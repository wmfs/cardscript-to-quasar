const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)
  const pre = builder.addTag('pre')
  pre.content('// TODO: MediaSource!')
  return builder.compile()
}
