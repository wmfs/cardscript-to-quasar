module.exports = function applyQa (config, source) {
  if (!config) {
    return
  }

  // source
  //   .addChildTag('q-icon')
  //   .addAttribute('name', 'forum')
  //   .addAttribute('size', 'sm')
  //   .addAttribute('class', 'q-ml-sm text-dark cursor-pointer')
  //   .addAttribute('@click', `action('OpenQaPanel', '${config.id}')`)

  const div = source
    .addChildTag('div')

  const dataPath = div.getDataPath()

  const qChatDiv = div
    .addChildTag('div')
    .addAttribute('v-for', `(message, idx) in ${dataPath}.$CHAT.${config.id}.messages`)

  const qChatMessage = qChatDiv
    .addChildTag('q-chat-message')
    .addAttribute('name', 'QA Comment')
    .addAttribute('bg-color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute(':key', 'idx')

  const responseInputDiv = qChatDiv
    .addChildTag('div')

  const responseInput = responseInputDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.$CHAT.${config.id}.messages[idx].responseInput`)
    .addAttribute('v-if', 'message.replyPanelOpen')

  const responseDisplay = responseInputDiv
    .addChildTag('q-chat-message')
    .addAttribute('name', 'Response')
    .addAttribute(':key', 'idx')
    .addAttribute('v-if', 'message.response')
    .addAttribute('sent', null)

  responseDisplay
    .addChildTag('div')
    .addAttribute('class', 'q-px-sm')
    .content('{{ message.response }}')

  qChatMessage
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
    .addAttribute('@click', `action('ToggleReplyPanel', {idx, originId: '${config.id}'})`)

  const input = div
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.QA${config.id}`)
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
    .addAttribute('@click', `action('AddChatMessage', {qaComponent: ${true}, id: '${config.id}'})`)

  const templateAfterResponse = responseInput
    .addChildTag('template')
    .addAttribute('v-slot:after', null)

  const sendButtonResponse = templateAfterResponse
    .addChildTag('q-btn')

  sendButtonResponse
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('icon', 'reply')
    .addAttribute('@click', `action('AddChatResponse', {idx, originId: '${config.id}'})`)
}
