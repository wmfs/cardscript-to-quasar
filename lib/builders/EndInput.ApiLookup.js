const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    templates
  } = definition

  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  const resultsDiv = builder.addTag('div')

  const list = resultsDiv.addChildTag('q-list')
  list.addAttribute(':no-border', true)

  const listHeader = list.addChildTag('q-list-header')
  listHeader.addAttribute('v-if', `data.${id}.results.length > 0`)
  listHeader.content(`{{data.${id}.summary.totalHits}} results found`)

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in data.${id}.results`)
    .addAttribute(':key', 'idx')
    .addAttribute('class', 'link-item')

  if (templates) {
    const { label, sublabel } = templates
    const itemMain = item.addChildTag('q-item-main')

    if (label) {
      const itemTileLabel = itemMain.addChildTag('q-item-tile')
      itemTileLabel.addAttribute(':label', true)
      itemTileLabel.content(templates.label)
    }

    if (sublabel) {
      const itemTileSublabel = itemMain.addChildTag('q-item-tile')
      itemTileSublabel.addAttribute(':sublabel', true)
      itemTileSublabel.content(templates.sublabel)
    }
  }

  const itemSide = item
    .addChildTag('q-item-side')
    .addAttribute('v-if', 'item.launches && item.launches.length > 0')

  const itemSideBtn = itemSide
    .addChildTag('q-btn')
    .addAttribute(':flat', true)
    .addAttribute(':round', true)
    .addAttribute(':dense', true)
    .addAttribute('icon', 'more_vert')

  const itemSidePopover = itemSideBtn
    .addChildTag('q-popover')

  const itemSideList = itemSidePopover
    .addChildTag('q-list')
    .addAttribute(':link', true)

  const itemSideItem = itemSideList
    .addChildTag('q-item')
    .addAttribute(':v-close-overlay', true)
    .addAttribute('v-for', '(launch, idx) in item.launches')
    .addAttribute(':key', 'idx')
    .addAttribute('@click.native', '')

  itemSideItem
    .addChildTag('q-item-main')
    .addAttribute(':label', 'launch.title || `Open`')

  const paginationDiv = builder.addTag('div')
  const pagination = paginationDiv.addChildTag('q-pagination')
  pagination.addAttribute('class', 'flex-center')
  pagination.addAttribute('v-model', `data.${id}.pagination.page`)
  pagination.addAttribute(':min', 1)
  pagination.addAttribute(':max', `data.${id}.pagination.totalPages`)
  pagination.addAttribute(':max-pages', 10)
  pagination.addAttribute(':disable', `data.${id}.loading`)
  pagination.addAttribute('@input', `action('InputApiLookupNext', ${inspect(definition)})`)

  return builder.compile() + '</div>'
}
