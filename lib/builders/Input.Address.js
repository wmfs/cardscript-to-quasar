const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const { id } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const searchFld = div.addChildTag('q-input')
  searchFld.addAttribute('float-label', 'Enter the Address')
  searchFld.bindToModel({ id: `${id}SearchFld` })

  const searchBtn = div.addChildTag('q-btn')
  searchBtn.addAttribute('class', 'q-mt-md')
  searchBtn.addAttribute('label', 'Find Address')
  searchBtn.addAttribute('color', 'primary')
  searchBtn.addAttribute('no-caps', null)
  searchBtn.addAttribute('unelevated', null)
  searchBtn.addAttribute('@click', `action('InputAddress', ${inspect({ dataPath: `${div.getDataPath()}`, id })})`)

  const selectFldDataPath = `${div.getDataPath()}.${id}SearchResults`

  const selectFld = div.addChildTag('q-select')
  selectFld.bindToModel(definition)
  selectFld.addAttribute('class', 'q-mt-lg')
  selectFld.addAttribute('float-label', 'Select an address')
  selectFld.addAttribute(':options', selectFldDataPath)
  selectFld.addAttribute('v-if', `${selectFldDataPath}.length > 0`)

  const cannotFindBtn = div.addChildTag('q-btn')
  cannotFindBtn.addAttribute('class', 'q-mt-md')
  cannotFindBtn.addAttribute('label', 'I can\'t find my address')
  cannotFindBtn.addAttribute(':outline', true)
  cannotFindBtn.addAttribute('color', 'primary')
  cannotFindBtn.addAttribute('no-caps', null)
  cannotFindBtn.addAttribute('unelevated', null)
  cannotFindBtn.addAttribute('v-if', `${selectFldDataPath}.length > 0`)

  // Address entering block...

  return builder.compile()
}
