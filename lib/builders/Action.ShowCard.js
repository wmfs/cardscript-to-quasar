const actionTemplate = require('./Action-template')

module.exports = function (definition, options) {
  return actionTemplate(
    definition,
    options,
    {}
  )
}
