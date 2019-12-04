const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

const COLORS = {
  accent: 'primary',
  good: 'positive',
  warning: 'warning',
  attention: 'negative',
  light: 'light',
  dark: 'dark'
}

const TEXT_WHITE = ['accent', 'good', 'attention', 'dark']

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
    color
  } = definition

  let card = '<q-card'

  if (showWhen) card += ` v-if="${showWhen}"`
  if (id) card += ` id="${id}"`

  // if (selectAction) card += ` @click=""`
  const classes = ['no-shadow']
  const styles = []

  if (color) {
    classes.push(`bg-${COLORS[color]}`)
    if (TEXT_WHITE.includes(color)) {
      classes.push(`text-white`)
    }
  } else if (style === 'emphasis') {
    classes.push('bg-light')
  }

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (classes.length > 0) card += ` class="${classes.join(' ')}"`

  if (backgroundImage) {
    const url = `url(statics/${backgroundImage})`
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

  card += '><q-card-section>'

  return card
}
