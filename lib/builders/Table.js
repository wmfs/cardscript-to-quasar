const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applyLaunches = require('./../utils/apply-launches')
const lookupOrValue = require('./../utils/lookup-or-value')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')
const safeInput = str => str.replace(/'/g, '\\\'')

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
    removableRows
  } = definition

  const builder = new ComponentBuilder(definition)

  const _columns = `[${columns.map(({ title, field, format }) => {
    const attr = [
      `label: '${title}'`,
      `field: '${field}'`,
      'align: \'left\''
    ]
    if (format) attr.push(`format: (val, item) => ${format}`)
    return '{' + attr.join(', ') + '}'
  })}]`

  const table = builder
    .addTag('q-table')
    .addAttribute('title', title)
    .addAttribute(':rows', `${arrayPath}`)
    .addAttribute(':columns', _columns)
    .addAttribute('flat', null)

  if (notFoundText) table.addAttribute('no-data-label', notFoundText)
  if (rowKey) table.addAttribute('row-key', rowKey)
  if (hideHeader) table.addAttribute('hide-header', '')
  if (hideBottom) {
    table.addAttribute('hide-bottom', '')
    table.addAttribute(':pagination', '{ rowsPerPage: 0 }')
  }

  const headerTemplate = table
    .addChildTag('template')
    .addAttribute('v-slot:header', 'props')

  const headerTr = headerTemplate
    .addChildTag('q-tr')

  if (selectionType) {
    let selection = selectionType
    if (selectionType === 'multi') selection = 'multiple'

    table.addAttribute('selection', selection)

    headerTr
      .addChildTag('q-th')
      .addAttribute('auto-width', null)
  }

  for (const col of columns) {
    headerTr
      .addChildTag('q-th')
      .addAttribute('class', 'text-left item-label-non-link')
      .content(col.title)
  }

  if (showLaunches) headerTr.addChildTag('q-th')
  if (removableRows) headerTr.addChildTag('q-th')

  const bodyTemplate = table
    .addChildTag('template')
    .addAttribute('v-slot:body', 'props')

  const bodyTr = bodyTemplate
    .addChildTag('q-tr')
    .addAttribute(':props', 'props')

  if (clickToLaunch) {
    bodyTr.addAttribute('class', 'cursor-pointer')
    bodyTr.addAttribute('@click', 'start(`pushCard`, props.row.launches[0].stateMachineName, props.row.launches[0].input, props.row.launches[0].title)') // todo: change to emit event
  }

  if (selectionType) {
    const destPath = `data.${id}Selected`
    bodyTr
      .addChildTag('q-td')
      .addAttribute('auto-width', null)

      .addChildTag('q-checkbox')
      .addAttribute('dense', null)
      // todo: might need to change data.${id}Selected to root through params and use apiLookupPath (but would need to change all references of selectable tables
      // .addAttribute(':model-value', `!!data.${id}Selected.find(r => r.rowKey === props.row.rowKey)`)
      // .addAttribute('@update:model-value', `action('AddTableRow', { row: props.row, arrayPath: 'data.${id}Selected', selectionType: '${selectionType}' })`)
      .addAttribute(':model-value', `!!${destPath}.find(r => hashSum(r) === hashSum(props.row))`)
      .addAttribute('@update:model-value', `action('ListSelection', { idx: props.rowIndex, sourcePath: '${safeInput(arrayPath)}', destPath: '${safeInput(destPath)}', selectionMax: ${0}, selectionType: '${selectionType}' })`)
  }

  for (const [idx, col] of columns.entries()) {
    const td = bodyTr
      .addChildTag('q-td')
      .addAttribute('key', col.field)

    const value = `{{ props.cols[${idx}].value }}`

    const display = col.choices
      ? lookupOrValue(col.title, value, col.choices)
      : value

    td
      .addChildTag('span')
      .content(display)

    if (col.flag) {
      const chip = td
        .addChildTag('q-chip')
        .addAttribute('class', 'q-ml-sm')
        .addAttribute('v-if', `props.row['${col.flag.field}'] === '${col.flag.value}'`)
        .content(col.flag.text)

      if (col.flag.icon) chip.addAttribute('icon', col.flag.icon)

      if (col.flag.color && COLORS[col.flag.color]) {
        chip.addAttribute('color', COLORS[col.flag.color])
        if (TEXT_WHITE.includes(col.flag.color)) {
          chip.addAttribute('text-color', 'white')
        }
      }
    }
  }

  if (showLaunches) {
    const td = bodyTr
      .addChildTag('q-td')
      .addAttribute('auto-width', null)

    applyLaunches(td, definition)
  }

  if (removableRows) {
    bodyTr
      .addChildTag('q-td')
      .addAttribute('auto-width', null)

      .addChildTag('q-btn')
      .addAttribute('flat', null)
      .addAttribute('round', null)
      .addAttribute('dense', null)
      .addAttribute('icon', 'delete')
      .addAttribute('@click', `action('DeleteTableRow', { arrayPath: '${arrayPath}', rowIndex: props.rowIndex } )`)
  }

  applySpacing({ spacing, source: table })

  return builder.compile()
}
