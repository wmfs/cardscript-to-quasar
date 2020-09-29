const ComponentBuilder = require('./../utils/Component-builder')

function MapBuilder (definition, options) {
  const builder = new ComponentBuilder(definition)

  const map = builder
    .addTag('div')
    .addChildTag('q-map')

  map.addAttribute(':id', `'${definition.id}'` || null)
  map.addAttribute(':locked', definition.type === 'Map')

  addStart(map, definition)

  const markers = findMarkers(definition)
  const hasMarkers = markers.length !== 0

  if (hasMarkers) {
    const showDetails = definition.showMarkerLabels || definition.showCentreLabels

    const markerDetails = showDetails
      ? builder.addTag('q-card')
        .addChildTag('q-card-section')
        .addChildTag('q-list')
      : null

    for (const [idx, m] of markers.entries()) {
      const markerFn = (m.format === 'OSGridRef') ? addMarkerOSGridRef : addMarkerLongLat
      markerFn(idx, m, markerDetails, map, builder, definition)
    } // for ...
  } // if ...

  addMarkerPath(map, definition)

  return { builder, map }
} // MapBuilder

function findMarkers (definition) {
  const markers = definition.markers ? [...definition.markers] : []
  if (definition.centre && definition.centre.show) {
    markers.push(definition.centre)
  }
  return markers
} // findMarkers

function addMarkerOSGridRef (idx, m, markerDetails, map, builder, definition) {
  if (markerDetails) {
    const item = markerDetails.addChildTag('q-item')

    if (m.showWhen) {
      item.addAttribute('v-if', m.showWhen)
    }

    // pin button
    const pinBtn = item
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('top', null)
      .addChildTag('q-btn')
      .addAttribute('icon', 'room')
      .addAttribute('round', null)
      .addAttribute('flat', null)
      .addAttribute('dense', null)
      .addAttribute('style', `color: ${m.color || '#005ea5'};`)

    if (definition.id) {
      pinBtn.addAttribute('@click', `mapJumpToXY('${definition.id}', data.${m.x}, data.${m.y})`)
    } else {
      pinBtn.addAttribute('@click', '')
    }

    // label
    const label = item.addChildTag('q-item-section')

    if (m.label) {
      label
        .addChildTag('q-item-label')
        .content(m.label)
    }

    label
      .addChildTag('q-item-label caption')
      .content(`{{data.${m.x}}}, {{data.${m.y}}}`)

    if (definition.type === 'Input.Map') {
      // edit button
      item
        .addChildTag('q-item-section')
        .addAttribute('side', null)
        .addChildTag('q-btn')
        .addAttribute('icon', 'edit')
        .addAttribute('round', null)
        .addAttribute('flat', null)
        .addAttribute('dense', null)
        .addAttribute('@click', `promptXYOpen('${map.getDataPath()}.MAP_PROMPT_${idx}', data.${m.x}, data.${m.y})`)

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
        .addAttribute('v-model.number', `${map.getDataPath()}.MAP_PROMPT_${idx}.x`)
        .addAttribute('label', 'X')

      dialogCardContent
        .addChildTag('q-input')
        .addAttribute('type', 'number')
        .addAttribute('v-model.number', `${map.getDataPath()}.MAP_PROMPT_${idx}.y`)
        .addAttribute('label', 'Y')

      const dialogCardActions = dialogCard.addChildTag('q-card-actions')

      dialogCardActions
        .addChildTag('q-btn')
        .addAttribute('flat', null)
        .addAttribute('label', 'Cancel')
        .addAttribute('@click', `promptMapCancel('${map.getDataPath()}.MAP_PROMPT_${idx}')`)

      dialogCardActions
        .addChildTag('q-btn')
        .addAttribute('flat', null)
        .addAttribute('label', 'Submit')
        .addAttribute('@click', `promptXYSubmit('${map.getDataPath()}.MAP_PROMPT_${idx}', '${map.getDataPath()}.${m.x}', '${map.getDataPath()}.${m.y}')`)

      dialogCardActions
        .addChildTag('q-btn')
        .addAttribute('flat', null)
        .addAttribute('label', 'Default to geolocation')
        .addAttribute('@click', `promptXYSubmit('${map.getDataPath()}.MAP_PROMPT_${idx}', '${map.getDataPath()}.${m.x}', '${map.getDataPath()}.${m.y}', true)`)
    }
  }

  mapCircle(map, m, 'OSGridRef')
} // addMarkerOSGridRef

function addMarkerLongLat (idx, m, markerDetails, map, builder, definition) {
  if (markerDetails) {
    const item = markerDetails.addChildTag('q-item')

    if (m.showWhen) {
      item.addAttribute('v-if', m.showWhen)
    }

    // pin button
    const pinBtn = item
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('top', null)
      .addChildTag('q-btn')
      .addAttribute('icon', 'room')
      .addAttribute('round', null)
      .addAttribute('flat', null)
      .addAttribute('dense', null)
      .addAttribute('style', `color: ${m.color || '#005ea5'};`)

    if (definition.id) {
      pinBtn.addAttribute('@click', `mapJumpToLatLon('${definition.id}', data.${m.longitude}, data.${m.latitude})`)
    } else {
      pinBtn.addAttribute('@click', '')
    }

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

    if (definition.type === 'Input.Map') {
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
        .addAttribute('@click', `promptMapCancel('${map.getDataPath()}.MAP_PROMPT_${idx}')`)

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
  }

  mapCircle(map, m, 'LatLon')
} // addMarkerLongLat

function mapCircle (map, m, format) {
  const Bindings = {
    LatLon: ['longitude', 'latitude'],
    OSGridRef: ['x', 'y']
  }

  const [xBinding, yBinding] = Bindings[format]

  const circle = map
    .addChildTag('q-map-circle')
    .addAttribute('format', format)
    .addAttribute(`:${xBinding}`, `data.${m[xBinding]}`)
    .addAttribute(`:${yBinding}`, `data.${m[yBinding]}`)
    .addAttribute('color', m.color)
    .addAttribute('id', m.id)
    .addAttribute('label', m.label || '')
    .addAttribute(':showMarker', m.showWhen || 'true')

  if (!m.locked) {
    circle
      .addAttribute(`@${xBinding}`, `v => { data.${m[xBinding]} = v }`)
      .addAttribute(`@${yBinding}`, `v => { data.${m[yBinding]} = v }`)
  }
} // mapCircle

function addStart (map, definition) {
  if (definition.defaultCentreToGeolocation) {
    map.addAttribute(':defaultCentreToGeolocation', true)
  } else {
    addStartCentre(map, definition.centre)
  }
} // addStart

function addStartCentre (map, centre) {
  if (!centre) return

  map
    .addAttribute(':centre-longitude', `data.${centre.longitude}`)
    .addAttribute(':centre-latitude', `data.${centre.latitude}`)
} // addStartCentre

function addMarkerPath (map, definition) {
  if (!definition.markersArrayPath) return

  map
    .addChildTag('q-map-circle')
    .addAttribute('v-for', `(m, idx) in ${definition.markersArrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute('format', 'LatLon')
    .addAttribute(':longitude', 'm.longitude')
    .addAttribute(':latitude', 'm.latitude')
    .addAttribute(':label', 'm.label')
    .addAttribute(':showMarker', 'm.showWhen === undefined ? true : m.showWhen')
} // addMarkerPath

module.exports = MapBuilder
