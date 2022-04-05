const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  if (!['multi', 'single'].includes(definition.selectionType)) definition.selectionType = null

  const {
    id,
    arrayPath,
    showLaunches,
    selectionType,
    selectionClearable,
    selectionPosition = 'right' // left, right
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })
  const builder1 = new ComponentBuilder(definition, { disableShowWhen: true })

  if (arrayPath && id && selectionType === 'multi') {
    if (selectionClearable) {
      const div = builder.addTag('div')

      const destPath = `${div.getDataPath()}.${id}Selected`

      div
        .addChildTag('q-btn')
        .addAttribute('v-if', `${destPath}.length > 0`)
        .addAttribute('@click', `action('ClearArraySelection', '${destPath}')`)
        .addAttribute('unelevated', null)
        .addAttribute('class', 'q-ml-md btn-primary')
        .content('Clear all')
    }
  }

  let template = '</div>'

  if (arrayPath && id) {
    if (selectionType && selectionPosition === 'right') {
      applySelection(builder1, definition)
    }

    if (showLaunches) {
      applyLaunches(builder1, definition)
    }
  }

  template += builder1.compile()
  template += '</div>'
  template += builder.compile()

  return template
}

function applySelection (builder, definition) {
  const {
    arrayPath,
    id,
    selectionType,
    selectionMax = 0, // 0 means no limit
    selectionShowWhen
  } = definition

  const selectDiv = builder
    .addTag('div')
    .addAttribute('class', 'col-2')

  const destPath = `${selectDiv.getDataPath()}.${id}Selected`

  let option

  if (selectionType === 'single') {
    option = selectDiv
      .addChildTag('q-radio')
      .addAttribute(':val', `${id}Item`)
      .addAttribute(':model-value', destPath)
  } else if (selectionType === 'multi') {
    option = selectDiv
      .addChildTag('q-checkbox')
      .addAttribute(':model-value', `!!${destPath}.find(r => hashSum(r) === hashSum(${id}Item))`)
  }

  if (selectionShowWhen) option.addAttribute('v-if', selectionShowWhen)

  option.addAttribute('@update:model-value', `action('ListSelection', { idx: ${id}Idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}' })`)
  // .addAttribute(':val', `${id}Idx`)
  // .addAttribute('v-model',`${option.getDataPath()}.${id}Selected`)
}

function applyLaunches (builder, definition) {
  const { id } = definition

  const div = builder
    .addTag('div')
    .addAttribute('class', 'col-1')

  const btn = div
    .addChildTag('q-btn')
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('color', 'primary')
    .addAttribute('icon', 'more_vert')
    .addAttribute('v-if', `${id}Item.launches && ${id}Item.launches.length > 0`)

  const menu = btn
    .addChildTag('q-menu')
    .addAttribute('auto-close', null)

  const list = menu
    .addChildTag('q-list')
    .addAttribute('style', 'min-width: 100px')
    .addAttribute('link', null)

  list
    .addChildTag('q-item')
    .addAttribute('clickable', null)
    .addAttribute('v-for', `(launch, launchIdx) in ${id}Item.launches`)
    .addAttribute(':key', 'launchIdx')
    .addAttribute('class', 'q-pa-md')
    .addAttribute('@click', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)')
    .addChildTag('q-item-label')
    .content('{{launch.title || `Open`}}')
}
