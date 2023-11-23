const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyComponentId = require('./../utils/apply-id')

module.exports = function (definition, options) {
  const {
    min,
    max,
    icon,
    title,
    tooltip,
    subtitle,
    separator,
    spacing,
    step,
    id
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  applyComponentId(div, id)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const slider = div.addChildTag('q-slider')
  slider.bindToModel(definition)
  slider.addAttribute(':label-always', true)

  if (min || min === 0) slider.addAttribute(':min', min)
  if (max || max === 0) slider.addAttribute(':max', max)
  if (step) slider.addAttribute(':step', step)

  applySpacing({ source: div, spacing })
  applySeparator({ separator, source: div })

  return builder.compile()
}

// <q-slider v-model="label" :min="-20" :max="20" :step="4" label-always color="orange" />
