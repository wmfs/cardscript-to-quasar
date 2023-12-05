const ComponentBuilder = require('./../utils/Component-builder')
const { COLORS } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    icon,
    color,
    title,
    subtitle,
    showWhen
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const entry = builder.addTag('q-timeline-entry', { includeClosingTag: false })

  if (showWhen) entry.addAttribute('v-if', showWhen)
  if (icon) entry.addAttribute('icon', icon)
  if (color && COLORS[color]) entry.addAttribute('color', COLORS[color])

  applyStringSlot(title, entry, 'title')
  applyStringSlot(subtitle, entry, 'subtitle')

  return builder.compile()
}

function applyStringSlot (value, entry, slot) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return
  }

  entry
    .addChildTag('template')
    .addAttribute(`v-slot:${slot}`, null)
    .content(value)
}
