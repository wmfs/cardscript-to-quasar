const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')
const { COLORS } = require('./../utils/color-reference')
const STYLES = ['standard', 'positive', 'primary']
const ACTION_SET_STYLES = ['list', 'dropdown']

module.exports = function ActionTemplate (definition, elementOptions, additionalOptions) {
  const {
    ActionSet,
    ActionStyle
  } = elementOptions

  const builder = new ComponentBuilder(definition)

  const onClick = getOnClick(definition)

  if (ActionSet && ACTION_SET_STYLES.includes(ActionStyle)) {
    actionSet(builder, ActionStyle, onClick, definition)
  } else {
    button(builder, onClick, definition)
  }

  return builder.compile()
}

function actionSet (builder, ActionStyle, onClick, definition) {
  const {
    title
  } = definition

  const classes = []

  if (ActionStyle === 'list') {
    classes.push('q-px-none')
  }

  const item = builder.addTag('q-item')

  if (ActionStyle === 'dropdown') {
    item.addAttribute('clickable', null)
  } else {
    classes.push('item-label')
  }

  item.addAttribute('class', classes.join(' '))

  const section = item.addChildTag('q-item-section')

  section
    .addChildTag('q-item-label')
    .addAttribute('@click', onClick)
    .content(title)
}

function button (builder, onClick, definition) {
  const {
    disableWhen,
    title
  } = definition

  const btn = builder
    .addTag('q-btn')
    .addAttribute('label', title)
    .addAttribute('class', 'q-mb-sm q-mr-sm')
    .addAttribute('@click', onClick)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)

  if (disableWhen) {
    btn.addAttribute(':disable', disableWhen)
  }

  const { buttonColor, textColor } = buttonColors(definition)
  btn.addAttribute('color', buttonColor)
  btn.addAttribute('text-color', textColor)
}

function buttonColors ({ type, color, style }) {
  const standardStyleActions = ['Action.Cancel', 'Action.ClearArraySelection', 'Action.NextTab', 'Action.PreviousTab', 'Action.Stop']
  const positiveStyleActions = ['Action.Submit']

  let buttonColor = 'primary'
  let textColor = 'white'

  if (COLORS[color]) {
    buttonColor = COLORS[color]
  } else if (style && STYLES.includes(style)) {
    buttonColor = style
  } else if (standardStyleActions.includes(type)) {
    buttonColor = 'standard'
  } else if (positiveStyleActions.includes(type)) {
    buttonColor = 'positive'
  }

  if (buttonColor === 'standard') {
    buttonColor = 'light'
  }

  if (['grey-3', 'light'].includes(buttonColor)) {
    textColor = 'dark'
  }

  return { buttonColor, textColor }
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
    text,
    card = {},
    onClick
  } = definition

  if (onClick) return onClick

  return {
    'Action.Cancel': 'action(\'CancelCard\')',
    'Action.NextTab': `action('NextTab', '${id}')`,
    'Action.OpenUrl': `openURL(parseTemplate('${url}'))`,
    'Action.PreviousTab': `action('PreviousTab', '${id}')`,
    'Action.CopyToClipboard': `action('CopyToClipboard', '${text || ''}' )`,
    'Action.ApiLookup': `action('ApiLookup', ${inspect({ stateMachineName, input } || {})} )`,
    'Action.PushCard': `action('PushCard', ${inspect({ stateMachineName, input, title } || {})} )`,
    'Action.ReplaceCard': `action('ReplaceCard', ${inspect({ stateMachineName, input, title } || {})} )`,
    'Action.ClearArraySelection': `action('ClearArraySelection', '${arrayPath}')`,
    'Action.Save': '',
    'Action.ShowCard': `action('ShowCard', ${inspect({ card })})`,
    'Action.Stop': 'action(\'StopCard\')',
    'Action.Submit': `action('SubmitCard', ${inspect(data || {})} )`,
    'Action.PrintCard': 'action(\'PrintCard\')'
  }[type]
}
