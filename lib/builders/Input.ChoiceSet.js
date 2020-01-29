const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySeparator = require('./../utils/apply-separator')

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

  const showWhen = prop => `${prop} ? parseTemplate(\`{{ \${${prop}} }}\`, { data }) === 'true' : true`

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')

  const classes = []

  if (spacing === 'padding') classes.push('q-pa-md')
  else if (spacing && MARGINS[spacing]) classes.push(`q-mt-${MARGINS[spacing]}`)

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))

  applySeparator({ separator, source: div })

  if (isMultiSelect || style === 'expanded') {
    const field = div.addChildTag('q-field')
    const template = field
      .addChildTag('template')
      .addAttribute('v-slot:control', null)

    const opt = template
      .addChildTag('div')
      .addAttribute('v-for', `(opt, idx) in lists.${id}`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'col-12') // todo: any way to avoid field having row class?

    if (isMultiSelect) {
      opt
        .addChildTag('q-checkbox')
        .addAttribute(':val', 'opt.value')
        .addAttribute(':label', 'opt.label')
        .addAttribute('v-if', showWhen('opt.disable'))
        .bindToModel(definition)
    } else if (style === 'expanded') {
      opt
        .addChildTag('q-radio')
        .addAttribute(':val', 'opt.value')
        .addAttribute(':label', 'opt.label')
        .addAttribute('v-if', showWhen('opt.disable'))
        .bindToModel(definition)
    }

    applyErrorCheck(field, id)
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

    select
      .addChildTag('template')
      .addAttribute('v-slot:option', 'props')

      .addChildTag('q-item')
      .addAttribute('@click', 'props.itemEvents.click')
      .addAttribute('@mousemove', 'props.setOptionIndex(props.index)')
      .addAttribute('clickable', null)
      .addAttribute(':active', 'props.itemProps.active')
      .addAttribute(':manualFocus', 'props.itemProps.manualFocus')
      .addAttribute(':focused', 'props.itemProps.focused')
      .addAttribute('v-if', showWhen('props.opt.disable'))
      .addAttribute(':dense', 'props.itemProps.dense')
      .addAttribute(':dark', 'props.itemProps.dark')

      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .content('{{ props.opt.label }}')

    applyErrorCheck(select, id)
  }

  return builder.compile()
}
