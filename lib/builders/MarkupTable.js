const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    id,
    title,
    arrayPath,
    columns,
    spacing,
    clickToLaunch,
    showLaunches,
    notFoundText,
    selectionType,
    rowKey,
    hideHeader,
    hideBottom,
    removableRows,
    orientation = 'horizontal'
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
  } = definition

  const destPath = `${qMarkupTable.getDataPath()}.${id}Selected`

  if (!hideHeader) {
    const tHead = qMarkupTable.addChildTag('thead')
    const tHeadRow = tHead.addChildTag('tr')

    if (selectionType) tHeadRow.addChildTag('th')

    for (const { title } of columns) {
      tHeadRow
        .addChildTag('th')
        .addAttribute('class', 'text-left')
        .content(title)
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

  for (const { value } of columns) {
    tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'text-left')
      .content(value)
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
}

function vertical (qMarkupTable, definition) {
  const {
    id,
    arrayPath,
    columns,
    showLaunches,
    selectionType,
    hideHeader,
    removableRows
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

  for (const { title, value } of columns) {
    const tr = tBody.addChildTag('tr')

    if (!hideHeader) {
      tr
        .addChildTag('td')
        .addAttribute('class', 'text-left text-weight-bold')
        .content(title)
    }

    tr
      .addChildTag('td')
      .addAttribute('class', 'text-left')
      .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
      .addAttribute(':key', 'idx')
      .content(value)
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
}

function applyRemove (td, arrayPath) {
  td
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('icon', 'delete')
    .addAttribute('@click.native', `action('DeleteTableRow', { arrayPath: '${arrayPath}', rowIndex: idx } )`)
}

function applyLaunches (td) {
  td
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('icon', 'more_horiz')
    .addAttribute('v-if', 'item.launches.length > 0')

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
}

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
      .addAttribute(':val', `item`)
      .addAttribute(':value', destPath)
  } else if (selectionType === 'multi') {
    option = td
      .addChildTag('q-checkbox')
      .addAttribute(':value', `!!${destPath}.find(r => hashSum(r) === hashSum(item))`)
  }

  option
    .addAttribute('dense', null)
    // todo: refactor AdaptiveCardSelection to generic name
    .addAttribute('@input', `action('AdaptiveCardSelection', { idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}' })`)
}