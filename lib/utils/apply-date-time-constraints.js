module.exports = function (element, min, max, dataPath) {
  if (min === undefined && max === undefined) {
    return
  }

  let config = ''

  const params = element.name === 'q-date' ? 'date' : 'hr, min, sec'

  if (min && max) {
    config = `{ ${params}, min: '${min}', max: '${max}'`
  } else if (min) {
    config = `{ ${params}, min: '${min}'`
  } else if (max) {
    config = `{ ${params}, max: '${max}'`
  }

  if (dataPath) {
    config += `, dataPath: '${dataPath}'`
  }

  config += `, elementType: '${element.name}' }`

  element.addAttribute(':options', `(${params}) => filterDateTimeOptions(${config})`)
}