const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet
  } = options

  const {
    title
    // iconUrl
    // card
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder.addTag('q-item')
    item.addAttribute('@click.native', `action('ReplaceCard')`)
    const main = item.addChildTag('q-item-main')
    main.addAttribute('label', title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
    button.addAttribute('@click', `action('ReplaceCard')`)
  }

  return builder.compile()
}
