const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    max,
    min,
    placeholder,
    title,
    spacing,
    separator
  } = definition

  const TODAY = new Date()

  const builder = new ComponentBuilder(definition)
  const date = builder.addTag('q-datetime')
  date.bindToModel(definition)
  date.addAttribute('type', 'datetime')
  if (placeholder) date.addAttribute('placeholder', placeholder)
  if (title) date.addAttribute('float-label', title)

  const classes = []
  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) date.addAttribute('class', classes.join(' '))
  if (styles.length > 0) date.add('style', styles.join('; '))

  if (min) date.addAttribute('min', min === '$TODAY' ? TODAY : min)
  if (max) date.addAttribute('max', max === '$TODAY' ? TODAY : max)

  return builder.compile()
}
