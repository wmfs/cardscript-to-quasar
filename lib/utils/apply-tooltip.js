module.exports = function ({ source, tooltip, icon = true }) {
  let applyTooltipTo = source

  if (icon) {
    applyTooltipTo = source
      .addChildTag('q-icon')
      .addAttribute('name', 'info')
      .addAttribute('size', 'sm')
      .addAttribute('class', 'q-ml-sm cursor-pointer')
  }

  let tooltipText = ''
  let persistent = false

  if (typeof tooltip === 'string') {
    tooltipText = tooltip
  } else if (typeof tooltip === 'object') {
    tooltipText = tooltip.text
    persistent = tooltip.persistent === true
  }

  if (persistent) {
    applyTooltipTo
      .addChildTag('q-popup-proxy')
      .addAttribute('breakpoint', 4320)
      .addChildTag('div')
      .addAttribute('class', 'bg-white text-dark shadow-4 q-pa-sm')
      .addAttribute('style', 'font-size: 16px; white-space: pre-wrap;')
      .addAttribute('max-width', '400px')
      .content(tooltipText)
  } else {
    applyTooltipTo
      .addChildTag('q-tooltip')
      .addAttribute('v-if', '$q.platform.is.desktop')
      .addAttribute('class', 'bg-white text-dark shadow-4')
      .addAttribute('style', 'font-size: 16px; white-space: pre-wrap;')
      .addAttribute('max-width', '400px')
      .content(tooltipText)

    applyTooltipTo
      .addChildTag('q-popup-proxy')
      .addAttribute('v-if', '$q.platform.is.mobile')
      .addChildTag('div')
      .addAttribute('class', 'bg-white text-dark shadow-4 q-pa-sm')
      .addAttribute('style', 'font-size: 16px; white-space: pre-wrap;')
      .addAttribute('max-width', '400px')
      .content(tooltipText)
  }
}
