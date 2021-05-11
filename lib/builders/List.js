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

      if (clickToLaunch) applyClickToLaunch(itemLabel, definition)
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
}

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

  if (templates) {
    const { label, sublabel, stamp, badge, badgeColor } = templates

    if (label) {
      const labelDiv = cardSection
        .addChildTag('div')
        .content(label)

      if (clickToLaunch) applyClickToLaunch(labelDiv, definition)
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
      cardSection
        .addChildTag('div')
        .addAttribute('class', 'text-caption text-grey')
        .content(s)
    }

    if (badge) applyBadges(card, definition)
  }
}

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
}

function applyClickToLaunch (element) {
  const params = ['stateMachineName', 'input', 'title']
    .map(p => `item.launches && item.launches.length ? item.launches[0].${p} : null`)
    .join(', ')

  element
    .addAttribute('class', 'item-label')
    .addAttribute('@click', `start('pushCard', ${params})`)
}