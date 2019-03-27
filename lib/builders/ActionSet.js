const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    spacing
  } = definition

  let listGroup = '<q-list no-border'
  const classes = []
  if (spacing === 'padding') {
    classes.push(`q-pa-md`)
  } else if (spacing && MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
    classes.push('q-pa-none')
  } else {
    classes.push('q-pa-none')
  }
  if (classes.length > 0) listGroup += ` class="${classes.join(' ')} link-item"`
  return listGroup + '>'
}
