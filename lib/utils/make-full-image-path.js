const _ = require('lodash')
module.exports = function makeFullImagePath (imagePath, options) {
  const compiled = _.template(options.imageSourceTemplate)
  return `url(${compiled({ imagePath })})`
}
