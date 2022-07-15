const { COLORS } = require('./../utils/color-reference')
const ComponentBuilder = require('./../utils/Component-builder')
const applyBadge = require('./../utils/apply-badge')

module.exports = function (definition, options) {
  const {
    id,
    tabs,
    color = 'accent',
    orientation,
    alignment = 'justify',
    shadowed
    // noCaps
  } = definition

  const builder = new ComponentBuilder(definition)

  const classes = []

  let qTabs

  if (orientation === 'vertical') {
    const splitter = builder
      .addTag('q-splitter', { includeClosingTag: false })
      .addAttribute(':model-value', 30)

    const templateBefore = splitter
      .addChildTag('template')
      .addAttribute('v-slot:before', null)

    qTabs = templateBefore
      .addChildTag('q-tabs')
      .addAttribute('vertical', null)
  } else {
    qTabs = builder.addTag('q-tabs')
  }

  qTabs.addAttribute('no-caps', null)

  qTabs.addAttribute('align', alignment)

  classes.push('text-faded')
  qTabs.addAttribute('active-color', COLORS[color])
  qTabs.addAttribute('active-bg-color', 'white')
  // qTabs.addAttribute('indicator-color', COLORS[color])
  qTabs.addAttribute('indicator-color', 'transparent')
  qTabs.addAttribute('active-class', `active-tab-border-${COLORS[color]}`)

  if (shadowed) {
    classes.push('shadow-2')
  }

  if (classes.length > 0) {
    qTabs.addAttribute('class', classes.join(' '))
  }

  const tabSetId = `${qTabs.getDataPath()}.${id}TabSet`

  qTabs.addAttribute('v-model', tabSetId)

  let tabIdx = 0

  for (const { title, showWhen, badge } of tabs) {
    const qTab = qTabs
      .addChildTag('q-tab')
      .addAttribute('name', `tab-${tabIdx}`)
      .addAttribute('label', title)

    if (showWhen) qTab.addAttribute('v-if', showWhen)

    if (badge) {
      const { color, icon, text, showWhen, outline } = badge
      applyBadge({ source: qTab, color, icon, text, showWhen, outline, floating: true })
    }

    tabIdx++
  }

  builder.addTag('q-separator')

  let tabPanels

  if (orientation === 'vertical') {
    const templateAfter = builder
      .addTag('template', { includeClosingTag: false })
      .addAttribute('v-slot:after', null)

    tabPanels = templateAfter
      .addChildTag('q-tab-panels', { includeClosingTag: false })
      .addAttribute('vertical', null)
  } else {
    tabPanels = builder.addTag('q-tab-panels', { includeClosingTag: false })
  }

  tabPanels
    .addAttribute('v-model', tabSetId)
    .addAttribute('style', 'background: none;')

  return builder.compile()
}
