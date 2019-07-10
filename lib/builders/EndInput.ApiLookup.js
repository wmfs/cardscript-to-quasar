const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    templates,
    showLaunches,
    showPagination,
    selectionType,
    ctxPaths,
    clickToLaunch
  } = definition

  apiLookupTracker.removeApiLookup()
  const builder = new ComponentBuilder(definition)

  const resultsDiv = builder.addTag('div')

  const list = resultsDiv
    .addChildTag('q-list')

  // Header
  list
    .addChildTag('q-item-label')
    .addAttribute(':header', true)
    .addAttribute('v-if', `data.${id}.results.length > 0`)
    .content(`{{data.${id}.summary.totalHits}} result{{data.${id}.summary.totalHits > 1 ? 's' : ''}} found`)
    .addAttribute('class', 'q-px-none')

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in data.${id}.results`)
    .addAttribute(':key', 'idx')

  if (selectionType === 'single' || selectionType === 'multi') {
    item
      .addAttribute('class', 'q-px-none')
      .addChildTag('q-item-section')
      .addAttribute(':side', true)
      .addChildTag(selectionType === 'single' ? 'q-radio' : 'q-checkbox')
      .bindToModel({ id: `${id}.selected` })
      .addAttribute(':val', `item.${ctxPaths.id}`)
  } else {
    item.addAttribute('class', 'q-px-none')
  }

  if (templates) {
    const { label, sublabel } = templates
    const itemMain = item.addChildTag('q-item-section')

    if (label) {
      const itemLabel = itemMain
        .addChildTag('q-item-label')
        .content(templates.label)

      if (selectionType === 'single' || selectionType === 'multi' || clickToLaunch) {
        itemLabel.addAttribute('class', 'item-label')
      }
    }

    if (sublabel) {
      itemMain
        .addChildTag('q-item-label')
        .addAttribute(':caption', true)
        .content(templates.sublabel)
    }

    if (clickToLaunch === true) {
      itemMain.addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)') // todo: change to emit event
    }
  }

  if (showLaunches === true) {
    const itemSide = item
      .addChildTag('q-item-section')
      .addAttribute(':right', true)
      .addAttribute(':side', true)
      .addAttribute('v-if', 'item.launches && item.launches.length > 0')

    const itemSideBtn = itemSide
      .addChildTag('q-btn')
      .addAttribute(':flat', true)
      .addAttribute(':round', true)
      .addAttribute(':dense', true)
      .addAttribute('icon', 'more_vert')

    const itemSideMenu = itemSideBtn
      .addChildTag('q-menu')

    const itemSideList = itemSideMenu
      .addChildTag('q-list')
      .addAttribute(':link', true)

    const itemSideItem = itemSideList
      .addChildTag('q-item')
      .addAttribute('v-close-popup', null)
      .addAttribute('clickable', null)
      .addAttribute('v-for', '(launch, idx) in item.launches')
      .addAttribute(':key', 'idx')
      .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

    itemSideItem
      .addChildTag('q-item-label')
      .content('{{launch.title || `Open`}}')
  }

  if (showPagination === true) {
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
  }

  return builder.compile() + '</div>'
}
