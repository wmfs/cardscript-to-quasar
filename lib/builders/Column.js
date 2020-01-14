const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

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

  if (style === 'emphasis') classes.push('bg-light')

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  // todo - small screens

  if (width === 'auto') {
    classes.push('col-auto')
  } else if (width === 'stretch') {
    classes.push('col')
  } else if (Number.isInteger(width) && (width > 0 && width <= 12)) {
    classes.push(`col-sm-${width}`)
    classes.push(`col-xs-12`)
  } else {
    classes.push('col-md')
    classes.push('col-xs-12')
  }

  let div = `<div class="${classes.join(' ')}"`
  if (styles.length > 0) div += ` style="${styles.join('; ')}"`

  if (showWhen) div += ` v-if="${showWhen}"`
  if (id) div += ` id="${id}"`

  div += '>'
  return div
}
