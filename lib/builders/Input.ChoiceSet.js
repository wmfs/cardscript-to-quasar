const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyTooltip = require('./../utils/apply-tooltip')
const applyComponentId = require('./../utils/apply-component-id')
const { inspect } = require('./../utils/local-util')
const { COLORS } = require('./../utils/color-reference')
const applyRequiredText = require('../utils/apply-required-text')

const showWhen = prop => `${prop} ? parseTemplate(\`{{ \${${prop}} }}\`, { data }) === 'true' : true`

module.exports = function (definition, options) {
  const {
    // inset,
    isMultiSelect,
    style, // compact, expanded
    spacing,
    separator,
    title,
    subtitle,
    tooltip,
    icon,
    hideSelectAllPrompt,
    id,
    validation
  } = definition

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

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')

  applyComponentId(div, id)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle, validation })

  if (isMultiSelect && !hideSelectAllPrompt) {
    div
      .addChildTag('div')
      .content('Select all that apply.')
      .addAttribute('class', 'text-grey')
  }

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  if (selectionType === 'Radio' || selectionType === 'Checkbox') {
    radioOrCheckbox(div, definition, selectionType)
  } else {
    select(div, definition)
  }

  applyRequiredText(div, id, validation)

  return builder.compile()
}

function onChoiceSelection (element, definition) {
  const {
    id,
    onChangeResetDataPaths: resetDataPaths,
    onSelectionEndpoint: endpoint,
    choicesPath = ''
  } = definition

  const dataPath = element.getDataPath() + '.' + id

  element.addAttribute('@update:model-value', `val => action('ChoiceSelection', { val, choicesPath: '${choicesPath}', dataPath: '${dataPath}', endpoint: ${endpoint ? inspect(endpoint) : null}, resetDataPaths: ${Array.isArray(resetDataPaths) && resetDataPaths.length > 0 ? inspect(resetDataPaths) : null} })`)
}

function select (div, definition) {
  const {
    id,
    clearable,
    filter,
    isMultiSelect,
    choicesPath
  } = definition

  const select = div.addChildTag('q-select')

  onChoiceSelection(select, definition)

  select.bindToModel(definition)

  select
    .addAttribute(':emit-value', true)
    .addAttribute(':map-options', true)
    .addAttribute('option-value', 'value')
    .addAttribute(':option-label', choicesPath ? 'opt => opt.title || opt.label' : 'opt => opt.label')
    .addAttribute(':dense', true)

  const pathToOptions = choicesPath || `lists.${id}`
  select.addAttribute(':options', `Array.isArray(${pathToOptions}) ? ${pathToOptions}.filter(filterDisabledOptions) : []`)

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
    .content(choicesPath ? '{{ props.opt.title || props.opt.label }}' : '{{ props.opt.label }}')

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

function radioOrCheckbox (div, definition, selectionType) {
  const {
    id,
    keepSelectedColor,
    choicesPath
  } = definition

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

  const item = optDiv
    .addChildTag('q-item')
    .addAttribute('class', 'q-pl-none')
    .addAttribute('tag', 'label')
    .addAttribute('dense', null)
    .addAttribute('v-if', showWhen('opt.disable'))

  const itemSectionOpt = item
    .addChildTag('q-item-section')
    .addAttribute('class', 'q-pr-none')
    .addAttribute('side', null)
    .addAttribute('top', null)

  const opt = itemSectionOpt
    .addChildTag(optTag)
    .addAttribute(':val', 'opt.value')
    .addAttribute(':color', `opt.color ? ${inspect(COLORS)}[opt.color] || 'standard' : 'standard'`)
    .bindToModel(definition)

  const itemSectionLabel = item
    .addChildTag('q-item-section')

  const itemLabel = itemSectionLabel
    .addChildTag('q-item-label')
    .content(choicesPath ? '{{ opt.title || opt.label }}' : '{{ opt.label }}')

  const tooltipIcon = itemLabel
    .addChildTag('q-icon')
    .addAttribute('v-if', 'typeof opt.tooltip === \'string\'')
    .addAttribute('name', 'info')
    .addAttribute('size', 'sm')
    .addAttribute('class', 'q-ml-sm text-dark')

  applyTooltip({ source: tooltipIcon, tooltip: '{{ opt.tooltip }}', icon: false })

  itemSectionLabel
    .addChildTag('q-item-label')
    .addAttribute('caption', null)
    .addAttribute('class', 'q-my-sm')
    .addAttribute('v-if', choicesPath ? 'Array.isArray(opt.subtitle || opt.sublabel)' : 'Array.isArray(opt.sublabel)')
    .addChildTag('div')
    .addAttribute('v-for', choicesPath ? '(sublabel, idx) in opt.subtitle || opt.sublabel' : '(sublabel, idx) in opt.sublabel')
    .addAttribute(':key', 'idx')
    .content('{{ sublabel }}')

  itemSectionLabel
    .addChildTag('q-item-label')
    .addAttribute('caption', null)
    .addAttribute('class', 'q-my-sm')
    .addAttribute('v-if', choicesPath ? 'typeof opt.subtitle === \'string\' || typeof opt.sublabel === \'string\'' : 'typeof opt.sublabel === \'string\'')
    .content(choicesPath ? '{{ opt.subtitle || opt.sublabel }}' : '{{ opt.sublabel }}')

  // const itemSectionTooltip = item
  //   .addChildTag('q-item-section')
  //   .addAttribute('side', null)
  //
  // const tooltipIcon = itemSectionTooltip
  //   .addChildTag('q-icon')
  //   .addAttribute('name', 'info')
  //   .addAttribute('size', 'sm')
  //   .addAttribute('class', 'text-dark')
  //   .addAttribute('v-if', 'typeof opt.tooltip === \'string\'')
  //
  // applyTooltip({ source: tooltipIcon, tooltip: '{{ opt.tooltip }}', icon: false })

  applyErrorCheck(field, id)
  onChoiceSelection(opt, definition)

  if (keepSelectedColor) {
    opt.addAttribute('keep-color', null)
  }
}
