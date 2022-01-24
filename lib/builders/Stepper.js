const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')
const ComponentBuilder = require('./../utils/Component-builder')
const applyBadge = require('./../utils/apply-badge')

module.exports = function (definition, options) {
  const {
    id,
    color,
    orientation = 'horizontal',
    alignment = 'left'
  } = definition

  const builder = new ComponentBuilder(definition)

  const stepper = builder.addTag('q-stepper', { includeClosingTag: false })
  const stepperId = `${stepper.getDataPath()}.${id}Stepper`

  stepper.addAttribute('v-model', stepperId)
  stepper.addAttribute('header-nav', null)
  stepper.addAttribute('flat', null)
  stepper.addAttribute('animated', null)

  if (orientation === 'vertical') {
    stepper.addAttribute('vertical', null)
  }

  // todo: color

  return builder.compile()
}
