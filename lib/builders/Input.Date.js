const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyDateTimeConstraints = require('./../utils/apply-date-time-constraints')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyComponentId = require('./../utils/apply-id')

const MASK = 'YYYY-MM-DDTHH:mm:ssZ'

module.exports = function (definition, options) {
  const {
    spacing,
    separator,
    icon,
    tooltip,
    title,
    subtitle,
    id,
    theme
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  applyComponentId(div, id)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  if (theme === 'GDS') {
    gdsTheme(div, definition)

    return builder.compile()
  }

  const field = div
    .addChildTag('q-field')
    .addAttribute('dense', null)
    .addAttribute('readonly', null)

  applyErrorCheck(field, id)

  prependTemplate(field, definition)
  controlTemplate(field, definition)
  appendTemplate(field, definition)

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}

function gdsTheme (div, definition) {
  const {
    max,
    min = '1900/01/01',
    spacing,
    separator,
    id,
    clearable
  } = definition

  const container = div.addChildTag('div')

  const row = container
    .addChildTag('div')
    .addAttribute('class', 'row')

  const dataPath = `${row.getDataPath()}.${id}`
  let errorCheck = `!!(${dataPath}_$DATE && ${dataPath}_$DATE.errors && ${dataPath}_$DATE.errors.length)`

  if (id) errorCheck += ` || (v$.data.${id} ? v$.data.${id}.$error : false)`

  for (const key of ['date', 'month', 'year']) {
    const label = { date: 'Day', month: 'Month', year: 'Year' }[key]

    row
      .addChildTag('div')
      .addAttribute('class', 'col')
      .addChildTag('q-input')
      .addAttribute('label', label)
      .addAttribute('dense', null)
      .addAttribute('no-error-icon', null)
      .addAttribute('type', 'number')
      .addAttribute('debounce', '500')
      .addAttribute(':model-value', `${dataPath}_$DATE.${key}`)
      .addAttribute('@update:model-value', `val => action('UpdateGDSDate', { dataPath: '${dataPath}', value: val, key: '${key}', min: '${min}', max: '${max}' })`)
      .addAttribute(':error', errorCheck)
  }

  if (clearable) {
    row
      .addChildTag('div')
      .addAttribute('class', 'col')
      .addChildTag('q-btn')
      .addAttribute('@click', `action('ClearGDSDate', '${dataPath}')`)
      .addAttribute('size', 'sm')
      .addAttribute('flat', null)
      .addAttribute('round', null)
      .addAttribute('icon', 'clear')
  }

  let errorMessages = `{{ ${dataPath}_$DATE && ${dataPath}_$DATE.errors && ${dataPath}_$DATE.errors.join(' ') }}`
  if (id) {
    errorMessages += ` {{ invalidFields && invalidFields['${id}'] && invalidFields['${id}'].messages ? invalidFields['${id}'].messages.join(' ') : '' }}`
  }

  container
    .addChildTag('div')
    .addAttribute('class', 'row q-mt-sm text-negative')
    .addAttribute('style', 'line-height: 1; font-size: 11px;')
    .addAttribute('v-if', errorCheck)
    .content(errorMessages)

  applySpacing({ spacing, source: container })
  applySeparator({ separator, source: container })
}

function prependTemplate (field, definition) {
  const { min, max } = definition

  const template = field
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)

  const icon = template
    .addChildTag('q-icon')
    .addAttribute('name', 'event')
    .addAttribute('class', 'cursor-pointer')

  const popupProxy = icon
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')

  const dateEl = popupProxy
    .addChildTag('q-date')
    .addAttribute('mask', MASK)

  dateEl.bindToModel(definition)

  applyDateTimeConstraints(dateEl, min, max)
}

function controlTemplate (field, definition) {
  const { id } = definition

  field
    .addChildTag('template')
    .addAttribute('v-slot:control', null)
    .content(`{{ formatDate(${field.getDataPath()}.${id}, 'DD/MM/YYYY') }}`)
}

function appendTemplate (field, definition) {
  const { clearable, id } = definition

  if (clearable !== true) {
    return
  }

  const template = field
    .addChildTag('template')
    .addAttribute('v-slot:append', null)

  template
    .addChildTag('q-icon')
    .addAttribute('name', 'clear')
    .addAttribute('class', 'cursor-pointer')
    .addAttribute('@click', `action('SetNullAtDataPath', { dataPath: '${field.getDataPath() + '.' + id}' })`)
}
