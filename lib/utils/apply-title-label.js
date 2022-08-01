const applyTooltip = require('./apply-tooltip')

module.exports = function ({ source, title, tooltip, icon }) {
  const labelDiv = source
    .addChildTag('div')
    .addAttribute('class', 'form-label')

  const span = labelDiv
    .addChildTag('span')
    .addAttribute('style', 'display: block;')

  let tooltipSource = span

  if (icon) {
    tooltipSource = span
      .addChildTag('q-icon')
      .addAttribute('name', icon)
      .addAttribute('size', '28px')
  }

  if (title) {
    tooltipSource = span
      .addChildTag('span')
      .addAttribute('class', 'q-ml-sm')
      .content(title)
  }

  if (tooltip) {
    applyTooltip({ source: tooltipSource, tooltip })
  }
}
