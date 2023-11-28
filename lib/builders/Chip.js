const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
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
    text,
    spacing
  } = definition

  const span = builder.addTag('span')
  const chip = span.addChildTag('q-chip')

  const classes = [
    'q-mr-sm',
    'q-ml-none'
  ]

  applySpacing({ source: span, spacing, classes })

  span.addAttribute('class', classes.join(' '))

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
    text,
    spacing
  } = definition

  const span = builder.addTag('span')
  const badge = span.addChildTag('q-badge')

  const classes = [
    'q-mr-sm',
    'q-ml-none'
  ]

  applySpacing({ source: span, spacing, classes })

  span.addAttribute('class', classes.join(' '))

  badge.addAttribute('multi-line', null)

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
