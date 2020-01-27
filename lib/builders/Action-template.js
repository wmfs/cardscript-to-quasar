const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function ActionTemplate (definition, elementOptions, additionalOptions) {
  const {
    ActionSet,
    ActionSetDropDown
  } = elementOptions

  const {
    type,
    title
  } = definition

  const builder = new ComponentBuilder(definition)

  const onClick = getOnClick(definition)

  if (ActionSet) {
    const classes = ['q-px-none']

    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', onClick)

    if (ActionSetDropDown) {
      item
        .addAttribute('clickable', null)
        .addAttribute('v-close-popup', null)
    } else {
      classes.push('item-label')
    }

    item.addAttribute('class', classes.join(' '))

    item
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .content(title)
  } else {
    const btn = builder
      .addTag('q-btn')
      .addAttribute('label', title)
      .addAttribute('class', 'q-mb-sm q-mr-sm')
      .addAttribute('@click', onClick)

    if (
      type === 'Action.Cancel' ||
      type === 'Action.NextTab' ||
      type === 'Action.PreviousTab' ||
      type === 'Action.Stop'
    ) {
      btn.addAttribute('color', 'standard')
      btn.addAttribute('text-color', '#0c0c0c')
    } else if (type === 'Action.Submit') {
      btn.addAttribute('color', 'positive')
    } else {
      btn.addAttribute('color', 'primary')
    }
  }

  return builder.compile()
}

function getOnClick (definition) {
  const {
    id,
    type,
    title,
    stateMachineName,
    input,
    url,
    data
  } = definition

  return {
    'Action.Cancel': 'action(\'Cancel\')',
    'Action.NextTab': `action('NextTab', '${id}')`,
    'Action.OpenUrl': `openURL(parseTemplate('${url}'))`,
    'Action.PreviousTab': `action('PreviousTab', '${id}')`,
    'Action.PushCard': `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`,
    'Action.ReplaceCard': `action('ReplaceCard', ${inspect({ stateMachineName, input, title } || {})} )`,
    'Action.Save': '',
    'Action.ShowCard': 'action(\'ShowCard\')',
    'Action.Stop': 'action(\'Stop\')',
    'Action.Submit': `action('Submit', ${inspect(data || {})} )`
  }[type]
}
