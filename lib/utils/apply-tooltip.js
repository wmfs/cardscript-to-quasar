module.exports = function ({ source, tooltip }) {
  source
    .addChildTag('q-icon')
    .addAttribute('name', 'info')
    .addAttribute('size', 'md')
    .addAttribute('class', 'q-ml-sm text-primary')
    .addChildTag('q-tooltip')
    .addAttribute('content-style', 'font-size: 16px')
    .addAttribute('max-width', '400px')
    .content(tooltip)
}
