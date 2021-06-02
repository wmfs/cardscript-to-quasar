const dateField = require('./Date-field')
module.exports = function (definition, options) {
  return dateField(
    definition,
    options,
    {
      type: 'Time'
    }
  )
}
