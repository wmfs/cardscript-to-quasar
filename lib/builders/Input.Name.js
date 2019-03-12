const textField = require('./Text-field')
module.exports = function (definition, options) {
  return textField(
    definition,
    options,
    {
      icon: 'face',
      title: 'name'
    }
  )
}
