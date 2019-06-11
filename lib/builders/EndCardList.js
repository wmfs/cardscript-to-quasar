const cardListTracker = require('./../utils/card-list-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { editable } = definition

  const builder = new ComponentBuilder(definition)

  const cardListId = cardListTracker.removeCardList()

  if (editable) {
    const actions = builder.addTag('q-card-actions')

    const close = actions.addChildTag('q-btn')
    close.addAttribute(':flat', true)
    close.addAttribute('@click.native', `internals.dialogControl.${cardListId} = false`)
    close.content('Close')

    const save = actions.addChildTag('q-btn')
    save.addAttribute(':flat', true)
    save.addAttribute('@click.native', `pushCardListContent('${cardListId}')`)
    save.content('Save')
  }

  return builder.compile() + '</q-card-section></q-card></q-dialog>'
}
