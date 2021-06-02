// A helper function for things like Input.Date, Input.DateTime, Input.Time
const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applyTooltip = require('./../utils/apply-tooltip')

const moment = require('moment')

function addDatePicker (template, definition) {
  const { min, max } = definition

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

  if (min || max) {
    const TODAY = moment().format('YYYY/MM/DD')

    if (min && max) {
      dateEl.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}' && date <= '${max === '$TODAY' ? TODAY : max}'`)
    } else if (min) {
      dateEl.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}'`)
    } else if (max) {
      dateEl.addAttribute(':options', `date => date <= '${max === '$TODAY' ? TODAY : max}'`)
    }

    // let format = 'YYYY/MM/DD'
    // if (type === 'Input.DateTime') {
    //   format += ' HH:mm'
    //   if (withSeconds) format += ':ss' // todo: why isn't this working?
    // }
    // const NOW = moment().format(format)
    // const minIsToday = min === '$TODAY' || min === '$NOW'
    // const maxIsToday = max === '$TODAY' || max === '$NOW'
    //
    // if (min && max) {
    //   dateEl.addAttribute(':options', `date => date >= '${minIsToday ? NOW : min}' && date <= '${maxIsToday ? NOW : max}'`)
    // } else if (min) {
    //   dateEl.addAttribute(':options', `date => date >= '${minIsToday ? NOW : min}'`)
    // } else if (max) {
    //   dateEl.addAttribute(':options', `date => date <= '${maxIsToday ? NOW : max}'`)
    // }
  }
}

function addTimePicker (template, definition) {
  // const { min, max, withSeconds } = definition

  const icon = template
    .addChildTag('q-icon')
    .addAttribute('name', 'access_time')
    .addAttribute('class', 'cursor-pointer')

  const popupProxy = icon
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')

  popupProxy
    .addChildTag('q-time')
    .bindToModel(definition)
    .addAttribute('mask', 'YYYY-MM-DDTHH:mm:ss.SSSZ') // YYYY-MM-DD HH:mm
    .addAttribute('format24h', null)

  // if (min || max) {
  //   const NOW = moment().format(`HH:mm${withSeconds ? ':ss' : ''}`)
  //
  //   if (min && max) {
  //     timeEl.addAttribute(':options', `time => time >= '${min === '$NOW' ? NOW : min}' && time <= '${max === '$NOW' ? NOW : max}'`)
  //   } else if (min) {
  //     timeEl.addAttribute(':options', `time => time >= '${min === '$NOW' ? NOW : min}'`)
  //   } else if (max) {
  //     timeEl.addAttribute(':options', `time => time <= '${max === '$NOW' ? NOW : max}'`)
  //   }
  // }
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
    // max,
    // min = '1900/01/01',
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
