const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
// const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    spacing,
    separator,
    title,
    isMultiUpload,
    onUploadEndpoint,
    additionalFields,
    accept,
    autoUpload
  } = definition

  // todo: attributes:
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

  uploader.addAttribute('label', 'Upload')
  uploader.addAttribute('style', 'max-width: 100%;')
  
  uploader.addAttribute(':auto-upload', autoUpload)
  uploader.addAttribute(':hide-upload-btn', autoUpload)

  uploader.addAttribute(':url', 'fileUploadUrl')
  uploader.addAttribute(':headers', 'fileUploadHeaders')
  uploader.addAttribute('@uploaded', 'info => action(\'FileUpload\', info)')

  const endpoint = onUploadEndpoint ? onUploadEndpoint.name : null

  uploader.addAttribute(':form-fields', formFields(id, endpoint, additionalFields))

  if (isMultiUpload) uploader.addAttribute(':multiple', true)
  if (accept) uploader.addAttribute('accept', accept.join(', '))

  applySpacing({ spacing, source: div })
  applySeparator({ separator, source: div })

  return builder.compile()
}

function formFields (id = '', endpoint = '', additionalFields = {}) {
  let e = `[{name:'id',value:'${id}'},{name:'endpoint',value:'${endpoint}'}`

  for (const [name, value] of Object.entries(additionalFields)) {
    if (e[e.length - 1] !== ',') e += ','

    const val = typeof value === 'string' ? `\`${value}\`` : value
    e += `{name:'${name}',value:${val}}`
  }

  e += ']'

  return e

  // const formFields = [
  //   { name: 'id', value: id },
  //   { name: 'endpoint', value: endpoint }
  // ]
  // Object.entries(additionalFields).forEach(([name, value]) => {
  //   formFields.push({ name, value })
  // })
  // return inspect(formFields)
}
