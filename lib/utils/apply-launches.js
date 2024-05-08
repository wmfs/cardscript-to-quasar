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
    Table: 'props.row.launches',
    TimelineEntry: 'item.launches'
  }[type]

  const btn = source
    .addChildTag('q-btn')
    .addAttribute('round', null)
    .addAttribute('color', 'primary')
    .addAttribute('dense', null)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('icon', 'more_vert')

  if (showSingleLaunchAsButton) {
    // If only one launch then show button
    source
      .addChildTag('q-btn')
      .addAttribute('color', 'primary')
      .addAttribute('dense', null)
      .addAttribute('outline', null)
      .addAttribute('no-caps', null)
      .addAttribute('unelevated', null)
      .addAttribute('v-if', `Array.isArray(${launchesPath}) && ${launchesPath}.length === 1`)
      .addAttribute(':label', `${launchesPath}[0].title || '${DefaultOpenText}'`)
      .addAttribute('@click', `action('LaunchAction', ${launchesPath}[0])`)

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

  const itemTemplate = list
    .addChildTag('template')
    .addAttribute('v-for', `(launch, launchIdx) in ${launchesPath}`)

  const item = itemTemplate
    .addChildTag('q-item')
    .addAttribute('clickable', null)
    .addAttribute('class', 'q-pa-md')
    // eslint-disable-next-line no-template-curly-in-string
    .addAttribute('v-if', 'launch.showWhen === null || launch.showWhen === undefined || parseTemplate(`{{ ${launch.showWhen} }}`, { data, launch }) === \'true\'')
    .addAttribute(':key', 'launchIdx')
    .addAttribute('@click', 'action(\'LaunchAction\', launch)')

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
