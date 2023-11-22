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
    .addAttribute(':name', 'message.author')
    .addAttribute('bg-color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute(':key', 'idx')

  qChatMessage
    .addAttribute('v-if', 'message.type === \'comment\'')
    .addChildTag('div')
    .addAttribute('class', 'q-px-sm')
    .content('{{ message.message }}')
    .addChildTag('q-btn')
    .addAttribute('v-if', `${dataPath}.chatControls.reply`)
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
    .addAttribute(`${dataPath}.chatControls.comment`)
    .addAttribute('v-if', `${dataPath}.chatControls.comment`)

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
    .addAttribute('@click', `action('AddChatMessage', {idx, originId: '${id}', type: 'comment'})`)

  const replyInputDiv = qChatDiv
    .addChildTag('div')

  const replyInput = replyInputDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}ChatMessages[idx].replyInput`)
    .addAttribute('v-if', 'message.replyPanelOpen')

  const replyDisplay = replyInputDiv
    .addChildTag('q-chat-message')
    .addAttribute(':name', 'message.author')
    .addAttribute(':key', 'idx')
    .addAttribute('v-if', 'message.type === \'reply\'')
    .addAttribute('sent', null)

  replyDisplay
    .addChildTag('div')
    .addAttribute('class', 'q-px-sm')
    .content('{{ message.message }}')

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
    .addAttribute('@click', `action('AddChatMessage', {idx, originId: '${id}', type: 'reply'})`)
    // .addAttribute('@click', `action('AddChatReply', {idx, originId: '${id}'})`)

  return builder.compile()
}
