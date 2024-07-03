module.exports = function (element, id, validation) {
  if (validation) {
    if (validation.required) {
      element.addChildTag('div').addAttribute('class', 'text-grey').content(`{{ v$.data.${id} && v$.data.${id}.$error ? '' : '*Required' }}`)
    } else if (validation.requiredIf) {
      element.addChildTag('div').addAttribute('class', 'text-grey').content(`{{ v$.data.${id} && v$.data.${id}.$error ? '' : ((${validation.requiredIf}) ? '*Required' : '') }}`)
    }
  }
}
