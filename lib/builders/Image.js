const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

const SIZES = {
  auto: '100%',
  stretch: '100%',
  small: '40px',
  medium: '80px',
  large: '160px'
}

module.exports = function (definition, options) {
  const {
    altText,
    horizontalAlignment,
    // selectAction,
    size,
    style,
    url,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  const img = div.addChildTag('img')

  const classes = []
  const styles = []

  if (['left', 'right', 'center'].includes(horizontalAlignment)) classes.push(`text-${horizontalAlignment}`)

  applySpacing({ spacing, classes })
  applySeparator({ separator, styles })

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))

  img.addAttribute('src', url)
  img.addAttribute('alt', altText || 'Image')
  img.addAttribute('width', SIZES[size] || '100%')

  styles.push('max-height: 100%', 'min-width: 0px')

  if (style === 'person') styles.push(`border-radius: 100%`)
  if (styles.length > 0) img.addAttribute('style', styles.join('; '))

  return builder.compile()
}
