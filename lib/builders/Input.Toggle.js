const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
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
    icon,
    tooltip
  } = definition

  const item = div
    .addChildTag('q-item')
    .addAttribute('class', 'q-pa-none')
    .addAttribute('tag', 'label')

  const leftItemSection = item
    .addChildTag('q-item-section')
    .addAttribute('class', 'q-pa-none')
    .addAttribute('side', null)

  const centerItemSection = item
    .addChildTag('q-item-section')

  if (useCheckbox) {
    leftItemSection
      .addChildTag('q-checkbox')
      .bindToModel(definition)
  } else {
    leftItemSection
      .addChildTag('q-toggle')
      .bindToModel(definition)
      .addAttribute('checked-icon', 'check')
      .addAttribute('unchecked-icon', 'close')
  }

  applyTitleLabel({ source: centerItemSection, title, icon, tooltip })
}
