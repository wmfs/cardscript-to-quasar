module.exports = function (element, min, max) {
  const d = new Date().getDate()
  const m = new Date().getMonth() + 1
  const y = new Date().getFullYear()
  const TODAY = `${y}/${m <= 9 ? '0' + m : m}/${d <= 9 ? '0' + d : d}`

  if (min && max) {
    element.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}' && date <= '${max === '$TODAY' ? TODAY : max}'`)
  } else if (min) {
    element.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}'`)
  } else if (max) {
    element.addAttribute(':options', `date => date <= '${max === '$TODAY' ? TODAY : max}'`)
  }
}
