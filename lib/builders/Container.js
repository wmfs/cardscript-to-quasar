const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const makeFullImagePath = require('./../utils/make-full-image-path')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    id,
    showWhen,
    background,
    backgroundImage,
    wash,
    // selectAction,
    style,
    // verticalContentAlignment,
    spacing,
    separator,
    color,
    bordered,
    shadowed = false,
    padding,
    justifyContent
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const card = builder.addTag('q-card', { includeClosingTag: false })

  if (showWhen) {
    card.addAttribute('v-if', showWhen)
  }

  if (id) {
    card.addAttribute('id', id)
  }

  const classes = ['q-my-md']
  const styles = []

  if (shadowed === false || background === 'none' || color === 'none') {
    classes.push('no-shadow')
  }

  if (color) {
    classes.push(`bg-${COLORS[color]}`)
    if (TEXT_WHITE.includes(color)) {
      classes.push('text-white')
    }
  } else if (background === 'none' || color === 'none') {
    classes.push('bg-transparent')
  } else if (style === 'emphasis') {
    classes.push('bg-light')
  }

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (bordered) {
    card.addAttribute('bordered', null)
    styles.push('border-color: rgb(0, 94, 165, 0.5)')
  }

  if (backgroundImage) {
    const url = makeFullImagePath(backgroundImage, options)
    const blackWash = 'linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5))'
    const whiteWash = 'linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5))'

    if (wash === 'black') {
      styles.push(`background-image: ${blackWash}, ${url} !important`)
    } else if (wash === 'white') {
      styles.push(`background-image: ${whiteWash}, ${url} !important`)
    } else {
      styles.push(`background-image: ${url} !important`)
    }
  }

  if (classes.length > 0) {
    card.addAttribute('class', classes.join(' '))
  }

  if (styles.length > 0) {
    card.addAttribute('style', styles.join(';'))
  }

  const cardSection = card.addChildTag('q-card-section', { includeClosingTag: false })

  if (padding === 'none') {
    cardSection.addAttribute('class', 'q-pa-none')
  }

  if (justifyContent) {
    cardSection.addAttribute('style', 'display: flex; justify-content: space-between;')
  }

  return builder.compile()
}
