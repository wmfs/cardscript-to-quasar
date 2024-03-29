const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    separator,
    spacing,
    showWhen
  } = definition

  let div = '<div'

  if (showWhen) div += ` v-if="${showWhen}"`

  const classes = ['row']
  const styles = []

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (classes.length > 0) div += ` class="${classes.join(' ')}"`
  if (styles.length > 0) div += ` style="${styles.join('; ')}"`

  return `${div}>`
}
