module.exports = function (element, min, max, dataPath) {
  let config = null

  if (min && max) {
    config = `{ date, min: '${min}', max: '${max}'`
  } else if (min) {
    config = `{ date, min: '${min}'`
  } else if (max) {
    config = `{ date, max: '${max}'`
  }

  if (config === null) {
    return
  }

  if (dataPath) {
    config += `, dataPath: '${dataPath}'`
  }

  config += `, elementType: '${element.name}' }`

  element.addAttribute(':options', `date => filterDateTimeOptions(${config})`)
}
