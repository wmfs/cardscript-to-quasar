const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const { spacing, tabs, id } = definition

  const classes = []
  if (spacing === 'padding') {
    classes.push(`q-pa-md`)
  } else if (spacing && MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  let tabSet = `<q-tabs${classes.length > 0 ? ' '+ classes.join(' ') : ''} v-model="data.${id}TabSet">`

  tabs.forEach(({ title }, idx) => {
    tabSet += `<q-tab name="tab-${idx}" label="${title}" />`
  })

  tabSet += `</q-tabs>`
  tabSet += `<q-tab-panels v-model="data.${id}TabSet">`

  // TODO: v-model to acknowledge cardListPath/Tracker

  return tabSet
}
