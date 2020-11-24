const ComponentBuilder = require('./../utils/Component-builder')
// const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    progressPath
  } = definition

  const builder = new ComponentBuilder(definition)

  const linearProgress = builder.addTag('q-linear-progress')

  linearProgress
    .addAttribute(':value', progressPath)
    .addAttribute('rounded', null)
    .addAttribute('class', 'q-mt-md')
    .addAttribute('size', 'xl')

  return builder.compile()
}
