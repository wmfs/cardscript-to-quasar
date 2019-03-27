const ComponentBuilder = require('./../utils/Component-builder')

// TODO: add to schema

module.exports = function (definition, options) {
  const {
    templates,
    // showLaunches,
    arrayPath,
    notFoundText
  } = definition

  const builder = new ComponentBuilder(definition)

  const list = builder
    .addTag('q-list')
    .addAttribute(':no-border', true)

  const listHeader = list
    .addChildTag('q-list-header')
    .addAttribute('class', 'q-px-none')

  listHeader
    .addChildTag('span')
    .addAttribute('v-if', `data.${arrayPath}.length === 0`)
    .content(notFoundText ? `${notFoundText}` : '0 results found.')

  listHeader
    .addChildTag('span')
    .addAttribute('v-if', `data.${arrayPath}.length > 0`)
    .content(`{{data.${arrayPath}.length}} result{{data.${arrayPath}.length === 1 ? '' : 's'}} found`)

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in data.${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute('class', 'non-link-item  q-px-none')

  if (templates) {
    const { label, sublabel } = templates
    const itemMain = item.addChildTag('q-item-main')

    if (label) {
      itemMain
        .addChildTag('q-item-tile')
        .addAttribute(':label', true)
        .content(templates.label)
    }

    if (sublabel) {
      itemMain
        .addChildTag('q-item-tile')
        .addAttribute(':sublabel', true)
        .content(templates.sublabel)
    }
  }

  // TODO: showLaunches

  return builder.compile()
}
