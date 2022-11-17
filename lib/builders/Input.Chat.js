const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  const dataPath = div.getDataPath()

  if (id) div.addAttribute('id', id)

  const qChatDiv = div
    .addChildTag('div')
    .addAttribute('v-for', `(message, idx) in ${dataPath}.$CHAT.${id}.messages`)

  const qChatMessage = qChatDiv
    .addChildTag('q-chat-message')
    .addAttribute('name', 'QA Comment')
    .addAttribute('bg-color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute(':key', 'idx')

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
    .addAttribute('@click', `action('ToggleReplyPanel', {idx, originId: '${id}'})`)

  const input = div
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}`)

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
    .addAttribute('@click', `action('AddChatMessage', '${id}')`)

  const responseInputDiv = qChatDiv
    .addChildTag('div')

  const responseInput = responseInputDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.$CHAT.${id}.messages[idx].responseInput`)
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
    .addAttribute('@click', `action('AddChatResponse', {idx, originId: '${id}'})`)

  return builder.compile()
}
