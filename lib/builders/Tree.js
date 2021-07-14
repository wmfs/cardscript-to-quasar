const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { id, selectionType } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const dataPath = `${div.getDataPath()}.${id}`

  const tree = div
    .addChildTag('q-tree')
    .addAttribute(':nodes', `${dataPath}`)
    .addAttribute('node-key', 'label')
    .addAttribute('default-expand-all', null)

  const headerTemplate = tree
    .addChildTag('template')
    .addAttribute('v-slot:default-header', 'prop')

  if (selectionType === 'single' || selectionType === 'multi') {
    const _div = headerTemplate
      .addChildTag('div')
      .addAttribute('class', 'row items-center')

    _div
      .addChildTag(selectionType === 'single' ? 'q-radio' : 'q-checkbox')
      .addAttribute(':val', 'prop.node.value || prop.node.label')
      .addAttribute('v-model', `${dataPath}Selected`)

    _div
      .addChildTag('span')
      .content('{{ prop.node.label }}')
  } else {
    headerTemplate
      .addChildTag('div')
      .addAttribute('class', 'row items-center')
      .content('{{ prop.node.label }}')
  }

  if (selectionType === 'multi') {
    div
      .addChildTag('q-btn')
      .addAttribute('label', 'Select all')
      .addAttribute('color', 'primary')
      .addAttribute('dense', null)
      .addAttribute('class', 'q-mr-md')
      .addAttribute('@click', `action('TreeSelectAll', '${dataPath}')`)

    div
      .addChildTag('q-btn')
      .addAttribute('label', 'Clear all')
      .addAttribute('color', 'primary')
      .addAttribute('dense', null)
      .addAttribute('outline', null)
      .addAttribute('@click', `action('TreeClearSelection', '${dataPath}Selected')`)
      .addAttribute('v-if', `${dataPath}Selected.length > 0`)
  }

  return builder.compile()
}
