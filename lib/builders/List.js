const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('./../utils/local-util')
const applyBadge = require('./../utils/apply-badge')
const applyLaunches = require('./../utils/apply-launches')
const applySpacing = require('./../utils/apply-spacing')
const applyQaMode = require('./../utils/apply-qa')

module.exports = function (definition, options) {
  if (definition.selectionClearable === undefined || definition.selectionClearable === null) {
    definition.selectionClearable = true
  }

  const {
    listStyle = 'list',
    spacing,
    qa
  } = definition

  const builder = new ComponentBuilder(definition)
  const parent = builder.addTag('div')

  if (listStyle === 'list') {
    renderList(parent, definition)
  } else {
    renderCards(parent, definition)
  }

  applySpacing({ spacing, source: parent })
  applyQaMode(qa, parent)

  return builder.compile()
}

function renderList (parent, definition) {
  const {
    arrayPath,
    templates,
    showLaunches,
    clickToLaunch,
    selectionType,
    selectionClearable,
    validation,
    notFoundText
  } = definition

  if (notFoundText) noResults(parent, definition)
  totalResults(parent, definition)
  selectAll(parent, definition)

  const list = parent
    .addChildTag('q-list')
    .addAttribute('v-if', `${arrayPath} && ${arrayPath}.length`)

  const item = list
    .addChildTag('q-item')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute(':class', '$q.screen.gt.xs ? \'\' : \'q-px-none\'')

  if (selectionType) applySelection(item, definition)
  applyAvatar(item, definition)

  if (templates) {
    const { label, sublabel, stamp, badge } = templates

    const itemSection = item.addChildTag('q-item-section')

    if (label) {
      const itemLabel = itemSection
        .addChildTag('q-item-label')
        .content(label)

      if (clickToLaunch) {
        applyClickToLaunch(itemLabel)
      } else {
        itemLabel.addAttribute('class', 'item-label-non-link')
      }
    }

    if (sublabel) {
      const sublabels = Array.isArray(sublabel) ? sublabel : [sublabel]

      for (const s of sublabels) {
        itemSection
          .addChildTag('q-item-label')
          .addAttribute('caption', null)
          .addAttribute('lines', 1)
          .content(s)
      }
    }

    if (stamp) {
      item
        .addChildTag('q-item-section')
        .addAttribute('side', null)
        .addAttribute('top', null)
        .content(stamp)
    }

    if (badge) applyBadges(itemSection, definition)
  }

  if (showLaunches) {
    const launchesParent = item
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('top', null)

    applyLaunches(launchesParent, definition)
  }
  if (selectionClearable && selectionType === 'multi') applyClearSelection(list, definition)
  if (validation) applyValidation(list, definition)
} // renderList

function renderCards (parent, definition) {
  const {
    arrayPath,
    imgSrcPath,
    templates,
    showLaunches,
    clickToLaunch,
    selectionType,
    selectionClearable,
    validation,
    notFoundText
  } = definition

  if (notFoundText) noResults(parent, definition)
  totalResults(parent, definition)
  selectAll(parent, definition)

  const div = parent
    .addChildTag('div')
    .addAttribute('class', 'row justify-start')
    .addAttribute('v-if', `${arrayPath} && ${arrayPath}.length`)

  const card = div
    .addChildTag('q-card')
    .addAttribute('v-for', `(item, idx) in ${arrayPath}`)
    .addAttribute(':key', 'idx')
    .addAttribute('style', 'max-width: 300px;')
    .addAttribute('class', 'q-mb-md q-mr-md')

  if (imgSrcPath) card.addChildTag('img', { isSelfClosingTag: true }).addAttribute(':src', imgSrcPath)

  const headerCardSection = card.addChildTag('q-card-section')
  const divRow = headerCardSection
    .addChildTag('div')
    .addAttribute('class', 'row items-center no-wrap')

  if (selectionType) {
    applySelection(divRow, definition)
  }

  if (templates) {
    const { label, sublabel, stamp, badge } = templates

    const headerCol = divRow
      .addChildTag('div')
      .addAttribute('class', 'col q-pr-sm')

    if (label) {
      const labelDiv = headerCol
        .addChildTag('div')
        .content(label)

      if (clickToLaunch) {
        applyClickToLaunch(labelDiv)
      } else {
        labelDiv.addAttribute('class', 'item-label-non-link')
      }
    }

    const sublabels = []

    if (sublabel) {
      if (Array.isArray(sublabel)) {
        sublabels.push(...sublabel)
      } else {
        sublabels.push(sublabel)
      }
    }

    if (stamp) {
      sublabels.push(stamp)
    }

    if (sublabels.length > 0) {
      const bodyCardSection = card.addChildTag('q-card-section')

      for (const s of sublabels) {
        bodyCardSection
          .addChildTag('div')
          .addAttribute('class', 'text-caption text-grey')
          .content(s)
      }
    }

    if (badge) {
      applyBadges(card, definition)
    }
  }

  if (showLaunches) {
    const launchesParent = divRow
      .addChildTag('div')
      .addAttribute('class', 'col-auto')

    applyLaunches(launchesParent, definition)
  }

  if (selectionClearable && selectionType === 'multi') {
    applyClearSelection(parent.addTag('div'), definition)
  }

  if (validation) {
    applyValidation(parent.addTag('div'), definition)
  }
} // renderCards

