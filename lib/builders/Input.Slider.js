const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    min,
    max,
    // icon,
    title,
    separator,
    spacing,
    step
  } = definition

  const builder = new ComponentBuilder(definition)

  if (title) {
    builder.addTag('div').addAttribute('class', 'form-label').content(title)
  }

  const div = builder.addTag('div')

  // if (title) {
  //   field.addAttribute('label-width', options.fieldLabelWidth)
  //   field.addAttribute('label', title)
  // }
  // if (icon) field.addAttribute('icon', icon)

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
