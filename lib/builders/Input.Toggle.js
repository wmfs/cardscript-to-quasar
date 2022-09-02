const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTooltip = require('./../utils/apply-tooltip')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    style,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  if (style === 'button') {
    applyButtonToggle(div, definition)
  } else {
    applyDefaultToggle(div, definition, style === 'checkbox')
  }

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}

function applyButtonToggle (div, definition) {
  const {
    title,
    // valueOff,
    // valueOn,
    icon
  } = definition

  const opts = [{ value: true }]

  if (icon) opts[0].icon = icon
  if (title) opts[0].label = title

  div
    .addChildTag('q-btn-toggle')
    .addAttribute(':options', inspect(opts))
    .addAttribute(':clearable', true)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('toggle-color', 'white')
    .addAttribute('toggle-text-color', 'primary')
    .addAttribute('color', 'light')
    .addAttribute('text-color', 'dark')
    .bindToModel(definition)
}

function applyDefaultToggle (div, definition, useCheckbox) {
  const {
    title,
    // valueOff,
    // valueOn,
    // icon,
    tooltip
  } = definition

  const field = div
    .addChildTag('q-field')
    .addAttribute('class', 'toggle-field')
    .addAttribute('borderless', null)

  const controlTemplate = field
    .addChildTag('template')
    .addAttribute('v-slot:control', null)

  const optDiv = controlTemplate
    .addChildTag('div')
    .addAttribute('class', 'col-12')

  let opt

  if (useCheckbox) {
    opt = optDiv
      .addChildTag('q-checkbox')
  } else {
    opt = optDiv
      .addChildTag('q-toggle')
      .addAttribute('checked-icon', 'check')
      .addAttribute('unchecked-icon', 'close')
  }

  opt
    .bindToModel(definition)
    .addAttribute('label', title)

  const tooltipIcon = optDiv
    .addChildTag('q-icon')
    .addAttribute('name', 'info')
    .addAttribute('size', 'sm')
    .addAttribute('class', 'q-ml-sm text-dark cursor-pointer')

  applyTooltip({ source: tooltipIcon, tooltip, icon: false })
}
