module.exports = function (element, min, max, dataPath) {
  let config = null

  const params = element.name === 'q-time'
    ? ['hr', 'min', 'sec']
    : ['date']

  if (min && max) {
    config = `{ ${params.join(', ')}, minimum: '${min}', maximum: '${max}', dataPath: '${dataPath}' }`
  } else if (min) {
    config = `{ ${params.join(', ')}, minimum: '${min}', dataPath: '${dataPath}' }`
  } else if (max) {
    config = `{ ${params.join(', ')}, maximum: '${max}', dataPath: '${dataPath}' }`
  }

  if (config === null) {
    return
  }

  const fnName = element.name === 'q-time'
    ? 'filterTimeOptions'
    : 'filterDateOptions'

  element.addAttribute(':options', `(${params.join(', ')}) => ${fnName}(${config})`)
}
