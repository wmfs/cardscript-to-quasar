const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  const list = builder.addTag('q-list')
  list.addAttribute(':no-border', true)

  definition.facts.forEach(({ title, value, icon, inset, choices, showIfUndefined }) => {
    const item = list.addChildTag('q-item')

    if (value) {
      const dataPaths = value.split('{{').filter(v => v.indexOf('}}') !== -1).map(v => v.substring(0, v.indexOf('}}')))
      if (showIfUndefined !== true && dataPaths.length > 0) {
        item.addAttribute('v-if', dataPaths.join(' || '))
      }
    }

    const itemSide = item.addChildTag('q-item-side')

    if (icon) {
      itemSide.addAttribute('icon', icon)
    } else {
      if (inset) itemSide.addAttribute('inset', 'icon')
    }

    const itemMain = item.addChildTag('q-item-main')

    itemMain.addChildTag('q-item-tile')
      .addAttribute(':label', true)
      .addAttribute('style', 'font-weight: bold;')
      .content(title)

    const display = lookupOrValue(title, value, choices)

    const classes = []
    const styles = []

    if (definition.separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

    if (definition.spacing === 'padding') {
      classes.push('q-pa-md')
    } else if (MARGINS[definition.spacing]) {
      classes.push(`q-mt-${MARGINS[definition.spacing]}`)
    }

    if (classes.length > 0) item.addAttribute('class', classes.join(' '))
    if (styles.length > 0) item.addAttribute('style', styles.join('; '))

    itemMain
      .addChildTag('q-item-tile')
      .addAttribute(':sublabel', true)
      .content(display)
  })

  return builder.compile()
}

function lookupOrValue (title, value, choices) {
  if (!choices) return value

  const data = value.replace('{{', '').replace('}}', '')
  const lookupTable = {}
  choices.forEach(o => { lookupTable[o.value] = o.title })
  const template = `{{ lists.$simpleTitleMaps['${title}'][${data}] || ${data} || '-' }}`
  return template
}
