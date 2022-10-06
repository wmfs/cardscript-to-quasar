const { COLORS, TEXT_WHITE } = require('./color-reference')

module.exports = function applyAvatar ({ source, color, icon }) {
  let colorToUse, textColor

  if (color && COLORS[color]) {
    colorToUse = COLORS[color]
    if (TEXT_WHITE.includes(color)) {
      textColor = 'white'
    }
  }

  const avatar = source
    .addChildTag('q-avatar')
    .addAttribute('icon', icon)
    .addAttribute('size', 'sm')

  if (colorToUse) avatar.addAttribute('color', colorToUse)
  if (textColor) avatar.addAttribute('text-color', textColor)
}
