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
    const list = builder.addTag('q-list')

    const listHeader = list
      .addChildTag('q-item-label')
      .addAttribute(':header', true)
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

    if (templates) {
      const { label, sublabel, stamp } = templates
      const itemMain = item.addChildTag('q-item-section')

      if (label) {
        // const label =
        itemMain
          .addChildTag('q-item-label')
          .content(templates.label)

        // if (showLaunches === true) {
        //   label.addAttribute('class', 'item-label')
        // }
      }

      if (sublabel) {
        itemMain
          .addChildTag('q-item-label')
          .addAttribute(':caption', true)
          .content(templates.sublabel)
      }

      // if (showLaunches === true) {
      //   itemMain.addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)') // todo: change to emit event
      // }

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
      // item.addAttribute('class', 'link-item  q-px-none')

      const itemSide = item
        .addChildTag('q-item-section')
        .addAttribute(':side', true)
        .addAttribute('v-if', 'item.launches && item.launches.length > 0')

      const itemSideBtn = itemSide
        .addChildTag('q-btn')
        .addAttribute(':flat', true)
        .addAttribute(':round', true)
        .addAttribute(':dense', true)
        .addAttribute('icon', 'more_vert')

      const itemSidePopover = itemSideBtn
        .addChildTag('q-menu')

      const itemSideList = itemSidePopover
        .addChildTag('q-list')
        .addAttribute('style', 'min-width: 100px')
        .addAttribute(':link', true)

      const itemSideItem = itemSideList
        .addChildTag('q-item')
        .addAttribute('v-close-overlay', null)
        .addAttribute('clickable', null)
        .addAttribute('v-for', '(launch, idx) in item.launches')
        .addAttribute(':key', 'idx')
        .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

      itemSideItem
        .addChildTag('q-item-label')
        .content('{{launch.title || `Open`}}')
    } else {
      item.addAttribute('class', 'non-link-item  q-px-none')
    }
  }

  return builder.compile()
}
