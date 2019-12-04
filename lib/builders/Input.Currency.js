const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    max,
    min,
    maxLength,
    placeholder,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)

  const input = builder.addTag('q-input')
  input.bindToModel(definition)
  input.addAttribute('type', 'number')
  input.addAttribute('prefix', '£')

  if (placeholder) input.addAttribute('placeholder', placeholder)
  if (maxLength) input.addAttribute('maxLength', maxLength)

  // Not sure if these are right...
  if (min) input.addAttribute('min', min)
  if (max) input.addAttribute('max', max)

  applySpacing({ spacing, source: input })
  applySeparator({ separator, source: input })

  return builder.compile()
}
