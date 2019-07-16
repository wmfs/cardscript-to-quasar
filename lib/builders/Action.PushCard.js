const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    ActionSet,
    ActionSetDropDown
  } = options

  const {
    title,
    stateMachineName,
    input
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`)

    if (ActionSetDropDown) {
      item
        .addAttribute('clickable', null)
        .addAttribute('v-close-popup', null)
    } else {
      item
        .addAttribute('class', 'item-label')
    }

    item
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .content(title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
    button.addAttribute('@click', `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`)
  }

  return builder.compile()
}
