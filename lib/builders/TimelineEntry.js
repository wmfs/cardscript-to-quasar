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
    showLaunches,
    clickToLaunch
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
    const span = titleCol.addChildTag('span')
    span.content(title)

    if (clickToLaunch) {
      applyClickToLaunch(span)
    } else {
      span.addAttribute('class', 'item-label-non-link')
    }
  }

  const subtitleTemplate = entry
    .addChildTag('template')
    .addAttribute('v-slot:subtitle', null)

  if (subtitle) {
    subtitleTemplate.content(subtitle)
  }

  return builder.compile()
}

function applyClickToLaunch (element) {
  const params = ['stateMachineName', 'input', 'title']
    .map(p => `Array.isArray(item.launches) && item.launches.length ? item.launches[0].${p} : null`)
    .join(', ')

  element
    .addAttribute('class', 'item-label')
    .addAttribute('@click', `start('pushCard', ${params})`)
}
