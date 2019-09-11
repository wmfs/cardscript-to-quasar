const ComponentBuilder = require('./../utils/Component-builder')
// const { inspect } = require('./../utils/local-util')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

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
    rowKey
  } = definition

  const builder = new ComponentBuilder(definition)

  const table = builder.addTag('q-table')
  table.addAttribute('title', title)
  table.addAttribute(':data', `${arrayPath}`)

  if (rowKey) table.addAttribute('row-key', rowKey)

  table.addAttribute(':columns', `[${columns.map(({ title, field, format }) => {
    const attr = [
      `label: '${title}'`,
      `field: '${field}'`,
      `align: 'left'`
    ]
    if (format) attr.push(`format: (val, item) => ${format}`)
    return '{' + attr.join(',') + '}'
  })}]`)

  if (notFoundText) {
    table.addAttribute('no-data-label', notFoundText)
  }

  const template = table.addChildTag('template')
  template.addAttribute('slot', 'body')
  template.addAttribute('slot-scope', 'props')

  const tr = template.addChildTag('q-tr')
  tr.addAttribute(':props', 'props')

  if (selectionType) {
    let selection = selectionType
    if (selectionType === 'multi') selection = 'multiple'

    table.addAttribute('selection', selection)
    table.addAttribute(':selected.sync', `data.${id}Selected`)

    tr.addChildTag('q-td')
      .addAttribute('auto-width', null)

      .addChildTag('q-checkbox')
      .addAttribute('dense', null)
      .addAttribute('v-model', 'props.selected')
  }

  const td = tr.addChildTag('q-td')
  td.addAttribute('v-for', 'col in props.cols')
  td.addAttribute(':key', 'col.name')
  td.content('{{col.value}}')

  if (showLaunches) {
    tr
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
      .addAttribute('link', null)

      .addChildTag('q-item')
      .addAttribute('clickable', null)
      .addAttribute('v-close-popup', null)
      .addAttribute('dense', null)
      .addAttribute('v-for', `(launch, idx) in props.row.launches`)
      .addAttribute(':key', 'idx')
      .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

      .addChildTag('q-item-label')
      .content('{{launch.title || `Open`}}')
  }

  const classes = []
  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) table.addAttribute('class', classes.join(' '))

  return builder.compile()
}
