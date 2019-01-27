const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    title,
    stateMachineName,
    input
  } = definition

  const builder = new ComponentBuilder(definition)

  const button = builder.addTag('q-btn')
  button.addAttribute('label', title)
  button.addAttribute('color', 'primary')
  button.addAttribute('@click', `action('PushCard', ${inspect({ stateMachineName, input } || {})} )`)

  return builder.compile()
}
