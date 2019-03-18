const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  const list = builder.addTag('q-list')
  list.addAttribute(':no-border', true)

  definition.facts.forEach(({ title, value, icon, inset, choices }) => {
    const item = list.addChildTag('q-item')
    const itemSide = item.addChildTag('q-item-side')

    if (icon) {
      itemSide.addAttribute('icon', icon)
    } else {
      if (inset) itemSide.addAttribute('inset', 'icon')
    }

    const itemMain = item.addChildTag('q-item-main')

    itemMain.addChildTag('q-item-tile')
      .addAttribute(':label', true)
      .content(title)

    const display = lookupOrValue(value, choices)

    itemMain.addChildTag('q-item-tile')
      .addAttribute(':sublabel', true)
      .content(display)
  })

  return builder.compile()
}

function lookupOrValue(value, choices) {
  if (!choices) return value

  const data = value.replace('{{', '').replace('}}', '')
  const lookupTable = { }
  choices.forEach(o => lookupTable[o.value] = o.title)
  const template = `{{ ${JSON.stringify(lookupTable)}[${data}] || ${data} || '-' }}`
  console.log(template)
  return template
}
