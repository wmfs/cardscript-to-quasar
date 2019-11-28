const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')

module.exports = function (definition, options) {
  const {
    id,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)

  const styles = []

  const div = builder.addTag('div')

  div.addAttribute('id', `graph-${id}`)

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  applySpacing({ spacing, classes })

  if (styles.length > 0) div.addAttribute('style', styles.join('; '))

  return builder.compile()
}
