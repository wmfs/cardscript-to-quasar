const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    ActionSet,
    ActionSetDropDown
  } = options

  const {
    title,
    // iconUrl
    data
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', `action('Submit', ${inspect(data || {})} )`)

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
      .addAttribute('color', 'positive')
      .addAttribute('class', 'q-mb-sm q-mr-sm')
      .addAttribute('@click', `action('Submit', ${inspect(data || {})} )`)
  }

  return builder.compile()
}
