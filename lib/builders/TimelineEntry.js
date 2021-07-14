const ComponentBuilder = require('./../utils/Component-builder')
const { COLORS } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    icon,
    color,
    title,
    subtitle
  } = definition

  const builder = new ComponentBuilder(definition)

  const entry = builder.addTag('q-timeline-entry', { includeClosingTag: false })

  if (icon) entry.addAttribute('icon', icon)
  if (title) entry.addAttribute('title', title)
  if (subtitle) entry.addAttribute('subtitle', subtitle)
  if (color && COLORS[color]) {
    entry.addAttribute('color', COLORS[color])
  }

  return builder.compile()
}
