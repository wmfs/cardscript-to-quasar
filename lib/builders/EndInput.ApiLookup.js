const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id
  } = definition

  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  const resultsDiv = builder.addTag('div')

  const list = resultsDiv.addChildTag('q-list')
  list.addAttribute('v-if', `data.${id}.results.length > 0`)

  const item = list.addChildTag('q-item')
  item.addAttribute('v-for', `(item, idx) in data.${id}.results`)
  item.addAttribute(':key', 'idx')
  item.content(`{{item}}`)

  const noResultsText = resultsDiv.addChildTag('div')
  noResultsText.addAttribute('v-if', `data.${id}.results.length === 0`)
  noResultsText.content('No results found.')

  const paginationDiv = builder.addTag('div')
  // const pagination = paginationDiv.addChildTag('q-pagination')

  /*
    <q-pagination
      class="q-pa-xl flex-center"
      v-model="page"
      :min="1"
      :max="totalPages"
      input
      @input="next"
    />
  */
  return builder.compile() + '</div>'
}
