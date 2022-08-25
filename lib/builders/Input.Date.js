const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyDateTimeConstraints = require('./../utils/apply-date-time-constraints')

module.exports = function (definition, options) {
  const {
    max,
    min = '1900/01/01',
    // placeholder,
    spacing,
    separator,
    icon,
    tooltip,
    title,
    id,
    clearable,
    theme,
    subtitle
  } = definition

  const builder = new ComponentBuilder(definition)

  applyTitleLabel({ source: builder.addTag('div'), title, icon, tooltip, subtitle })

  if (theme === 'GDS') {
    const container = builder
      .addTag('div')

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
    // todo: if (tooltip) applyTooltip({ source: container, tooltip })

    return builder.compile()
  }

  const input = builder.addTag('q-input')
  input
    // .addAttribute(':rules', `['date']`)
    .addAttribute('dense', null)
    .addAttribute('readonly', null)
    .addAttribute(':model-value', `formatDate(${input.getDataPath()}.${id}, 'DD/MM/YYYY')`)

  applyErrorCheck(input, id)

  const template = input
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)

  const iconEl = template
    .addChildTag('q-icon')
    .addAttribute('name', icon || 'event')
    .addAttribute('class', 'cursor-pointer')

  const popUpProxy = iconEl
    .addChildTag('q-popup-proxy')
    .addAttribute('ref', 'qDateProxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')

  const dateEl = popUpProxy
    .addChildTag('q-date')
    .addAttribute('@update:model-value', '() => $refs.qDateProxy.hide()')
    .addAttribute('mask', 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    // DD-MM-YYYY - display
    // YYYY-MM-DDTHH:mm:ss.SSSZ - underlying model
  dateEl.bindToModel(definition)

  // if (placeholder) input.addAttribute('placeholder', placeholder) // TODO: test

  if (clearable) {
    input
      .addChildTag('template')
      .addAttribute('v-slot:append', null)
      .addChildTag('q-icon')
      .addAttribute('name', 'clear')
      .addAttribute('class', 'cursor-pointer')
      .addAttribute('@click', `action('SetNullAtDataPath', { dataPath: '${input.getDataPath() + '.' + id}' })`)
      // .addAttribute('@click', `setNullAtDataPath('${input.getDataPath() + '.' + id}')`)
      // .addAttribute('@click', `action('ClearDate', ${inspect({ dataPath: input.getDataPath() + '.' + id })} )`)
  }

  applySpacing({ spacing, source: input })
  applySeparator({ separator, source: input })
  applyDateTimeConstraints(dateEl, min, max)

  return builder.compile()
}
