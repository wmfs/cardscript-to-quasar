const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')

module.exports = function (definition, options) {
  if (definition.side && !['right', 'left'].includes(definition.side)) {
    definition.side = 'right'
  }

  const {
    side,
    spacing
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const timeline = builder
    .addTag('q-timeline', { includeClosingTag: false })
    .addAttribute('side', side)

  applySpacing({ spacing, source: timeline })

  return builder.compile()
}
