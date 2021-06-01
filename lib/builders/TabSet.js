const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')
const ComponentBuilder = require('./../utils/Component-builder')
const applyBadge = require('./../utils/apply-badge')

module.exports = function (definition, options) {
  const {
    id,
    tabs,
    color = 'accent',
    orientation,
    alignment = 'justify'
  } = definition

  const builder = new ComponentBuilder(definition)

  const classes = []

  let qTabs

  if (orientation === 'vertical') {
    const splitter = builder
      .addTag('q-splitter', { includeClosingTag: false })
      .addAttribute(':value', 30)

    const templateBefore = splitter
      .addChildTag('template')
      .addAttribute('v-slot:before', null)

    qTabs = templateBefore
      .addChildTag('q-tabs')
      .addAttribute('vertical', null)
  } else {
    qTabs = builder.addTag('q-tabs')
  }

  if (alignment) qTabs.addAttribute('align', alignment)

  if (color && COLORS[color]) {
    classes.push(`bg-${COLORS[color]}`)

    if (TEXT_WHITE.includes(color)) classes.push('text-white')
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

  tabPanels.addAttribute('v-model', tabSetId)

  return builder.compile()
}
