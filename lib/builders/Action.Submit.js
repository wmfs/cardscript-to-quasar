const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    ActionSet
  } = options

  const {
    title,
    // iconUrl
    data
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder.addTag('q-item')
    item.addAttribute('@click', `action('Submit', ${inspect(data || {})} )`)
    const main = item.addChildTag('q-item-label')
    main.addAttribute('header', title)
  } else {
    const button = builder.addTag('q-btn')
    button.addAttribute('label', title)
    button.addAttribute('color', 'positive')
    button.addAttribute(':push', true)
    button.addAttribute('class', 'q-my-xl q-mr-md')
    button.addAttribute('@click', `action('Submit', ${inspect(data || {})} )`)
  }

  return builder.compile()
}
