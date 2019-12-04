const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    title,
    // valueOff,
    // valueOn,
    spacing,
    icon,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')

  const toggle = div.addChildTag('q-toggle')
  toggle.bindToModel(definition)
  toggle.addAttribute('checked-icon', 'check')
  toggle.addAttribute('unchecked-icon', 'close')

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
