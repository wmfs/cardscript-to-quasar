const MapBuilder = require('./Map-base')

function InputMap (definition, options) {
  const { builder, map } = MapBuilder(definition, options)

  bindOutputs(map, definition, 'longitude')
  bindOutputs(map, definition, 'latitude')

  return builder.compile()
} // Map

function bindOutputs (map, definition, fieldName) {
  if (!definition[fieldName]) return

  map.addAttribute(fieldName, definition[fieldName])
  map.addAttribute('v-model', 'data')
} // bindOutputs

module.exports = InputMap
