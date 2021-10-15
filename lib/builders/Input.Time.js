const datePicker = require('./Date-picker')
module.exports = function (definition, options) {
  return datePicker(
    definition,
    options,
    {
      type: 'Time'
    }
  )
}
