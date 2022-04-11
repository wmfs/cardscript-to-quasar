module.exports = function (source, id) {
  if (id) {
    source.addAttribute(':error', `v$.data.${id} ? v$.data.${id}.$error : false`)
    source.addAttribute(':error-message', `invalidFields && invalidFields['${id}'] ? invalidFields['${id}'].messages.join(' ') : ''`)
  }
}
