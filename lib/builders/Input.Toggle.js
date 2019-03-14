const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    title,
    // valueOff,
    // valueOn,
    spacing,
    icon,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)

  const field = builder.addTag('q-field')

  if (title) {
    field.addAttribute('label-width', 12)
    field.addAttribute('label', title)
  }
  if (icon) field.addAttribute('icon', icon)

  const toggle = field.addChildTag('q-toggle')
  toggle.bindToModel(definition)
  toggle.addAttribute('checked-icon', 'check')
  toggle.addAttribute('unchecked-icon', 'close')

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

  return builder.compile()
}
