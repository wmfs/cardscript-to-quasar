const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    title,
    arrayPath,
    columns,
    spacing,
    openable
  } = definition

  const builder = new ComponentBuilder(definition)

  const table = builder.addTag('q-table')
  table.addAttribute('title', title)
  table.addAttribute(':data', `data.${arrayPath}`)

  table.addAttribute(':columns', `[${columns.map(({ title, field }) => {
    return `{ label: '${title}', field: '${field}', align: 'left' }`
  })}]`)

  const headerRow = table.addChildTag('q-tr')
  headerRow.addAttribute('slot', 'header')
  headerRow.addAttribute('slot-scope', 'props')
  headerRow.addAttribute(':props', 'props')

  if (openable) {
    const checkHeader = headerRow.addChildTag('q-th')
    checkHeader.addAttribute('key', 'check')
  }

  const header = headerRow.addChildTag('q-th')
  header.addAttribute('v-for', 'col in props.cols')
  header.addAttribute(':key', 'col.name')
  header.content('{{ col.label }}')

  const template = table.addChildTag('template')
  template.addAttribute('slot', 'body')
  template.addAttribute('slot-scope', 'props')

  const tr = template.addChildTag('q-tr')
  tr.addAttribute(':props', 'props')

  if (openable) {
    tr.addAttribute('class', 'cursor-pointer')
    tr.addAttribute('@click.native', 'openTableRow(props.row)')

    const openTd = tr.addChildTag('q-td')
    openTd.addAttribute('key', 'check')
    openTd.addAttribute(':props', 'props')

    const openTdCheck = openTd.addChildTag('q-checkbox')
    openTdCheck.addAttribute('v-model', 'props.expand')
    openTdCheck.addAttribute('checked-icon', 'keyboard_arrow_up')
    openTdCheck.addAttribute('unchecked-icon', 'keyboard_arrow_down')
  }

  const td = tr.addChildTag('q-td')
  td.addAttribute('v-for', 'col in props.cols')
  td.addAttribute(':key', 'col.name')
  td.content('{{parseTemplate("${" + col.field + "}", props.row)}}') // eslint-disable-line

  const classes = []
  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) table.addAttribute('class', classes.join(' '))

  return builder.compile()
}
