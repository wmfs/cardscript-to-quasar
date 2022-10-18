module.exports = function applyQa (config, source) {
  if (!config) {
    return
  }

  source
    .addChildTag('q-icon')
    .addAttribute('name', 'forum')
    .addAttribute('size', 'sm')
    .addAttribute('class', 'q-ml-sm text-dark cursor-pointer')
    .addAttribute('@click', `action('OpenQaPanel', '${config.id}')`)

  const div = source
    .addChildTag('div')

  const dataPath = div.getDataPath()

  const qChatMessage = div
    .addChildTag('q-chat-message')
    .addAttribute('v-for', `(message, idx) in ${dataPath}.${config.id}QaComments`)
    .addAttribute('bg-color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute(':key', 'idx')

  qChatMessage
    .addChildTag('div')
    .content('{{message}}')

  const input = div
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${config.id}QaComment`)

  const templateAfter = input
    .addChildTag('template')
    .addAttribute('v-slot:after', null)

  const sendButton = templateAfter
    .addChildTag('q-btn')

  sendButton
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('icon', 'send')
    .addAttribute('@click', `action('AddQaComment', '${config.id}')`)

  div.addAttribute('v-if', `${dataPath}.${config.id}ToggleQa`)
}
