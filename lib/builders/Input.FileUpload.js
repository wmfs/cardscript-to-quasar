const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')

module.exports = function (definition, options) {
  const {
    spacing,
    separator,
    title
  } = definition

  const builder = new ComponentBuilder(definition)
  const uploader = builder.addTag('q-uploader')
  uploader.addAttribute('url', '')

  if (title) uploader.addAttribute('float-label', title)

  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  applySpacing({ spacing, source: uploader })

  if (styles.length > 0) uploader.addAttribute('style', styles.join('; '))

  return builder.compile()
}
