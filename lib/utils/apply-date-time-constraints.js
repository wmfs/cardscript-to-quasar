module.exports = function (element, min, max) {
  let config = null

  if (min && max) {
    config = `{ date, min: '${min}', max: '${max}' }`
  } else if (min) {
    config = `{ date, min: '${min}' }`
  } else if (max) {
    config = `{ date, max: '${max}' }`
  }

  if (config === null) {
    return
  }

  element.addAttribute(':options', `date => filterDateTimeOptions(${config})`)
}
