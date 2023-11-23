const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')

module.exports = function (definition, options) {
  const {
    // max,
    // min,
    // placeholder,
    spacing,
    separator,
    title,
    icon,
    tooltip,
    subtitle
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder
    .addTag('div')
    .addAttribute('id', `CARDSCRIPT_${id}`)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const input = div.addChildTag('q-input')
  input.bindToModel(definition)

  input
    .addAttribute('mask', 'fulltime')
    .addAttribute(':rules', '[\'fulltime\']')
    // template
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)
    // q-icon
    .addChildTag('q-icon')
    .addAttribute('name', 'access_time')
    .addAttribute('class', 'cursor-pointer')
    // q-popup-proxy
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')
    // q-time
    .addChildTag('q-time')
    .addAttribute('with-seconds', null)
    .addAttribute('format24h', null)
    .bindToModel(definition)

  // if (placeholder) date.addAttribute('placeholder', placeholder)

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
