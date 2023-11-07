const ComponentBuilder = require('./../utils/Component-builder')
const applyBadge = require('./../utils/apply-badge')
const lookupOrValue = require('./../utils/lookup-or-value')

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
    facts.forEach(({ title, value, icon, inset, choices, showIfUndefined, showWhen, badge, wrap = true }) => {
      const item = list.addChildTag('q-item').addAttribute('class', 'q-pl-none')

      if (showWhen) {
        item.addAttribute('v-if', showWhen)
      } else if (value) {
        const dataPaths = value.split('{{').filter(v => v.indexOf('}}') !== -1).map(v => v.substring(0, v.indexOf('}}')))
        const show = showAllIfUndefined || showIfUndefined
        if (show !== true && dataPaths.length > 0) {
          item.addAttribute('v-if', dataPaths.join(' || '))
        }
      }

      if (showIcons) {
        const itemSide = item
          .addChildTag('q-item-section')
          .addAttribute(':side', true)

        if (icon) {
          itemSide
            .addChildTag('q-icon')
            .addAttribute('name', icon)
        } else {
          if (inset) itemSide.addAttribute('inset', 'icon')
        }
      }

      const itemMain = item.addChildTag('q-item-section')

      itemMain.addChildTag('q-item-label')
        .addAttribute('style', 'font-size: 16px; font-weight: bold;')
        .content(title)

      const display = lookupOrValue(title, value, choices)

      const classes = []
      const styles = []

      if (definition.separator) styles.push('border-top: 1px solid rgb(238, 238, 238)', 'margin-top: 8px', 'padding-top: 8px')

      if (definition.spacing === 'padding') {
        classes.push('q-pa-md')
      } else if (MARGINS[definition.spacing]) {
        classes.push(`q-mt-${MARGINS[definition.spacing]}`)
      }

      if (classes.length > 0) item.addAttribute('class', classes.join(' '))
      if (styles.length > 0) item.addAttribute('style', styles.join('; '))

      const caption = itemMain
        .addChildTag('q-item-label')
        .addAttribute('style', 'font-size: 16px;')

      if (badge) {
        for (const b of badge) {
          const { color, icon, showWhen, text, outline } = b
          applyBadge({ source: caption, color, icon, text, showWhen, outline })
        }
      }

      const span = caption.addChildTag('span')

      if (wrap) {
        span.addAttribute('style', 'word-wrap: break-word; white-space: pre-wrap;')
      }

      span.content(display)
    })
  } else {
    const item = list
      .addChildTag('q-item')
      .addAttribute('v-for', `(item, idx) in ${facts}`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'q-pl-none')

    const itemMain = item.addChildTag('q-item-section')

    itemMain
      .addChildTag('q-item-label')
      .addAttribute('style', 'font-size: 16px; font-weight: bold;')
      .content('{{item.title}}')

    itemMain
      .addChildTag('q-item-label')
      .addAttribute('style', 'font-size: 16px;')
      .content('{{item.value}}')
  }

  return builder.compile()
}
