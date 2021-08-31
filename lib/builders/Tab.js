const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options, idx) {
  const {
    showWhen
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const tabPanel = builder
    .addTag('q-tab-panel', { includeClosingTag: false })
    .addAttribute('name', `tab-${idx}`)

  if (showWhen) tabPanel.addAttribute('v-if', showWhen)

  return builder.compile()
}
