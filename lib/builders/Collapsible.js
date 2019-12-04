module.exports = function (definition, options) {
  const { title, titleBind, showWhen } = definition

  const label = titleBind ? `:label=${titleBind}` : `label=${title}`

  return `<q-expansion-item ${showWhen ? `v-if="${showWhen}"` : ''} ${label}><q-card><q-card-section>`
}
