const apiLookupTracker = require('./../utils/api-lookup-tracker')
const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    id,
    showWhen,
    spacing,
    validation
  } = definition

  apiLookupTracker.addApiLookup(id)

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })
  const div = builder.addTag('div', { includeClosingTag: false })
  // div.addAttribute('style', 'border: 1px solid #e0e0e0;')
  if (validation) {
    div.addAttribute(':style', `$v.data.${id} && $v.data.${id}.$error ? 'border: 1px solid #db2828;' : 'border: 1px solid #e0e0e0;'`)
  } else {
    div.addAttribute('style', 'border: 1px solid #e0e0e0;')
  }

  const classes = ['q-pa-md']
  if (spacing && MARGINS[spacing]) classes.push(`q-mt-${MARGINS[spacing]}`)
  div.addAttribute('class', classes.join(' '))

  if (showWhen) div.addAttribute('v-if', `${showWhen}`)

  return builder.compile()
}
