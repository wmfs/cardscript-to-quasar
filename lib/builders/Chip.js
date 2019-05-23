const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

const COLORS = {
  accent: 'primary',
  good: 'positive',
  warning: 'warning',
  attention: 'negative',
  light: 'light',
  dark: 'dark'
}

const TEXT_WHITE = ['accent', 'good', 'attention', 'dark']

module.exports = function (definition, options) {
  const {
    icon,
    color,
    text,
    spacing
  } = definition

  const builder = new ComponentBuilder(definition)

  const classes = []

  const div = builder.addTag('div')
  const chip = div.addChildTag('q-chip')
  chip.content(text)

  if (icon) chip.addAttribute('icon', icon)

  if (color && COLORS[color]) {
    chip.addAttribute('color', COLORS[color])
    if (TEXT_WHITE.includes(color)) {
      chip.addAttribute('text-color', 'white')
    }
  }

  if (spacing === 'padding') {
    classes.push(`q-pa-md`)
  } else if (spacing && MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))

  return builder.compile()
}
