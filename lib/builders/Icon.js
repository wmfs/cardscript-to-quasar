const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    icon,
    color,
    spacing
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  const chip = div
    .addChildTag('q-icon')
    .addAttribute('name', icon)
    .addAttribute('style', 'font-size: 2rem;')

  if (color && COLORS[color]) {
    chip.addAttribute('color', COLORS[color])
    if (TEXT_WHITE.includes(color)) {
      chip.addAttribute('text-color', 'white')
    }
  }

  applySpacing({ spacing, source: div })

  return builder.compile()
}
