module.exports = function ({ source, tooltip, icon = true }) {
  let parent = source

  if (icon) {
    parent = source
      .addChildTag('q-icon')
      .addAttribute('name', 'info')
      .addAttribute('size', 'sm')
      .addAttribute('class', 'q-ml-sm text-grey3')
  }

  parent
    .addChildTag('q-tooltip')
    .addAttribute('content-class', 'bg-white text-dark shadow-4')
    .addAttribute('content-style', 'font-size: 16px; white-space: pre-wrap;')
    .addAttribute('max-width', '400px')
    .content(tooltip)
}
