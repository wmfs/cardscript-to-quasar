const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  console.log('FACT SET')
  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  div.addAttribute('class', 'q-mt-sm')

  definition.facts.forEach(({ title, value }) => {
    const row = div.addChildTag('div')
    row.addAttribute('class', 'row')

    const colTitle = row.addChildTag('div')
    const colValue = row.addChildTag('div')

    colTitle.addAttribute('class', 'col-6 text-weight-bold')
    colValue.addAttribute('class', 'col-6')

    colTitle.content(title)
    colValue.content(value)
  })

  return builder.compile()
}
