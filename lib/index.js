const dottie = require('dottie')
const builders = require('./builders')

// const apiLookupTracker = require('./utils/api-lookup-tracker')
const cardListTracker = require('./utils/card-list-tracker')

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
  AdaptiveCard: {
    endTemplate: '</div>',
    arrayPath: 'body'
  },
  ImageSet: {
    endTemplate: '</div>',
    arrayPath: 'images'
  }
}

module.exports = async function (cardscript, options) {
  if (!options) options = {}
  if (!Object.prototype.hasOwnProperty.call(options, 'fieldLabelWidth')) {
    options.fieldLabelWidth = 12
  }
  if (!Object.prototype.hasOwnProperty.call(options, 'imageSourceTemplate')) {
    options.imageSourceTemplate = 'url(statics/${imagePath})' // eslint-disable-line
  }

  let template = '<div>\n'
  let depth = 0

  async function parseElement (element, idx) {
    let indent = INDENT

    for (let i = 0; i < depth; i++) {
      indent += ONE_TAB
    }

    if (builders[element.type]) {
      try {
        const lines = await builders[element.type].conversionFunction(element, options, idx)
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
      for (const [idx, ele] of dottie.get(element, CONTAINERS[element.type].arrayPath).entries()) {
        await parseElement(ele, idx)
      }

      template += `${indent}${CONTAINERS[element.type].endTemplate}`
      depth--
    }

    if (element.type === 'ActionSet') {
      depth++
      options.ActionSet = true

      if (element.actionStyle === 'dropdown') {
        options.ActionSetDropDown = true
      }

      if (element.launchesPath) {
        const onClick = '@click.native="action(\'PushCard\', { stateMachineName: launch.stateMachineName, input: launch.input, title: launch.title } )"'
        const loop = `v-for="(launch, idx) in ${element.launchesPath}"`
        const key = ':key="idx"'

        if (element.actionStyle === 'dropdown' || element.actionStyle === 'list') {
          let item = `<q-item ${loop} ${key} ${onClick} `

          if (element.actionStyle === 'dropdown') {
            item += 'clickable v-close-popup '
          } else if (element.actionStyle === 'list') {
            item += 'class="item-label" '
          }

          item += '><q-item-section><q-item-label>{{launch.title}}</q-item-label></q-item-section></q-item>'

          template += item
        } else {
          template += `<q-btn ${loop} ${key} ${onClick} :label="launch.title" color="primary" class="q-mb-sm q-mr-sm" />`
        }
      } else {
        for (const [idx, ele] of dottie.get(element, 'actions').entries()) {
          await parseElement(ele, idx)
        }
      }

      template += `${indent}</q-list>`

      options.ActionSet = false

      if (element.actionStyle === 'dropdown') {
        options.ActionSetDropDown = false
        template += '</q-btn-dropdown>'
      }

      if (element.actionStyle !== 'dropdown' && element.actionStyle !== 'list' && element.showWhen) {
        template += '</template>'
      }

      depth--
    }

    if (element.type === 'CardList') {
      depth++
      for (const [idx, ele] of element.card.body.entries()) {
        await parseElement(ele, idx)
      }
      await parseElement({ type: 'EndCardList', actions: element.card.actions || [] })
      depth--
    }

    if (element.type === 'Input.ApiLookup') {
      depth++
      if (element.parametersCard) {
        depth++
        template += '<div>'
        for (const [idx, ele] of element.parametersCard.body.entries()) {
          await parseElement(ele, idx)
        }
        const input = { id: element.id, endpoint: element.endpoint, ctxPaths: element.ctxPaths }

        const getDataPath = element => {
          const dataPath = ['data']

          if (cardListTracker.insideACardList()) dataPath.push(cardListTracker.getCurrentCardList())

          dataPath.push(element.id)
          return dataPath.join('.')
        }

        const dataPath = getDataPath(element)

        template += `<div class="text-right q-mt-md"><q-btn label="${element.buttonText || 'Go'}" color="primary" :loading="${dataPath}.loading" @click="action('InputApiLookupParamsChanged', ${inspect(input)})" /></div></div>`
        depth--
      }

      if (element.resultsCard) {
        for (const [idx, ele] of element.resultsCard.body.entries()) {
          await parseElement(ele, idx)
        }
      }

      const el = cloneDeep(element)
      el.type = 'EndInput.ApiLookup'
      await parseElement(el)
      depth--
    }
  }

  if (cardscript.body) {
    for (const [idx, ele] of cardscript.body.entries()) {
      await parseElement(ele, idx)
    }
  }

  if (cardscript.actions) {
    template += '<div class="q-mt-md">'
    for (const [idx, ele] of cardscript.actions.entries()) {
      await parseElement(ele, idx)
    }
    template += '</div>'
  }

  template += '</div>'

  return { template }
}
