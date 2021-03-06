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

    // TODO datapath instead of id
    // const dataPath = div.getDataPath(id)
    // console.log('>>>', dataPath)

    div
      .addChildTag('q-pagination')
      .addAttribute('class', 'flex-center')
      .addAttribute('v-model', `data.${id}.pagination.page`)
      .addAttribute(':min', 1)
      .addAttribute(':max', `data.${id}.pagination.totalPages`)
      .addAttribute(':max-pages', 10)
      .addAttribute(':disable', `data.${id}.loading`)
      .addAttribute('input', null)
      .addAttribute('@input', `action('InputApiLookupNext', ${inspect({ id, endpoint, ctxPaths })})`)
  }

  return builder.compile() + '</div>'
}
