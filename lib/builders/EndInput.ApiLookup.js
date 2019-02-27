const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id,
    templates
  } = definition

  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  const resultsDiv = builder.addTag('div')

  const list = resultsDiv.addChildTag('q-list')
  list.addAttribute('v-if', `data.${id}.results.length > 0`)

  const item = list.addChildTag('q-item')
  item.addAttribute('v-for', `(item, idx) in data.${id}.results`)
  item.addAttribute(':key', 'idx')

  if (templates) {
    const { label, sublabel } = templates
    const itemMain = item.addChildTag('q-item-main')

    if (label) {
      const itemTileLabel = itemMain.addChildTag('q-item-tile')
      itemTileLabel.addAttribute('label')
      itemTileLabel.content(templates.label)
    }

    if (sublabel) {
      const itemTileSublabel = itemMain.addChildTag('q-item-tile')
      itemTileSublabel.addAttribute('sublabel')
      itemTileSublabel.content(templates.sublabel)
    }
  }

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
