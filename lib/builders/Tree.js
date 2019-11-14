const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  builder
    .addTag('q-tree')
    .addAttribute(':nodes', `data.${definition.id}`)
    .addAttribute('node-key', 'label')

  return builder.compile()
}
