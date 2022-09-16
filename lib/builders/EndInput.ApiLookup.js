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
      .addAttribute('v-if', `data.${id}.pagination.totalPages > 1`)
      .addAttribute('class', 'flex-center')
      .addAttribute('v-model', `data.${id}.pagination.page`)
      .addAttribute('@update:model-value', `action('InputApiLookupNext', ${inspect({ id, endpoint, ctxPaths })})`)
      .addAttribute(':min', 1)
      .addAttribute(':max', `data.${id}.pagination.totalPages`)
      .addAttribute(':max-pages', 4)
      .addAttribute(':disable', `data.${id}.loading`)
      .addAttribute('direction-links', null)
      .addAttribute('unelevated', null)
  }

  return builder.compile() + '</div>'
}
