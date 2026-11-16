// Only join real error messages: ids such as "filter", "map" or "toString" would otherwise
// pick up built-in array/object methods from invalidFields and fail with "reading 'join'".
module.exports = function (source, id) {
  if (id) {
    source.addAttribute(':error', `v$.data.${id} ? v$.data.${id}.$error : false`)
    source.addAttribute(':error-message', `Array.isArray(invalidFields?.['${id}']?.messages) ? invalidFields['${id}'].messages.join(' ') : ''`)
  }
}
