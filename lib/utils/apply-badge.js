const { COLORS, TEXT_WHITE } = require('./color-reference')

module.exports = function applyBadge ({ source, color, icon, text, showWhen, outline, floating }) {
  let colorToUse, textColor

  if (color && COLORS[color]) {
    colorToUse = COLORS[color]
    if (TEXT_WHITE.includes(colorToUse)) {
      textColor = 'white'
    }
  }

  const badge = source
    .addChildTag('q-badge')
    .addAttribute('class', 'q-mx-xs')

  if (colorToUse) badge.addAttribute('color', colorToUse)
  if (textColor) badge.addAttribute('text-color', textColor)
  if (floating) badge.addAttribute('floating', null)
  if (outline) badge.addAttribute('outline', null)
  if (icon) badge.addChildTag('q-icon').addAttribute('name', icon)
  if (showWhen) badge.addAttribute('v-if', showWhen)

  badge.content(text)
}
