const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  default: 'md',
  extraLarge: 'xl'
}
module.exports = function ({ spacing, source, classes = [] }) {
  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (spacing !== 'none') {
    if (MARGINS[spacing]) {
      classes.push(`q-py-${MARGINS[spacing]}`)
    } else {
      classes.push(`q-py-${MARGINS.default}`)
    }
  }
  if (source && classes.length > 0) {
    source.addAttribute('class', classes.join(' '))
  }
}
