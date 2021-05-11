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

function renderList (builder, definition) {
  const {
    arrayPath,
    templates,
    id,
    showLaunches,
    showTotal,
    notFoundText,
    clickToLaunch,
    selectionType,
    selectionMax = 0, // 0 means no limit
    onSelectionEndpoint,
    rowKey,
    validation,
    dense,
    showSingleLaunchAsButton
  } = definition

  const list = builder.addTag('q-list')
  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute(':class', '$q.screen.gt.xs ? \'\' : \'q-px-none\'')

  if (templates) {
    const { label, sublabel, stamp, badge, badgeColor } = templates

    const itemSection = item.addChildTag('q-item-section')

    if (label) {
      const itemLabel = itemSection
        .addChildTag('q-item-label')
        .content(label)

      if (clickToLaunch) applyClickToLaunch(itemLabel)
    }

    if (sublabel) {
      itemSection
        .addChildTag('q-item-label')
        .addAttribute('caption', null)
        .content(sublabel)
    }

    if (stamp) {
      item
        .addChildTag('q-item-section')
        .addAttribute('side', null)
        .addAttribute('top', null)
        .content(stamp)
    }

    if (badge) applyBadges(itemSection, definition)
  }

  if (showLaunches) applyLaunches(item, definition)
} // renderList

function renderCards (builder, definition) {
  const {
    arrayPath,
    imgSrcPath,
    templates,
    id,
    showLaunches,
    showTotal,
    notFoundText,
    clickToLaunch,
    selectionType,
    selectionMax = 0, // 0 means no limit
    onSelectionEndpoint,
    rowKey,
    validation,
    dense,
    showSingleLaunchAsButton
  } = definition

  const div = builder
    .addTag('div')
    .addAttribute('class', 'row justify-around')

  const card = div
    .addChildTag('q-card')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute('style', 'max-width: 300px;')
    .addAttribute('class', 'q-mb-md')

  if (imgSrcPath) card.addChildTag('img').addAttribute(':src', imgSrcPath)

  const cardSection = card.addChildTag('q-card-section')
  const divRow = cardSection
    .addChildTag('div')
    .addAttribute('class', 'row items-center no-wrap')

  if (templates) {
    const { label, sublabel, stamp, badge } = templates

    const headerCol = divRow
      .addChildTag('div')
      .addAttribute('class', 'col')

    if (label) {
      const labelDiv = headerCol
        .addChildTag('div')
        .content(label)

      if (clickToLaunch) applyClickToLaunch(labelDiv)
    }

    const sublabels = []

    if (sublabel) {
      if (Array.isArray(sublabel)) {
        sublabels.push(...sublabel)
      } else {
        sublabels.push(sublabel)
      }
    }

    if (stamp) sublabels.push(stamp)

    for (const s of sublabels) {
      headerCol
        .addChildTag('div')
        .addAttribute('class', 'text-caption text-grey')
        .content(s)
    }

    if (badge) applyBadges(card, definition)
  }

  if (showLaunches) applyLaunches(divRow, definition)
} // renderCards

function applyBadges (parent, definition) {
  const {
    templates,
    listStyle = 'list'
  } = definition

  const {
    badge,
    badgeColor
  } = templates

  const badges = Array.isArray(badge) ? badge : [{ text: badge, colour: badgeColor || 'accent' }]

  if (badges.length) {
    const container = parent.addChildTag(listStyle === 'list' ? 'q-item-label' : 'q-card-section')

    for (const { colour, icon, showWhen, text } of badges) {
      let colorToUse = 'primary'
      let textColor = 'white'

      if (colour && COLORS[colour]) {
        colorToUse = COLORS[colour]
        if (TEXT_WHITE.includes(colour)) {
          textColor = 'white'
        }
      }

      const badge = container
        .addChildTag('q-badge')
        .addAttribute('color', colorToUse)
        .addAttribute('text-color', textColor)
        .addAttribute('class', 'q-mr-sm')
        .content(text)

      if (icon) badge.addChildTag('q-icon').addAttribute('name', icon)
      if (showWhen) badge.addAttribute('v-if', showWhen)
    }
  }
} // applyBadges

function applyClickToLaunch (element) {
  const params = ['stateMachineName', 'input', 'title']
    .map(p => `item.launches && item.launches.length ? item.launches[0].${p} : null`)
    .join(', ')

  element
    .addAttribute('class', 'item-label')
    .addAttribute('@click', `start('pushCard', ${params})`)
} // applyClickToLaunch

function applyLaunches (parent, definition) {
  const {
    listStyle = 'list',
    showSingleLaunchAsButton
  } = definition

  const section = listStyle === 'list'
    ? parent
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('top', null)
    : parent
      .addChildTag('div')
      .addAttribute('class', 'col-auto')

  section.addAttribute('item.launches && items.launches.length > 0')

  // If multiple launches then show menu
  const btn = section
    .addChildTag('q-btn')
    .addAttribute('flat', null)
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('icon', 'more_vert')

  if (showSingleLaunchAsButton) {
    // If only one launch then show button
    section
      .addChildTag('q-btn')
      .addAttribute('color', 'primary')
      .addAttribute('dense', null)
      .addAttribute('outline', null)
      .addAttribute('v-if', 'item.launches && item.launches.length === 1')
      .addAttribute(':label', 'item.launches[0].title || \'Open\'')
      .addAttribute('@click.native', 'start(`pushCard`, item.launches[0].stateMachineName, item.launches[0].input, item.launches[0].title)')

    btn.addAttribute('v-if', 'item.launches && item.launches.length > 1')
  } else {
    btn.addAttribute('v-if', 'item.launches && item.launches.length > 0')
  }

  btn
    .addChildTag('q-menu')

    .addChildTag('q-list')
    .addAttribute('style', 'min-width: 100px')
    .addAttribute('link', null)

    .addChildTag('q-item')
    .addAttribute('clickable', null)
    .addAttribute('v-close-popup', null)
    .addAttribute('v-for', '(launch, idx) in item.launches')
    .addAttribute(':key', 'idx')
    .addAttribute('class', 'q-pa-md')
    .addAttribute('@click.native', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)')

    .addChildTag('q-item-label')
    .content('{{launch.title || `Open`}}')
} // applyLaunches