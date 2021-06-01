// A helper function for things like Input.Text, Input.Name, Input.Email
const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
// const applySpacing = require('./../utils/apply-spacing')
// const applySeparator = require('./../utils/apply-separator')
const applyTooltip = require('./../utils/apply-tooltip')

// TODO: isMultiline, maxLength, title, style (text, tel, url, email) need support?
module.exports = function TextField (definition, elementOptions, additionalOptions) {
  const {
    id,
    placeholder,
    // spacing,
    // separator,
    editor,
    tooltip,
    validation
  } = definition

  const builder = new ComponentBuilder(definition)

  const label = definition.title || additionalOptions.title || placeholder
  const icon = definition.icon || additionalOptions.icon

  const div = builder.addTag('div')
  const outerDivClasses = ['q-my-sm']

  let input

  if (editor) {
    const innerDiv = div
      .addChildTag('div')
      .addAttribute('class', 'text-weight-bold q-mb-md')

    if (icon) {
      innerDiv
        .addChildTag('q-icon')
        .addAttribute('name', 'far fa-check-circle')
        .addAttribute('size', 'xs')
        .addAttribute('color', 'grey3')
        .addAttribute('class', 'q-mx-sm')
    }

    if (label) innerDiv.content(label)

    input = div.addChildTag('q-editor')
  } else {
    outerDivClasses.push('text-field')

    input = div
      .addChildTag('q-input')
      .addAttribute('stack-label', null)
      .addAttribute('filled', null)
      .addAttribute('no-error-icon', null)

    if (label) input.addAttribute('label', label)
    if (placeholder) input.addAttribute(placeholder)

    if (icon) {
      const templatePrepend = input
        .addChildTag('template')
        .addAttribute('v-slot:prepend', null)

      templatePrepend
        .addChildTag('q-icon')
        .addAttribute('name', 'far fa-check-circle')
        .addAttribute('size', 'xs')
        .addAttribute('color', 'grey3')
    }

    const templateAppend = input
      .addChildTag('template')
      .addAttribute('v-slot:append', null)

    if (id && validation) {
      templateAppend
        .addChildTag('q-icon')
        .addAttribute('name', 'far fa-check-circle')
        .addAttribute('size', 'xs')
        .addAttribute(':color', `data.$HAS_VALIDATED ? ($v.data.${id} && $v.data.${id}.$error ? 'negative' : 'positive') : 'grey3'`)
    }

    if (tooltip) {
      applyTooltip({ source: templateAppend, tooltip })
    }

    if (definition.isMultiline || additionalOptions.isMultiline) {
      input.addAttribute('type', 'textarea')
    }

    if (definition.connectionType === 'mobile' || definition.connectionType === 'landline') {
      input.addAttribute('type', 'number')
      input.addAttribute('min', 0)
    }
  }

  input.bindToModel(definition)

  applyErrorCheck(input, id)

  div.addAttribute('class', outerDivClasses.join(' '))

  return builder.compile()
}
