const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applyTooltip = require('./../utils/apply-tooltip')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    title,
    spacing,
    // notFoundText, todo
    orientation = 'horizontal',
    separator = 'horizontal',
    fixedHeader
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  applySpacing({ spacing, source: div })

  if (title) {
    div
      .addChildTag('div')
      .addAttribute('class', 'q-table__title q-mb-sm')
      .content(title)
  }

  const qMarkupTable = div
    .addChildTag('q-markup-table')
    .addAttribute('flat', null)
    .addAttribute('separator', separator)

  if (fixedHeader) qMarkupTable.addAttribute('style', 'overflow: auto; height: 75vh;')

  if (orientation === 'horizontal') {
    horizontal(qMarkupTable, definition)
  } else {
    vertical(qMarkupTable, definition)
  }

  return builder.compile()
}

function horizontal (qMarkupTable, definition) {
  const {
    id,
    arrayPath,
    columns,
    clickToLaunch,
    showLaunches,
    selectionType,
    hideHeader,
    removableRows
    // fixedHeader TODO
  } = definition

  const destPath = `${qMarkupTable.getDataPath()}.${id}Selected`

  if (!hideHeader) {
    const tHead = qMarkupTable.addChildTag('thead')
    const tHeadRow = tHead.addChildTag('tr')

    if (selectionType) tHeadRow.addChildTag('th')

    for (const { title, showWhen, titleTooltip } of columns) {
      const th = tHeadRow
        .addChildTag('th')
        .addAttribute('class', 'text-left')
        .content(title)

      if (titleTooltip) applyTooltip({ source: th, tooltip: titleTooltip })
      if (showWhen) th.addAttribute('v-if', showWhen)
    }

    if (showLaunches) tHeadRow.addChildTag('th')
    if (removableRows) tHeadRow.addChildTag('th')
  }

  const tBody = qMarkupTable.addChildTag('tbody')
  const tBodyRow = tBody
    .addChildTag('tr')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')

  if (selectionType) {
    const selectionTd = tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'q-table--col-auto-width')
    applySelection(selectionTd, definition, destPath)
  }

  for (const { value, showWhen, badge, tooltip, showLaunches } of columns) {
    const cell = tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'text-left')
      .content(value)

    if (showWhen) cell.addAttribute('v-if', showWhen)
    if (tooltip) applyTooltip({ source: cell, tooltip, icon: false })
    if (badge) applyBadge(cell, badge)
    if (showLaunches) {
      // spacer
      cell.addChildTag('div').addAttribute('style', 'height: 50px;')

      const l = cell
        .addChildTag('div')
        .addAttribute('class', 'q-mt-sm')
        .addAttribute('style', 'position: absolute; bottom: 16px; right: 16px;')

      applyLaunches(l)
    }
  }

  if (clickToLaunch) {
    tBodyRow
      .addAttribute('class', 'cursor-pointer')
      .addAttribute('@click', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)')
  }

  if (showLaunches) {
    const launchesTd = tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'q-table--col-auto-width')
    applyLaunches(launchesTd)
  }

  if (removableRows) {
    const removeTd = tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'q-table--col-auto-width')
    applyRemove(removeTd, arrayPath)
  }
} // horizontal

function vertical (qMarkupTable, definition) {
  const {
    id,
    arrayPath,
    columns,
    showLaunches,
    selectionType,
    hideHeader,
    removableRows,
    fixedHeader
  } = definition

  const destPath = `${qMarkupTable.getDataPath()}.${id}Selected`

  qMarkupTable.addAttribute('wrap-cells', null)

  const tBody = qMarkupTable.addChildTag('tbody')

  if (selectionType) {
    const tr = tBody
      .addChildTag('tr')
      .addAttribute('class', 'q-tr--no-hover')

    if (!hideHeader) tr.addChildTag('td')

    const selectionTd = tr
      .addChildTag('td')
      .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
      .addAttribute(':key', 'idx')

    applySelection(selectionTd, definition, destPath)
  }

  let colIdx = 0

  for (const { title, value, showWhen, badge, tooltip, showLaunches, titleTooltip, color } of columns) {
    const tr = tBody.addChildTag('tr')

    const trClasses = []

    if (color && COLORS[color]) {
      trClasses.push(`bg-${COLORS[color]}`)
      if (TEXT_WHITE.includes(color)) {
        trClasses.push('text-white')
      }
    }

    if (trClasses.length) tr.addAttribute('class', trClasses.join(' '))

    if (showWhen) tr.addAttribute('v-if', showWhen)

    if (!hideHeader) {
      applyVerticalHeader(tr, { title, titleTooltip, fixedHeader, colIdx })
    }

    const cell = tr
      .addChildTag(fixedHeader && colIdx === 0 ? 'th' : 'td')
      .addAttribute('class', 'text-left')
      .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
      .addAttribute(':key', 'idx')
      .content(value)

    const cellStyles = []

    if (fixedHeader && colIdx === 0) cellStyles.push('position: sticky', 'top: 0', 'z-index: 1')

    if (cellStyles.length) cell.addAttribute('style', cellStyles.join('; '))

    if (tooltip) applyTooltip({ source: cell, tooltip, icon: false })
    if (badge) applyBadge(cell, badge)
    if (showLaunches) {
      // spacer
      cell.addChildTag('div').addAttribute('style', 'height: 50px;')

      const l = cell
        .addChildTag('div')
        .addAttribute('class', 'q-mt-sm')
        .addAttribute('style', 'position: absolute; bottom: 16px; right: 16px;')

      applyLaunches(l)
    }

    colIdx++
  }

  if (showLaunches) {
    const tr = tBody
      .addChildTag('tr')
      .addAttribute('class', 'q-tr--no-hover')

    if (!hideHeader) tr.addChildTag('td')

    const launchesTd = tr
      .addChildTag('td')
      .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
      .addAttribute(':key', 'idx')

    applyLaunches(launchesTd)
  }

  if (removableRows) {
    const tr = tBody
      .addChildTag('tr')
      .addAttribute('class', 'q-tr--no-hover')

    if (!hideHeader) tr.addChildTag('td')

    const removeTd = tr
      .addChildTag('td')
      .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
      .addAttribute(':key', 'idx')

    applyRemove(removeTd, arrayPath)
  }
} // vertical

