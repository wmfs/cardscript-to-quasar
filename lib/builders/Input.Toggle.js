const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTooltip = require('./../utils/apply-tooltip')
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
    applyDefaultToggle(div, definition)
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
    .addAttribute('flat', null)
    .addAttribute('dense', null)
    .bindToModel(definition)
}

function applyDefaultToggle (div, definition) {
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

  const leftItemSection = item
    .addChildTag('q-item-section')
    .addAttribute('class', 'q-pa-none')
    .addAttribute('avatar', null)

  leftItemSection
    .addChildTag('q-toggle')
    .bindToModel(definition)
    .addAttribute('checked-icon', 'check')
    .addAttribute('unchecked-icon', 'close')
    .addAttribute('size', 'lg')

  const centerItemSection = item
    .addChildTag('q-item-section')

  applyTitleLabel({ source: centerItemSection, title, icon, tooltip })

  // const toggle = div
  //   .addChildTag('q-toggle')
  //   .bindToModel(definition)
  //   .addAttribute('checked-icon', 'check')
  //   .addAttribute('unchecked-icon', 'close')
  //   .addAttribute('size', 'lg')
  //
  // if (icon) {
  //   toggle.addAttribute('icon', icon)
  // }
  //
  // if (title) {
  //   toggle
  //     .addAttribute('label', title)
  //     .addAttribute('class', 'form-label')
  //
  //   // .addAttribute(':left-label', true)
  // }
  //
  // if (tooltip) {
  //   applyTooltip({ source: div, tooltip })
  // }
}
