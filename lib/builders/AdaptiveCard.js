const adaptiveCardTracker = require('./../utils/adaptive-card-tracker')

module.exports = function (definition, options) {
  const { arrayPath, id, showWhen } = definition

  let template = ''

  if (arrayPath && id) {
    adaptiveCardTracker.addAdaptiveCard(id, arrayPath)
    template += `<div v-for="(${id}Item, ${id}Idx) in ${arrayPath}" :key="${id}Idx"`

    if (showWhen) template += ` v-if="${showWhen}"`

    template += '>'
  } else {
    template += '<div>'
  }

  return template
}
