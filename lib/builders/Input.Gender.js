const ComponentBuilder = require('./../utils/Component-builder')
const applyComponentId = require('./../utils/apply-component-id')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    term,
    preferNotToSay,
    preferToSelfDescribe,
    includeTransgender
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder
    .addTag('div')
    .content(term === 'sex' ? 'Sex' : 'Gender')
    .addAttribute('class', 'form-label')

  applyComponentId(div, id)

  const optionGroup = builder.addTag('q-option-group')
  optionGroup.bindToModel(definition)

  const opts = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
  ]

  if (preferNotToSay) opts.push({ label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' })
  if (preferToSelfDescribe) opts.push({ label: 'Prefer not to self describe', value: 'PREFER_NOT_TO_SELF_DESCRIBE' })
  if (includeTransgender) opts.push({ label: 'Transgender', value: 'TRANSGENDER' })

  optionGroup.addAttribute(':options', inspect(opts))

  return builder.compile()
}
