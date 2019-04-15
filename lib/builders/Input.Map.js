const MapBuilder = require('./Map-base')

function InputMap (definition, options) {
  const { builder, map } = MapBuilder(definition, options)

  return builder.compile()
} // Map

module.exports = InputMap
