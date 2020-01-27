const textField = require('./Text-field')
module.exports = function (definition, options) {
  let icon
  if (Object.prototype.hasOwnProperty.call(definition, 'connectionType')) {
    switch (definition.connectionType) {
      case 'mobile':
        icon = 'smartphone'
        break
      default:
        icon = 'phone'
    }
  } else {
    icon = 'phone'
  }
  return textField(
    definition,
    options,
    {
      icon: icon,
      title: 'Phone number'
    }
  )
}
