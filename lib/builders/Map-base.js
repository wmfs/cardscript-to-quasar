const ComponentBuilder = require('./../utils/Component-builder')

function MapBuilder (definition, options) {
  const builder = new ComponentBuilder(definition)

  const map = builder.addTag('div')
    .addChildTag('q-map')

  addStartCentre(map, definition.centre)

  return { builder, map }
} // MapBuilder

function addStartCentre (map, centre) {
  if (!centre) return

  map.addAttribute(
    ':centre-longitude',
    `'${centre.longitude}'`
  ).addAttribute(
    ':centre-latitude',
    `'${centre.latitude}'`
  )

  map.addAttribute(
    'centre-show',
    centre.hasOwnProperty('show') ? centre.show : true
  )
} // addStartCentre

module.exports = MapBuilder
