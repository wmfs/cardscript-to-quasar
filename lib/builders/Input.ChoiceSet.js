const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applyTooltip = require('./../utils/apply-tooltip')
const { inspect } = require('./../utils/local-util')

const showWhen = prop => `${prop} ? parseTemplate(\`{{ \${${prop}} }}\`, { data }) === 'true' : true`

module.exports = function (definition, options) {
  const {
    id,
    // inset,
    isMultiSelect,
    style, // compact, expanded
    // spacing,
    // separator,
    title,
    placeholder,
    tooltip,
    // icon,
    clearable,
    filter,
    onChangeResetDataPaths,
    validation
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')
  const outerDivClasses = ['q-my-md']

  let selectionType

  if (isMultiSelect) {
    if (style === 'compact') selectionType = 'Select'
    else selectionType = 'Checkbox'
  } else {
    if (style === 'expanded') selectionType = 'Radio'
    else selectionType = 'Select'
  }

  if (selectionType === 'Select') {
    outerDivClasses.push('input-field')

    const select = div
      .addChildTag('q-select')
      .bindToModel(definition)
      .addAttribute('stack-label', null)
      .addAttribute('filled', null)
      .addAttribute('no-error-icon', null)
      .addAttribute(':options', `lists.${id}`)
      .addAttribute(':emit-value', true)
      .addAttribute(':map-options', true)

    if (title) select.addAttribute('label', title)
    if (placeholder) select.addAttribute(placeholder)
    if (clearable) select.addAttribute('clearable', null)

    if (filter) {
      select
        .addAttribute('@filter', `(val, update) => filterChoiceSetFn('${id}', val, update)`)
        .addAttribute('use-input', null)
    }

    if (onChangeResetDataPaths) {
      // todo: can't pass in objects as values, could try JSON.stringify and escape quotes
      select.addAttribute('@input', `action('ResetDataPaths', ${inspect({ dataPaths: onChangeResetDataPaths })})`)
    }

    const selectTemplate = select
      .addChildTag('template')
      .addAttribute('v-slot:option', 'props')

    const selectItem = selectTemplate
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

    selectItem
      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .content('{{ props.opt.label }}')

    if (isMultiSelect) {
      select.addAttribute('options-selected-class', 'bg-accent')
      select.addAttribute('multiple', null)
      select.addAttribute('counter', null)
      // todo: selectionMax -> max-values="2" hint="Max 2 selections"

      selectItem
        .addChildTag('q-item-section')
        .addAttribute('side', null)

        .addChildTag('q-checkbox')
        .addAttribute(':value', 'props.selected')
        .addAttribute('@input', 'props.toggleOption(props.opt)')
    }

    // if (icon) {
    //   const templatePrepend = select
    //     .addChildTag('template')
    //     .addAttribute('v-slot:prepend', null)
    //
    //   applyIcon(templatePrepend, icon)
    // }

    const templateAppend = select
      .addChildTag('template')
      .addAttribute('v-slot:append', null)

    if (id && validation) {
      templateAppend
        .addChildTag('q-icon')
        .addAttribute('name', 'far fa-check-circle')
        .addAttribute('size', 'xs')
        .addAttribute(':color', `data.$HAS_VALIDATED ? ($v.data.${id} && $v.data.${id}.$error ? 'negative' : 'positive') : 'grey3'`)

      applyErrorCheck(select, id)
    }

    if (tooltip) applyTooltip({ source: templateAppend, tooltip })
  } else {
    const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label q-ml-sm')
    // applyIcon(labelDiv, icon)
    if (title) labelDiv.addChildTag('span').content(title)
    if (tooltip) applyTooltip({ source: labelDiv, tooltip })

    const field = div.addChildTag('q-field')
    const template = field
      .addChildTag('template')
      .addAttribute('v-slot:control', null)

    const opt = template
      .addChildTag('div')
      .addAttribute('v-for', `(opt, idx) in lists.${id}`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'col-12') // todo: any way to avoid field having row class?

    if (selectionType === 'Checkbox') {
      opt
        .addChildTag('q-checkbox')
        .addAttribute(':val', 'opt.value')
        .addAttribute(':label', 'opt.label')
        .addAttribute('v-if', showWhen('opt.disable'))
        .bindToModel(definition)
    } else if (selectionType === 'Radio') {
      opt
        .addChildTag('q-radio')
        .addAttribute(':val', 'opt.value')
        .addAttribute(':label', 'opt.label')
        .addAttribute('v-if', showWhen('opt.disable'))
        .bindToModel(definition)
    }

    applyErrorCheck(field, id)
  }

  div.addAttribute('class', outerDivClasses.join(' '))

  return builder.compile()
}

// function applyIcon (el, icon) {
//   if (icon) {
//     el
//       .addChildTag('q-icon')
//       .addAttribute('name', icon)
//       .addAttribute('size', 'xs')
//       .addAttribute('color', 'grey3')
//   }
// }
