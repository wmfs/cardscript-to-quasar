const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applyTooltip = require('./../utils/apply-tooltip')
const applyBadge = require('./../utils/apply-badge')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    title,
    spacing,
    notFoundText,
    orientation = 'horizontal',
    separator = 'horizontal',
    fixedHeader,
    arrayPath,
    square,
    bordered,
    wrapCells
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

  if (notFoundText) {
    div
      .addChildTag('div')
      .addAttribute('v-if', `!${arrayPath} || !${arrayPath}.length`)
      .content(notFoundText)
  }

  const qMarkupTable = div
    .addChildTag('q-markup-table')
    .addAttribute('v-if', `${arrayPath} && ${arrayPath}.length`)
    .addAttribute('flat', null)
    .addAttribute('separator', separator)

  if (fixedHeader) qMarkupTable.addAttribute('style', 'overflow: auto; max-height: 75vh;')
  if (square) qMarkupTable.addAttribute('square', null)
  if (bordered) qMarkupTable.addAttribute('bordered', null)
  if (wrapCells) qMarkupTable.addAttribute('wrap-cells', null)

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
    showLaunchesTitle,
    selectionType,
    hideHeader,
    removableRows,
    removeInLaunches,
    fixedHeader,
    headerColor
  } = definition

  const destPath = `${qMarkupTable.getDataPath()}.${id}Selected`

  if (!hideHeader) {
    const tHead = qMarkupTable.addChildTag('thead')
    const tHeadRow = tHead.addChildTag('tr')
    const tHeadRowClasses = []

    if (selectionType) tHeadRow.addChildTag('th')

    for (const { title, showWhen, titleTooltip } of columns) {
      const th = tHeadRow
        .addChildTag('th')
        .addAttribute('class', 'text-left')
        .content(title)

      const cellStyles = []

      if (fixedHeader) cellStyles.push('position: sticky', 'top: 0', 'z-index: 1')
      if (titleTooltip) applyTooltip({ source: th, tooltip: titleTooltip })
      if (showWhen) th.addAttribute('v-if', showWhen)

      th.addAttribute('style', cellStyles.join('; '))
    }

    if (showLaunches) tHeadRow.addChildTag('th').content(showLaunchesTitle || '')
    if (removableRows && !removeInLaunches) tHeadRow.addChildTag('th')
    if (headerColor && COLORS[headerColor]) {
      tHeadRowClasses.push(`bg-${COLORS[headerColor]}`)
      if (TEXT_WHITE.includes(headerColor)) {
        tHeadRowClasses.push('text-white')
      }
    } else {
      tHeadRowClasses.push('bg-white')
    }
    if (tHeadRowClasses.length) {
      tHeadRow.addAttribute('class', tHeadRowClasses.join(' '))
    }
  }

  const tBody = qMarkupTable.addChildTag('tbody')
  const tBodyRow = tBody
    .addChildTag('tr')
    .addAttribute('v-for', `(item, rowIdx) in ${arrayPath}`)
    .addAttribute(':key', 'rowIdx')

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

    if (badge) {
      for (const { showWhen, text, color, icon, outline } of badge) {
        applyBadge({ source: cell, color, icon, text, showWhen, outline })
      }
    }

    if (showLaunches) {
      // spacer
      cell.addChildTag('div').addAttribute('style', 'height: 50px;')

      const l = cell
        .addChildTag('div')
        .addAttribute('class', 'q-mt-sm')
        .addAttribute('style', 'position: absolute; bottom: 16px; right: 16px;')

      applyLaunches(l, definition)
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
      .addAttribute('class', 'q-table--col-auto-width text-right')
    applyLaunches(launchesTd, definition)
  }

  if (removableRows && !removeInLaunches) {
    const removeTd = tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'q-table--col-auto-width')
    applyRemove(removeTd, definition)
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
    removeInLaunches,
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
      .addAttribute('v-for', `(item, rowIdx) in ${arrayPath}`)
      .addAttribute(':key', 'rowIdx')

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
      .addAttribute('v-for', `(item, rowIdx) in ${arrayPath}`)
      .addAttribute(':key', 'rowIdx')
      .content(value)

    const cellStyles = []

    if (fixedHeader && colIdx === 0) cellStyles.push('position: sticky', 'top: 0', 'z-index: 1')

    if (cellStyles.length) cell.addAttribute('style', cellStyles.join('; '))

    if (tooltip) applyTooltip({ source: cell, tooltip, icon: false })

    if (badge) {
      for (const { showWhen, text, color, icon, outline } of badge) {
        applyBadge({ source: cell, color, icon, text, showWhen, outline })
      }
    }

    if (showLaunches) {
      // spacer
      cell.addChildTag('div').addAttribute('style', 'height: 50px;')

      const l = cell
        .addChildTag('div')
        .addAttribute('class', 'q-mt-sm')
        .addAttribute('style', 'position: absolute; bottom: 16px; right: 16px;')

      applyLaunches(l, definition)
    }

    colIdx++
  }

  if (showLaunches) {
    const tr = tBody
      .addChildTag('tr')
      .addAttribute('class', 'q-tr--no-hover')

    if (!hideHeader) tr.addChildTag('td') // todo: showLaunchesTitle

    const launchesTd = tr
      .addChildTag('td')
      .addAttribute('v-for', `(item, rowIdx) in ${arrayPath}`)
      .addAttribute(':key', 'rowIdx')

    applyLaunches(launchesTd, definition)
  }

  if (removableRows && !removeInLaunches) {
    const tr = tBody
      .addChildTag('tr')
      .addAttribute('class', 'q-tr--no-hover')

    if (!hideHeader) tr.addChildTag('td')

    const removeTd = tr
      .addChildTag('td')
      .addAttribute('v-for', `(item, rowIdx) in ${arrayPath}`)
      .addAttribute(':key', 'rowIdx')

    applyRemove(removeTd, definition)
  }
} // vertical

