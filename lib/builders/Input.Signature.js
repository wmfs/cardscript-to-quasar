const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyComponentId = require('./../utils/apply-component-id')

module.exports = function (definition, options) {
  const {
    id,
    agreement,
    saveText,
    guidance,
    title,
    subtitle,
    tooltip,
    icon,
    allowNameInput
  } = definition

  const builder = new ComponentBuilder(definition)

  const card = builder.addTag('q-card')
  const cardSection = card.addChildTag('q-card-section')

  applyComponentId(card, id)
  applyTitleLabel({ source: cardSection, title, icon, tooltip, subtitle: subtitle || guidance })

  const modal = builder.addTag('q-dialog')
  const dataPath = modal.getDataPath()

  const imgDiv = cardSection.addChildTag('div')
  imgDiv.addAttribute('v-if', `${dataPath}.${id} && ${dataPath}.${id}.length > 0`)
  imgDiv.addAttribute('class', 'q-mt-md')

  imgDiv.addChildTag('img', { isSelfClosingTag: true })
    .addAttribute(':src', `${dataPath}.${id}`)
    .addAttribute('style', 'height: 200px; width: 100%;')

  const opts = inspect({ dataPath, id })

  const openBtn = cardSection.addChildTag('q-btn')
  openBtn.addAttribute(':label', `${dataPath}.${id} && ${dataPath}.${id}.length > 0 ? 'Change Signature' : 'Collect Signature'`)
  openBtn.addAttribute('color', 'primary')
  openBtn.addAttribute('no-caps', null)
  openBtn.addAttribute('unelevated', null)
  openBtn.addAttribute('class', 'q-mt-md')
  openBtn.addAttribute('@click', `action('ShowSignatureModal', ${opts})`)

  modal.addAttribute('v-model', `${dataPath}.${id}OpenModal`)
  modal.addAttribute(':maximized', true)
  modal.addAttribute('@show', `action('ResizeSignatureModal', ${opts})`)

  const div = modal.addChildTag('q-card')

  if (agreement) {
    const agreementText = div.addChildTag('div')
    agreementText.content(agreement)
    agreementText.addAttribute('class', 'text-weight-light q-mt-md q-ml-md')
  }

  // VueSignaturePad
  div.addChildTag('VueSignaturePad')
    .addAttribute('id', `${id}SignaturePad`)
    .addAttribute('width', '100%')
    .addAttribute('height', '500px')
    .addAttribute('ref', `${id}SignaturePad`)
    .addAttribute('style', 'border-top: 1px solid #bdbdbd; border-bottom: 1px solid #bdbdbd;')
    .addAttribute('class', 'q-my-md')

  // Close
  div.addChildTag('q-btn')
    .addAttribute('label', 'Close')
    .addAttribute('color', 'primary')
    .addAttribute('@click', `${dataPath}.${id}OpenModal = false`)
    .addAttribute('class', 'q-ml-md q-mr-sm')
    .addAttribute(':outline', true)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)

  // Clear
  div.addChildTag('q-btn')
    .addAttribute('label', 'Clear')
    .addAttribute('color', 'primary')
    .addAttribute('@click', `action('ClearSignature', ${opts})`)
    .addAttribute('class', 'q-mr-sm')
    .addAttribute(':outline', true)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)

  // Undo
  div.addChildTag('q-btn')
    .addAttribute('label', 'Undo')
    .addAttribute('color', 'primary')
    .addAttribute('@click', `action('UndoSignature', ${opts})`)
    .addAttribute('class', 'q-mr-sm')
    .addAttribute(':outline', true)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)

  // Save
  div.addChildTag('q-btn')
    .addAttribute('label', saveText || 'Save')
    .addAttribute('color', 'primary')
    .addAttribute('@click', `action('SaveSignature', ${opts})`)
    .addAttribute('class', 'q-mr-sm')
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)

  applyNameInput(cardSection, id, allowNameInput, dataPath)
  applyErrorCheck(cardSection, id, allowNameInput)

  const cardClasses = ['q-mt-md', 'no-shadow']

  if (cardClasses.length > 0) {
    card.addAttribute('class', cardClasses.join(' '))
  }

  return builder.compile()
}

function applyErrorCheck (parent, id, allowNameInput) {
  if (!id) {
    return
  }

  parent
    .addChildTag('div')
    .addAttribute('v-if', `v$.data.${id} ? v$.data.${id}.$error : false`)
    .addAttribute('class', 'text-negative q-mt-md')
    .content('You must enter a signature')
}

function applyNameInput (parent, id, allowNameInput, dataPath) {
  if (!allowNameInput) {
    return
  }

  const div = parent.addChildTag('div')
  div.addAttribute('class', 'q-mt-md')
  div.addAttribute('v-if', `${dataPath}.${id}`)

  applyTitleLabel({ source: div, title: 'Name' })

  const input = div.addChildTag('q-input')
  input.addAttribute('v-model', `${dataPath}.${id}Name`)
  input.addAttribute(':dense', true)

  if (id) {
    input.addAttribute(':error', `v$.data.${id}Name ? v$.data.${id}Name.$error : false`)
    input.addAttribute(':error-message', `invalidFields && invalidFields['${id}Name'] ? invalidFields['${id}Name'].messages.join(' ') : ''`)
  }
}
