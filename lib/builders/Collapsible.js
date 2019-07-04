module.exports = function (definition, options) {
  const { title, showWhen } = definition

  return `<q-expansion-item ${showWhen ? `v-if="${showWhen}"` : ''} label="${title}"><q-card><q-card-section>`
}
