const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet,
    ActionSetDropDown
  } = options

  const {
    title,
    // iconUrl
    url
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', `openURL(parseTemplate('${url}'))`)

    if (ActionSetDropDown) {
      item
        .addAttribute('clickable', null)
        .addAttribute('v-close-popup', null)
    } else {
      item.addAttribute('class', 'item-label')
    }

    item
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .content(title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
    button.addAttribute('@click', `openURL(parseTemplate('${url}'))`)
  }

  return builder.compile()
}