function applyBadges (parent, definition) {
  const {
    templates,
    listStyle = 'list'
  } = definition

  const {
    badge,
    badgeColor
  } = templates

  const badges = Array.isArray(badge) ? badge : [{ text: badge, colour: badgeColor || 'accent' }]

  if (badges.length) {
    const container = parent.addChildTag(listStyle === 'list' ? 'q-item-label' : 'q-card-section')

    for (const { colour, icon, showWhen, text, outline } of badges) {
      applyBadge({ source: container, color: colour, icon, text, showWhen, outline })
    }
  }
} // applyBadges

function applyClickToLaunch (element) {
  const params = ['stateMachineName', 'input', 'title']
    .map(p => `item.launches && item.launches.length ? item.launches[0].${p} : null`)
    .join(', ')

  element
    .addAttribute('class', 'item-label')
    .addAttribute('@click', `start('pushCard', ${params})`)
} // applyClickToLaunch

function applySelection (parent, definition) {
  const {
    id,
    listStyle = 'list',
    selectionType,
    rowKey,
    onSelectionEndpoint,
    arrayPath,
    selectionMax = 0,
    selectionShowWhen
  } = definition

  const section = listStyle === 'list'
    ? parent
      .addChildTag('q-item-section')
      .addAttribute('side', null)
      .addAttribute('top', null)
    : parent
      .addChildTag('div')
      .addAttribute('class', 'col-auto')

  if (selectionShowWhen) section.addAttribute('v-if', selectionShowWhen)

  const option = section.addChildTag(selectionType === 'single' ? 'q-radio' : 'q-checkbox')

  const destPath = `${parent.getDataPath()}.${id}`

  if (selectionType === 'multi') {
    option.addAttribute(':model-value', rowKey ? `${destPath}.includes(item.${rowKey})` : `!!${destPath}.find(r => hashSum(r) === hashSum(item))`)
  } else if (selectionType === 'single') {
    option.addAttribute(':val', rowKey ? `item.${rowKey}` : 'item')
    option.addAttribute(':model-value', `${destPath}`)
  }

  if (onSelectionEndpoint) {
    option.addAttribute('@update:model-value', `action('ListSelection', { idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}', rowKey: '${rowKey}', onSelectionEndpoint: ${inspect(onSelectionEndpoint)} })`)
  } else {
    option.addAttribute('@update:model-value', `action('ListSelection', { idx, sourcePath: '${arrayPath}', destPath: '${destPath}', selectionMax: ${selectionMax}, selectionType: '${selectionType}', rowKey: '${rowKey}' })`)
  }
} // applySelection

