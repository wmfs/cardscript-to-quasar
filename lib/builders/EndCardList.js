const cardListTracker = require('./../utils/card-list-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { actions } = definition

  const builder = new ComponentBuilder(definition)

  const cardListId = cardListTracker.removeCardList()

  if (actions.length > 0) {
    const cardActions = builder.addTag('q-card-actions')

    actions.forEach(action => {
      switch (action.type) {
        case 'Action.Submit':
          cardActions
            .addChildTag('q-btn')
            .addAttribute(':flat', true)
            .addAttribute('@click.native', `pushCardListContent('${cardListId}')`)
            .content(action.title)
          break
        case 'Action.Cancel':
          cardActions
            .addChildTag('q-btn')
            .addAttribute(':flat', true)
            .addAttribute('@click.native', `internals.dialogControl.${cardListId} = false`)
            .content(action.title)
          break
      }
    })
  }

  return builder.compile() + '</q-card-section></q-card></q-dialog>'
}
