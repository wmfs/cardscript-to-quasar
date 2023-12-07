const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    id
  } = definition

  const builder = new ComponentBuilder(definition)

  const topLevelDiv = builder.addTag('div')
  const dataPath = topLevelDiv.getDataPath()

  if (id) {
    topLevelDiv.addAttribute('id', id)
  }

  const commentsDiv = topLevelDiv
    .addChildTag('div')
    .addAttribute('v-for', `(comment, commentIdx) in ${dataPath}.${id}ChatMessages`)

  addComment(commentsDiv, id, dataPath)

  const repliesDiv = commentsDiv
    .addChildTag('div')
    .addAttribute('v-for', '(reply, replyIdx) in comment.replies')

  addReply(repliesDiv)
  addReplyInput(commentsDiv, id, dataPath)
  addCommentInput(topLevelDiv, id, dataPath)

  return builder.compile()
}

function addComment (commentsDiv, id, dataPath) {
  const qChatMessage = commentsDiv
    .addChildTag('q-chat-message')
    .addAttribute(':name', 'comment.createdBy')
    .addAttribute('bg-color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute(':key', 'commentIdx')

  const rowDiv = qChatMessage
    .addChildTag('div')
    .addAttribute('class', 'row')

  rowDiv
    .addChildTag('div')
    .addAttribute('class', 'col')
    .content('{{ comment.message }}')

  const rightCol = rowDiv
    .addChildTag('div')
    .addAttribute('class', 'col-auto')

  rightCol
    .addChildTag('q-btn')
    .addAttribute('v-if', `${dataPath}.chatControls.reply`)
    .addAttribute('icon', 'reply')
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('outline', null)
    .addAttribute('class', 'q-ml-md')
    .addAttribute('@click', `action('ToggleReplyPanel', {idx: commentIdx, originId: '${id}'})`)
}

function addReply (replyDiv) {
  const qChatMessage = replyDiv
    .addChildTag('q-chat-message')
    .addAttribute(':name', 'reply.createdBy')
    .addAttribute(':key', 'replyIdx')
    .addAttribute('sent', null)

  qChatMessage
    .addChildTag('div')
    .addAttribute('class', 'q-px-sm')
    .content('{{ reply.message }}')
}

function addReplyInput (commentsDiv, id, dataPath) {
  const replyInput = commentsDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}ChatMessages[commentIdx].replyInput`)
    .addAttribute('v-if', 'comment.replyPanelOpen')
    .addAttribute('id', `${id}ReplyInput`)
    .addAttribute('placeholder', 'Type your reply here')

  const replyInputAfterTemplate = replyInput
    .addChildTag('template')
    .addAttribute('v-slot:after', null)

  replyInputAfterTemplate
    .addChildTag('q-btn')
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('icon', 'reply')
    .addAttribute('@click', `action('AddChatMessage', {idx: commentIdx, originId: '${id}', type: 'reply'})`)
}

function addCommentInput (topLevelDiv, id, dataPath) {
  const commentInput = topLevelDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}ChatInput`)
    .addAttribute(`${dataPath}.chatControls.comment`)
    .addAttribute('v-if', `${dataPath}.chatControls.comment`)
    .addAttribute('placeholder', 'Leave a comment')

  const commentInputAfterTemplate = commentInput
    .addChildTag('template')
    .addAttribute('v-slot:after', null)

  commentInputAfterTemplate
    .addChildTag('q-btn')
    .addAttribute('round', null)
    .addAttribute('dense', null)
    .addAttribute('flat', null)
    .addAttribute('icon', 'send')
    .addAttribute('@click', `action('AddChatMessage', {idx: commentIdx, originId: '${id}', type: 'comment'})`)
}
