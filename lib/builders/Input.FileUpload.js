const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
// const { inspect } = require('./../utils/local-util')

module.exports = function (definition, options) {
  const {
    id,
    spacing,
    separator,
    title,
    subtitle,
    isMultiUpload,
    onUploadEndpoint,
    additionalFields,
    accept,
    autoUpload,
    icon,
    tooltip
  } = definition

  // todo: attributes:
  // max-file-size
  // max-total-size
  // max-files
  // no-thumbnails

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const endpoint = onUploadEndpoint ? onUploadEndpoint.name : null

  const uploader = div.addChildTag('q-uploader')

  const classes = ['q-ml-sm']

  uploader
    .addAttribute('label', 'Choose a file')
    .addAttribute('style', 'max-width: 100%;')
    .addAttribute(':auto-upload', autoUpload)
    .addAttribute(':hide-upload-btn', autoUpload)
    .addAttribute(':url', 'fileUploadUrl')
    .addAttribute(':headers', 'fileUploadHeaders')
    .addAttribute('@uploading', 'info => action(\'FileUploading\', info)')
    .addAttribute('@uploaded', 'info => action(\'FileUploaded\', info)')
    .addAttribute(':form-fields', formFields(id, endpoint, additionalFields))

  if (title) {
    classes.push('q-mt-sm')
  }

  uploader.addAttribute('class', classes.join(' '))

  if (isMultiUpload) {
    uploader.addAttribute(':multiple', true)
  }

  if (Array.isArray(accept)) {
    uploader.addAttribute('accept', accept.join(', '))
  }

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
