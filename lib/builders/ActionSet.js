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

  let listGroup = '<q-list link separator>'
  const classes = []
  if (spacing === 'padding') {
    classes.push(`q-pa-md`)
  } else if (spacing && MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }
  if (classes.length > 0) listGroup += ` class="${classes.join(' ')}"`
  return listGroup
}
