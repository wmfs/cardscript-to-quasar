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
  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')

  const classes = []

  if (spacing === 'padding') classes.push(`q-pa-md`)
  else if (spacing && MARGINS[spacing]) classes.push(`q-mt-${MARGINS[spacing]}`)

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))
  if (separator) div.addAttribute('style', `border-top: 1px solid rgb(238, 238, 238); margin-top: 8px; padding-top: 8px;`)

  // TODO
  // if (validation && id) {
  //   div.addAttribute(':error', `$v.data.${id}.$error`)
  //   div.addAttribute('error-label', 'INVALID!') // todo: get a tailored error message here
  // }

  if (isMultiSelect) {
    // CHECKBOX
    const optionGroup = div.addChildTag('q-option-group')
    optionGroup.bindToModel(definition)
    optionGroup
      .addAttribute(':options', `lists.${id}`)
      .addAttribute('type', 'checkbox')
      .addAttribute(':dense', true)
  } else if (style === 'expanded') {
    // RADIO
    const optionGroup = div.addChildTag('q-option-group')
    optionGroup.bindToModel(definition)
    optionGroup
      .addAttribute(':options', `lists.${id}`)
      .addAttribute('type', 'radio')
      .addAttribute(':dense', true)
  } else {
    // SELECT
    const select = div.addChildTag('q-select')

    select.bindToModel(definition)
    select
      .addAttribute(':options', `lists.${id}`)
      .addAttribute(':emit-value', true)
      .addAttribute(':map-options', true)
      .addAttribute(':dense', true)
  }

  return builder.compile()
}
