const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition) {
  const {
    url
  } = definition

  const builder = new ComponentBuilder(definition)

  const iframe = builder.addTag('iframe')

  // iframe.addAttribute('width', '550')
  // iframe.addAttribute('height', '400')

  if (url) {
    iframe.addAttribute('src', url)
  }

  return builder.compile()
}
