const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')
const ComponentBuilder = require('./../utils/Component-builder')
const applyBadge = require('./../utils/apply-badge')

module.exports = function (definition, options, idx) {
  const {
    StepperId
  } = options

  const {
    title,
    icon
    // showWhen
  } = definition

  const builder = new ComponentBuilder(definition)

  const step = builder.addTag('q-step', { includeClosingTag: false })

  const parentStepperId = [step.getDataPath(), StepperId].join('.')

  step.addAttribute(':name', idx)
  step.addAttribute(':done', `${parentStepperId} > ${idx}`)

  if (title) step.addAttribute('title', title)
  if (icon) step.addAttribute('icon', icon)

  // If we add `showWhen` then we'll need to do something special
  // when clicking next/previous buttons to skip over hidden steps

  return builder.compile()
}
