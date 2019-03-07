// todo: safer placeholder parsing (e.g. try putting " in placeholder attribute)
const textField = require('./Text-field')
module.exports = function (definition, options) {
  return textField(
    definition,
    options,
    {}
  )
}
