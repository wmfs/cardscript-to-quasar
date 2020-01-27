const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const { COLORS } = require('./../utils/color-reference')

const SIZES = {
  small: 'text-caption',
  medium: 'text-h5',
  large: 'text-h3',
  extraLarge: 'text-h2',
  default: 'text-subtitle1'
}

const WEIGHTS = {
  lighter: 'light',
  bolder: 'bold'
}

module.exports = function (definition, options) {
  const {
    color,
    horizontalAlignment,
    isSubtle,
    maxLines,
    size,
    text,
    weight,
    wrap = true,
    id,
    spacing,
    separator,
    preformat,
    markdown
  } = definition

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  if (id) div.addAttribute('id', id)

  const classes = []
  const styles = []

  if (['left', 'right', 'center'].includes(horizontalAlignment)) classes.push(`text-${horizontalAlignment}`)
  if (color && COLORS[color]) classes.push(`text-${COLORS[color]}`)
  if (isSubtle) classes.push('text-weight-light')
  if (weight && WEIGHTS[weight]) classes.push(`text-weight-${WEIGHTS[weight]}`)

  if (size && SIZES[size]) {
    classes.push(SIZES[size])
  } else {
    classes.push(SIZES.default)
  }

  if (!wrap) {
    classes.push('ellipsis')
  }

  if (maxLines) {
    styles.push(`height: ${maxLines}em`, 'line-height: 1em', 'overflow: hidden')
  }

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (styles.length > 0) div.addAttribute('style', styles.join('; '))
  if (classes.length > 0) div.addAttribute('class', classes.join(' '))

  if (preformat) {
    div.addChildTag('pre').content(text)
  } else if (markdown) {
    div
      .addChildTag('div')
      .addAttribute('class', 'compiled-markdown')
      .addAttribute('v-html', `data.${id}CompiledMarkdown`) // todo: getDataPath instead
  } else {
    div.content(text)
  }

  return builder.compile()
}
