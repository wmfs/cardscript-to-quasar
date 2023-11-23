const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyComponentId = require('./../utils/apply-component-id')
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
    tooltip,
    maxFileSizeBytes,
    maxTotalSize,
    maxFiles
  } = definition

  // todo: attributes:
  // no-thumbnails

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  applyComponentId(div, id)

  applyTitleLabel({ source: div, title, icon, tooltip, subtitle })

  const endpoint = onUploadEndpoint ? onUploadEndpoint.name : null

  const uploader = div.addChildTag('q-uploader')

  const classes = []

  let label = 'Choose a file'

  if (maxFileSizeBytes) {
    uploader.addAttribute('max-file-size', maxFileSizeBytes)
    label += ` (Max file size ${formatBytes(maxFileSizeBytes, 0)})`
  }

  if (maxFiles) {
    uploader.addAttribute('max-files', maxFiles)
  }

  if (maxTotalSize) {
    uploader.addAttribute('max-total-size', maxTotalSize)
  }

  uploader
    .addAttribute('label', label)
    .addAttribute('style', 'max-width: 100%;')
    .addAttribute(':auto-upload', autoUpload)
    .addAttribute(':hide-upload-btn', autoUpload)
    .addAttribute(':url', 'fileUploadUrl')
    .addAttribute(':headers', 'fileUploadHeaders')
    .addAttribute('@uploading', 'info => action(\'FileUploading\', info)')
    .addAttribute('@uploaded', 'info => action(\'FileUploaded\', info)')
    .addAttribute('@rejected', 'rejectedEntries => action(\'FileRejected\', rejectedEntries)')
    .addAttribute('@failed', 'info => action(\'FileFailed\', info)')
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

function formatBytes (bytes = 0, decimals = 0) {
  if (!+bytes) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
