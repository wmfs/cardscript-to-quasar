const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    max,
    min = '1900/01/01',
    // placeholder,
    spacing,
    separator,
    icon,
    title,
    id,
    clearable,
    validation
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
    .addAttribute(':value', `formatDate(${input.getDataPath()}.${id}, 'DD/MM/YYYY')`)

  if (validation && id) input.addAttribute(':error', `$v.data.${id}.$error`)

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
    .addAttribute('@input', `() => $refs.qDateProxy.hide()`)
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

  const classes = []
  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) input.addAttribute('class', classes.join(' '))
  if (styles.length > 0) input.addAttribute('style', styles.join('; '))

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
