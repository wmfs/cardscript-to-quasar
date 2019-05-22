const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    // multiline,
    lineDelimited,
    title,
    dataPath
  } = definition

  // todo: spacing

  const builder = new ComponentBuilder(definition)

  const card = builder.addTag('q-card')

  const cardTitle = card.addChildTag('q-card-section')
  cardTitle.content(title || 'Address')

  card.addChildTag('q-card-separator')

  const cardMain = card.addChildTag('q-card-section')
  cardMain.addAttribute('v-if', `data.${dataPath}`)
  const line = cardMain.addChildTag('div')
  line.addAttribute('v-for', `(line, $idx) in data.${dataPath}.split('${lineDelimited || ','}')`)
  line.addAttribute(':key', '$idx')
  line.content(`{{line}}`)

  const cardMainEmpty = card.addChildTag('q-card-section')
  cardMainEmpty.content('Address not found.')
  cardMainEmpty.addAttribute('v-if', `!data.${dataPath}`)

  return builder.compile()
}
