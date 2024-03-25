const ComponentBuilder = require('./../utils/Component-builder')
const { COLORS } = require('./../utils/color-reference')
const applyLaunches = require('./../utils/apply-launches')

module.exports = function (definition, options) {
  const {
    icon,
    color,
    title,
    subtitle,
    showWhen,
    showLaunches
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const entry = builder.addTag('q-timeline-entry', { includeClosingTag: false })

  if (showWhen) {
    entry.addAttribute('v-if', showWhen)
  }

  if (icon) {
    entry.addAttribute('icon', icon)
  }

  if (color && COLORS[color]) {
    entry.addAttribute('color', COLORS[color])
  }

  const titleTemplate = entry
    .addChildTag('template')
    .addAttribute('v-slot:title', null)

  if (showLaunches) {
    const launchesParent = titleTemplate
      .addChildTag('div')
      .addAttribute('class', 'float-right')

    applyLaunches(launchesParent, definition)
  }

  const titleDivRow = titleTemplate
    .addChildTag('div')
    .addAttribute('class', 'row')

  const titleCol = titleDivRow
    .addChildTag('div')
    .addAttribute('class', 'col')

  if (title) {
    titleCol.content(title)
  }

  const subtitleTemplate = entry
    .addChildTag('template')
    .addAttribute('v-slot:subtitle', null)

  if (subtitle) {
    subtitleTemplate.content(subtitle)
  }

  return builder.compile()
}
