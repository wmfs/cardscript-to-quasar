const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyTooltip = require('./../utils/apply-tooltip')
const { inspect } = require('./../utils/local-util')
const { COLORS } = require('./../utils/color-reference')

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
    onChangeResetDataPaths,
    keepSelectedColor
  } = definition

  const choicesPath = definition.choicesPath
    ? `${definition.choicesPath}.map(r => { return { label: r.title, value: r.value } })`
    : ''

  let selectionType

  if (isMultiSelect) {
    if (style === 'compact') {
      selectionType = 'Select'
    } else {
      selectionType = 'Checkbox'
    }
  } else {
    if (style === 'expanded') {
      selectionType = 'Radio'
    } else {
      selectionType = 'Select'
    }
  }

  const showWhen = prop => `${prop} ? parseTemplate(\`{{ \${${prop}} }}\`, { data }) === 'true' : true`

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  applyTitleLabel({ source: div, title, icon, tooltip })
  // const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  // if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px').addAttribute('class', 'q-ml-sm')
  // if (title) labelDiv.addChildTag('span').content(title).addAttribute('class', 'q-ml-sm')
  // if (tooltip) applyTooltip({ source: labelDiv, tooltip })

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

    const optDiv = template
      .addChildTag('div')
      .addAttribute('v-for', `(opt, idx) in ${choicesPath || `lists.${id}`}`)
      .addAttribute(':key', 'idx')
      .addAttribute('class', 'col-12') // todo: any way to avoid field having row class?

    const optTag = selectionType === 'Checkbox' ? 'q-checkbox' : 'q-radio'
    const opt = optDiv.addChildTag(optTag)

    opt
      .addAttribute(':val', 'opt.value')
      .addAttribute(':label', 'opt.label')
      .addAttribute(':color', `opt.color ? ${inspect(COLORS)}[opt.color] || 'standard' : 'standard'`)
      .addAttribute('v-if', showWhen('opt.disable'))
      .bindToModel(definition)

    _onChangeResetDataPaths(opt, onChangeResetDataPaths)

    if (keepSelectedColor) {
      opt.addAttribute('keep-color', null)
    }

    const tooltipIcon = opt
      .addChildTag('q-icon')
      .addAttribute('name', 'info')
      .addAttribute('size', 'sm')
      .addAttribute('class', 'q-ml-sm text-dark')
      .addAttribute('v-if', 'typeof opt.tooltip === \'string\'')

    applyTooltip({ source: tooltipIcon, tooltip: '{{ opt.tooltip }}', icon: false })

    applyErrorCheck(field, id)
  } else {
    // SELECT
    const select = div.addChildTag('q-select')

    _onChangeResetDataPaths(select, onChangeResetDataPaths)

    select.bindToModel(definition)

    select
      .addAttribute(':emit-value', true)
      .addAttribute(':map-options', true)
      .addAttribute(':dense', true)

    const pathToOptions = choicesPath || `lists.${id}`
    select.addAttribute(':options', pathToOptions + '.filter(filterDisabledOptions)')

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
      // .addAttribute('v-if', showWhen('props.opt.disable'))
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

function _onChangeResetDataPaths (element, dataPaths) {
  if (Array.isArray(dataPaths) && dataPaths.length > 0) {
    // todo: can't pass in objects as values, could try JSON.stringify and escape quotes
    element.addAttribute('@update:model-value', `action('ResetDataPaths', ${inspect({ dataPaths: dataPaths })})`)
  }
}
