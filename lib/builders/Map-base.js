const ComponentBuilder = require('./../utils/Component-builder')

function MapBuilder (definition, options) {
  const builder = new ComponentBuilder(definition)

  const map = builder.addTag('div')
    .addChildTag('q-map')

  addStartCentre(map, definition.centre)

  map.addAttribute(':locked', definition.type === 'Map')

  const markers = definition.markers ? [...definition.markers] : []
  if (definition.centre && definition.centre.show) {
    markers.push(definition.centre)
  }

  for (const m of markers) {
    map
      .addChildTag('q-map-circle')
      .addAttribute(
        ':longitude',
        `data.${m.longitude}`
      )
      .addAttribute(
        ':latitude',
        `data.${m.latitude}`
      )
      .addAttribute(
        'color',
        m.color
      )
      .addAttribute(
        'id',
        m.id
      )
  }

  return { builder, map }
} // MapBuilder

function addStartCentre (map, centre) {
  if (!centre) return

  map.addAttribute(
    ':centre-longitude',
    `data.${centre.longitude}`
  ).addAttribute(
    ':centre-latitude',
    `data.${centre.latitude}`
  )
} // addStartCentre

module.exports = MapBuilder
