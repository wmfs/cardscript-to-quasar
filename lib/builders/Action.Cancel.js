const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    ActionSet
  } = options

  const {
    title
    // iconUrl
  } = definition

  const builder = new ComponentBuilder(definition)

  if (ActionSet) {
    const item = builder.addTag('q-item')
    item.addAttribute('@click.native', `action('Cancel')`)
    const main = item.addChildTag('q-item-main')
    main.addAttribute('label', title)
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
