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

  const avatarTemplate = qChatMessage
    .addChildTag('template')
    .addAttribute('v-slot:avatar', null)

  avatarTemplate
    .addChildTag('q-avatar')
    .addAttribute('color', 'primary')
    .addAttribute('text-color', 'white')
    .addAttribute('class', 'q-mr-sm')
    .content('{{ emailToAvatarInitials(comment.createdBy) }}')

  const rowDiv = qChatMessage
    .addChildTag('div')
    .addAttribute('class', 'row')

  const leftCol = rowDiv
    .addChildTag('div')
    .addAttribute('class', 'col')

  leftCol
    .addChildTag('div')
    .addAttribute('class', 'row')
    .content('{{ comment.message }}')

  const timestampRow = leftCol
    .addChildTag('div')
    .addAttribute('class', 'row')

  timestampRow
    .addChildTag('div')
    .addAttribute('class', 'q-message-stamp')
    .content('{{ formatDate(comment.created, \'DD/MM/YY HH:mm\') }}')

  const rightCol = rowDiv
    .addChildTag('div')
    .addAttribute('class', 'col-auto')

  rightCol
    .addChildTag('q-btn')
    .addAttribute('v-if', `${dataPath}.loggedInUser !== comment.createdBy && ${dataPath}.chatControls.reply`)
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
    .addAttribute(':stamp', 'formatDate(reply.created, \'DD/MM/YY HH:mm\')')
    .addAttribute(':key', 'replyIdx')
    .addAttribute('sent', null)

  const avatarTemplate = qChatMessage
    .addChildTag('template')
    .addAttribute('v-slot:avatar', null)

  avatarTemplate
    .addChildTag('q-avatar')
    .addAttribute('color', 'grey-4')
    .addAttribute('text-color', 'black')
    .addAttribute('class', 'q-ml-sm')
    .content('{{ emailToAvatarInitials(reply.createdBy) }}')

  qChatMessage
    .addChildTag('div')
    .content('{{ reply.message }}')
}

function addReplyInput (commentsDiv, id, dataPath) {
  const replyDiv = commentsDiv
    .addChildTag('div')
    .addAttribute(':id', `commentIdx + '${id}ReplyInput'`)

  const replyInput = replyDiv
    .addChildTag('q-input')
    .addAttribute('v-model', `${dataPath}.${id}ChatMessages[commentIdx].replyInput`)
    .addAttribute('v-if', 'comment.replyPanelOpen')
    .addAttribute('placeholder', 'Type your reply here')
    .addAttribute('autogrow', null)

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
    .addAttribute('autogrow', null)

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
