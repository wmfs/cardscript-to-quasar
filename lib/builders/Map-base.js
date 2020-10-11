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
      addMarker(m.format, idx, m, markerDetails, map, builder, definition)
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

function addMarker (format, idx, m, markerDetails, map, builder, definition) {
  if (markerDetails) {
    const item = markerDetails.addChildTag('q-item')

    if (m.showWhen) {
      item.addAttribute('v-if', m.showWhen)
    }

    markerLabel(m, item, definition, format)

    if (definition.type === 'Input.Map') {
      markerEditButton(idx, m, item, map, builder, format)
    }
  }

  mapCircle(map, m, format)
} // addMarker

const OutBinding = {
  LatLon: ['lng', 'lat'],
  OSGridRef: ['x', 'y']
}

const Bindings = {
  LatLon: ['longitude', 'latitude'],
  OSGridRef: ['x', 'y']
}
const FunctionSuffix = {
  LatLon: 'LatLon',
  OSGridRef: 'XY'
}
const EditLabels = {
  LatLon: ['Longitude', 'Latitude'],
  OSGridRef: ['X', 'Y']
}

const LabelFormatter = {
  LatLon: binding => `parseFloat(${binding}).toFixed(5)`,
  OSGridRef: binding => binding
}

function markerLabel (m, item, definition, format) {
  const [xBinding, yBinding] = Bindings[format]
  const suffix = FunctionSuffix[format]
  const formatter = LabelFormatter[format]

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
    pinBtn.addAttribute('@click', `mapJumpTo${suffix}('${definition.id}', data.${m[xBinding]}, data.${m[yBinding]})`)
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

  const xyLabel = [xBinding, yBinding]
    .map(b => `data.${m[b]}`)
    .map(l => formatter(l))
    .map(f => `{{${f}}}`)
    .join(', ')
  label
    .addChildTag('q-item-label caption')
    .content(xyLabel)
} // markerLabel

function markerEditButton (idx, m, item, map, builder, format) {
  const [xOut, yOut] = OutBinding[format]
  const [xBinding, yBinding] = Bindings[format]
  const suffix = FunctionSuffix[format]
  const [xLabel, yLabel] = EditLabels[format]

  const mapPrompt = `${map.getDataPath()}.MAP_PROMPT_${idx}`

  // edit button
  item
    .addChildTag('q-item-section')
    .addAttribute('side', null)
    .addChildTag('q-btn')
    .addAttribute('icon', 'edit')
    .addAttribute('round', null)
    .addAttribute('flat', null)
    .addAttribute('dense', null)
    .addAttribute('@click', `prompt${suffix}Open('${mapPrompt}', data.${m[xBinding]}, data.${m[yBinding]})`)

  // dialog
  const dialog = builder
    .addTag('q-dialog')
    .addAttribute('v-model', `${mapPrompt}.show`) // bindToModel
    .addAttribute('persistent', null)

  const dialogCard = dialog.addChildTag('q-card')

  const dialogCardContent = dialogCard.addChildTag('q-card-section')

  dialogCardContent
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('v-model.number', `${mapPrompt}.${xOut}`)
    .addAttribute('label', xLabel)

  dialogCardContent
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('v-model.number', `${mapPrompt}.${yOut}`)
    .addAttribute('label', yLabel)

  const dialogCardActions = dialogCard.addChildTag('q-card-actions')

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('label', 'Cancel')
    .addAttribute('@click', `promptMapCancel('${mapPrompt}')`)

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('label', 'Submit')
    .addAttribute('@click', `prompt${suffix}Submit('${mapPrompt}', '${map.getDataPath()}.${m[xBinding]}', '${map.getDataPath()}.${m[yBinding]}')`)

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('label', 'Default to geolocation')
    .addAttribute('@click', `prompt${suffix}Submit('${mapPrompt}', '${map.getDataPath()}.${m[xBinding]}', '${map.getDataPath()}.${m[yBinding]}', true)`)
} // markerEditButton

function mapCircle (map, m, format) {
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
