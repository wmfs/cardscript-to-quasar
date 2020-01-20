const applySpacing = require('./../utils/apply-spacing')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { spacing, tabs, id } = definition

  const builder = new ComponentBuilder(definition)

  const classes = []

  applySpacing({ spacing, classes })

  const qTabs = builder.addTag('q-tabs')

  if (classes.length > 0) {
    qTabs.addAttribute('class', classes.join(' '))
  }

  qTabs.addAttribute('v-model', `${qTabs.getDataPath()}.${id}TabSet`)

  tabs.forEach(({ title, showWhen }, idx) => {
    const qTab = qTabs
      .addChildTag('q-tab')
      .addAttribute('name', `tab-${idx}`)
      .addAttribute('label', title)

    if (showWhen) qTab.addAttribute('v-if', showWhen)
  })

  builder
    .addTag('q-tab-panels', { includeClosingTag: false })
    .addAttribute('v-model', `${qTabs.getDataPath()}.${id}TabSet`)

  return builder.compile()
}
