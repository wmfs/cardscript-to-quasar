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
    .addAttribute('v-if', '$q.platform.is.desktop')
    .addAttribute('class', 'bg-white text-dark shadow-4')
    .addAttribute('style', 'font-size: 16px; white-space: pre-wrap;')
    .addAttribute('max-width', '400px')
    .content(tooltip)

  applyTooltipTo
    .addChildTag('q-popup-proxy')
    .addAttribute('v-if', '$q.platform.is.mobile')
    .addAttribute('class', 'bg-white text-dark shadow-4 q-pa-sm')
    .addAttribute('style', 'font-size: 16px; white-space: pre-wrap;')
    .addAttribute('max-width', '400px')
    .content(tooltip)
}
