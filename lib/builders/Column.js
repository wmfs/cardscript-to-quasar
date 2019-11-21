const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    // selectAction,
    style,
    width,
    id,
    spacing,
    separator,
    showWhen
  } = definition

  const classes = []
  const styles = []

  if (separator) styles.push(`border-left: 1px solid rgb(238, 238, 238)`, `margin-left: 8px`, `padding-left: 8px`)
  if (style === 'emphasis') classes.push('bg-light')
  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  // todo - small screens

  if (width === 'auto') {
    classes.push('col-auto')
  } else if (width === 'stretch') {
    classes.push('col')
  } else if (Number.isInteger(width) && (width > 0 && width <= 12)) {
    classes.push(`col-sm-${width}`)
    classes.push(`col-xs-12`)
  } else {
    classes.push('col')
    classes.push('col-xs-12')
  }

  let div = `<div class="${classes.join(' ')}"`
  if (styles.length > 0) div += ` style="${styles.join('; ')}"`

  if (showWhen) div += ` v-if="${showWhen}"`
  if (id) div += ` id="${id}"`

  div += '>'
  return div
}
