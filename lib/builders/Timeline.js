const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  if (definition.side && !['right', 'left'].includes(definition.side)) definition.side = 'right'

  const {
    side
  } = definition

  const builder = new ComponentBuilder(definition)

  builder
    .addTag('q-timeline', { includeClosingTag: false })
    .addAttribute('side', side)

  return builder.compile()
}
