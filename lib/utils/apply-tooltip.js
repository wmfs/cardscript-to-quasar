module.exports = function ({ source, tooltip, icon = true }) {
  let applyTooltipTo = source

  if (icon) {
    applyTooltipTo = source
      .addChildTag('q-icon')
      .addAttribute('name', 'info')
      .addAttribute('size', 'sm')
      .addAttribute('class', 'q-ml-sm text-dark')
  }

  applyTooltipTo
    .addChildTag('q-tooltip')
    .addAttribute('class', 'bg-white text-dark shadow-4')
    .addAttribute('style', 'font-size: 16px; white-space: pre-wrap;')
    .addAttribute('max-width', '400px')
    .content(tooltip)
}
