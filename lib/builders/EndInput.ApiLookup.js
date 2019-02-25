const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  const results = builder.addTag('div')
  results.content('results here')

  const pagination = builder.addTag('div')
  pagination.content('pagination here')

  return builder.compile() + '</div>'
}
