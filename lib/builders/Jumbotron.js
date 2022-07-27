const ComponentBuilder = require('./../utils/Component-builder')
const makeFullImagePath = require('./../utils/make-full-image-path')

module.exports = function (definition, options) {
  const {
    backgroundImage,
    title,
    subtitle,
    wash
  } = definition
  const builder = new ComponentBuilder(definition)

  const cardClasses = ['jumbotron']

  const card = builder.addTag('q-card')
  card.addAttribute(':dark', true)

  const cardSection = card
    .addChildTag('q-card-section')
    .addAttribute(':class', '$q.screen.gt.xs ? \'q-pa-xl\' : \'q-pa-md\'')

  // Title
  cardSection
    .addChildTag('div')
    .addAttribute(':class', '$q.screen.gt.xs ? \'text-h2\' : \'text-subtitle1\'')
    .content(title)

  // Subtitle
  if (subtitle) {
    cardSection
      .addChildTag('div')
      .addAttribute(':class', '$q.screen.gt.xs ? \'text-subtitle1\' : \'text-caption\'')
      .content(subtitle)
  }

  if (backgroundImage) {
    const url = makeFullImagePath(backgroundImage, options)
    const blackWash = 'linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5))'
    const whiteWash = 'linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5))'

    if (wash === 'black') {
      card.addAttribute('style', `background-image: ${blackWash}, ${url};`)
    } else if (wash === 'white') {
      card.addAttribute('style', `background-image: ${whiteWash}, ${url};`)
      card.addAttribute(':dark', false)
    } else {
      card.addAttribute('style', `background-image: ${url};`)
    }
  } else {
    cardClasses.push('bg-primary', 'text-white')
  }

  card.addAttribute('class', cardClasses.join(' '))

  return builder.compile()
}
