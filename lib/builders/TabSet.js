const applySpacing = require('./../utils/apply-spacing')

module.exports = function (definition, options) {
  const { spacing, tabs, id } = definition

  const classes = []

  applySpacing({ spacing, classes })

  let tabSet = `<q-tabs${classes.length > 0 ? ` class="${classes.join(' ')}"` : ''} v-model="data.${id}TabSet">`

  tabs.forEach(({ title }, idx) => {
    tabSet += `<q-tab name="tab-${idx}" label="${title}" />`
  })

  tabSet += `</q-tabs>`
  tabSet += `<q-tab-panels v-model="data.${id}TabSet">`

  // TODO: v-model to acknowledge cardListPath/Tracker
  return tabSet
}
