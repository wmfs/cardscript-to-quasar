
module.exports = function (definition, options) {
  const { arrayPath, id, showWhen, selectionType } = definition

  let template = ''

  if (arrayPath && id) {
    template += `<div v-for="(${id}Item, ${id}Idx) in ${arrayPath}" :key="${id}Idx"`

    if (showWhen) template += ` v-if="${showWhen}"`

    template += '>'

    if (selectionType === 'single' || selectionType === 'multi') {
      console.log('>>>', selectionType)
      let selectionDiv = '<div>'
      let option = ''

      if (selectionType === 'single') {
        // option = '<q-radio'
        // option += ' :value=""'
      } else if (selectionType === 'multi') {
        option = '<q-checkbox'
        option += ` :val="${id}Idx"`
        option += ` v-model="data.${id}Selected"` // todo: getDataPath()
      }

      option += '/>'

      selectionDiv += option
      selectionDiv += '</div>'

      template += selectionDiv
    }
  } else {
    template += '<div>'
  }

  console.log(template)
  return template
}
