const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTooltip = require('./../utils/apply-tooltip')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    // inset,
    isMultiSelect,
    style, // compact, expanded
    spacing,
    separator,
    title,
    tooltip,
    icon,
    clearable,
    filter,
    onChangeResetDataPaths
  } = definition

  const choicesPath = definition.choicesPath
    ? `${definition.choicesPath}.map(r => { return { label: r.title, value: r.value } })`
    : ''

  let selectionType

  if (isMultiSelect) {
    if (style === 'compact') selectionType = 'Select'
    else selectionType = 'Checkbox'
  } else {
    if (style === 'expanded') selectionType = 'Radio'
    else selectionType = 'Select'
  }

  const showWhen = prop => `${prop} ? parseTemplate(\`{{ \${${prop}} }}\`, { data }) === 'true' : true`

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px').addAttribute('class', 'q-ml-sm')
  if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')
  if (tooltip) applyTooltip({ source: labelDiv, tooltip })

  if (isMultiSelect) {
    div
      .addChildTag('div')
      .content('Select all that apply.')
      .addAttribute('class', 'q-ml-sm text-grey')
  }

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  if (selectionType === 'Radio' || selectionType === 'Checkbox') {
    const field = div.addChildTag('q-field')
    const template = field
      .addChildTag('template')
      .addAttribute('v-slot:control', null)

    const opt = template
      .addChildTag('div')
      .addAttribute('v-for', `(opt, idx) in ${choicesPath || `lists.${id}`}`)
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
  } else {
    // SELECT
    const select = div.addChildTag('q-select')

    if (onChangeResetDataPaths) {
      // todo: can't pass in objects as values, could try JSON.stringify and escape quotes
      select.addAttribute('@update:model-value', `action('ResetDataPaths', ${inspect({ dataPaths: onChangeResetDataPaths })})`)
    }

    select.bindToModel(definition)

    select
      .addAttribute(':emit-value', true)
      .addAttribute(':map-options', true)
      .addAttribute(':dense', true)

    if (choicesPath) {
      select.addAttribute(':options', choicesPath)
    } else {
      select.addAttribute(':options', `lists.${id}`)
    }

    if (clearable) {
      select.addAttribute('clearable', null)
    }

    if (filter) {
      select
        .addAttribute('@filter', `(value, update) => action('FilterChoiceSetFn', { id: '${id}', choicesPath: '${definition.choicesPath || ''}', value, update })`)
        .addAttribute('use-input', null)
    }

    const selectTemplate = select
      .addChildTag('template')
      .addAttribute('v-slot:option', 'props')

    const selectItem = selectTemplate
      .addChildTag('q-item')
      .addAttribute('@click', 'props.itemProps.onClick')
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
      select.addAttribute('multiple', null)
      select.addAttribute('counter', null)
      // todo: selectionMax -> max-values="2" hint="Max 2 selections"

      selectItem
        .addChildTag('q-item-section')
        .addAttribute('side', null)

        .addChildTag('q-checkbox')
        .addAttribute(':model-value', 'props.selected')
        .addAttribute('@update:model-value', 'props.toggleOption(props.opt)')
    }

    applyErrorCheck(select, id)
  }

  return builder.compile()
}
