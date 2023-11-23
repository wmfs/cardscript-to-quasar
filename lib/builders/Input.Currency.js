const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')

module.exports = function (definition, options) {
  const {
    max,
    min,
    maxLength,
    placeholder,
    spacing,
    separator,
    icon,
    tooltip,
    title,
    subtitle
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder
    .addTag('div')
    .addAttribute('id', `CARDSCRIPT_${id}`)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const input = div.addChildTag('q-input')
  input.bindToModel(definition)
  input.addAttribute('type', 'number')
  input.addAttribute('prefix', '£')

  if (placeholder) input.addAttribute('placeholder', placeholder)
  if (maxLength) input.addAttribute('maxLength', maxLength)

  // Not sure if these are right...
  if (min) input.addAttribute('min', min)
  if (max) input.addAttribute('max', max)

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
