const _ = require('lodash')
module.exports = function makeFullImagePath (imagePath, options) {
  const compiled = _.template(options.imageSourceTemplate)
  const full = compiled({
    imagePath: imagePath
  })
  return full
}
