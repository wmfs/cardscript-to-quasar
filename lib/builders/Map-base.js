const ComponentBuilder = require('./../utils/Component-builder')

function MapBuilder (definition, options) {
  const builder = new ComponentBuilder(definition)

  const map = builder
    .addTag('div')
    .addChildTag('q-map')

  map.addAttribute(':id', `'${definition.id}'` || null)
  map.addAttribute(':locked', definition.type === 'Map')
  map.addAttribute(':draggable', definition.draggable || false)

  const mapFlyToId = map.getDataPath() + '.' + definition.id + 'MapFlyTo'
  map.addAttribute(':mapFlyTo', mapFlyToId)

  addStart(map, definition)

  const markers = findMarkers(definition)
  const hasMarkers = markers.length !== 0

  if (hasMarkers) {
    const showDetails = definition.showMarkerLabels || definition.showCentreLabels

    const markerDetails = showDetails
      ? builder.addTag('q-card')
        .addAttribute('flat', null)
        .addChildTag('q-card-section')
        .addChildTag('q-list')
      : null

    for (const [idx, m] of markers.entries()) {
      addLabel(m.format, idx, m, markerDetails, map, builder, definition)
    } // for ...

    // add circles in reverse order, so bottom most label is bottom most circle
    markers.reverse()
    for (const [, m] of markers.entries()) {
      addCircle(m.format, m, map)
    }
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

function addLabel (format, idx, m, markerDetails, map, builder, definition) {
  format = cleanFormat(format)

  if (markerDetails) {
    const item = markerDetails.addChildTag('q-item')

    if (m.showWhen) {
      item.addAttribute('v-if', m.showWhen)
    }

    markerLabel(m, item, definition, format)

    if (definition.type === 'Input.Map' && !m.locked) {
      markerEditButton(definition.id, idx, m, item, map, builder, format)
    }
  }
} // addLabel

function addCircle (format, m, map) {
  format = cleanFormat(format)

  mapCircle(map, m, format)
}

function cleanFormat (f) {
  if (['LatLon', 'OSGridRef'].includes(f)) return f
  return 'LatLon'
}

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
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('dense', null)
    .addAttribute('style', `color: ${m.color || '#005ea5'};`)

  if (definition.id) {
    const mapFlyToId = pinBtn.getDataPath() + '.' + definition.id + 'MapFlyTo'
    pinBtn.addAttribute('@click', `action('MapJumpTo${suffix}', { id: '${mapFlyToId}', x: data.${m[xBinding]}, y: data.${m[yBinding]} })`)
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
    .addChildTag('q-item-label')
    .addAttribute('caption', null)
    .content(xyLabel)
} // markerLabel

function markerEditButton (elementId, idx, m, item, map, builder, format) {
  const [xOut, yOut] = OutBinding[format]
  const [xBinding, yBinding] = Bindings[format]
  const suffix = FunctionSuffix[format]
  const [xLabel, yLabel] = EditLabels[format]

  const mapPrompt = `${map.getDataPath()}.${elementId}_MAP_PROMPT_${idx}`

  // edit button
  item
    .addChildTag('q-item-section')
    .addAttribute('side', null)
    .addChildTag('q-btn')
    .addAttribute('icon', 'edit')
    .addAttribute('round', null)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('dense', null)
    .addAttribute('@click', `action('PromptMap${suffix}Open', { mapPrompt: '${mapPrompt}', x: data.${m[xBinding]}, y: data.${m[yBinding]} })`)

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
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('label', 'Cancel')
    .addAttribute('@click', `action('PromptMapCancel', { mapPrompt: '${mapPrompt}' })`)

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('label', 'Submit')
    .addAttribute('@click', `action('PromptMap${suffix}Submit', { mapPrompt: '${mapPrompt}', xDataPath: '${map.getDataPath()}.${m[xBinding]}', yDataPath: '${map.getDataPath()}.${m[yBinding]}', defaultToGeoLocation: false })`)

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('label', 'Default to geolocation')
    .addAttribute('@click', `action('PromptMap${suffix}Submit', { mapPrompt: '${mapPrompt}', xDataPath: '${map.getDataPath()}.${m[xBinding]}', yDataPath: '${map.getDataPath()}.${m[yBinding]}', defaultToGeoLocation: true })`)
} // markerEditButton

function mapCircle (map, m, format) {
  const [xBinding, yBinding] = Bindings[format]

  const circle = map
    .addChildTag('q-map-circle')
    .addAttribute('format', format)
    .addAttribute(`:${xBinding}`, `data?.${m[xBinding]}`)
    .addAttribute(`:${yBinding}`, `data?.${m[yBinding]}`)
    .addAttribute('color', m.color)
    .addAttribute('id', m.id)
    .addAttribute('label', m.label || '')
    .addAttribute(':showMarker', m.showWhen || 'true')

  if (!m.locked) {
    circle
      .addAttribute(`@${xBinding}`, `v => { data.${m[xBinding]} = v }`)
      .addAttribute(`@${yBinding}`, `v => { data.${m[yBinding]} = v }`)
  } else {
    circle.addAttribute('locked', 'true')
  }
} // mapCircle

function addStart (map, definition) {
  addStartCentre(map, definition.centre)

  if (definition.defaultCentreToGeolocation) {
    map.addAttribute(':defaultCentreToGeolocation', true)
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
    .addAttribute(':format', 'm.format || \'LatLon\'')
    .addAttribute(':longitude', 'm.longitude')
    .addAttribute(':latitude', 'm.latitude')
    .addAttribute(':x', 'm.x')
    .addAttribute(':y', 'm.y')
    .addAttribute(':label', 'm.label')
    .addAttribute(':id', 'm.id')
    .addAttribute(':color', 'm.color')
    // eslint-disable-next-line no-template-curly-in-string
    .addAttribute(':showMarker', 'm.showWhen === undefined ? true : parseTemplate(`{{ ${m.showWhen} }}`, { data, m }) === \'true\'')
} // addMarkerPath

module.exports = MapBuilder
