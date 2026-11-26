// Input.Address: the address picker.
// Renders the <tymly-address-picker> Vue component from @wmfs/tymly-address-picker
// which searches the gazetteer, shows results, the chosen address and manual entry.
// See ./../utils/address-picker-config.js for the settings and the data it writes.

const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyComponentId = require('./../utils/apply-component-id')
const addressPickerConfig = require('./../utils/address-picker-config')

module.exports = function (definition, options) {
  const { id, spacing, separator } = definition

  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')
  applyComponentId(div, id)

  const dataPath = div.getDataPath()
  const config = addressPickerConfig(definition)

  div
    .addChildTag('tymly-address-picker')
    .addAttribute(':config', toAttribute(config))
    .addAttribute(':model', dataPath)
    .addAttribute(':validation', 'v$.data')
    .addAttribute(':invalid-fields', 'invalidFields')
    .addAttribute('@update', `patch => Object.assign(${dataPath}, patch)`)

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}

// JSON is valid JavaScript; escape it so it can sit inside a double-quoted attribute.
function toAttribute (obj) {
  return JSON.stringify(obj)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}
