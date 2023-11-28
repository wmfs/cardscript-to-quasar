module.exports = function (component, id) {
  if (typeof id === 'string' && id.trim().length > 0) {
    component.addAttribute('id', `CARDSCRIPT_${id}`)
  }
}
