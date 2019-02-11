const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  const list = builder.addTag('q-list')
  list.addAttribute(':no-border', true)

  definition.facts.forEach(({ title, value }) => {
    const item = list.addChildTag('q-item')
    const itemMain = item.addChildTag('q-item-main')
    const itemTileTitle = itemMain.addChildTag('q-item-tile')
    itemTileTitle.addAttribute(':label', true)
    itemTileTitle.content(title)
    const itemTileValue = itemMain.addChildTag('q-item-tile')
    itemTileValue.addAttribute(':sublabel', true)
    itemTileValue.content(value)
  })

  return builder.compile()
}
