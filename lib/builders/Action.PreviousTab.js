const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet,
    ActionSetDropDown
  } = options

  const {
    title,
    id
    // iconUrl
  } = definition

  const builder = new ComponentBuilder(definition)

  const action = `action('PreviousTab', '${id}')`

  if (ActionSet) {
    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', action)

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
      .addAttribute('color', 'standard')
      .addAttribute('text-color', '#0c0c0c')
      .addAttribute('class', 'q-mb-sm q-mr-sm')
      .addAttribute('@click', action)
  }

  return builder.compile()
}
