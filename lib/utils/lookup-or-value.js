module.exports = function lookupOrValue (title, value, choices) {
  if (Array.isArray(choices) === true) {
    const data = value.replace('{{', '').replace('}}', '')

    const arrVal = `${data}.map(d => lists.$simpleTitleMaps['${title}'][d] || d || '-').join(', ')`
    const strVal = `lists.$simpleTitleMaps['${title}'][${data}] || ${data}`
    const defaultVal = '-'

    return `{{ ( Array.isArray(${data}) ? ${arrVal} : (${strVal}) ) || '${defaultVal}' }}`
  } else {
    return value
  }
}
