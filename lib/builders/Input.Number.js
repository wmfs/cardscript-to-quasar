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

  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')

  const input = div
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .bindToModel(definition)

  if (placeholder) input.addAttribute('placeholder', placeholder)
  if (maxLength) input.addAttribute('maxlength', maxLength)

  // TODO: Not sure if these are right...
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

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))
  if (styles.length > 0) div.addAttribute('style', styles.join('; '))

  // TODO
  // if (validation && id) input.addAttribute(':error', `$v.data.${id}.$error`)

  return builder.compile()
}
