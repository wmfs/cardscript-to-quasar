const applyTooltip = require('./apply-tooltip')

module.exports = function ({ source, title, tooltip, icon }) {
  const labelDiv = source
    .addChildTag('div')
    .addAttribute('class', 'form-label')

  let tooltipSource = labelDiv

  if (icon) {
    tooltipSource = labelDiv
      .addChildTag('q-icon')
      .addAttribute('name', icon)
      .addAttribute('size', '28px')
  }

  if (title) {
    tooltipSource = labelDiv
      .addChildTag('span')
      .addAttribute('class', 'q-ml-sm')
      .content(title)
  }

  if (tooltip) {
    applyTooltip({ source: tooltipSource, tooltip })
  }
}
