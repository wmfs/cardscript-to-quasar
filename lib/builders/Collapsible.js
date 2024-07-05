const applySpacing = require('./../utils/apply-spacing')
const applyBadge = require('./../utils/apply-badge')
const ComponentBuilder = require('../utils/Component-builder')

module.exports = function (definition, options) {
  const { id, title, subtitle, badge, badgeColor, showWhen, spacing = 'none' } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const expansionItem = builder.addTag('q-expansion-item', { includeClosingTag: false })

  if (id) {
    expansionItem.bindToModel({ id: `${id}Collapsible` })
  }

  if (showWhen) {
    expansionItem.addAttribute('v-if', showWhen)
  }

  expansionItem.addAttribute('expand-icon', 'keyboard_arrow_right')
  expansionItem.addAttribute('expanded-icon', 'keyboard_arrow_down')
  expansionItem.addAttribute('switch-toggle-side', null)

  const headerTemplate = expansionItem.addChildTag('template')
  headerTemplate.addAttribute('v-slot:header', null)

  const itemSection = headerTemplate.addChildTag('q-item-section')
  const titleLabel = itemSection.addChildTag('q-item-label')
  titleLabel.content(title)

  if (badge) {
    const badges = Array.isArray(badge) ? badge : [{ text: badge, colour: badgeColor || 'accent' }]
    const badgeLabel = itemSection.addChildTag('q-item-label')
    for (const badge of badges) {
      applyBadge({ source: badgeLabel, ...badge })
    }
  }

  if (subtitle) {
    const subtitles = Array.isArray(subtitle) ? subtitle : [subtitle]
    for (const st of subtitles) {
      itemSection
        .addChildTag('q-item-label')
        .addAttribute('caption', null)
        .content(st)
    }
  }

  const card = expansionItem.addChildTag('q-card', { includeClosingTag: false })
  card.addAttribute('class', 'collapsible-container')
  card.addChildTag('q-card-section', { includeClosingTag: false })

  const expansionItemClasses = []

  applySpacing({ spacing, classes: expansionItemClasses })

  if (expansionItemClasses.length > 0) {
    expansionItem.addAttribute('class', expansionItemClasses.join(' '))
  }

  return builder.compile()
}