function applyBadge (td, badge) {
  for (const { showWhen, text, color, icon } of badge) {
    const chip = td
      .addChildTag('q-badge')
      .addAttribute('class', 'q-ml-sm')

    if (showWhen) chip.addAttribute('v-if', showWhen)

    if (icon) chip.addChildTag('q-icon').addAttribute('name', icon)

    if (color && COLORS[color]) {
      chip.addAttribute('color', COLORS[color])

      if (TEXT_WHITE.includes(color)) {
        chip.addAttribute('text-color', 'white')
      }
    }

    chip.content(text)
  }
} // applyBadge

function applyRemove (td, arrayPath) {
  td
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('icon', 'delete')
    .addAttribute('@click.native', `action('DeleteTableRow', { arrayPath: '${arrayPath}', rowIndex: idx } )`)
} // applyRemove

function applyLaunches (td) {
  td
    .addChildTag('q-btn')
    // .addAttribute('flat', null)
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('color', 'primary')
    .addAttribute('icon', 'more_vert')
    .addAttribute('v-if', 'item.launches && item.launches.length > 0')

    .addChildTag('q-menu')
    .addChildTag('q-list')
    .addAttribute('style', 'min-width: 100px')
    .addAttribute('link', null)

    .addChildTag('q-item')
    .addAttribute('clickable', null)
    .addAttribute('v-close-popup', null)
    .addAttribute('v-for', '(launch, idx) in item.launches')
    .addAttribute(':key', 'idx')
    .addAttribute('class', 'q-pa-md')
    .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)')

    .addChildTag('q-item-label')
    .content('{{launch.title || `Open`}}')
} // applyLaunches

function applySelection (td, definition, destPath) {
  const {
    selectionType,
    arrayPath,
    selectionMax = 0 // 0 means no limit
  } = definition

  let option

  if (selectionType === 'single') {
    option = td
      .addChildTag('q-radio')
      .addAttribute(':val', 'item')
      .addAttribute(':value', destPath)
  } else if (selectionType === 'multi') {
    option = td
      .addChildTag('q-checkbox')
      .addAttribute(':value', `!!${destPath}.find(r => hashSum(r) === hashSum(item))`)
  }

  option
    .addAttribute('dense', null)
    .addAttribute('@input', `action('ListSelection', { idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}' })`)
} // applySelection

function applyVerticalHeader (tr, { title, titleTooltip, fixedHeader, colIdx }) {
  const titleTd = tr.addChildTag(fixedHeader && colIdx === 0 ? 'th' : 'td')

  const cellStyles = ['width: 40%']

  if (fixedHeader && colIdx === 0) cellStyles.push('position: sticky', 'top: 0', 'z-index: 1')

  if (cellStyles.length) titleTd.addAttribute('style', cellStyles.join('; '))

  const titleRow = titleTd.addChildTag('div').addAttribute('class', 'row')

  titleRow
    .addChildTag('div')
    .addAttribute('class', 'col text-left text-weight-bold')
    .content(title)

  if (titleTooltip) {
    const tooltipCol = titleRow.addChildTag('div').addAttribute('class', 'col-auto')
    applyTooltip({ source: tooltipCol, tooltip: titleTooltip })
  }
} // applyVerticalHeader
