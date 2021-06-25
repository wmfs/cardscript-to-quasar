const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  if (!['multi', 'single'].includes(definition.selectionType)) definition.selectionType = null

  const {
    id,
    arrayPath,
    showLaunches,
    separator,
    showWhen,
    selectionType,
    selectionPosition = 'right' // left, right
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const parentDiv = builder.addTag('div', { includeClosingTag: false })
  parentDiv.addAttribute('class', 'row')

  if (separator) parentDiv.addAttribute('style', 'border-bottom: 1px solid rgb(0, 0, 0, 0.12); margin-bottom: 8px; padding-bottom: 8px')

  let contentColWidth = 12

  if (arrayPath && id) {
    parentDiv
      .addAttribute('v-for', `(${id}Item, ${id}Idx) in ${arrayPath}`)
      .addAttribute(':key', `${id}Idx`)

    if (showWhen) parentDiv.addAttribute('v-if', showWhen)

    if (selectionType) {
      contentColWidth -= 2

      if (selectionPosition === 'left') applySelection(parentDiv, definition)
    }

    if (showLaunches) {
      contentColWidth--
    }
  }

  const contentDiv = parentDiv.addChildTag('div', { includeClosingTag: false })
  contentDiv.addAttribute('class', `col-${contentColWidth}`)

  return builder.compile()
}

function applySelection (parentDiv, definition) {
  const {
    arrayPath,
    id,
    selectionType,
    selectionMax = 0, // 0 means no limit
    selectionShowWhen
  } = definition

  const selectDiv = parentDiv
    .addChildTag('div')
    .addAttribute('class', 'col-2')

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

  if (selectionShowWhen) option.addAttribute('v-if', selectionShowWhen)

  option.addAttribute('@input', `action('ListSelection', { idx: ${id}Idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}' })`)
  // .addAttribute(':val', `${id}Idx`)
  // .addAttribute('v-model',`${option.getDataPath()}.${id}Selected`)
}
