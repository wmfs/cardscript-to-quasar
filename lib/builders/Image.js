const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const makeFullImagePath = require('./../utils/make-full-image-path')

const SIZES = {
  auto: '100%',
  stretch: '100%',
  small: '40px',
  medium: '80px',
  large: '160px',
  veryLarge: '320px'
}

module.exports = function (definition, options) {
  const {
    altText,
    horizontalAlignment,
    // selectAction,
    size = 'auto',
    style,
    url,
    urlBind,
    spacing,
    separator,
    imagePath
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  const img = div.addChildTag('img', { isSelfClosingTag: true })

  const classes = []
  const styles = []

  if (['left', 'right', 'center'].includes(horizontalAlignment)) {
    classes.push(`text-${horizontalAlignment}`)
  }

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (classes.length > 0) {
    div.addAttribute('class', classes.join(' '))
  }

  if (url) {
    img.addAttribute('src', url)
  } else if (urlBind) {
    img.addAttribute(':src', urlBind)
  } else if (imagePath) {
    const str = makeFullImagePath(definition.imagePath, options)
    const regex = /(?<=url\()(.*)(?=\))/
    const result = regex.exec(str)
    const fullImagePath = result[0]
    img.addAttribute('src', fullImagePath)
  }

  img.addAttribute('alt', altText || 'Image')

  styles.push('max-height: 100%', `width: ${SIZES[size]};`)

  if (style === 'person') {
    styles.push('border-radius: 100%')
  }

  if (styles.length > 0) {
    img.addAttribute('style', styles.join('; '))
  }

  return builder.compile()
}
