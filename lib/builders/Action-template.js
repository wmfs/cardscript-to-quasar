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
    disableWhen,
    style // primary / close
  } = definition

  // const style = definition.style // primary, standard, positive

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
    const btnClasses = ['q-mb-sm', 'q-mr-sm']

    const btn = builder
      .addTag('q-btn')
      .addAttribute('label', title)
      .addAttribute('@click', onClick)

    if (disableWhen) btn.addAttribute(':disable', disableWhen)

    if (style === 'primary') {
      btnClasses.push('btn-primary')
    } else if (style === 'close') {
      btnClasses.push('btn-close')
    } else {
      switch (type) {
        case 'Action.Cancel':
        case 'Action.Stop':
        case 'Action.ClearArraySelection':
          btnClasses.push('btn-close')
          break
        default:
          btnClasses.push('btn-primary')
      }
    }

    btn.addAttribute('unelevated', null)

    btn.addAttribute('class', btnClasses.join(' '))
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
