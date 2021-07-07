function stringTemplateParser (label) {
  if (label === null || label === undefined || typeof label !== 'string') return ''

  let result = ''
  let formattedLabel = ''
  let insideJs = false

  if (label.startsWith('{{')) {
    insideJs = true
    formattedLabel = label.substring(2)
  } else {
    result += '\''
    formattedLabel = label
  }

  for (let i = 0; i < formattedLabel.length; i++) {
    const char = formattedLabel[i]
    const nextChar = formattedLabel[i + 1]

    if (char === '{' && nextChar === '{' && !insideJs) {
      insideJs = true
      result += '\' + '
      i++
    } else if (char === '}' && nextChar === '}' && insideJs) {
      insideJs = false
      result += ' + \''
      i++
    } else {
      result += char
    }
  }

  if (!formattedLabel.endsWith('}}')) result += '\''

  if (result.endsWith(' + \'')) result = result.slice(0, result.length - 4)

  return result.trim()
}

module.exports = stringTemplateParser
