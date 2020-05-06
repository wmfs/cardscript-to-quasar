const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    spacing,
    separator,
    title,
    isMultiUpload,
    onUploadEndpoint
  } = definition

  // todo: attributes:
  // accept
  // max-file-size
  // max-total-size
  // no-thumbnails

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  if (title) {
    div
      .addChildTag('div')
      .addAttribute('class', 'form-label q-mb-md')
      .content(title)
  }

  const uploader = div.addChildTag('q-uploader')

  uploader.addAttribute(':auto-upload', false)
  uploader.addAttribute(':hide-upload-btn', false)

  uploader.addAttribute(':url', 'fileUploadGetUrl')
  uploader.addAttribute(':headers', 'fileUploadGetHeaders')

  const endpoint = onUploadEndpoint ? onUploadEndpoint.name : null

  const formFields = [
    { name: 'id', value: id },
    { name: 'endpoint', value: endpoint }
  ]

  uploader.addAttribute(':form-fields', inspect(formFields))

  if (isMultiUpload) uploader.addAttribute(':multiple', true)

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}
