const ComponentBuilder = require('./../utils/Component-builder')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

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
    facts.forEach(({ title, value, icon, inset, choices, showIfUndefined, showWhen, badge }) => {
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
        .addAttribute('style', 'font-size: 16px')
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
        .addAttribute('style', 'font-size: 16px; font-weight: bold;')

      if (badge) {
        for (const b of badge) {
          applyBadges(caption, b)
        }
      }

      caption.content(display)
    })
  } else {
    const item = list
      .addChildTag('q-item')
      .addAttribute('v-for', `(item, idx) in ${facts}`)
      .addAttribute(':key', 'idx')

    const itemMain = item.addChildTag('q-item-section')

    itemMain
      .addChildTag('q-item-label')
      .addAttribute('style', 'font-size: 16px;')
      .content('{{item.title}}')

    itemMain
      .addChildTag('q-item-label')
      .addAttribute('style', 'font-size: 16px; font-weight: bold;')
      .content('{{item.value}}')
  }

  return builder.compile()
}

function lookupOrValue (title, value, choices) {
  if (Array.isArray(choices) === true) {
    const data = value.replace('{{', '').replace('}}', '')

    const arrVal = `${data}.map(d => lists.$simpleTitleMaps['${title}'][d] || d || '-').join(', ')`
    const strVal = `lists.$simpleTitleMaps['${title}'][${data}] || ${data}`
    const defaultVal = '-'

    return `{{ ( Array.isArray(${data}) ? ${arrVal} : (${strVal}) ) || '${defaultVal}' }}`
  } else {
    return value
  }
}

function applyBadges (element, badge) {
  const { color, icon, showWhen, text, outline } = badge

  let colorToUse = 'primary'
  let textColor = 'white'

  if (color && COLORS[color]) {
    colorToUse = COLORS[color]
    if (TEXT_WHITE.includes(color)) {
      textColor = 'white'
    }
  }

  const b = element
    .addChildTag('q-badge')
    .addAttribute('color', colorToUse)
    .addAttribute('text-color', textColor)
    .addAttribute('class', 'q-mx-sm')

  if (outline) b.addAttribute('outline', null)
  if (icon) b.addChildTag('q-icon').addAttribute('name', icon)
  if (showWhen) b.addAttribute('v-if', showWhen)

  b.content(text)
}
