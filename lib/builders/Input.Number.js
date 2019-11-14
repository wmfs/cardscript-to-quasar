const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    icon,
    max,
    min,
    placeholder,
    spacing,
    separator,
    title,
    id
  } = definition

  const builder = new ComponentBuilder(definition)

  const classes = []
  const styles = []

  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')

  const dataPath = `${div.getDataPath(definition)}.${id}`

  const input = div
    .addChildTag('q-input')
    .addAttribute('type', 'number')
    .addAttribute('@input', `val => ${dataPath} = val === '' ? null : +val`)
    .addAttribute(':value', dataPath)
    // .bindToModel(definition, 'number')

  if (placeholder) input.addAttribute('placeholder', placeholder)

  if (min !== undefined) input.addAttribute('min', min)
  if (max !== undefined) input.addAttribute('max', max)

  if (id) {
    input.addAttribute(':error', `$v.data.${id} ? $v.data.${id}.$error : false`)
    input.addAttribute(':error-message', `invalidFields['${id}'] ? invalidFields['${id}'].messages.join(' ') : ''`)
  }

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))
  if (styles.length > 0) div.addAttribute('style', styles.join('; '))

  return builder.compile()
}
