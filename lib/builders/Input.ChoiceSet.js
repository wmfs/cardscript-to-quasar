const ComponentBuilder = require('./../utils/Component-builder')
const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    id,
    inset,
    isMultiSelect,
    style,
    spacing,
    separator,
    title,
    icon,
    validation
  } = definition

  const builder = new ComponentBuilder(definition)
  const field = builder.addTag('div')

  /*
  TODO: upgrade!
  const field = builder.addTag('q-field')
  if (icon) {
    field.addAttribute('icon', icon)
  } else {
    if (inset) field.addAttribute('inset', 'icon')
  }
  const classes = []

  if (spacing === 'padding') classes.push(`q-pa-md`)
  else if (spacing && MARGINS[spacing]) classes.push(`q-mt-${MARGINS[spacing]}`)

  if (classes.length > 0) field.addAttribute('class', classes.join(' '))
  if (title) {
    field.addAttribute('label-width', 12)
    field.addAttribute('label', title)
  }
  if (separator) field.addAttribute('style', `border-top: 1px solid rgb(238, 238, 238); margin-top: 8px; padding-top: 8px;`)
  if (validation && id) {
    field.addAttribute(':error', `$v.data.${id}.$error`)
    field.addAttribute('error-label', 'INVALID!') // todo: get a tailored error message here
  }
  */

  if (isMultiSelect) {
    // CHECKBOX
    const optionGroup = field.addChildTag('q-option-group')

    optionGroup.bindToModel(definition)
    optionGroup.addAttribute(':options', `lists.${id}`)
    optionGroup.addAttribute('type', 'checkbox')
  } else if (style === 'expanded') {
    // RADIO
    const optionGroup = field.addChildTag('q-option-group')
    optionGroup.bindToModel(definition)
    optionGroup.addAttribute(':options', `lists.${id}`)
    optionGroup.addAttribute('type', 'radio')
  } else {
    // SELECT
    const select = field.addChildTag('q-select')

    select.bindToModel(definition)
    select
      .addAttribute(':options', `lists.${id}`)
      .addAttribute(':emit-value', true)
      .addAttribute(':map-options', true)
  }

  return builder.compile()
}
