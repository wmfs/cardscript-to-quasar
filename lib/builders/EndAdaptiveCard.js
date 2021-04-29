const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id,
    arrayPath,
    selectionType,
    selectionClearable
  } = definition

  const builder = new ComponentBuilder(definition)

  if (arrayPath && id && selectionType === 'multi') {
    if (selectionClearable) {
      const div = builder.addTag('div')

      const destPath = `${div.getDataPath()}.${id}Selected`

      div
        .addChildTag('q-btn')
        .addAttribute('v-if', `${destPath}.length > 0`)
        .addAttribute('@click', `action('ClearArraySelection', '${destPath}')`)
        .addAttribute('dense', null)
        .addAttribute('color', 'primary')
        .addAttribute('class', 'q-ml-md')
        .content('Clear selection')
    }
  }

  return '</div></div>' + builder.compile()
}
