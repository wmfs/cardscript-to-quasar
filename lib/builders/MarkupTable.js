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
    removableRows
  } = definition

  if (!hideHeader) {
    const tHead = qMarkupTable.addChildTag('thead')
    const tHeadRow = tHead.addChildTag('tr')

    for (const { title } of columns) {
      tHeadRow
        .addChildTag('th')
        .addAttribute('class', 'text-left')
        .content(title)
    }
  }

  const tBody = qMarkupTable.addChildTag('tbody')
  const tBodyRow = tBody
    .addChildTag('tr')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')

  for (const { value } of columns) {
    tBodyRow
      .addChildTag('td')
      .addAttribute('class', 'text-left')
      .content(value)
  }
}

function vertical (qMarkupTable, definition) {
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
    removableRows
  } = definition

  qMarkupTable.addAttribute('wrap-cells', null)

  const tBody = qMarkupTable.addChildTag('tbody')

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
}