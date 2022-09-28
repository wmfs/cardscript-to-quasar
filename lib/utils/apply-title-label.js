const applyTooltip = require('./apply-tooltip')

module.exports = function ({ source, title, tooltip, icon, subtitle }) {
  if (!icon && !title && !subtitle && !tooltip) {
    return
  }

  const labelDiv = source
    .addChildTag('div')

  const span = labelDiv
    .addChildTag('div')

  let tooltipSource = span

  if (icon) {
    tooltipSource = span
      .addChildTag('q-icon')
      .addAttribute('name', icon)
      .addAttribute('size', '28px')
      .addAttribute('class', 'q-mr-sm')
  }

  if (title) {
    tooltipSource = span
      .addChildTag('span')
      .addAttribute('class', 'form-label')
      .content(title)
  }

  if (subtitle) {
    const subtitleDivClasses = ['form-sublabel']
    const subtitleDiv = labelDiv
      .addChildTag('div')
      .content(subtitle)

    if (title) {
      subtitleDivClasses.push('q-mt-sm')
    }

    subtitleDiv
      .addAttribute('class', subtitleDivClasses.join(' '))
  }

  if (tooltip) {
    applyTooltip({ source: tooltipSource, tooltip })
  }
}
