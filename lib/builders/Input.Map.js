const MapBuilder = require('./Map-base')

function InputMap (definition, options) {
  const { builder } = MapBuilder(definition, options)

  return builder.compile()
} // Map

module.exports = InputMap
