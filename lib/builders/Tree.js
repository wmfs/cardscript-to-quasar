const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { id, selectionType } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const tree = div
    .addChildTag('q-tree')
    .addAttribute(':nodes', `data.${id}`)
    .addAttribute('node-key', 'label')
    .addAttribute('default-expand-all', null)

  const headerTemplate = tree
    .addChildTag('template')
    .addAttribute('v-slot:default-header', 'prop')

  if (selectionType === 'single' || selectionType === 'multi') {
    const div = headerTemplate
      .addChildTag('div')
      .addAttribute('class', 'row items-center')

    div
      .addChildTag(selectionType === 'single' ? 'q-radio' : 'q-checkbox')
      .addAttribute('v-if', 'prop.node.value')
      .addAttribute(':val', 'prop.node.value')
      .addAttribute(':label', 'prop.node.label')
      .addAttribute('v-model', `data.${id}Selected`)

    div
      .addChildTag('span')
      .addAttribute('v-if', '!prop.node.value')
      .addAttribute('style', 'margin-left: 44px;')
      .content('{{ prop.node.label }}')
  }

  // if (selectionType === 'multi') {
  //   div
  //     .addChildTag('q-btn')
  //     .addAttribute('label', 'Select all')
  //     .addAttribute('color', 'primary')
  //     .addAttribute('dense', null)
  //     .addAttribute('class', 'q-mr-md')
  //     .addAttribute('@click', `action('TreeSelectAll', '${id}')`)
  //
  //   div
  //     .addChildTag('q-btn')
  //     .addAttribute('label', 'Clear selection')
  //     .addAttribute('color', 'primary')
  //     .addAttribute('dense', null)
  //     .addAttribute('@click', `action('TreeClearSelection', '${id}')`)
  // }

  return builder.compile()
}
