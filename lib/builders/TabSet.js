const { COLORS } = require('./../utils/color-reference')
const ComponentBuilder = require('./../utils/Component-builder')

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

    classes.push('q-my-md')
  }

  qTabs.addAttribute('no-caps', null)
  qTabs.addAttribute('align', alignment)

  classes.push('text-dark')

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

  for (const { title, showWhen, icon, badge } of tabs) {
    const qTab = qTabs
      .addChildTag('q-tab')
      .addAttribute('name', `tab-${tabIdx}`)
      .addAttribute('label', title)

    if (icon) {
      qTab.addAttribute('icon', icon)
    }

    if (showWhen) {
      qTab.addAttribute('v-if', showWhen)
    }

    applyTabAlert(qTab, badge)

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
      .addAttribute('class', 'q-ml-md')
  } else {
    tabPanels = builder.addTag('q-tab-panels', { includeClosingTag: false })
  }

  tabPanels
    .addAttribute('v-model', tabSetId)
    .addAttribute('style', 'background: none;')

  return builder.compile()
}

function applyTabAlert (qTab, badge) {
  if (!badge) {
    return
  }

  const { color, icon, showWhen } = badge

  if (showWhen) {
    qTab.addAttribute(':alert', `(${showWhen}) ? '${COLORS[color]}' : false`)
  } else {
    qTab.addAttribute('alert', COLORS[color])
  }

  if (icon) {
    qTab.addAttribute('alert-icon', icon)
  }
}
