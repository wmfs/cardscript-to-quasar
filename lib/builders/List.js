const ComponentBuilder = require('./../utils/Component-builder')

// TODO: add to cardscript-schema

module.exports = function (definition, options) {
  const {
    templates,
    showLaunches,
    arrayPath,
    notFoundText,
    isCards
  } = definition

  const builder = new ComponentBuilder(definition)

  if (isCards) {
    // TODO
  } else {
    const list = builder
      .addTag('q-list')
      .addAttribute(':no-border', true)

    const listHeader = list
      .addChildTag('q-list-header')
      .addAttribute('class', 'q-px-none')

    listHeader
      .addChildTag('span')
      .addAttribute('v-if', `data.${arrayPath}.length === 0`)
      .content(notFoundText ? `${notFoundText}` : '0 results found')

    listHeader
      .addChildTag('span')
      .addAttribute('v-if', `data.${arrayPath}.length > 0`)
      .content(`{{data.${arrayPath}.length}} result{{data.${arrayPath}.length === 1 ? '' : 's'}} found`)

    const item = list
      .addChildTag('q-item')
      .addAttribute('v-for', `(item, idx) in data.${arrayPath}`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'non-link-item  q-px-none')

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

    if (showLaunches === true) {
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
        .addAttribute('@click.native', 'start(``, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

      itemSideItem
        .addChildTag('q-item-main')
        .addAttribute(':label', 'launch.title || `Open`')
    }
  }

  return builder.compile()
}
