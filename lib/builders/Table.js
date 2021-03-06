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
    .addAttribute(':data', `${arrayPath}`)
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
    table.addAttribute(':selected.sync', `data.${id}Selected`)

    headerTr
      .addChildTag('q-th')
      .addAttribute('auto-width', null)

      .addChildTag('q-checkbox')
      .addAttribute('dense', null)
      .addAttribute('v-model', 'props.selected')
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
    bodyTr.addAttribute('@click.native', 'start(`pushCard`, props.row.launches[0].stateMachineName, props.row.launches[0].input, props.row.launches[0].title)') // todo: change to emit event
  }

  if (selectionType) {
    bodyTr
      .addChildTag('q-td')
      .addAttribute('auto-width', null)

      .addChildTag('q-checkbox')
      .addAttribute('dense', null)
      .addAttribute('v-model', 'props.selected')
  }

  for (const [idx, col] of columns.entries()) {
    const td = bodyTr
      .addChildTag('q-td')
      .addAttribute('key', col.field)

    td
      .addChildTag('span')
      .content(`{{ props.cols[${idx}].value }}`)

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
    bodyTr
      .addChildTag('q-td')
      .addAttribute('auto-width', null)

      .addChildTag('q-btn')
      .addAttribute('flat', null)
      .addAttribute('round', null)
      .addAttribute('dense', null)
      .addAttribute('icon', 'more_horiz')
      .addAttribute('v-if', 'props.row.launches.length > 0')

      .addChildTag('q-menu')
      .addChildTag('q-list')
      .addAttribute('style', 'min-width: 100px')
      .addAttribute('link', null)

      .addChildTag('q-item')
      .addAttribute('clickable', null)
      .addAttribute('v-close-popup', null)
      .addAttribute('v-for', '(launch, idx) in props.row.launches')
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'q-pa-md')
      .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

      .addChildTag('q-item-label')
      .content('{{launch.title || `Open`}}')
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
      .addAttribute('@click.native', `action('DeleteTableRow', { arrayPath: '${arrayPath}', rowIndex: props.rowIndex } )`)
  }

  applySpacing({ spacing, source: table })

  return builder.compile()
}
