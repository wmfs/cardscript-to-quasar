const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    id,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  div.addAttribute('id', `graph-${id}`)

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
