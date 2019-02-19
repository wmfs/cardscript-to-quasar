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
    openable
  } = definition

  const builder = new ComponentBuilder(definition)

  const table = builder.addTag('q-table')
  table.addAttribute('title', title)
  table.addAttribute(':data', `data.${arrayPath}`)

  table.addAttribute(':columns', `[${columns.map(({ title, field }) => {
    return `{ label: '${title}', field: '${field}', align: 'left' }`
  })}]`)

  const template = table.addChildTag('template')
  template.addAttribute('slot', 'body')
  template.addAttribute('slot-scope', 'props')

  const tr = template.addChildTag('q-tr')
  tr.addAttribute(':props', 'props')

  if (openable) {
    const modal = builder.addTag('q-modal')
    const dataPath = modal.getDataPath()
    // const opts = inspect({ dataPath, id })

    tr.addAttribute('class', 'cursor-pointer')
    // tr.addAttribute('@click.native', `openTableRow(props.row, ${opts})`)
    tr.addAttribute('@click.native', `${dataPath}.${id}OpenModal = true`)

    modal.addAttribute('v-model', `${dataPath}.${id}OpenModal`)
    const div = modal.addChildTag('div')
    div.content('modal')
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
