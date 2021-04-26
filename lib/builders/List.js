const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    listStyle = 'list'
  } = definition

  const builder = new ComponentBuilder(definition)

  if (listStyle === 'list') {
    renderList(builder, definition)
  } else {
    renderCards(builder, definition)
  }

  console.log(builder.compile())

  return builder.compile()
}

function renderCards (builder, definition) {
  const {
    arrayPath,
    showLaunches,
    templates,
    imgSrcPath
  } = definition

  const div = builder.addTag('div')

  div.addAttribute('class', 'row justify-around')

  const card = div
    .addChildTag('q-card')
    .addAttribute('style', 'max-width: 300px;')
    .addAttribute('class', 'q-mb-md')

  card
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')

  if (imgSrcPath) {
    card
      .addChildTag('img')
      .addAttribute(':src', imgSrcPath)
  }

  const cardSection = card
    .addChildTag('q-card-section')

  const divRow = cardSection
    .addChildTag('div')
    .addAttribute('class', 'row items-center no-wrap')

  if (templates) {
    const { label, sublabel, stamp, badge, badgeColor } = templates

    const divColTitles = divRow
      .addChildTag('div')
      .addAttribute('class', 'col')

    if (label) {
      divColTitles
        .addChildTag('div')
        .addAttribute('class', 'text-h6')
        .content(label)
    }

    if (stamp) {
      divColTitles
        .addChildTag('div')
        .addAttribute('class', 'text-caption')
        .content(stamp)
    }

    if (badge) {
      const badges = Array.isArray(badge) ? badge : [{ text: badge, colour: badgeColor || 'accent' }]
      const badgeCardSection = badges.length ? card.addChildTag('q-card-section') : null

      for (const b of badges) {
        let color = 'primary'
        let textColor = 'white'

        if (b.colour && COLORS[b.colour]) {
          color = COLORS[b.colour]
          if (TEXT_WHITE.includes(b.colour)) {
            textColor = 'white'
          }
        }

        const badge = badgeCardSection
          .addChildTag('q-badge')
          .addAttribute('color', color)
          .addAttribute('text-color', textColor)
          .addAttribute('class', 'q-mr-sm')
          .content(b.text)

        if (b.showWhen) badge.addAttribute('v-if', b.showWhen)
      }
    }

    if (sublabel) {
      const cardSection = card.addChildTag('q-card-section')
      const sublabels = Array.isArray(sublabel) ? sublabel : [sublabel]

      sublabels.forEach(s => {
        cardSection
          .addChildTag('div')
          .content(s)
      })
    }
  }

  if (showLaunches) {
    const divColActions = divRow
      .addChildTag('div')
      .addAttribute('class', 'col-auto')

    const btn = divColActions
      .addChildTag('q-btn')
      .addAttribute('icon', 'more_vert')
      .addAttribute('round', null)
      .addAttribute('flat', null)

    const actionMenu = btn.addChildTag('q-menu')

    const actionMenuList = actionMenu
      .addChildTag('q-list')
      .addAttribute('style', 'min-width: 100px')

    const actionMenuListItem = actionMenuList
      .addChildTag('q-item')
      .addAttribute('clickable', null)
      .addAttribute('v-close-popup', null)
      .addAttribute('v-for', '(launch, idx) in item.launches')
      .addAttribute(':key', 'idx')
      .addAttribute('@click', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)') // todo: change to emit event

    actionMenuListItem
      .addChildTag('q-item-section')
      .content('{{launch.title}}')
  }
}

