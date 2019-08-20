const dottie = require('dottie')
const builders = require('./builders')
// const apiLookupTracker = require('./utils/api-lookup-tracker')
const { inspect } = require('./utils/local-util')
const { cloneDeep } = require('lodash')
const ONE_TAB = '  '
const INDENT = '  '
const CONTAINERS = {
  Container: {
    endTemplate: '</q-card-section></q-card>',
    arrayPath: 'items'
  },
  Column: {
    endTemplate: '</div>',
    arrayPath: 'items'
  },
  ColumnSet: {
    endTemplate: '</div>',
    arrayPath: 'columns'
  },
  TabSet: {
    endTemplate: '</q-tab-panels>',
    arrayPath: 'tabs'
  },
  Tab: {
    endTemplate: '</q-tab-panel>',
    arrayPath: 'items'
  },
  Collapsible: {
    endTemplate: '</q-card-section></q-card></q-expansion-item>',
    arrayPath: 'card.body'
  },
  ActionSet: {
    endTemplate: '</q-list>',
    arrayPath: 'actions'
  },
  ImageSet: {
    endTemplate: '</div>',
    arrayPath: 'images'
  }
}

module.exports = function (cardscript, options) {
  if (!options) options = {}
  if (!options.hasOwnProperty('fieldLabelWidth')) {
    options.fieldLabelWidth = 12
  }
  if (!options.hasOwnProperty('imageSourceTemplate')) {
    options.imageSourceTemplate = 'url(statics/${imagePath})' // eslint-disable-line
  }

  let template = '<div>\n'
  let depth = 0

  function parseElement (element, idx) {
    let indent = INDENT

    for (let i = 0; i < depth; i++) {
      indent += ONE_TAB
    }

    if (builders[element.type]) {
      try {
        const lines = builders[element.type].conversionFunction(element, options, idx)
        template += `${indent}${lines}\n`
      } catch (originalError) {
        console.error('CARDSCRIPT-TO-QUASAR: FAILED TO BUILD ELEMENT')
        console.error('---------------------------------------------')
        const id = element.id || 'No ID!'
        console.error(JSON.stringify(element, null, 2))
        let title, name
        if (cardscript.templateMeta) {
          title = cardscript.templateMeta.title || 'Untitled'
          name = cardscript.templateMeta.name || 'No name'
          console.error(cardscript.templateMeta)
        } else {
          title = 'Untitled'
          name = 'No name'
        }
        const newError = new Error(
          `Failed to compile Cardscript ${element.type} element '${id}' in ${title} (${name}): ${originalError.toString()}`
        )
        throw newError
      }
    } else {
      console.log('CARDSCRIPT-TO-QUASAR')
      console.log('--------------------')
      console.log(`Unknown type of builder: ${element.type}`)
      console.log(`Element: ${JSON.stringify(element)}`)
    }

    if (Object.keys(CONTAINERS).includes(element.type)) {
      depth++

      if (element.type === 'ActionSet') options.ActionSet = true
      if (element.type === 'ActionSet' && element.actionStyle === 'dropdown') options.ActionSetDropDown = true

      dottie.get(element, CONTAINERS[element.type].arrayPath).forEach(parseElement)

      if (element.type === 'ActionSet') options.ActionSet = false
      if (element.type === 'ActionSet' && element.actionStyle === 'dropdown') options.ActionSetDropDown = false

      template += `${indent}${CONTAINERS[element.type].endTemplate}`

      if (element.type === 'ActionSet' && element.actionStyle === 'dropdown') {
        template += `</q-btn-dropdown>`
      }

      depth--
    }

    if (element.type === 'CardList') {
      depth++
      element.card.body.forEach(parseElement)
      parseElement({ type: 'EndCardList', actions: element.card.actions || [] })
      depth--
    }

    if (element.type === 'Input.ApiLookup') {
      depth++
      if (element.parametersCard) {
        depth++
        template += `<div>`
        element.parametersCard.body.forEach(parseElement)
        const input = { id: element.id, endpoint: element.endpoint, ctxPaths: element.ctxPaths }
        template += `<div class="text-right q-mt-md"><q-btn label="${element.buttonText || 'Go'}" color="primary" :loading="data.${element.id}.loading" @click="action('InputApiLookupParamsChanged', ${inspect(input)})" /></div></div>`
        depth--
      }

      if (element.resultsCard) {
        element.resultsCard.body.forEach(parseElement)
      }

      const el = cloneDeep(element)
      el.type = 'EndInput.ApiLookup'
      parseElement(el)
      depth--
    }
  }

  if (cardscript.body) {
    cardscript.body.forEach(parseElement)
  }

  if (cardscript.actions) {
    template += `<div class="q-mt-md">`
    cardscript.actions.forEach(parseElement)
    template += `</div>`
  }

  template += '</div>'
  return { template }
}
