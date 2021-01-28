const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const { inspect } = require('./../utils/local-util')
const applyTooltip = require('./../utils/apply-tooltip')

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
    clearable
  } = definition

  const builder = new ComponentBuilder(definition)

  if (title) {
    builder
      .addTag('div')
      .content(title)
      .addAttribute('class', 'form-label')
  }

  const input = builder.addTag('q-input')
  input
    // .addAttribute(':rules', `['date']`)
    .addAttribute('dense', null)
    .addAttribute('readonly', null)
    .addAttribute(':value', `formatDate(${input.getDataPath()}.${id}, 'DD/MM/YYYY')`)

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
    .addAttribute('@input', '() => $refs.qDateProxy.hide()')
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
      .addAttribute('@click.native', `action('ClearDate', ${inspect({ dataPath: input.getDataPath() + '.' + id })} )`)
  }

  applySpacing({ spacing, source: input })
  applySeparator({ separator, source: input })
  if (tooltip) applyTooltip({ source: input, tooltip })

  const d = new Date().getDate()
  const m = new Date().getMonth() + 1
  const y = new Date().getFullYear()
  const TODAY = `${y}/${m <= 9 ? '0' + m : m}/${d <= 9 ? '0' + d : d}`

  if (min && max) {
    dateEl.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}' && date <= '${max === '$TODAY' ? TODAY : max}'`)
  } else if (min) {
    dateEl.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}'`)
  } else if (max) {
    dateEl.addAttribute(':options', `date => date <= '${max === '$TODAY' ? TODAY : max}'`)
  }

  return builder.compile()
}
