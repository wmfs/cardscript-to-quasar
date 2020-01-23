const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const { COLORS } = require('./../utils/color-reference')
// const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    title,
    arrayPath,
    columns,
    spacing,
    showLaunches,
    notFoundText,
    selectionType,
    rowKey,
    hideHeader,
    hideBottom
  } = definition

  const builder = new ComponentBuilder(definition)

  const _columns = `[${columns.map(({ title, field, format }) => {
    const attr = [
      `label: '${title}'`,
      `field: '${field}'`,
      `align: 'left'`
    ]
    if (format) attr.push(`format: (val, item) => ${format}`)
    return '{' + attr.join(', ') + '}'
  })}]`

  const table = builder
    .addTag('q-table')
    .addAttribute('title', title)
    .addAttribute(':data', `${arrayPath}`)
    .addAttribute(':columns', _columns)

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
      .content(col.title)
  }

  if (showLaunches) {
    headerTr.addChildTag('q-th')
  }

  const bodyTemplate = table
    .addChildTag('template')
    .addAttribute('v-slot:body', 'props')

  const bodyTr = bodyTemplate
    .addChildTag('q-tr')
    .addAttribute(':props', 'props')

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

    if (col.icon) {
      const spanClasses = ['q-mr-sm']
      const icon = td
        .addChildTag('span')
        .addAttribute('style', 'font-size: 2em')

      if (col.showIconWhenValueEquals) {
        icon.addAttribute('v-if', `props.cols[${idx}].value === '${col.showIconWhenValueEquals}'`)
      }

      if (col.iconColor && COLORS[col.iconColor]) {
        spanClasses.push(`q-mr-sm text-${COLORS[col.iconColor]}`)
      }

      icon.addAttribute('class', spanClasses.join(' '))

      icon
        .addChildTag('q-icon')
        .addAttribute('name', col.icon)
    }

    td
      .addChildTag('span')
      .content(`{{ props.cols[${idx}].value }}`)
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
      .addAttribute('v-for', `(launch, idx) in props.row.launches`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'q-pa-md')
      .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

      .addChildTag('q-item-label')
      .content('{{launch.title || `Open`}}')
  }

  applySpacing({ spacing, source: table })

  return builder.compile()
}
