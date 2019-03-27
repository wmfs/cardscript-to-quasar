const ComponentBuilder = require('./../utils/Component-builder')

// TODO: add to schema

module.exports = function (definition, options) {
  const {
    templates,
    // showLaunches,
    arrayPath
  } = definition

  const builder = new ComponentBuilder(definition)

  const list = builder
    .addTag('q-list')
    .addAttribute(':no-border', true)
    .addChildTag('q-list-header')
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
