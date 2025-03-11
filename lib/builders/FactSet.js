const ComponentBuilder = require('./../utils/Component-builder')
const applyBadge = require('./../utils/apply-badge')
const applyTooltip = require('../utils/apply-tooltip')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const { showIcons, facts, showAllIfUndefined } = definition
  const builder = new ComponentBuilder(definition)

  const list = builder.addTag('q-list')
  list.addAttribute('class', 'non-link-item')

  if (Array.isArray(facts)) {
    for (const fact of facts) {
      const {
        title,
        value,
        icon,
        inset,
        choices,
        choicesPath,
        showIfUndefined,
        showWhen,
        badge,
        tooltip
      } = fact

      const item = list.addChildTag('q-item').addAttribute('class', 'q-pl-none')

      if (showWhen) {
        item.addAttribute('v-if', showWhen)
      } else if (typeof value === 'string' && value.length > 0) {
        const dataPaths = value.split('{{').filter(v => v.indexOf('}}') !== -1).map(v => v.substring(0, v.indexOf('}}')))
        const show = showAllIfUndefined || showIfUndefined
        if (show !== true && dataPaths.length > 0) {
          item.addAttribute('v-if', dataPaths.join(' || '))
        }
      }

      if (showIcons) {
        const itemSideSection = item
          .addChildTag('q-item-section')
          .addAttribute(':side', true)

        if (icon) {
          itemSideSection
            .addChildTag('q-icon')
            .addAttribute('name', icon)
        } else {
          if (inset) {
            itemSideSection.addAttribute('inset', 'icon')
          }
        }
      }

      const itemMainSection = item
        .addChildTag('q-item-section')
        .addAttribute('style', 'font-size: 16px; word-wrap: break-word; white-space: pre-wrap;')

      itemMainSection.addChildTag('q-item-label')
        .addAttribute('style', 'font-weight: bold;')
        .content(title)

      const classes = []
      const styles = []

      if (definition.separator) {
        styles.push('border-top: 1px solid rgb(238, 238, 238)', 'margin-top: 8px', 'padding-top: 8px')
      }

      if (definition.spacing === 'padding') {
        classes.push('q-pa-md')
      } else if (MARGINS[definition.spacing]) {
        classes.push(`q-mt-${MARGINS[definition.spacing]}`)
      }

      if (classes.length > 0) {
        item.addAttribute('class', classes.join(' '))
      }

      if (styles.length > 0) {
        item.addAttribute('style', styles.join('; '))
      }

      if (Array.isArray(choices)) {
        const arrayPath = value.replace('{{', '').replace('}}', '')

        // Array
        const arraySpan = itemMainSection
          .addChildTag('q-item-label')
          .addAttribute('v-if', `Array.isArray(${arrayPath})`)
          .addAttribute('v-for', `(item, idx) in ${arrayPath}`)

        arraySpan
          .addChildTag('span')
          .content(`{{ lists.$simpleTitleMaps['${title}'][item] || item || '-' }}`)

        // Not array
        const valueItemLabel = itemMainSection
          .addChildTag('q-item-label')
          .addChildTag('span')
          .addAttribute('v-if', `!Array.isArray(${arrayPath})`)
          .content(`{{ lists.$simpleTitleMaps['${title}'][${arrayPath}] || ${arrayPath} || '-' }}`)

        if (tooltip) {
          applyTooltip({ source: valueItemLabel, tooltip })
        }
      } else if (typeof choicesPath === 'string') {
        const dataPath = value.replace('{{', '').replace('}}', '')

        itemMainSection
          .addChildTag('q-item-label')
          .addAttribute('v-if', `Array.isArray(${dataPath}) && Array.isArray(${choicesPath})`)
          .addAttribute('v-for', `(arrItem, idx) in ${dataPath}`)
          .addChildTag('span')
          .content(`{{ ${choicesPath}.find(c => c.value === arrItem)?.title }}`)

        const valueItemLabel = itemMainSection
          .addChildTag('q-item-label')
          .addAttribute('v-if', `!Array.isArray(${dataPath}) && Array.isArray(${choicesPath})`)
          .addChildTag('span')
          .content(`{{ ${choicesPath}.find(c => c.value === ${dataPath})?.title }}`)

        if (tooltip) {
          applyTooltip({ source: valueItemLabel, tooltip })
        }
      } else {
        const valueItemLabel = itemMainSection
          .addChildTag('q-item-label')
          .content(value)

        if (tooltip) {
          applyTooltip({ source: valueItemLabel, tooltip })
        }
      }

      if (Array.isArray(badge) && badge.length) {
        const badgeSection = itemMainSection.addChildTag('q-item-label')

        for (const b of badge) {
          const { color, icon, showWhen, text, outline } = b
          applyBadge({ source: badgeSection, color, icon, text, showWhen, outline })
        }
      }
    }
  } else {
    const item = list
      .addChildTag('q-item')
      .addAttribute('v-for', `(item, idx) in ${facts}`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'q-pl-none')
      .addAttribute('style', 'font-size: 16px;')

    const itemMainSection = item.addChildTag('q-item-section')

    itemMainSection
      .addChildTag('q-item-label')
      .addAttribute('style', 'font-weight: bold;')
      .content('{{item.title}}')

    itemMainSection
      .addChildTag('q-item-label')
      .content('{{item.value}}')
  }

  return builder.compile()
}
