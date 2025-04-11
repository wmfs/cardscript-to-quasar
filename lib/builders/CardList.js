const cardListTracker = require('./../utils/card-list-tracker')
const ComponentBuilder = require('./../utils/Component-builder')
const applyTitleLabel = require('./../utils/apply-title-label')
const applyBadge = require('./../utils/apply-badge')
const applyAvatar = require('./../utils/apply-avatar')

module.exports = function (definition, options) {
  const parentCardList = cardListTracker.getCurrentCardList()
  cardListTracker.addCardList(definition.id)

  const {
    id,
    showWhen,
    title,
    subtitle,
    icon,
    tooltip
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })

  const dialogKey = `internals.dialogControl.${id}`

  const arrayPath = parentCardList
    ? `internals.currentCardListData.${parentCardList}.${id}`
    : `data.${id}`

  applyTitleLabel({ source: builder.addTag('div'), title, icon, tooltip, subtitle })

  instanceTemplate(builder, definition, arrayPath)
  openButton(builder, definition)

  const dialog = builder.addTag('q-dialog', { includeClosingTag: false })
  dialog
    .addAttribute('v-model', dialogKey)
    .addAttribute('persistent', null)

  const card = dialog
    .addChildTag('q-card', { includeClosingTag: false })
    .addAttribute('style', 'min-width: 75vw;')

  if (showWhen) {
    card.addAttribute('v-if', showWhen)
  }

  card.addChildTag('q-card-section', { includeClosingTag: false })

  return builder.compile()
}

function instanceTemplate (builder, definition, arrayPath) {
  // For existing CardList usage
  if (!definition.instanceTemplate && (definition.instanceTitleTemplate || definition.instanceSubtitleTemplate || definition.instanceIconTemplate)) {
    definition.instanceTemplate = {
      title: definition.instanceTitleTemplate,
      subtitle: definition.instanceSubtitleTemplate,
      icon: definition.instanceIconTemplate
    }
  }

  const {
    id,
    showWhen,
    instanceTemplate
  } = definition

  if (!instanceTemplate) {
    return
  }

  const {
    title,
    subtitle,
    icon,
    badge,
    avatar,
    selectionType,
    rowKey,
    disableEdit = false,
    disableDelete = false
  } = instanceTemplate

  const div = builder.addTag('div')

  if (showWhen) {
    div.addAttribute('v-if', showWhen)
  }

  const list = div
    .addChildTag('q-list')
    .addAttribute('class', 'q-mt-sm')
    .addAttribute(':no-border', true)
    .addAttribute(':link', true)
    .addAttribute('v-if', `${arrayPath} && ${arrayPath}.length > 0`)

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, $idx) in ${arrayPath}`)
    .addAttribute(':key', '$idx')

  if (selectionType === 'multi' && rowKey) {
    item
      .addChildTag('q-item-section')
      .addAttribute('side', null)

      .addChildTag('q-checkbox')
      .addAttribute('v-model', `item.${rowKey}`)
  }

  if (selectionType === 'single') {
    item
      .addChildTag('q-item-section')
      .addAttribute('side', null)

      .addChildTag('q-radio')
      .addAttribute('v-model', `data.${id}Selected`)
      .addAttribute(':val', '$idx')
  }

  // is avatar same as icon?

  if (icon) {
    item
      .addChildTag('q-item-section')
      .addAttribute('side', null)

      .addChildTag('q-icon')
      .addAttribute('name', icon)
  }

  if (avatar) {
    const avatars = Array.isArray(avatar) ? avatar : [avatar]

    for (const avatar of avatars) {
      const source = item
        .addChildTag('q-item-section')
        .addAttribute('avatar', null)
        .addAttribute('class', 'q-pr-none')

      if (avatar.showWhen) {
        source.addAttribute('v-if', avatar.showWhen)
      }

      applyAvatar({ source, ...avatar })
    }
  }

  const labelSection = item
    .addChildTag('q-item-section')

  labelSection
    .addChildTag('q-item-label')
    .addAttribute('lines', 2)
    .content(title || '')

  if (subtitle) {
    labelSection
      .addChildTag('q-item-label')
      .addAttribute('lines', 2)
      .addAttribute('caption', null)
      .content(subtitle || '')
  }

  if (badge) {
    const badges = Array.isArray(badge) ? badge : [{ text: badge, colour: 'accent' }]
    const source = labelSection.addChildTag('q-item-label')

    for (const badge of badges) {
      applyBadge({ source, ...badge })
    }
  }

  const rightSection = item
    .addChildTag('q-item-section')
    .addAttribute('side', null)
    .addAttribute('top', null)

  const buttonsDiv = rightSection
    .addChildTag('div')
    .addAttribute('class', 'text-grey-8 q-gutter-xs')

  if (!disableEdit) {
    buttonsDiv
      .addChildTag('q-btn')
      .addAttribute('no-caps', null)
      .addAttribute('unelevated', null)
      .addAttribute('round', null)
      .addAttribute('dense', null)
      .addAttribute('icon', 'edit')
      .addAttribute('@click', `action('EditCardListContent', { cardListId: '${id}', index: $idx })`)
  }

  if (!disableDelete) {
    buttonsDiv
      .addChildTag('q-btn')
      .addAttribute('no-caps', null)
      .addAttribute('unelevated', null)
      .addAttribute('round', null)
      .addAttribute('dense', null)
      .addAttribute('icon', 'delete')
      .addAttribute('@click', `action('RemoveCardListContent', { cardListId: '${id}', index: $idx })`)
  }
}

function openButton (builder, definition) {
  const {
    id,
    showWhen,
    addButtonLabel
  } = definition

  const btn = builder.addTag('q-btn')

  btn
    .addAttribute('class', 'q-mt-sm')
    .addAttribute('color', 'primary')
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('@click', `action('CreateNewCardList', { cardListId: '${id}' })`)
    .addAttribute('label', addButtonLabel || 'Open Card')

  if (showWhen) {
    btn.addAttribute('v-if', showWhen)
  }
}
