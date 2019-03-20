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

  const list = resultsDiv
    .addChildTag('q-list')
    .addAttribute(':no-border', true)
    .addChildTag('q-list-header')
    .addAttribute('v-if', `data.${id}.results.length > 0`)
    .content(`{{data.${id}.summary.totalHits}} results found`)

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in data.${id}.results`)
    .addAttribute(':key', 'idx')
    .addAttribute('class', 'non-link-item')

  if (templates) {
    const { label, sublabel } = templates
    const itemMain = item.addChildTag('q-item-main')

    if (label) {
      itemMain
        .addChildTag('q-item-tile')
        .addAttribute(':label', true)
        .content(templates.label)
    }

    if (sublabel) {
      itemMain
        .addChildTag('q-item-tile')
        .addAttribute(':sublabel', true)
        .content(templates.sublabel)
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
    .addAttribute('@click.native', 'start(``, launch.stateMachineName, launch.input, launch.title)')

  itemSideItem
    .addChildTag('q-item-main')
    .addAttribute(':label', 'launch.title || `Open`')

  builder
    .addTag('div')
    .addChildTag('q-pagination')
    .addAttribute('class', 'flex-center')
    .addAttribute('v-model', `data.${id}.pagination.page`)
    .addAttribute(':min', 1)
    .addAttribute(':max', `data.${id}.pagination.totalPages`)
    .addAttribute(':max-pages', 10)
    .addAttribute(':disable', `data.${id}.loading`)
    .addAttribute('@input', `action('InputApiLookupNext', ${inspect(definition)})`)

  return builder.compile() + '</div>'
}
