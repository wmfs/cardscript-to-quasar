const dottie = require('dottie')
const builders = require('./builders')
// const apiLookupTracker = require('./utils/api-lookup-tracker')
const { inspect } = require('./utils/local-util')
const ONE_TAB = '  '
const INDENT = '  '
const CONTAINERS = {
  Container: {
    endTemplate: '</q-card-main></q-card>',
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
    endTemplate: '</q-tabs>',
    arrayPath: 'tabs'
  },
  Tab: {
    endTemplate: '</q-tab-pane>',
    arrayPath: 'items'
  },
  Collapsible: {
    endTemplate: '</div></q-collapsible>',
    arrayPath: 'card.body'
  },
  ActionSet: {
    // endTemplate: '</q-btn-group>',
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
    }

    if (Object.keys(CONTAINERS).includes(element.type)) {
      depth++
      if (element.type === 'ActionSet') options.ActionSet = true
      dottie.get(element, CONTAINERS[element.type].arrayPath).forEach(parseElement)
      if (element.type === 'ActionSet') options.ActionSet = false
      template += `${indent}${CONTAINERS[element.type].endTemplate}`
      depth--
    }

    if (element.type === 'CardList') {
      depth++
      element.card.body.forEach(parseElement)
      parseElement({ type: 'EndCardList', editable: element.editable || false })
      depth--
    }

    if (element.type === 'Input.ApiLookup') {
      depth++
      if (element.parametersCard) {
        depth++
        template += `<div>`
        element.parametersCard.body.forEach(parseElement)
        template += `<div class="text-right q-mt-md"><q-btn label="go" color="primary" :loading="data.${element.id}.loading" @click="action('InputApiLookupParamsChanged', ${inspect(element)})" /></div></div>`
        depth--
      }
      parseElement({
        type: 'EndInput.ApiLookup',
        id: element.id,
        templates: element.templates,
        endpoint: element.endpoint,
        ctxPaths: element.ctxPaths
      })
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
