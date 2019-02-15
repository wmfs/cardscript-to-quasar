const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  console.log(definition)
  const {
    title,
    arrayPath,
    columns,
    spacing
  } = definition

  const builder = new ComponentBuilder(definition)

  const table = builder.addTag('q-table')
  table.addAttribute('title', title)
  table.addAttribute(':data', `data.${arrayPath}`)
  // table.addAttribute('v-if', `data.${arrayPath}`)

  table.addAttribute(':columns', `[${columns.map(({ title, field }) => {
    return `{ label: '${title}', field: '${field}', align: 'left' }`
  })}]`)

  // const tr = table.addChildTag('q-tr')
  // tr.addAttribute('slot', 'header')
  // tr.addAttribute('slot-scope', 'props')
  //
  // for (const col of columns) {
  //   const th = tr.addChildTag('q-th')
  //   th.addAttribute('key', col.field)
  //   th.addAttribute(':props', 'props')
  //   th.content(col.title)
  // }

  const classes = []
  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) table.addAttribute('class', classes.join(' '))

  return builder.compile()
}
