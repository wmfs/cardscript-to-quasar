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
    const item = builder.addTag('q-item')
    item.addAttribute('@click.native', `openURL(parseTemplate('${url}'))`)
    const main = item.addChildTag('q-item-label')
    main.addAttribute('header', title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
    button.addAttribute('@click', `openURL(parseTemplate('${url}'))`)
  }

  return builder.compile()
}
