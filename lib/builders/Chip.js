const ComponentBuilder = require('./../utils/Component-builder')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  if (definition.style === 'badge') {
    return badgeBuilder(builder, definition)
  }

  return chipBuilder(builder, definition)
}

function chipBuilder (builder, definition) {
  const {
    icon,
    text
  } = definition

  const chip = builder
    .addTag('q-chip')
    .addAttribute('class', 'q-mt-sm q-mr-sm q-mb-none q-ml-none')

  if (icon) {
    chip.addAttribute('icon', icon)
  }

  if (text) {
    chip.content(text)

    chip
      .addChildTag('q-tooltip')
      .content(text)
  }

  applyColours(chip, definition)

  return builder.compile()
}

function badgeBuilder (builder, definition) {
  const {
    icon,
    text
  } = definition

  const badge = builder
    .addTag('q-badge')
    .addAttribute('class', 'q-mt-sm q-mr-sm q-mb-none q-ml-none')
    .addAttribute('multi-line', null)

  if (icon) {
    badge
      .addChildTag('q-icon')
      .addAttribute('name', icon)
  }

  if (text) {
    badge.content(text)
  }

  applyColours(badge, definition)

  return builder.compile()
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
