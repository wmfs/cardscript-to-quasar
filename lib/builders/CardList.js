// todo: title, header, guidance

const cardListTracker = require('./../utils/card-list-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const parentCardList = cardListTracker.getCurrentCardList()
  cardListTracker.addCardList(definition.id)

  const {
    id,
    showWhen,
    addButtonLabel,
    instanceTitleTemplate,
    instanceSubtitleTemplate
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const dialogKey = `internals.dialogControl.${id}`

  const arrayPath = parentCardList
    ? `internals.currentCardListData.${parentCardList}.${id}`
    : `data.${id}`

  if (instanceTitleTemplate) {
    const div = builder.addTag('div')
    if (showWhen) div.addAttribute('v-if', showWhen)

    const list = div.addChildTag('q-list')
    list.addAttribute(':no-border', true)
    list.addAttribute(':link', true)
    list.addAttribute('v-if', `${arrayPath} && ${arrayPath}.length > 0`)

    const item = list.addChildTag('q-item')
    item.addAttribute('v-for', `(item, $idx) in ${arrayPath}`)
    item.addAttribute(':key', '$idx')

    // itemSideIcon
    item
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('left', null)
      .addChildTag('q-icon')
      .addAttribute('name', 'note')

    const itemMain = item.addChildTag('q-item-section')

    // label
    itemMain
      .addChildTag('q-item-label')
      .content(instanceTitleTemplate || '')

    if (instanceSubtitleTemplate) {
      // sublabel
      itemMain
        .addChildTag('q-item-label')
        .addAttribute('caption', null)
        .content(instanceSubtitleTemplate || '')
    }

    const itemSideAction = item
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('right', null)

    const itemSideActionBtn = itemSideAction.addChildTag('q-btn')
    itemSideActionBtn.addAttribute(':flat', true)
    itemSideActionBtn.addAttribute(':round', true)
    itemSideActionBtn.addAttribute(':dense', true)
    itemSideActionBtn.addAttribute('icon', 'delete_forever')
    itemSideActionBtn.addAttribute('@click', `removeCardListContent('${id}', $idx)`)
  }

  const btn = builder.addTag('q-btn')
  btn.addAttribute('color', 'primary')
  btn.addAttribute('@click.native.stop', `createNewCardList('${id}')`)
  btn.addAttribute('label', addButtonLabel || 'Open Card')
  if (showWhen) btn.addAttribute('v-if', showWhen)

  const dialog = builder.addTag('q-dialog', { includeClosingTag: false })
  dialog.addAttribute('v-model', dialogKey)

  const card = dialog.addChildTag('q-card', { includeClosingTag: false })
  if (showWhen) card.addAttribute('v-if', showWhen)

  card.addChildTag('q-card-section', { includeClosingTag: false })

  // console.log(builder.compile())

  return builder.compile()
}
