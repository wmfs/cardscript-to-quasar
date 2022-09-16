const cardListTracker = require('./../utils/card-list-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { actions } = definition

  const builder = new ComponentBuilder(definition)

  const cardListId = cardListTracker.removeCardList()

  if (actions.length > 0) {
    const cardActions = builder
      .addTag('q-card-actions')
      .addAttribute('align', 'right')

    actions.forEach(action => {
      switch (action.type) {
        case 'Action.Submit': {
          const btn = cardActions
            .addChildTag('q-btn')
            .addAttribute('no-caps', null)
            .addAttribute('unelevated', null)
            .addAttribute('color', 'positive')
            .addAttribute('@click', `action('PushCardListContent', { cardListId: '${cardListId}' })`)
            .content(action.title)

          if (action.showWhen) btn.addAttribute('v-if', action.showWhen)
          break
        }
        case 'Action.Cancel': {
          const btn = cardActions
            .addChildTag('q-btn')
            .addAttribute('no-caps', null)
            .addAttribute('unelevated', null)
            .addAttribute('color', 'light')
            .addAttribute('text-color', 'dark')
            .addAttribute('@click', `internals.dialogControl.${cardListId} = false`)
            .content(action.title)

          if (action.showWhen) btn.addAttribute('v-if', action.showWhen)
          break
        }
      }
    })
  }

  return builder.compile() + '</q-card-section></q-card></q-dialog>'
}
