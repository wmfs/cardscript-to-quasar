const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    arrayPath,
    id,
    showWhen,
    selectionType,
    selectionMax = 0 // 0 means no limit
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const parentDiv = builder.addTag('div', { includeClosingTag: false })
  parentDiv.addAttribute('class', 'row')

  let select = false

  if (arrayPath && id) {
    parentDiv
      .addAttribute('v-for', `(${id}Item, ${id}Idx) in ${arrayPath}`)
      .addAttribute(':key', `${id}Idx`)

    if (showWhen) parentDiv.addAttribute('v-if', showWhen)

    if (selectionType === 'single' || selectionType === 'multi') {
      select = true

      const selectDiv = parentDiv
        .addChildTag('div')
        .addAttribute('class', 'col-1')

      const destPath = `${selectDiv.getDataPath()}.${id}Selected`

      let option

      if (selectionType === 'single') {
        option = selectDiv
          .addChildTag('q-radio')
          .addAttribute(':val', `${id}Item`)
          .addAttribute(':value', destPath)
      } else if (selectionType === 'multi') {
        option = selectDiv
          .addChildTag('q-checkbox')
          .addAttribute(':value', `!!${destPath}.find(r => hashSum(r) === hashSum(${id}Item))`)
      }

      option.addAttribute('@input', `action('AdaptiveCardSelection', { idx: ${id}Idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}' })`)
      // .addAttribute(':val', `${id}Idx`)
      // .addAttribute('v-model',`${option.getDataPath()}.${id}Selected`)
    }
  }

  parentDiv
    .addChildTag('div', { includeClosingTag: false })
    .addAttribute('class', `col-${select ? 11 : 12}`)

  return builder.compile()
}
