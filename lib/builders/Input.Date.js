const datePicker = require('./Date-picker')
const dateField = require('./Date-field')

module.exports = function (definition, options) {
  if (definition.theme === 'GDS') {
    return dateField(
      definition,
      options,
      {
        type: 'Date'
      }
    )
  }

  return datePicker(
    definition,
    options,
    {
      type: 'Date'
    }
  )
}
