const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  const list = builder.addTag('q-list')
  list.addAttribute(':no-border', true)

  definition.facts.forEach(({ title, value, icon }) => {
    const item = list.addChildTag('q-item')
    const itemSide = item.addChildTag('q-item-side')

    if (icon) {
      itemSide.addAttribute('icon', icon)
    } else {
      itemSide.addAttribute('inset', 'icon')
    }

    const itemMain = item.addChildTag('q-item-main')
    // const itemTileIcon = item.addChildTag('q-item-side')
    // itemTileIcon.addAttribute('left')
    // const iconTile = itemTileIcon.addChildTag('q-item-tile')
    // iconTile.addAttribute('icon', true)
    // iconTile.content(icon)
    const itemTileTitle = itemMain.addChildTag('q-item-tile')
    itemTileTitle.addAttribute(':label', true)
    itemTileTitle.content(title)
    const itemTileValue = itemMain.addChildTag('q-item-tile')
    itemTileValue.addAttribute(':sublabel', true)
    itemTileValue.content(value)
  })

  return builder.compile()
}
