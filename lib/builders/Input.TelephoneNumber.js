const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyComponentId = require('./../utils/apply-component-id')

module.exports = function TextField (definition, options) {
  const {
    id,
    placeholder,
    spacing,
    separator,
    tooltip,
    title = 'Phone number',
    subtitle,
    connectionType
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  applyComponentId(div, id)

  let icon
  switch (connectionType) {
    case 'mobile':
      icon = 'smartphone'
      break
    default:
      icon = 'phone'
  }

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const dataPath = `${div.getDataPath(definition)}.${id}`

  const input = div
    .addChildTag('q-input')
    .addAttribute('type', 'tel')
    //.addAttribute('@update:model-value', `val => ${dataPath} = val === '' ? null : +val`)
    //.addAttribute(':model-value', dataPath)
    .addAttribute(':dense', true)
    .addAttribute('class', 'disable-input-number-arrows')
    .addAttribute('v-model', `${dataPath}`)

  if (placeholder) input.addAttribute('placeholder', placeholder)

  applyErrorCheck(input, id)
  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
