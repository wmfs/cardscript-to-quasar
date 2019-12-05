
module.exports = function (definition, options) {
  const { arrayPath, id } = definition

  let template = ``

  if (arrayPath && id) {
    template += `<div v-for="(${id}Item, ${id}Idx) in ${arrayPath}" :key="${id}Idx">`
  } else {
    template += `<div>`
  }

  return template
}
