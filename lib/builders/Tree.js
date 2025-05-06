const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const { id, selectionType, nodes } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const tree = div
    .addChildTag('q-tree')
    .addAttribute('node-key', 'label')
    .addAttribute('dense', null)
    .addAttribute('default-expand-all', null)

  if (typeof nodes === 'string') {
    tree.addAttribute(':nodes', nodes)
  } else {
    tree.addAttribute(':nodes', `${div.getDataPath()}.${id}`)
  }

  const headerTemplate = tree
    .addChildTag('template')
    .addAttribute('v-slot:default-header', 'prop')

  const bodyTemplate = tree
    .addChildTag('template')
    .addAttribute('v-slot:default-body', 'prop')

  bodyTemplate
    .addChildTag('div')
    .addAttribute('v-if', 'prop.node.sublabel')
    .addAttribute('class', 'q-ml-md')
    .content('{{ prop.node.sublabel }}')

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
    // headerTemplate
    //   .addChildTag('div')
    //   .addAttribute('class', 'row items-center')
    //   .content('{{ prop.node.label }}')

    const item = headerTemplate.addChildTag('q-item')
    const itemSection = item.addChildTag('q-item-section')

    itemSection
      .addChildTag('q-item-label')
      .addAttribute('v-if', '!Array.isArray(prop.node.launches) || !prop.node.launches.length')
      .addAttribute('class', 'item-label-non-link')
      .content('{{ prop.node.label }}')

    const labelWithLink = itemSection
      .addChildTag('q-item-label')
      .addAttribute('v-if', 'Array.isArray(prop.node.launches) && prop.node.launches.length')
      .content('{{ prop.node.label }}')

    applyClickToLaunch(labelWithLink)

    // itemSection
    //   .addChildTag('q-item-label')
    //   .addAttribute('v-if', 'prop.node.sublabel')
    //   .addAttribute('caption', null)
    //   .addAttribute('lines', 1)
    //   .content('{{ prop.node.sublabel }}')
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

function applyClickToLaunch (element) {
  const params = ['stateMachineName', 'input', 'title']
    .map(p => `prop.node.launches[0].${p}`)
    .join(', ')

  element
    .addAttribute('class', 'item-label')
    .addAttribute('@click', `start('pushCard', ${params})`)
} // applyClickToLaunch
