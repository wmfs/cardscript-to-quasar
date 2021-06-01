const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    endpoint,
    ctxPaths,
    showPagination
  } = definition

  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  if (showPagination === true) {
    const div = builder.addTag('div')

    const dataPath = div.getDataPath(id)

    div
      .addChildTag('q-pagination')
      .addAttribute('class', 'flex-center')
      .addAttribute('v-model', `${dataPath}.${id}.pagination.page`)
      .addAttribute(':min', 1)
      .addAttribute(':max', `${dataPath}.${id}.pagination.totalPages`)
      .addAttribute(':max-pages', 4)
      .addAttribute(':disable', `${dataPath}.${id}.loading`)
      .addAttribute('direction-links', null)
      .addAttribute('boundary-numbers', null)
      .addAttribute('ellipses', null)
      .addAttribute('@input', `action('InputApiLookupNext', ${inspect({ id, endpoint, ctxPaths })})`)
  }

  return builder.compile() + '</div>'
}
