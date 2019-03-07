const textField = require('./Text-field')
module.exports = function (definition, options) {
  return textField(
    definition,
    options,
    {
      icon: 'alternate_email',
      title: 'E-mail',
      type: 'email'
    }
  )
}
