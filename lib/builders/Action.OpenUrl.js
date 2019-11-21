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
    builder
      .addTag('q-btn')
      .addAttribute('label', title)
      .addAttribute('color', 'primary')
      .addAttribute('class', 'q-mb-sm q-mr-sm')
      .addAttribute('@click', `openURL(parseTemplate('${url}'))`)
  }

  return builder.compile()
}
