const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  builder.addTag('q-separator').addAttribute('class', 'q-my-md')

  return builder.compile()
}
