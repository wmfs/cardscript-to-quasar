const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { id, selectionType } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const tree = div
    .addChildTag('q-tree')
    .addAttribute(':nodes', `${div.getDataPath()}.${id}`)
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
      .addAttribute('v-if', 'prop.node.value')
      .addAttribute(':val', 'prop.node.value')
      .addAttribute(':label', 'prop.node.label')
      .addAttribute('v-model', `${div.getDataPath()}.${id}Selected`)

    _div
      .addChildTag('span')
      .addAttribute('v-if', '!prop.node.value')
      .addAttribute('style', 'margin-left: 44px;')
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
      .addAttribute('no-caps', null)
      .addAttribute('unelevated', null)
      .addAttribute('class', 'q-mr-md')
      .addAttribute('@click', `action('TreeSelectAll', '${div.getDataPath()}.${id}')`)

    div
      .addChildTag('q-btn')
      .addAttribute('label', 'Clear all')
      .addAttribute('color', 'primary')
      .addAttribute('outline', null)
      .addAttribute('no-caps', null)
      .addAttribute('unelevated', null)
      .addAttribute('@click', `action('ClearArraySelection', '${div.getDataPath()}.${id}Selected')`)
      .addAttribute('v-if', `${div.getDataPath()}.${id}Selected.length > 0`)
  }

  return builder.compile()
}
