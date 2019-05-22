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

  const jumbotron = builder.addTag('q-jumbotron')
  jumbotron.addAttribute(':dark', true)

  const heading = jumbotron
    .addChildTag('div')
    .addAttribute('class', 'text-h2')
    .content(title)

  if (subtitle) {
    heading
      .addChildTag('div')
      .addAttribute('class', 'text-subtitle1')
      .content(subtitle)
  }

  if (backgroundImage) {
    const url = makeFullImagePath(backgroundImage, options)
    const blackWash = 'linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5))'
    const whiteWash = 'linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5))'

    if (wash === 'black') {
      jumbotron.addAttribute('style', `background-image: ${blackWash}, ${url};`)
    } else if (wash === 'white') {
      jumbotron.addAttribute('style', `background-image: ${whiteWash}, ${url};`)
      jumbotron.addAttribute(':dark', false)
    } else {
      jumbotron.addAttribute('style', `background-image: ${url};`)
    }
  } else {
    jumbotron.addAttribute('class', 'bg-primary')
  }

  return builder.compile()
}
