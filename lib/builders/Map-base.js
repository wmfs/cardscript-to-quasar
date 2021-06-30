const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('../utils/local-util')

function MapBuilder (definition, options) {
  const builder = new ComponentBuilder(definition)

  const map = builder
    .addTag('div')
    .addChildTag('q-map')

  map.addAttribute(':id', `'${definition.id}'` || null)
  map.addAttribute(':locked', definition.type === 'Map')
  map.addAttribute(':draggable', definition.draggable || false)

  addStart(map, definition)

  const markers = findMarkers(definition)
  const hasMarkers = markers.length !== 0

  const showDetails = definition.showMarkerLabels || definition.showCentreLabels

  const markerDetails = showDetails
    ? builder.addTag('q-card')
        .addAttribute('flat', null)
        .addAttribute('style', 'border: 1px solid #BFBFBF;')
        .addChildTag('q-card-section')
        .addChildTag('q-list')
    : null

  if (hasMarkers) {
    for (const [idx, m] of markers.entries()) {
      addLabel(m.format, idx, m, markerDetails, map, builder, definition)
    } // for ...

    // add circles in reverse order, so bottom most label is bottom most circle
    markers.reverse()
    for (const [, m] of markers.entries()) {
      addCircle(m.format, m, map)
    }
  }

  addMarkerPath(map, definition, markerDetails)

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
    .addAttribute('flat', null)
    .addAttribute('dense', null)
    .addAttribute('style', `color: ${m.color || '#443DF6'};`)

  if (definition.id) {
    pinBtn.addAttribute('@click', `mapJumpTo${suffix}('${definition.id}', data.${m[xBinding]}, data.${m[yBinding]})`)
  } else {
    pinBtn.addAttribute('@click', '')
  }

  // label
  const label = item.addChildTag('q-item-section')

  if (m.label) {
    const l = Array.isArray(m.label) ? m.label : [m.label]
    label
      .addChildTag('q-item-label')
      .content(l.join(' '))
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

  const input1 = dialogCardContent
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('v-model.number', `${mapPrompt}.${xOut}`)
    .addAttribute('label', xLabel)

  const input2 = dialogCardContent
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('v-model.number', `${mapPrompt}.${yOut}`)
    .addAttribute('label', yLabel)

  if (format === 'OSGridRef') {
    const rules = '[ val => /^\\d{6}(\\.\\d{2})?$/.test(val) || \'Coordinate must be 8 digits only (including 2 decimal places)\' ]'

    input1.addAttribute(':rules', rules)
    input2.addAttribute(':rules', rules)
  }

  const dialogCardActions = dialogCard.addChildTag('q-card-actions')

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('unelevated', null)
    .addAttribute('class', 'btn-close')
    .addAttribute('label', 'Cancel')
    .addAttribute('@click', `promptMapCancel('${mapPrompt}')`)

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('unelevated', null)
    .addAttribute('class', 'btn-primary')
    .addAttribute('label', 'Submit')
    .addAttribute('@click', `prompt${suffix}Submit('${mapPrompt}', '${map.getDataPath()}.${m[xBinding]}', '${map.getDataPath()}.${m[yBinding]}')`)

  dialogCardActions
    .addChildTag('q-btn')
    .addAttribute('unelevated', null)
    .addAttribute('class', 'btn-primary')
    .addAttribute('label', 'Default to geolocation')
    .addAttribute('@click', `prompt${suffix}Submit('${mapPrompt}', '${map.getDataPath()}.${m[xBinding]}', '${map.getDataPath()}.${m[yBinding]}', true)`)
} // markerEditButton

function mapCircle (map, m, format) {
  const [xBinding, yBinding] = Bindings[format]

  const circle = map
    .addChildTag('q-map-circle')
    .addAttribute(':data', 'data')
    .addAttribute(':m', inspect(m))
    .addAttribute('format', format)
    .addAttribute(`:${xBinding}`, `data?.${m[xBinding]}`)
    .addAttribute(`:${yBinding}`, `data?.${m[yBinding]}`)
    .addAttribute('color', m.color)
    .addAttribute('id', m.id)
    .addAttribute(':showMarker', m.showWhen || 'true')

  if (m.label) {
    const l = Array.isArray(m.label) ? m.label : [m.label]
    circle.addAttribute(':label', inspect(l))
  }

  if (!m.locked) {
    circle
      .addAttribute(`@${xBinding}`, `v => { data.${m[xBinding]} = v }`)
      .addAttribute(`@${yBinding}`, `v => { data.${m[yBinding]} = v }`)
  } else {
    circle.addAttribute('locked', 'true')
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

function addMarkerPath (map, definition, markerDetails) {
  if (!definition.markersArrayPath) return

  const circle = map
    .addChildTag('q-map-circle')
    .addAttribute('v-for', `(m, idx) in ${definition.markersArrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute(':data', 'data')
    .addAttribute(':m', 'm')
    .addAttribute(':format', 'm.format || \'LatLon\'')
    .addAttribute(':label', 'm.label')
    .addAttribute(':color', 'm.color')
    .addAttribute(':showMarker', 'm.showWhen === undefined ? true : m.showWhen')
    .addAttribute(':locked', 'm.locked || false')

  for (const binding of ['longitude', 'latitude', 'x', 'y']) {
    circle.addAttribute(`:${binding}`, `m.${binding}`)
    circle.addAttribute(`@${binding}`, `v => { if (!m.locked) m.${binding} = v }`)
  }

  if (markerDetails) {
    const item = markerDetails
      .addChildTag('q-item')
      .addAttribute('v-for', `(m, idx) in ${definition.markersArrayPath}`)
      .addAttribute(':key', 'idx')
      .addAttribute('v-if', 'm.showWhen || true')

    const genPinBtn = () => {
      return item
        .addChildTag('q-item-section')
        .addAttribute('side', null)
        .addAttribute('top', null)
        .addChildTag('q-btn')
        .addAttribute('icon', 'room')
        .addAttribute('round', null)
        .addAttribute('flat', null)
        .addAttribute('dense', null)
        // eslint-disable-next-line no-template-curly-in-string
        .addAttribute(':style', '`color: ${m.color || \'#443DF6\'};`')
    }

    const pinBtnOSGridRef = genPinBtn().addAttribute('v-if', 'm.format === \'OSGridRef\'')
    const pinBtnLatLon = genPinBtn().addAttribute('v-if', 'm.format === \'LatLon\'')

    if (definition.id) {
      pinBtnOSGridRef.addAttribute('@click', `mapJumpToXY('${definition.id}', m.x, m.y)`)
      pinBtnLatLon.addAttribute('@click', `mapJumpToLatLon('${definition.id}', m.longitude, m.latitude)`)
    } else {
      pinBtnOSGridRef.addAttribute('@click', '')
      pinBtnLatLon.addAttribute('@click', '')
    }

    const label = item.addChildTag('q-item-section')

    label
      .addChildTag('q-item-label')
      .addAttribute('v-if', 'm.label')
      .addChildTag('span')
      .addAttribute('v-for', '(label, labelIdx) in Array.isArray(m.label) ? m.label : [m.label]')
      .addAttribute(':key', 'labelIdx')
      .content('{{ parseTemplate(label, { data, m }) }}')

    label
      .addChildTag('q-item-label')
      .addAttribute('caption', null)
      .addAttribute('v-if', 'm.format === \'OSGridRef\'')
      .content('{{ m.x }}, {{ m.y }}')

    label
      .addChildTag('q-item-label')
      .addAttribute('caption', null)
      .addAttribute('v-if', 'm.format === \'LatLon\'')
      .content('{{ m.longitude ? parseFloat(m.longitude).toFixed(5) : null }}, {{ m.latitude ? parseFloat(m.latitude).toFixed(5) : null }}')

    // todo: markerEditButton
  }
} // addMarkerPath

module.exports = MapBuilder
