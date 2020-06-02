
module.exports = function (definition, options) {
  const { arrayPath, id, showWhen } = definition

  let template = ''

  if (arrayPath && id) {
    template += `<div v-for="(${id}Item, ${id}Idx) in ${arrayPath}" :key="${id}Idx"`

    if (showWhen) template += ` v-if="${showWhen}"`

    template += '>'
  } else {
    template += '<div>'
  }

  return template
}