function renderList (builder, definition) {
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

  if (selectionType === 'multi') {
    const selectAllItem = list
      .addChildTag('q-item')
      .addAttribute('v-if', `${arrayPath}.length > 0`)
      // .addAttribute(':class', '$q.screen.gt.xs ? \'\' : \'q-px-none\'')
      .addAttribute('class', 'non-link-item  q-px-none')

    selectAllItem
      .addChildTag('q-item-section')
      .addAttribute(':side', true)
      .addChildTag('q-checkbox')
      .addAttribute('v-model', `${list.getDataPath()}.${id}SelectAll`)
      .addAttribute('@input', `action('ListSelectAll', ${inspect({ dataPath: `${list.getDataPath()}.${id}` })})`)

    selectAllItem
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .addAttribute('class', 'item-label-non-link')
      .content(`Select all {{${arrayPath}.length}} result{{${arrayPath}.length === 1 ? '' : 's'}} below`)
  }

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute(':class', '$q.screen.gt.xs ? \'\' : \'q-px-none\'')

  if (selectionType === 'single' || selectionType === 'multi') {
    const itemSection = item
      .addChildTag('q-item-section')
      .addAttribute(':side', true)

    const option = itemSection
      .addChildTag(selectionType === 'single' ? 'q-radio' : 'q-checkbox')
      // .bindToModel(definition)
      // .addAttribute(':val', rowKey ? `item.${rowKey}` : 'item')

    if (selectionType === 'multi') {
      option.addAttribute(':value', rowKey ? `${list.getDataPath()}.${id}.includes(item.${rowKey})` : `!!${list.getDataPath()}.${id}.find(r => hashSum(r) === hashSum(item))`)
    } else if (selectionType === 'single') {
      option.addAttribute(':val', `hashSum(${list.getDataPath()}.${id}) === hashSum(${rowKey ? `item.${rowKey}` : 'item'})`)
      option.addAttribute(':value', `${list.getDataPath()}.${id}`)
    }

    if (onSelectionEndpoint) {
      option.addAttribute('@input', `action('ListSelection', { onSelectionEndpoint: ${inspect(onSelectionEndpoint)}, selectionType: '${selectionType}', dataPath: \`${list.getDataPath()}.${id}\`, ${rowKey ? `item: item.${rowKey}` : 'item'} })`)
    } else {
      option.addAttribute('@input', `action('ListSelection', { selectionType: '${selectionType}', dataPath: \`${list.getDataPath()}.${id}\`, ${rowKey ? `item: item.${rowKey}` : 'item'} })`)
    }

    if (validation) {
      list.addAttribute(':style', `$v.${list.getDataPath()}.${id}.$error ? 'border: 1px solid #db2828;' : ''`)
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
    const { label, sublabel, stamp, badge, badgeColor } = templates
    const itemMain = item.addChildTag('q-item-section')

    if (label) {
      const itemLabel = itemMain.addChildTag('q-item-label')

      if (selectionType === 'single' || selectionType === 'multi' || clickToLaunch === true) {
        itemLabel.addAttribute('class', 'item-label')

        if (clickToLaunch === true) {
          itemLabel.addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)') // todo: change to emit event
        }
      } else {
        itemLabel.addAttribute('class', 'item-label-non-link')
      }

      itemLabel.content(label)
    }

    if (badge) {
      const badges = Array.isArray(badge) ? badge : [{ text: badge, colour: badgeColor || 'accent' }]
      const badgeItemLabel = badges.length ? itemMain.addChildTag('q-item-label') : null

      for (const b of badges) {
        let color = 'primary'
        let textColor = 'white'

        if (b.colour && COLORS[b.colour]) {
          color = COLORS[b.colour]
          if (TEXT_WHITE.includes(b.colour)) {
            textColor = 'white'
          }
        }

        const badge = badgeItemLabel
          .addChildTag('q-badge')
          .addAttribute('color', color)
          .addAttribute('text-color', textColor)
          .addAttribute('class', 'q-mr-sm')
          .content(b.text)

        if (b.showWhen) badge.addAttribute('v-if', b.showWhen)
      }
    }

    if (sublabel) {
      const sublabels = Array.isArray(sublabel) ? sublabel : [sublabel]

      sublabels.forEach(s => {
        itemMain
          .addChildTag('q-item-label')
          .addAttribute(':caption', true)
          .content(s)
      })
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
      .addAttribute(':style', '!item.launches || item.launches === \'\' || item.launches.length === 0 ? \'margin-right: 33.59px !important;\' : \'\'')

    if (definition.showSingleLaunchAsButton) {
      // If only one launch then show button
      itemSide
        .addChildTag('q-btn')
        .addAttribute('color', 'primary')
        .addAttribute('dense', null)
        .addAttribute('outline', null)
        .addAttribute('v-if', 'item.launches && item.launches.length === 1')
        .addAttribute(':label', 'item.launches[0].title || \'Open\'')
        .addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)') // todo: change to emit event
    }

    // If multiple launches then show menu
    const itemSideVertBtn = itemSide
      .addChildTag('q-btn')
      .addAttribute(':flat', true)
      .addAttribute(':round', true)
      .addAttribute(':dense', true)
      .addAttribute('icon', 'more_vert')

    if (definition.showSingleLaunchAsButton) {
      itemSideVertBtn.addAttribute('v-if', 'item.launches && item.launches.length > 1')
    }

    const itemSidePopover = itemSideVertBtn
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
}
