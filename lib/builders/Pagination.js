const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')
const { COLORS } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const {
    page,
    totalPages,
    min = 1,
    maxPages = 4,
    endpoint,
    color
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  div
    .addChildTag('q-pagination')
    .addAttribute('class', 'flex-center')
    .addAttribute('v-model', page)
    .addAttribute(':min', min)
    .addAttribute(':max', totalPages)
    .addAttribute(':max-pages', maxPages)
    // .addAttribute(':disable', `${dataPath}.${id}.loading`)
    .addAttribute('color', color && COLORS[color] ? COLORS[color] : 'primary')
    .addAttribute('direction-links', null)
    .addAttribute('boundary-numbers', null)
    .addAttribute('ellipses', null)
    .addAttribute('@update:model-value', `action('Pagination', ${inspect(endpoint)})`)

  return builder.compile()
}
