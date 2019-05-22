const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    ActionSet
  } = options

  const {
    title,
    stateMachineName,
    input
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    builder
      .addTag('q-item')
      .addAttribute('@click.native', `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`)
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .addAttribute('class', 'q-item-label-title')
      .content(title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'primary')
    button.addAttribute('@click', `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`)
  }

  return builder.compile()
}
