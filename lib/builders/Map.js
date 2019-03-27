const MapBuilder = require('./Map-base')

function Map (definition, options) {
  const { builder, map } = MapBuilder(definition, options)

  map.addAttribute('locked', true)

  return builder.compile()
} // Map

module.exports = Map