function applyClearSelection (parent, definition) {
  const { id } = definition

  const destPath = `${parent.getDataPath()}.${id}`

  parent
    .addChildTag('q-item-label')
    .addAttribute('v-if', `${destPath}.length > 0`)
    .addAttribute('header', null)
    .addAttribute('class', 'q-px-none')
    .content(`{{${destPath}.length}} selected`)
    .addChildTag('q-btn')
    .addAttribute('@click', `action('ClearArraySelection', '${destPath}')`)
    .addAttribute('dense', null)
    .addAttribute('outline', null)
    .addAttribute('no-caps', null)
    .addAttribute('unelevated', null)
    .addAttribute('color', 'primary')
    .addAttribute('class', 'q-ml-md')
    .content('Clear all')
} // applyClearSelection

function applyValidation (parent, definition) {
  const { id } = definition

  const destPath = `${parent.getDataPath()}.${id}`

  parent.addAttribute(':style', `v$.${destPath}.$error ? 'border: 1px solid #db2828;' : ''`)
} // applyValidation

function noResults (parent, definition) {
  const {
    arrayPath,
    notFoundText
  } = definition

  parent
    .addChildTag('div')
    .addAttribute('v-if', `!${arrayPath} || ${arrayPath}.length === 0`)
    .content(notFoundText)
} // noResults

function totalResults (parent, definition) {
  const { arrayPath, showTotal } = definition

  if (showTotal) {
    parent
      .addChildTag('q-item-label')
      .addAttribute('v-if', `${arrayPath} && ${arrayPath}.length`)
      .addAttribute('header', null)
      .addAttribute('class', 'q-px-none')
      .content(`{{ ${arrayPath}.length }} total results`)
  }
} // totalResults

function selectAll (parent, definition) {
  const {
    id,
    rowKey,
    selectionType,
    selectionMax = 0,
    arrayPath
  } = definition

  if (selectionType === 'multi' && selectionMax === 0) {
    const item = parent.addChildTag('q-item')

    const destPath = `${item.getDataPath()}.${id}`

    item
      .addAttribute('v-if', `${arrayPath}.length > 0`)
      .addAttribute('class', 'non-link-item  q-px-none')

      .addChildTag('q-item-section')
      .addAttribute(':side', true)
      .addChildTag('q-checkbox')
      .addAttribute(':model-value', `${arrayPath}.every(row => ${rowKey ? `${destPath}.includes(row.${rowKey})` : `!!${destPath}.find(r => hashSum(r) === hashSum(row))`})`)
      .addAttribute('@update:model-value', `action('ListSelectAll', ${inspect({ destPath: `${destPath}`, sourcePath: arrayPath, rowKey })})`)

      .addChildTag('q-item-section')
      .addChildTag('q-item-label')
      .addAttribute('class', 'item-label-non-link')
      .content(`Select all {{${arrayPath}.length}} result{{${arrayPath}.length === 1 ? '' : 's'}} below`)
  }
} // selectAll

function applyAvatar (item, definition) {
  const { avatar } = definition

  if (avatar) {
    const { type, source, sourcePath } = avatar

    if (['icon', 'letter', 'image'].includes(type) && (source || sourcePath)) {
      const itemSection = item
        .addChildTag('q-item-section') // left section
        .addAttribute('top', null)
        .addAttribute('avatar', null)

      // todo: custom color

      if (type === 'icon') {
        const icon = itemSection
          .addChildTag('q-icon')
          .addAttribute('color', 'primary')

        if (source) icon.addAttribute('name', source)
        if (sourcePath) icon.addAttribute(':name', sourcePath)
      }

      if (type === 'letter') {
        const avatar = itemSection
          .addChildTag('q-avatar')
          .addAttribute('color', 'primary')
          .addAttribute('text-color', 'white')

        if (source) avatar.content(source)
        if (sourcePath) avatar.content(`{{ ${sourcePath} }}`)
      }

      if (type === 'image') {
        const avatar = itemSection.addChildTag('q-avatar')
        const image = avatar.addChildTag('img', { isSelfClosingTag: true })

        if (source) image.addAttribute('src', source)
        if (sourcePath) image.addAttribute(':src', sourcePath)
      }
    }
  }
} // applyAvatar
