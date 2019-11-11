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
    // inset,
    isMultiSelect,
    style,
    spacing,
    separator,
    title,
    icon,
    clearable,
    filter
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

  if (isMultiSelect || style === 'expanded') {
    const field = div.addChildTag('q-field')
    const template = field
      .addChildTag('template')
      .addAttribute('v-slot:control', null)

    const optionGroup = template.addChildTag('q-option-group')
    optionGroup.bindToModel(definition)
    optionGroup
      .addAttribute(':options', `lists.${id}`)
      // .addAttribute(':dense', true)

    if (id) {
      field.addAttribute(':error', `$v.data.${id} ? $v.data.${id}.$error : false`)
      field.addAttribute(':error-message', `invalidFields['${id}'] ? invalidFields['${id}'].messages.join(' ') : ''`)
    }

    if (isMultiSelect) {
      optionGroup.addAttribute('type', 'checkbox')
    } else if (style === 'expanded') {
      optionGroup.addAttribute('type', 'radio')
    }
  } else {
    // SELECT
    const select = div.addChildTag('q-select')

    select.bindToModel(definition)
    select
      .addAttribute(':options', `lists.${id}`)
      .addAttribute(':emit-value', true)
      .addAttribute(':map-options', true)
      .addAttribute(':dense', true)

    if (clearable) {
      select.addAttribute('clearable', null)
    }

    if (filter) {
      select
        .addAttribute('@filter', `(val, update) => filterChoiceSetFn('${id}', val, update)`)
        .addAttribute('use-input', null)
    }

    if (id) {
      select.addAttribute(':error', `$v.data.${id} ? $v.data.${id}.$error : false`)
      select.addAttribute(':error-message', `invalidFields['${id}'] ? invalidFields['${id}'].messages.join(' ') : ''`)
    }
  }

  return builder.compile()
}
