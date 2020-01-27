module.exports = function ({ separator, source, styles = [] }) {
  if (separator) {
    styles.push('border-top: 1px solid rgb(238, 238, 238)', 'margin-top: 8px', 'padding-top: 8px')

    if (source && styles.length > 0) {
      source.addAttribute('style', styles.join('; '))
    }
  }
}
