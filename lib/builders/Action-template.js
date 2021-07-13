const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function ActionTemplate (definition, elementOptions, additionalOptions) {
  const {
    ActionSet,
    ActionStyle
  } = elementOptions

  const {
    type,
    title,
    disableWhen
  } = definition

  let style = definition.style // primary, standard, positive

  const builder = new ComponentBuilder(definition)

  const onClick = getOnClick(definition)

  if (ActionSet && (ActionStyle === 'list' || ActionStyle === 'dropdown')) {
    const classes = []

    if (ActionStyle === 'list') classes.push('q-px-none')

    const item = builder
      .addTag('q-item')
      .addAttribute('@click.native', onClick)

    if (ActionStyle === 'dropdown') {
      item
        .addAttribute('clickable', null)
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

    if (disableWhen) btn.addAttribute(':disable', disableWhen)

    if (!style) {
      if (
        type === 'Action.Cancel' ||
        type === 'Action.ClearArraySelection' ||
        type === 'Action.NextTab' ||
        type === 'Action.PreviousTab' ||
        type === 'Action.Stop'
      ) {
        style = 'standard'
      } else if (type === 'Action.Submit') {
        style = 'positive'
      } else {
        style = 'primary'
      }
    }

    if (style === 'standard') {
      btn.addAttribute('color', 'standard')
      btn.addAttribute('text-color', '#0c0c0c')
    } else if (style === 'positive') {
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
    data,
    arrayPath,
    text
  } = definition

  return {
    'Action.Cancel': 'action(\'Cancel\')',
    'Action.NextTab': `action('NextTab', '${id}')`,
    'Action.OpenUrl': `openURL(parseTemplate('${url}'))`,
    'Action.PreviousTab': `action('PreviousTab', '${id}')`,
    'Action.CopyToClipboard': `action('CopyToClipboard', '${text || ''}' )`,
    'Action.ApiLookup': `action('ApiLookup', ${inspect({ stateMachineName, input } || {})} )`,
    'Action.PushCard': `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`,
    'Action.ReplaceCard': `action('ReplaceCard', ${inspect({ stateMachineName, input, title } || {})} )`,
    'Action.ClearArraySelection': `action('ClearArraySelection', '${arrayPath}')`,
    'Action.Save': '',
    'Action.ShowCard': 'action(\'ShowCard\')',
    'Action.Stop': 'action(\'Stop\')',
    'Action.Submit': `action('Submit', ${inspect(data || {})} )`
  }[type]
}
