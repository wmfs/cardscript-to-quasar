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

  const qChatDiv = div
    .addChildTag('div')

  const qChatMessage = qChatDiv
    .addChildTag('q-chat-message')
    .addAttribute('v-for', `(message, idx) in ${dataPath}.${config.id}QaComments`)
    .addAttribute('name', 'QA Comment')
    .addAttribute('bg-color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute(':key', 'idx')

  const replyDiv = qChatDiv
    .addChildTag('div')
    .addAttribute('v-for', `(message, idx) in ${dataPath}.${config.id}QaComments`)

  replyDiv
    .addChildTag('q-input')
    .addAttribute('v-if', 'message.replyPanelOpen')

  const messageDiv = qChatMessage
    .addChildTag('div')
    .addAttribute('class', 'q-px-sm')
    .content('{{ message.comment }}')
    .addChildTag('q-btn')
    .addAttribute('icon', 'reply')
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('outline', null)
    .addAttribute('class', 'q-ml-md')
    .addAttribute('@click', `action('ToggleReplyPanel', {originId: '${config.id}', panelId: message.comment})`)

  const input = div
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${config.id}QaComment.comment`)
    .addAttribute('v-if', `${dataPath}.permissions.canComment`)

  const templateAfterInput = input
    .addChildTag('template')
    .addAttribute('v-slot:after', null)

  const sendButton = templateAfterInput
    .addChildTag('q-btn')

  sendButton
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('icon', 'send')
    .addAttribute('@click', `action('AddQaComment', '${config.id}')`)

  div.addAttribute('v-if', `${dataPath}.${config.id}ToggleQa`)
}
