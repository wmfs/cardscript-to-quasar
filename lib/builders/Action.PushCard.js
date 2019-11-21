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

  const onClick = `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`

  if (ActionSet) {
    const classes = ['q-px-none']

    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', onClick)

    if (ActionSetDropDown) {
      item
        .addAttribute('clickable', null)
        .addAttribute('v-close-popup', null)
    } else {
      classes.push('item-label')
    }

    item.addAttribute('class', classes.join(' '))

    item
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .content(title)
  } else {
    builder
      .addTag('q-btn')
      .addAttribute('label', title)
      .addAttribute('color', 'primary')
      .addAttribute('class', 'q-mb-sm q-mr-sm')
      .addAttribute('@click', onClick)
  }

  return builder.compile()
}
