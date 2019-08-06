const ComponentBuilder = require('./../utils/Component-builder')

function MapBuilder (definition, options) {
  let detailsCard, markerList

  const builder = new ComponentBuilder(definition)

  const map = builder
    .addTag('div')
    .addChildTag('q-map')
    .addAttribute(':showDetailsCard', definition.showMarkerLabels || definition.showCentreLabels)

  addStartCentre(map, definition.centre)

  map.addAttribute(':locked', definition.type === 'Map')

  const markers = definition.markers ? [...definition.markers] : []

  if (
    definition.showMarkerLabels ||
    definition.showCentreLabels
  ) {
    detailsCard = builder
      .addTag('q-card')
      .addChildTag('q-card-section')
  }

  if (definition.centre && definition.centre.show) {
    markers.push(definition.centre)
  }

  if (detailsCard && markers.length > 0) {
    markerList = detailsCard.addChildTag('q-list')
  }

  for (const [idx, m] of markers.entries()) {
    if (markerList) {
      const item = markerList
        .addChildTag('q-item')

      // avatar icon
      item
        .addChildTag('q-item-section')
        .addAttribute('avatar', null)
        .addAttribute('top', null)
        .addChildTag('q-avatar')
        .addAttribute('icon', 'room')
        .addAttribute('style', `color: ${m.color || '#005ea5'};`)

      // label
      const label = item.addChildTag('q-item-section')

      if (m.label) {
        label
          .addChildTag('q-item-label')
          .content(m.label)
      }

      label
        .addChildTag('q-item-label caption')
        .content(`{{parseFloat(data.${m.longitude}).toFixed(5)}}, {{parseFloat(data.${m.latitude}).toFixed(5)}}`)

      // edit button
      item
        .addChildTag('q-item-section')
        .addAttribute('side', null)
        .addChildTag('q-btn')
        .addAttribute('icon', 'edit')
        .addAttribute('round', null)
        .addAttribute('flat', null)
        .addAttribute('dense', null)
        .addAttribute('@click', `promptLatLonOpen('${map.getDataPath()}.MAP_PROMPT_${idx}', data.${m.longitude}, data.${m.latitude})`)

      // dialog
      const dialog = builder
        .addTag('q-dialog')
        .addAttribute('v-model', `${map.getDataPath()}.MAP_PROMPT_${idx}.show`) // bindToModel
        .addAttribute('persistent', null)

      const dialogCard = dialog.addChildTag('q-card')

      const dialogCardContent = dialogCard.addChildTag('q-card-section')

      dialogCardContent
        .addChildTag('q-input')
        .addAttribute('type', 'number')
        .addAttribute('v-model.number', `${map.getDataPath()}.MAP_PROMPT_${idx}.lng`)
        .addAttribute('label', 'Longitude')

      dialogCardContent
        .addChildTag('q-input')
        .addAttribute('type', 'number')
        .addAttribute('v-model.number', `${map.getDataPath()}.MAP_PROMPT_${idx}.lat`)
        .addAttribute('label', 'Latitude')

      const dialogCardActions = dialogCard.addChildTag('q-card-actions')

      dialogCardActions
        .addChildTag('q-btn')
        .addAttribute('flat', null)
        .addAttribute('label', 'Cancel')
        .addAttribute('@click', `promptLatLonCancel('${map.getDataPath()}.MAP_PROMPT_${idx}')`)

      dialogCardActions
        .addChildTag('q-btn')
        .addAttribute('flat', null)
        .addAttribute('label', 'Submit')
        .addAttribute('@click', `promptLatLonSubmit('${map.getDataPath()}.MAP_PROMPT_${idx}', '${map.getDataPath()}.${m.longitude}', '${map.getDataPath()}.${m.latitude}')`)

      dialogCardActions
        .addChildTag('q-btn')
        .addAttribute('flat', null)
        .addAttribute('label', 'Default to geolocation')
        .addAttribute('@click', `promptLatLonSubmit('${map.getDataPath()}.MAP_PROMPT_${idx}', '${map.getDataPath()}.${m.longitude}', '${map.getDataPath()}.${m.latitude}', true)`)
    }

    const marker = map
      .addChildTag('q-map-circle')
      .addAttribute(':longitude', `data.${m.longitude}`)
      .addAttribute(':latitude', `data.${m.latitude}`)
      .addAttribute('color', m.color)
      .addAttribute('id', m.id)
      .addAttribute('label', m.label || '')

    if (!m.locked) {
      marker
        .addAttribute('@longitude', `v => { data.${m.longitude} = v }`)
        .addAttribute('@latitude', `v => { data.${m.latitude} = v }`)
    }
  }

  return { builder, map }
} // MapBuilder

function addStartCentre (map, centre) {
  if (!centre) return

  map
    .addAttribute(':centre-longitude', `data.${centre.longitude}`)
    .addAttribute(':centre-latitude', `data.${centre.latitude}`)
} // addStartCentre

module.exports = MapBuilder
