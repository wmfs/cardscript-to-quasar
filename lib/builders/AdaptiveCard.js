
module.exports = function (definition, options) {
  const { arrayPath, id, showWhen, selectionType } = definition

  let template = ''
  let selection = false

  if (arrayPath && id) {
    template += `<div v-for="(${id}Item, ${id}Idx) in ${arrayPath}" :key="${id}Idx" class="row"`

    if (showWhen) template += ` v-if="${showWhen}"`

    template += '>'

    if (selectionType === 'single' || selectionType === 'multi') {
      selection = true
      let selectionDiv = '<div class="col-1">'
      let option = ''

      if (selectionType === 'single') {
        option = '<q-radio'
      } else if (selectionType === 'multi') {
        option = '<q-checkbox'
      }

      option += ` :val="${id}Idx"`
      option += ` v-model="data.${id}Selected"` // todo: getDataPath()
      option += ' />'

      selectionDiv += option
      selectionDiv += '</div>'

      template += selectionDiv
    }
  } else {
    template += '<div class="row">'
  }

  template += `<div class="col-1${selection ? 1 : 2}">`

  console.log(template)
  return template
}
