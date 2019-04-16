const textField = require('./Text-field')
module.exports = function (definition, options) {
  definition.validation = {
    email: true
  }

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
