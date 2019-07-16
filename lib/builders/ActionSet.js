const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    showWhen,
    spacing,
    actionStyle,
    label
  } = definition

  const classes = []

  if (spacing === 'padding') {
    if (actionStyle === 'dropdown') {
      classes.push(`q-px-md`)
    } else {
      classes.push(`q-pa-md`)
    }
  } else if (spacing && MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
    classes.push('q-pa-none')
  } else {
    classes.push('q-pa-none')
  }

  let listGroup = ''

  if (actionStyle === 'dropdown') {
    listGroup += `<q-btn-dropdown color="primary" label="${label}"`

    if (showWhen) listGroup += ` v-if="${showWhen}"`
    if (classes.length > 0) listGroup += ` class="${classes.join(' ')} link-item"`

    listGroup += `>`
  }

  listGroup += `<q-list no-border`

  if (actionStyle !== 'dropdown') {
    if (showWhen) listGroup += ` v-if="${showWhen}"`
    if (classes.length > 0) listGroup += ` class="${classes.join(' ')} link-item"`
  }

  return listGroup + `>`
}
