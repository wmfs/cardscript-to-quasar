const ComponentBuilder = require('./../utils/Component-builder')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')
const applyTooltip = require('./../utils/apply-tooltip')

module.exports = function (definition, options) {
  const { title, subtitle, badge, badgeColor, showWhen, tooltip } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const expansionItem = builder.addTag('q-expansion-item', { includeClosingTag: false })

  if (typeof showWhen === 'string' && showWhen.length > 0) {
    expansionItem.addChildTag('v-if', showWhen)
  }

  expansionItem
    .addAttribute('expand-icon', 'keyboard_arrow_right')
    .addAttribute('expanded-icon', 'keyboard_arrow_down')
    .addAttribute('switch-toggle-side', null)

  const templateHeader = expansionItem.addChildTag('template')
  templateHeader.addAttribute('v-slot:header', null)

  const itemSection = templateHeader.addChildTag('q-item-section')
  const itemLabel = itemSection.addChildTag('q-item-label')

  if (typeof title === 'string' && title.length > 0) {
    itemLabel.content(title)
  }

  if (badge) {
    let color = 'primary'
    let textColor = 'white'

    if (badgeColor && COLORS[badgeColor]) {
      color = COLORS[badgeColor]
      if (TEXT_WHITE.includes(badgeColor)) {
        textColor = 'white'
      }
    }

    const badgeLabel = itemSection.addChildTag('q-item-label')
    const badgeElement = badgeLabel.addChildTag('q-badge')
    badgeElement
      .addAttribute('color', color)
      .addAttribute('text-color', textColor)
      .content(badge)
  }

  if (subtitle) {
    const subtitles = Array.isArray(subtitle) ? subtitle : [subtitle]

    subtitles.forEach(st => {
      itemSection
        .addChildTag('q-item-label')
        .addAttribute('caption', null)
        .content(st)
    })
  }

  const card = expansionItem
    .addChildTag('q-card', { includeClosingTag: false })
    .addAttribute('class', 'collapsible-container')

  card.addChildTag('q-card-section', { includeClosingTag: false })

  return builder.compile()
}
