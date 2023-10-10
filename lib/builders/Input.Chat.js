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
    .addAttribute('v-for', `(message, idx) in ${dataPath}.${id}ChatMessages`)

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

  const chatInput = div
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}ChatInput`)

  const templateAfterInput = chatInput
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

  const replyInputDiv = qChatDiv
    .addChildTag('div')

  const replyInput = replyInputDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}ChatMessages[idx].replyInput`)
    .addAttribute('v-if', 'message.replyPanelOpen')

  const replyDisplay = replyInputDiv
    .addChildTag('q-chat-message')
    .addAttribute('name', 'Reply')
    .addAttribute(':key', 'idx')
    .addAttribute('v-if', 'message.reply')
    .addAttribute('sent', null)

  replyDisplay
    .addChildTag('div')
    .addAttribute('class', 'q-px-sm')
    .content('{{ message.reply }}')

  const templateAfterReply = replyInput
    .addChildTag('template')
    .addAttribute('v-slot:after', null)

  const sendButtonReply = templateAfterReply
    .addChildTag('q-btn')

  sendButtonReply
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('icon', 'reply')
    .addAttribute('@click', `action('AddChatReply', {idx, originId: '${id}'})`)



  return builder.compile()
}