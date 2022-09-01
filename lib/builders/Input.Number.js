const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTooltip = require('./../utils/apply-tooltip')

module.exports = function (definition, options) {
  const {
    icon,
    max,
    min = 0,
    placeholder,
    spacing,
    separator,
    title,
    id,
    tooltip,
    prefix,
    disableArrows
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')
  if (tooltip) applyTooltip({ source: labelDiv, tooltip })

  const dataPath = `${div.getDataPath(definition)}.${id}`

  const input = div
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('@update:model-value', `val => ${dataPath} = val === '' ? null : +val`)
    .addAttribute(':model-value', dataPath)
    .addAttribute(':dense', true)

  if (id) input.addAttribute('id', `${id}-input`)

  // .bindToModel(definition, 'number')

  if (prefix) input.addAttribute('prefix', prefix)
  if (placeholder) input.addAttribute('placeholder', placeholder)

  if (min !== undefined) input.addAttribute('min', min)
  if (max !== undefined) input.addAttribute('max', max)

  if (disableArrows) input.addAttribute('class', 'disable-input-number-arrows')

  applyErrorCheck(input, id)
  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