function applyRemove (td, definition) {
  const { arrayPath, removeText, removeIcon, removeInLaunches } = definition

  if (removeInLaunches) return

  const btn = td
    .addChildTag('q-btn')
    .addAttribute('dense', null)
    .addAttribute('color', 'primary')
    .addAttribute('@click.native', `action('DeleteTableRow', { arrayPath: '${arrayPath}', rowIndex: rowIdx } )`)

  if (removeIcon) btn.addAttribute('icon', removeIcon)

  if (removeText) {
    btn.addAttribute('label', removeText)
  } else {
    btn.addAttribute('icon', 'delete')
  }
} // applyRemove

function applyLaunches (td, definition) {
  const {
    removableRows,
    removeInLaunches,
    removeText,
    arrayPath,
    showSingleLaunchAsButton
  } = definition

  const btn = td
    .addChildTag('q-btn')
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('color', 'primary')
    .addAttribute('icon', 'more_vert')

  if (showSingleLaunchAsButton) {
    // If only one launch then show button
    td
      .addChildTag('q-btn')
      .addAttribute('color', 'primary')
      .addAttribute('dense', null)
      .addAttribute('outline', null)
      .addAttribute('v-if', 'item.launches && item.launches.length === 1')
      .addAttribute(':label', 'item.launches[0].title || \'Open\'')
      .addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)')

    btn.addAttribute('v-if', 'item.launches && item.launches.length > 1')
  } else {
    btn.addAttribute('v-if', 'item.launches && item.launches.length > 0')
  }

  const menu = btn
    .addChildTag('q-menu')
    .addAttribute('auto-close', null)

  const list = menu
    .addChildTag('q-list')
    .addAttribute('style', 'min-width: 100px')
    .addAttribute('link', null)

  list
    .addChildTag('q-item')
    .addAttribute('clickable', null)
    .addAttribute('v-for', '(launch, launchIdx) in item.launches')
    .addAttribute(':key', 'launchIdx')
    .addAttribute('class', 'q-pa-md')
    .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)')
    .addChildTag('q-item-label')
    .content('{{launch.title || `Open`}}')

  if (removableRows && removeInLaunches) {
    list
      .addChildTag('q-item')
      .addAttribute('clickable', null)
      .addAttribute('class', 'q-pa-md')
      .addAttribute('@click.native', `action('DeleteTableRow', { arrayPath: '${arrayPath}', rowIndex: rowIdx } )`)
      .addChildTag('q-item-label')
      .content(removeText || 'Remove')
  }
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
    .addAttribute('@input', `action('ListSelection', { idx: rowIdx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}' })`)
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
