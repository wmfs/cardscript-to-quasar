const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

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

  applySpacing({ spacing, source: uploader })
  applySeparator({ separator, source: uploader })

  return builder.compile()
}
