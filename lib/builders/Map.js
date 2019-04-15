const MapBuilder = require('./Map-base')

function Map (definition, options) {
  const { builder } = MapBuilder(definition, options)

  return builder.compile()
} // Map

module.exports = Map
