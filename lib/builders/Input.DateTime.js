const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyDateTimeConstraints = require('./../utils/apply-date-time-constraints')
const applyTitleLabel = require('./../utils/apply-title-label')

const MASK = 'YYYY-MM-DDTHH:mm:ssZ'

module.exports = function (definition, options) {
  const {
    id,
    title,
    icon,
    tooltip,
    subtitle,
    spacing,
    separator
    // clearable
  } = definition

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const classes = []

  const field = div
    .addChildTag('q-field')
    .addAttribute('dense', null)
    .addAttribute('readonly', null)

  applyErrorCheck(field, id)

  prependTemplate(field, definition)
  controlTemplate(field, definition)
  appendTemplate(field, definition)

  applySpacing({ spacing, classes })
  applySeparator({ separator, source: div })

  if (classes.length > 0) {
    div.addAttribute('class', classes.join(' '))
  }

  return builder.compile()
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
  const { id, withSeconds } = definition

  field
    .addChildTag('template')
    .addAttribute('v-slot:control', null)
    .content(`{{ formatDate(${field.getDataPath()}.${id}, 'DD/MM/YYYY HH:mm${withSeconds ? ':ss' : ''}') }}`)
}

function appendTemplate (field, definition) {
  const { withSeconds, clearable, id, min, max } = definition

  const dataPath = `${field.getDataPath()}.${id}`

  const template = field
    .addChildTag('template')
    .addAttribute('v-slot:append', null)

  const icon = template
    .addChildTag('q-icon')
    .addAttribute('name', 'access_time')
    .addAttribute('class', 'cursor-pointer')

  const popupProxy = icon
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')

  const timeEl = popupProxy
    .addChildTag('q-time')
    .addAttribute('mask', MASK)
    .addAttribute('format24h', null)
    .addAttribute(':withSeconds', withSeconds || false)

  applyDateTimeConstraints(timeEl, min, max, dataPath)

  timeEl.bindToModel(definition)

  if (clearable !== true) {
    return
  }

  template
    .addChildTag('q-icon')
    .addAttribute('name', 'clear')
    .addAttribute('class', 'cursor-pointer')
    .addAttribute('@click', `action('SetNullAtDataPath', { dataPath: '${dataPath}' })`)
}
