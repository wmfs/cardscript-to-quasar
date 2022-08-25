const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    spacing,
    style = 'chip'
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  if (style === 'chip') {
    addChip(div, definition)
  } else if (style === 'badge') {
    addBadge(div, definition)
  }

  applySpacing({ spacing, source: div })

  return builder.compile()
}

function addChip (div, definition) {
  const {
    icon,
    text
  } = definition

  const chip = div
    .addChildTag('q-chip')
    .addAttribute('label', text)
    .addAttribute('class', 'q-ma-none')

  if (icon) {
    chip.addAttribute('icon', icon)
  }

  chip
    .addChildTag('q-tooltip')
    .content(text)

  applyColours(chip, definition)
}

function addBadge (div, definition) {
  const {
    icon,
    text
  } = definition

  const badge = div
    .addChildTag('q-badge')
    .addAttribute('multi-line', null)

  if (icon) {
    badge.addChildTag('q-icon').addAttribute('name', icon)
  }

  badge.content(text)
  applyColours(badge, definition)
}

function applyColours (ele, definition) {
  const {
    color
  } = definition

  if (color && COLORS[color]) {
    ele.addAttribute('color', COLORS[color])
    if (TEXT_WHITE.includes(color)) {
      ele.addAttribute('text-color', 'white')
    }
  }
}
