const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTooltip = require('./../utils/apply-tooltip')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    title,
    // valueOff,
    // valueOn,
    spacing,
    icon,
    separator,
    style,
    tooltip
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
    const toggle = div
      .addChildTag('q-toggle')
      .bindToModel(definition)
      .addAttribute('checked-icon', 'check')
      .addAttribute('unchecked-icon', 'close')
      .addAttribute('size', 'lg')

    if (icon) {
      toggle.addAttribute('icon', icon)
    }

    if (title) {
      toggle
        .addAttribute('label', title)
        .addAttribute('class', 'form-label')

      // .addAttribute(':left-label', true)
    }

    if (tooltip) {
      applyTooltip({ source: div, tooltip })
    }
  }

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
