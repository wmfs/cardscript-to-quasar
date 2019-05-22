const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet
  } = options

  const {
    title,
    // iconUrl
    url
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    builder
      .addTag('q-item')
      .addAttribute('@click.native', `openURL(parseTemplate('${url}'))`)
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .addAttribute('class', 'q-item-label-title')
      .content(title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
    button.addAttribute('@click', `openURL(parseTemplate('${url}'))`)
  }

  return builder.compile()
}
