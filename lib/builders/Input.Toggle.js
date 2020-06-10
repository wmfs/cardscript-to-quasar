const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    title,
    // valueOff,
    // valueOn,
    spacing,
    icon,
    separator,
    style
  } = definition

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  if (style === 'button') {
    const opts = [{ value: true }]

    if (icon) opts[0].icon = icon
    if (title) opts[0].label = title

    div
      .addChildTag('q-btn-toggle')
      .addAttribute(':options', inspect(opts))
      .addAttribute(':clearable', true)
      .addAttribute('flat', null)
      .addAttribute('dense', null)
      .bindToModel(definition)
  } else {
    if (icon) div.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px').addAttribute('class', 'q-mr-sm')
    if (title) div.addChildTag('span').addAttribute('class', 'form-label').content(title)

    div
      .addChildTag('q-toggle')
      .bindToModel(definition)
      .addAttribute('checked-icon', 'check')
      .addAttribute('unchecked-icon', 'close')
      .addAttribute('size', 'lg')
  }

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
