const DefaultOpenText = 'Open'
const DefaultRemoveText = 'Remove'

module.exports = function applyLaunches (source, definition) {
  const {
    showSingleLaunchAsButton,
    removableRows,
    removeInLaunches,
    removeText,
    arrayPath,
    id,
    type
  } = definition

  const launchesPath = {
    List: 'item.launches',
    MarkupTable: 'item.launches',
    EndAdaptiveCard: `${id}Item.launches`,
    Table: 'props.row.launches'
  }[type]

  const btn = source
    .addChildTag('q-btn')
    .addAttribute('round', null)
    .addAttribute('color', 'primary')
    .addAttribute('dense', null)
    .addAttribute('icon', 'more_vert')

  if (showSingleLaunchAsButton) {
    // If only one launch then show button
    source
      .addChildTag('q-btn')
      .addAttribute('color', 'primary')
      .addAttribute('dense', null)
      .addAttribute('outline', null)
      .addAttribute('v-if', `Array.isArray(${launchesPath}) && ${launchesPath}.length === 1`)
      .addAttribute(':label', `${launchesPath}[0].title || '${DefaultOpenText}'`)
      .addAttribute('@click', `start('pushCard', ${launchesPath}[0].stateMachineName, ${launchesPath}[0].input, ${launchesPath}[0].title)`)

    btn.addAttribute('v-if', `Array.isArray(${launchesPath}) && ${launchesPath}.length > 1`)
  } else {
    btn.addAttribute('v-if', `Array.isArray(${launchesPath}) && ${launchesPath}.length > 0`)
  }

  const menu = btn
    .addChildTag('q-menu')
    .addAttribute('auto-close', null)

  const list = menu
    .addChildTag('q-list')
    .addAttribute('style', 'min-width: 100px')
    .addAttribute('link', null)

  const item = list
    .addChildTag('q-item')
    .addAttribute('clickable', null)
    .addAttribute('class', 'q-pa-md')
    .addAttribute('v-for', `(launch, launchIdx) in ${launchesPath}`)
    .addAttribute(':key', 'launchIdx')
    .addAttribute('@click', 'start(`pushCard`, launch.stateMachineName, launch.input, launch.title)')

  item
    .addChildTag('q-item-label')
    .content(`{{ launch.title || '${DefaultOpenText}' }}`)

  if (removableRows && removeInLaunches) {
    list
      .addChildTag('q-item')
      .addAttribute('clickable', null)
      .addAttribute('class', 'q-pa-md')
      .addAttribute('@click', `action('DeleteArrayItem', { arrayPath: '${arrayPath}', rowIndex: rowIdx } )`)
      .addChildTag('q-item-label')
      .content(removeText || DefaultRemoveText)
  }
}
