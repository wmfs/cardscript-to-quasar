const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet,
    ActionSetDropDown
  } = options

  const {
    title
    // iconUrl
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', `action('Cancel')`)

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
    button.addAttribute('color', 'standard')
    button.addAttribute('text-color', '#0c0c0c')
    button.addAttribute(':push', true)
    button.addAttribute('class', 'q-my-xl q-mr-md')
    button.addAttribute('@click', `action('Cancel')`)
  }

  return builder.compile()
}
