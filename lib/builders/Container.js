const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const makeFullImagePath = require('./../utils/make-full-image-path')
const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    id,
    showWhen,
    backgroundImage,
    wash,
    // selectAction,
    style,
    // verticalContentAlignment,
    spacing,
    separator,
    color,
    bordered,
    shadowed,
    padding,
    justifyContent
  } = definition

  let card = '<q-card'

  if (showWhen) card += ` v-if="${showWhen}"`
  if (id) card += ` id="${id}"`

  // if (selectAction) card += ` @click=""`
  const classes = ['q-my-md']
  const styles = []

  if (!shadowed) classes.push('no-shadow')

  if (color) {
    classes.push(`bg-${COLORS[color]}`)
    if (TEXT_WHITE.includes(color)) {
      classes.push('text-white')
    }
  } else if (style === 'emphasis') {
    classes.push('bg-light')
  }

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (bordered) {
    card += ' bordered'
    styles.push('border-color: rgb(0, 94, 165, 0.5)')
  }

  if (classes.length > 0) card += ` class="${classes.join(' ')}"`

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

  if (styles.length > 0) card += ` style="${styles.join('; ')}"`

  card += '><q-card-section'

  if (padding === 'none') card += ' class="q-pa-none"'
  if (justifyContent) card += ' style = "display: flex; justify-content: space-between;"'

  card += '>'

  return card
}
