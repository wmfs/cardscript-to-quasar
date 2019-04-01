const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id,
    showWhen
  } = definition

  apiLookupTracker.addApiLookup(id)

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })
  const div = builder.addTag('div', { includeClosingTag: false })
  // div.addAttribute('style', 'border: 1px solid #e0e0e0;')
  div.addAttribute(':style', `$v.data.${id} && $v.data.${id}.$error ? 'border: 1px solid #db2828;' : 'border: 1px solid #e0e0e0;'`)
  div.addAttribute('class', 'q-pa-md')
  if (showWhen) div.addAttribute('v-if', `${showWhen}`)

  return builder.compile()
}
