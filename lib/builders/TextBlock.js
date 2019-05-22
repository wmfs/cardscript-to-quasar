const ComponentBuilder = require('./../utils/Component-builder')

const COLORS = {
  accent: 'primary',
  good: 'positive',
  warning: 'warning',
  attention: 'negative',
  light: 'light',
  dark: 'dark'
}

const SIZES = {
  small: 'text-caption',
  medium: 'text-h5',
  large: 'text-h3',
  extraLarge: 'text-h2',
  default: 'text-subtitle1'
}

const WEIGHTS = {
  lighter: 'light',
  bolder: 'bold'
}

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl',
  default: 'md'
}

module.exports = function (definition, options) {
  const {
    color,
    horizontalAlignment,
    isSubtle,
    maxLines,
    size,
    text,
    weight,
    wrap,
    id,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  if (id) div.addAttribute('id', id)

  const classes = []
  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)
  if (['left', 'right', 'center'].includes(horizontalAlignment)) classes.push(`text-${horizontalAlignment}`)
  if (color && COLORS[color]) classes.push(`text-${COLORS[color]}`)
  if (isSubtle) classes.push(`text-weight-light`)
  if (weight && WEIGHTS[weight]) classes.push(`text-weight-${WEIGHTS[weight]}`)

  if (spacing === 'padding') {
    classes.push(`q-pa-md`)
  } else if (spacing && MARGINS[spacing]) {
    classes.push(`q-my-${MARGINS[spacing]}`)
  } else {
    classes.push(`q-my-${MARGINS.default}`)
  }

  if (size && SIZES[size]) {
    classes.push(SIZES[size])
  } else {
    classes.push(SIZES.default)
  }

  if (!wrap) {
    classes.push('ellipsis')
  }

  if (maxLines) {
    styles.push(`height: ${maxLines}em`, `line-height: 1em`, `overflow: hidden`)
  }

  if (styles.length > 0) div.addAttribute('style', styles.join('; '))
  if (classes.length > 0) div.addAttribute('class', classes.join(' '))

  div.content(text)
  return builder.compile()
}
