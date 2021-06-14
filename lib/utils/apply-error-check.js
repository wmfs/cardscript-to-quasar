module.exports = function (source, definition) {
  const { id, validation } = definition

  if (id && validation) {
    source.addAttribute(':error', `$v.data.${id} ? $v.data.${id}.$error : false`)
    source.addAttribute(':error-message', `invalidFields && invalidFields['${id}'] ? invalidFields['${id}'].messages.join(' ') : ''`)
    source.addAttribute('aria-invalid', 'true')
    source.addAttribute('aria-label', `invalidFields && invalidFields['${id}'] ? invalidFields['${id}'].messages.join(' ') : ''`)
  }
}
