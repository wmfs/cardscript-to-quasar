const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyTooltip = require('./../utils/apply-tooltip')
const { inspect } = require('./../utils/local-util')
const { COLORS } = require('./../utils/color-reference')

const showWhen = prop => `${prop} ? parseTemplate(\`{{ \${${prop}} }}\`, { data }) === 'true' : true`

module.exports = function (definition, options) {
  definition.choicesPath = definition.choicesPath
    ? `${definition.choicesPath}.map(r => { return { label: r.title, value: r.value, sublabel: r.subtitle } })`
    : ''

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
    hideSelectAllPrompt
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

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

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

  return builder.compile()
}

function onChoiceSelection (element, definition) {
  const {
    id,
    onChangeResetDataPaths: resetDataPaths,
    onSelectionEndpoint: endpoint
  } = definition

  const dataPath = element.getDataPath() + '.' + id

  element.addAttribute('@update:model-value', `val => action('ChoiceSelection', { val, dataPath: '${dataPath}', endpoint: ${endpoint ? inspect(endpoint) : null}, resetDataPaths: ${Array.isArray(resetDataPaths) && resetDataPaths.length > 0 ? inspect(resetDataPaths) : null} })`)
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
    .content('{{ opt.label }}')

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
    .addAttribute('v-if', 'Array.isArray(opt.sublabel)')
    .addChildTag('div')
    .addAttribute('v-for', '(sublabel, idx) in opt.sublabel')
    .addAttribute(':key', 'idx')
    .content('{{ sublabel }}')

  itemSectionLabel
    .addChildTag('q-item-label')
    .addAttribute('caption', null)
    .addAttribute('class', 'q-my-sm')
    .addAttribute('v-if', 'typeof opt.sublabel === \'string\'')
    .content('{{ opt.sublabel }}')

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
