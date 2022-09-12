const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    endpoint,
    ctxPaths,
    showPagination,
    resultsPerPage
  } = definition

  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  if (showPagination === true) {
    const div = builder
      .addTag('div')
      .addAttribute('style', 'width: 100%; display: flex; justify-content: end; align-items: center;')
      .addAttribute('class', 'q-my-md')

    const dataPath = div.getDataPath()
    const totalPages = [dataPath, id, 'pagination', 'totalPages'].join('.')
    const loading = [dataPath, id, 'loading'].join('.')
    const page = [dataPath, id, 'pagination', 'page'].join('.')
    const limit = resultsPerPage
    const offset = `((${page} - 1) * ${limit})`
    const totalHits = [dataPath, id, 'summary', 'totalHits'].join('.')

    div
      .addChildTag('q-pagination')
      .addAttribute('v-if', `${totalPages} > 1`)
      .addAttribute('class', 'flex-center')
      .addAttribute('v-model', page)
      .addAttribute(':min', 1)
      .addAttribute(':max-pages', 4)
      .addAttribute(':max', totalPages)
      .addAttribute('direction-links', null)
      .addAttribute(':disable', loading)
      .addAttribute('@update:model-value', `action('InputApiLookupNext', ${inspect({ id, endpoint, ctxPaths })})`)

    div
      .addChildTag('div')
      .addAttribute('v-if', `${totalHits} > 0`)
      .addAttribute('class', 'text-weight-light q-mx-md')
      .content(`Showing {{ ${offset} + 1 }} - {{ ${offset} + ${limit} > ${totalHits} ? ${totalHits} : ${offset} + ${limit} }} of {{ ${totalHits} }} results`)
  }

  return builder.compile() + '</div>'
}
