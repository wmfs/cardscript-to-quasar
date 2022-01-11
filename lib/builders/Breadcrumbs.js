const ComponentBuilder = require('./../utils/Component-builder')
const ALIGN_OPTS = ['left', 'center', 'right', 'between', 'around']

module.exports = function (definition, options) {
  const builder = new ComponentBuilder(definition)

  const {
    items,
    arrayPath,
    align,
    separator
  } = definition

  const root = builder.addTag('q-breadcrumbs')

  if (typeof separator === 'string') {
    root.addAttribute('separator', separator)
  } else if (typeof separator === 'object') {
    const template = root
      .addChildTag('template')
      .addAttribute('v-slot:separator', null)

    if (separator.icon) {
      template
        .addChildTag('q-icon')
        .addAttribute('name', separator.icon)
    }
  }

  if (Array.isArray(items) && items.length > 0) {
    for (const item of items) {
      const child = root.addChildTag('q-breadcrumbs-el')

      if (item.title) child.addAttribute('label', item.title)
      if (item.icon) child.addAttribute('icon', item.icon)
    }
  }

  if (typeof arrayPath === 'string') {
    const child = root.addChildTag('q-breadcrumbs-el')
    child
      // .addAttribute('v-for', `(opt, idx) in ${arrayPath || `lists.${id}`}`)
      .addAttribute('v-for', `(el, idx) in ${arrayPath}`)
      .addAttribute(':key', 'idx')
      .addAttribute(':label', 'el.title')
      .addAttribute(':icon', 'el.icon')
  }

  if (ALIGN_OPTS.includes(align)) root.addAttribute('align', align)

  return builder.compile()
}
