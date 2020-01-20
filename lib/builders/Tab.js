const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options, idx) {
  const builder = new ComponentBuilder(definition)

  const { showWhen } = definition

  const tabPanel = builder
    .addTag('q-tab-panel', { includeClosingTag: false })
    .addAttribute('name', `tab-${idx}`)

  if (showWhen) {
    tabPanel.addAttribute('v-if', showWhen)
  }

  return builder.compile()
}
