const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id,
    orientation = 'horizontal',
    showWhen
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const stepper = builder.addTag('q-stepper', { includeClosingTag: false })
  const stepperId = `${stepper.getDataPath()}.${id}Stepper`

  stepper.addAttribute('v-model', stepperId)
  stepper.addAttribute('header-nav', null)
  stepper.addAttribute('flat', null)
  stepper.addAttribute('animated', null)
  stepper.addAttribute('active-icon', 'none')

  if (showWhen) stepper.addAttribute('v-if', showWhen)
  if (orientation === 'vertical') stepper.addAttribute('vertical', null)

  return builder.compile()
}
