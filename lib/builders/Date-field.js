// A helper function for things like Input.Date, Input.DateTime, Input.Time
const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applyTooltip = require('./../utils/apply-tooltip')

function applyMinMax (element, definition) {
  const d = new Date().getDate()
  const m = new Date().getMonth() + 1
  const y = new Date().getFullYear()
  const TODAY = `${y}/${m <= 9 ? '0' + m : m}/${d <= 9 ? '0' + d : d}`

  const { min, max } = definition

  if (min && max) {
    element.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}' && date <= '${max === '$TODAY' ? TODAY : max}'`)
  } else if (min) {
    element.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}'`)
  } else if (max) {
    element.addAttribute(':options', `date => date <= '${max === '$TODAY' ? TODAY : max}'`)
  }
}

function addDatePicker (template, definition) {
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
    .bindToModel(definition)
    .addAttribute('mask', 'YYYY-MM-DDTHH:mm:ss.SSSZ') // YYYY-MM-DD HH:mm

  applyMinMax(dateEl, definition)
}

function addTimePicker (template, definition) {
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
    .bindToModel(definition)
    .addAttribute('mask', 'YYYY-MM-DDTHH:mm:ss.SSSZ') // YYYY-MM-DD HH:mm
    .addAttribute('format24h', null)

  applyMinMax(timeEl, definition)
}

function applyClearable (template, dataPath) {
  template
    .addChildTag('q-icon')
    .addAttribute('name', 'clear')
    .addAttribute('class', 'cursor-pointer')
    .addAttribute('@click.native', `action('ClearDate', { dataPath: '${dataPath}' } )`)
}

module.exports = function TextField (definition, elementOptions, additionalOptions) {
  const {
    id,
    placeholder,
    tooltip,
    validation,
    max,
    min = '1900/01/01',
    clearable,
    withSeconds
  } = definition

  const builder = new ComponentBuilder(definition)

  const label = definition.title || additionalOptions.title || placeholder

  const div = builder.addTag('div')
  const outerDivClasses = ['q-my-md', 'input-field']

  const dataPath = div.getDataPath()

  const input = div
    .addChildTag('q-input')
    .addAttribute('stack-label', null)
    .addAttribute('filled', null)
    .addAttribute('no-error-icon', null)

  if (label) input.addAttribute('label', label)
  if (placeholder) input.addAttribute(placeholder)

  const templatePrepend = input
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)

  const templateAppend = input
    .addChildTag('template')
    .addAttribute('v-slot:append', null)

  let mask = ''

  switch (additionalOptions.type) {
    case 'Date':
      mask = 'DD/MM/YYYY'
      addDatePicker(templatePrepend, definition)
      break
    case 'DateTime':
      mask = 'DD/MM/YYYY HH:mm'
      if (withSeconds) mask += ':ss'
      addDatePicker(templatePrepend, definition)
      addTimePicker(templateAppend, definition)
      break
    case 'Time':
      addTimePicker(templatePrepend, definition)
      break
  }

  if (additionalOptions.type === 'Time') {
    input
      .bindToModel(definition)
      .addAttribute('mask', withSeconds ? 'fulltime' : 'time')
      .addAttribute(':rules', withSeconds ? '[\'fulltime\']' : '[\'time\']')
  } else {
    input.addAttribute(':value', `formatDate(${dataPath}.${id}, '${mask}')`)
  }

  if (clearable) applyClearable(templateAppend, `${dataPath}.${id}`)
  if (tooltip) applyTooltip({ source: templateAppend, tooltip })

  if (id && validation) {
    templateAppend
      .addChildTag('q-icon')
      .addAttribute('name', 'far fa-check-circle')
      .addAttribute('size', 'xs')
      .addAttribute(':color', `data.$HAS_VALIDATED ? ($v.data.${id} && $v.data.${id}.$error ? 'negative' : 'positive') : 'grey3'`)
  }

  applyErrorCheck(input, definition)

  div.addAttribute('class', outerDivClasses.join(' '))

  return builder.compile()
}
