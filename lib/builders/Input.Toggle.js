const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')

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
  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  applySpacing({ spacing, source: div })

  if (styles.length > 0) div.addAttribute('style', styles.join('; '))

  return builder.compile()
}
