const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    icon,
    max,
    min,
    maxLength,
    placeholder,
    spacing,
    separator,
    title,
    id,
    validation
  } = definition

  const builder = new ComponentBuilder(definition)

  const field = builder.addTag('q-field')
  const input = field.addChildTag('q-input')
  input.bindToModel(definition)
  input.addAttribute('type', 'number')

  if (placeholder) input.addAttribute('placeholder', placeholder)
  if (maxLength) input.addAttribute('maxlength', maxLength)
  if (title) {
    field.addAttribute('label-width', options.fieldLabelWidth)
    field.addAttribute('label', title)
  }
  if (icon) field.addAttribute('icon', icon)

  // Not sure if these are right...
  if (min) input.addAttribute('min', min)
  if (max) input.addAttribute('max', max)

  const classes = []
  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) field.addAttribute('class', classes.join(' '))
  if (styles.length > 0) field.addAttribute('style', styles.join('; '))
  if (validation && id) input.addAttribute(':error', `$v.data.${id}.$error`) // TODO: Might be field now?

  return builder.compile()
}
