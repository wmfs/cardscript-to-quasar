const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

// TODO: add to cardscript-schema

module.exports = function (definition, options) {
  const {
    id,
    templates,
    showLaunches,
    showTotal,
    arrayPath,
    notFoundText,
    clickToLaunch,
    selectionType,
    onSelectionEndpoint,
    rowKey,
    validation,
    dense
  } = definition

  const builder = new ComponentBuilder(definition)

  const list = builder.addTag('q-list')

  if (dense) list.addAttribute(':dense', true)

  if (showTotal) {
    const listHeader = list
      .addChildTag('q-item-label')
      .addAttribute(':header', true)
      .addAttribute('class', 'q-px-none')

    listHeader
      .addChildTag('span')
      .addAttribute('v-if', `${arrayPath}.length === 0`)
      .content(notFoundText ? `${notFoundText}` : '0 results found')

    listHeader
      .addChildTag('span')
      .addAttribute('v-if', `${arrayPath}.length > 0`)
      .content(`{{${arrayPath}.length}} result{{${arrayPath}.length === 1 ? '' : 's'}} found`)
  }

  if (!showTotal && notFoundText) {
    list
      .addChildTag('q-item-label')
      .addAttribute(':header', true)
      .addAttribute('class', 'q-px-none')
      .addAttribute('v-if', `${arrayPath}.length === 0`)
      .addChildTag('span')
      .content(notFoundText)
  }

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute(':class', `$q.screen.gt.xs ? '' : 'q-px-none'`)

  if (selectionType === 'single' || selectionType === 'multi') {
    const itemSection = item
      .addChildTag('q-item-section')
      .addAttribute(':side', true)

    const option = itemSection
      .addChildTag(selectionType === 'single' ? 'q-radio' : 'q-checkbox')
      .bindToModel(definition)
      .addAttribute(':val', `item.${rowKey}`)

    if (onSelectionEndpoint) {
      option.addAttribute('@input', `action('ListSelection', ${inspect(onSelectionEndpoint)})`)
    }

    if (validation) {
      list.addAttribute(`:style`, `$v.${list.getDataPath()}.${id}.$error ? 'border: 1px solid #db2828;' : ''`)
    }

    if (selectionType === 'multi') {
      list
        .addChildTag('q-item-label')
        .addAttribute(':header', true)
        .addAttribute('class', 'q-px-none')
        .content(`{{${list.getDataPath()}.${id}.length}} selected`)
        .addChildTag('q-btn')
        .addAttribute('v-if', `${list.getDataPath()}.${id}.length > 0`)
        .addAttribute('@click', `action('ClearListSelection', '${list.getDataPath()}.${id}')`)
        .addAttribute('dense', null)
        .addAttribute('color', 'primary')
        .addAttribute('class', 'q-ml-md')
        .content('Clear selection')
    }
  }

  if (templates) {
    const { label, sublabel, stamp } = templates
    const itemMain = item.addChildTag('q-item-section')

    if (label) {
      const itemLabel = itemMain.addChildTag('q-item-label')

      if (selectionType === 'single' || selectionType === 'multi' || clickToLaunch === true) {
        itemLabel.addAttribute('class', 'item-label')

        if (clickToLaunch === true) {
          itemLabel.addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)') // todo: change to emit event
        }
      }

      itemLabel.content(label)
    }

    if (sublabel) {
      itemMain
        .addChildTag('q-item-label')
        .addAttribute(':caption', true)
        .content(sublabel)
    }

    if (stamp) {
      item
        .addChildTag('q-item-section')
        .addAttribute('side', null)
        .addChildTag('q-item-label')
        .addAttribute('caption', null)
        .content(stamp)
    }
  }

  if (showLaunches === true) {
    const itemSide = item
      .addChildTag('q-item-section')
      .addAttribute(':side', true)
      .addAttribute(':style', `!item.launches || item.launches === '' || item.launches.length === 0 ? 'margin-right: 33.59px !important;' : ''`)

    const itemSideBtn = itemSide
      .addChildTag('q-btn')
      .addAttribute(':flat', true)
      .addAttribute(':round', true)
      .addAttribute(':dense', true)
      .addAttribute('icon', 'more_vert')
      .addAttribute('v-if', 'item.launches && item.launches.length > 0')

    const itemSidePopover = itemSideBtn
      .addChildTag('q-menu')

    const itemSideList = itemSidePopover
      .addChildTag('q-list')
      .addAttribute('style', 'min-width: 100px')
      .addAttribute(':link', true)

    const itemSideItem = itemSideList
      .addChildTag('q-item')
      .addAttribute('v-close-popup', null)
      .addAttribute('clickable', null)
      .addAttribute('v-for', '(launch, idx) in item.launches')
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'q-pa-md')
      .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

    itemSideItem
      .addChildTag('q-item-label')
      .content('{{launch.title || `Open`}}')
  } else {
    item.addAttribute('class', 'non-link-item  q-px-none')
  }

  return builder.compile()
}
