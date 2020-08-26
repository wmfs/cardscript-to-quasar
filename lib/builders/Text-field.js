// A helper function for things like Input.Text, Input.Name, Input.Email
const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

// TODO: isMultiline, maxLength, title, style (text, tel, url, email) need support?
module.exports = function TextField (definition, elementOptions, additionalOptions) {
  const {
    id,
    placeholder,
    spacing,
    separator,
    editor,
    tooltip
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const icon = definition.icon || additionalOptions.icon
  const label = definition.title || additionalOptions.title || placeholder // TODO: Needs to be better, placeholder as well.
  // const type = definition.type || additionalOptions.type

  const labelDiv = div.addChildTag('div').addAttribute('class', 'form-label')
  if (icon) labelDiv.addChildTag('q-icon').addAttribute('name', icon).addAttribute('size', '28px')
  if (label) labelDiv.addChildTag('span').content(label).addAttribute('class', 'q-ml-sm')
  if (tooltip) {
    labelDiv
      .addChildTag('q-icon')
      .addAttribute('name', 'info')
      .addAttribute('size', 'md')
      .addAttribute('class', 'q-ml-sm text-primary')
      .addChildTag('q-tooltip')
      .addAttribute('content-style', 'font-size: 16px')
      .content(tooltip)
  }

  let input
  if (editor) {
    input = div.addChildTag('q-editor') // TODO: has this changed?
  } else {
    input = div.addChildTag('q-input')
  }

  input.bindToModel(definition)
  input.addAttribute(':dense', true)

  if (definition.isMultiline || additionalOptions.isMultiline) {
    input.addAttribute('type', 'textarea')
  }

  if (definition.connectionType === 'mobile' || definition.connectionType === 'landline') {
    input.addAttribute('type', 'number')
    input.addAttribute('min', 0)
  }

  applyErrorCheck(input, id)
  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
