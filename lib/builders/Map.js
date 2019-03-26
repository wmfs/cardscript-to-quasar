const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  const map = builder.addTag('div')
    .addChildTag('t-map')

  map.addAttribute(
    ':centre-longitude',
    `'${definition.centre.longitude}'`
  ).addAttribute(
    ':centre-latitude',
    `'${definition.centre.latitude}'`
  )

  return builder.compile()
}
