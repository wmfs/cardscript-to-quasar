const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet
  } = options

  const {
    title
    // iconUrl
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    builder
      .addTag('q-item')
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .addAttribute('class', 'item-label')
      .content(title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
  }

  return builder.compile()
}
