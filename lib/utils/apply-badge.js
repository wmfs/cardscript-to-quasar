const { COLORS, TEXT_WHITE } = require('./color-reference')

module.exports = function applyBadge ({ source, color, icon, text, showWhen, outline, floating }) {
  let colorToUse, textColor

  if (color && COLORS[color]) {
    colorToUse = COLORS[color]
    if (TEXT_WHITE.includes(color)) {
      textColor = 'white'
    }
  }

  const tag = floating ? 'q-badge' : 'q-chip'

  const badge = source
    .addChildTag(tag)
    .addAttribute('class', 'q-mx-xs')
    .addAttribute('square', null)
    .addAttribute('size', 'sm')

  if (colorToUse) badge.addAttribute('color', colorToUse)
  if (textColor) badge.addAttribute('text-color', textColor)
  if (outline) badge.addAttribute('outline', null)
  if (showWhen) badge.addAttribute('v-if', showWhen)

  if (tag === 'q-badge') {
    if (floating) badge.addAttribute('floating', null)
    if (icon) badge.addChildTag('q-icon').addAttribute('name', icon)
  } else if (tag === 'q-chip') {
    if (icon) badge.addAttribute('icon', icon)
  }

  badge.content(text)
}
