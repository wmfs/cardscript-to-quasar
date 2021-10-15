const ComponentBuilder = require('./../utils/Component-builder')
// const applyErrorCheck = require('./../utils/apply-error-check')
// const applyTooltip = require('./../utils/apply-tooltip')

module.exports = function DateField (definition, elementOptions, additionalOptions) {
  const {
    id
    // tooltip,
    // validation,
    // max,
    // min = '1900/01/01',
  } = definition

  const builder = new ComponentBuilder(definition)

  const row = builder
    .addTag('div')
    .addAttribute('class', 'row')

  const dataPath = `${row.getDataPath()}.${id}`

  for (const key of ['date', 'month', 'year']) {
    const label = { date: 'Day', month: 'Month', year: 'Year' }[key]

    row
      .addChildTag('q-input')
      .addAttribute('label', label)
      .addAttribute('filled', null)
      .addAttribute('stack-label', null)
      .addAttribute('no-error-icon', null)
      .addAttribute('type', 'number')
      .addAttribute('debounce', '500')
      .addAttribute(':value', `${dataPath}_$DATE.${key}`)
      .addAttribute('@input', `val => action('UpdateGDSDate', { dataPath: '${dataPath}', value: val, key: '${key}' })`)
  }

  return builder.compile()
}
