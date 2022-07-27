// A helper function for things like Input.Text, Input.Name, Input.Email
const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')

// TODO: isMultiline, maxLength, title, style (text, tel, url, email) need support?
module.exports = function TextField (definition, elementOptions, additionalOptions) {
  const {
    id,
    placeholder,
    spacing,
    separator,
    editor,
    tooltip,
    mask,
    fillMask
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const icon = definition.icon || additionalOptions.icon
  const label = definition.title || additionalOptions.title // || placeholder // TODO: Needs to be better, placeholder as well.
  // const type = definition.type || additionalOptions.type

  applyTitleLabel({ source: div, title: label, icon, tooltip })

  let input
  if (editor) {
    input = div.addChildTag('q-editor') // TODO: has this changed?
  } else {
    input = div.addChildTag('q-input')

    if (mask) {
      input.addAttribute('mask', mask)

      if (fillMask === 'true' || fillMask === true) {
        input.addAttribute(':fill-mask', true)
      } else if (fillMask) {
        input.addAttribute('fill-mask', fillMask)
      }
    }
  }

  if (placeholder) input.addAttribute('placeholder', placeholder)

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
