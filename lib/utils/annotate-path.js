// Adds data-cs-path="..." to the first real tag of an element's compiled markup, so tools such as the
// cardscript designer can map rendered DOM back to the element in the card JSON. Only used when the
// element carries a __csPath property (the designer adds it to its preview copy); normal cards are unchanged.
const ATTR = 'data-cs-path'

module.exports = function annotatePath (markup, csPath) {
  if (typeof markup !== 'string' || csPath === undefined || csPath === null) return markup
  const value = String(csPath).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  // Skip <template ...> wrappers (showWhen, v-for); annotate the first rendered tag.
  const re = /<([a-zA-Z][\w.-]*)(?=[\s/>])/g
  let m
  while ((m = re.exec(markup)) !== null) {
    if (m[1].toLowerCase() === 'template') continue
    const at = m.index + m[0].length
    return `${markup.slice(0, at)} ${ATTR}="${value}"${markup.slice(at)}`
  }
  return markup
}
