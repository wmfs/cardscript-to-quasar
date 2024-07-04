const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyComponentId = require('./../utils/apply-component-id')
const applyRequiredText = require('../utils/apply-required-text')

module.exports = function (definition, options) {
  const {
    icon,
    max,
    min = 0,
    placeholder,
    spacing,
    separator,
    title,
    subtitle,
    id,
    tooltip,
    prefix,
    disableArrows,
    validation
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  applyComponentId(div, id)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle, validation })

  const dataPath = `${div.getDataPath(definition)}.${id}`

  const input = div
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('@update:model-value', `val => ${dataPath} = val === '' ? null : +val`)
    .addAttribute(':model-value', dataPath)
    .addAttribute(':dense', true)

  // .bindToModel(definition, 'number')

  if (prefix) input.addAttribute('prefix', prefix)
  if (placeholder) input.addAttribute('placeholder', placeholder)

  if (min !== undefined) input.addAttribute('min', min)
  if (max !== undefined) input.addAttribute('max', max)

  if (disableArrows) input.addAttribute('class', 'disable-input-number-arrows')

  applyErrorCheck(input, id)
  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })
  applyRequiredText(div, id, validation)

  return builder.compile()
}
