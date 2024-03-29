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
  // Stepper: {
  //   endTemplate: '</q-stepper>',
  //   arrayPath: 'steps'
  // },
  // Step: {
  //   endTemplate: '</q-step>',
  //   arrayPath: 'items'
  // },
  Collapsible: {
    endTemplate: '</q-card-section></q-card></q-expansion-item>',
    arrayPath: 'card.body'
  },
  // Timeline: {
  //   endTemplate: '</q-timeline>',
  //   arrayPath: 'items'
  // },
  TimelineEntry: {
    endTemplate: '</q-timeline-entry>',
    arrayPath: 'items'
  },
  // AdaptiveCard: {
  //   endTemplate: '</div></div>',
  //   arrayPath: 'body'
  // },
  ImageSet: {
    endTemplate: '</div>',
    arrayPath: 'images'
  }
}

module.exports = function (cardscript, options) {
  if (!options) options = {}
  if (!Object.prototype.hasOwnProperty.call(options, 'fieldLabelWidth')) {
    options.fieldLabelWidth = 12
  }
  if (!Object.prototype.hasOwnProperty.call(options, 'imageSourceTemplate')) {
    options.imageSourceTemplate = 'url(${imagePath})' // eslint-disable-line
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
      const array = dottie.get(element, CONTAINERS[element.type].arrayPath)
      if (Array.isArray(array)) {
        array.forEach(parseElement)
      }
      template += `${indent}${CONTAINERS[element.type].endTemplate}`
      depth--
    }

    if (element.type === 'TabSet' && element.orientation === 'vertical') {
      template += '</template></q-splitter>'
    }

    if (element.type === 'Stepper' && element.id) {
      depth++
      options.StepperId = `${element.id}Stepper`

      element.steps.forEach((step, idx) => {
        template += builders.Step.conversionFunction(step, options, idx)
        step.items.forEach(parseElement)

        const next = idx < element.steps.length - 1
        const previous = idx > 0

        if (next || previous) {
          // If we add `showWhen` then we'll need to do something special
          // when clicking next/previous buttons to skip over hidden steps

          template += '<q-stepper-navigation>'

          if (previous) {
            const def = { title: 'Previous', type: 'Action.PreviousTab', onClick: `data.${options.StepperId} = ${idx - 1}` }
            template += builders['Action.PreviousTab'].conversionFunction(def, options, idx)
          }

          if (next) {
            const def = { title: 'Next', type: 'Action.NextTab', onClick: `data.${options.StepperId} = ${idx + 1}` }
            template += builders['Action.NextTab'].conversionFunction(def, options, idx)
          }

          template += '</q-stepper-navigation>'
        }

        template += '</q-step>'
      })

      template += '</q-stepper>'
      options.StepperId = null
      depth--
    }

    if (element.type === 'ActionSet') {
      depth++

      options.ActionSet = true
      options.ActionStyle = element.actionStyle || 'list'

      if (element.launchesPath) {
        const onClick = '@click="action(\'PushCard\', { stateMachineName: launch.stateMachineName, input: launch.input, title: launch.title } )"'
        const loop = `v-for="(launch, idx) in ${element.launchesPath}"`
        const key = ':key="idx"'

        if (options.ActionStyle === 'dropdown' || options.ActionStyle === 'list') {
          let item = `<q-item ${loop} ${key} ${onClick} `

          if (options.ActionStyle === 'dropdown') {
            item += 'clickable '
          } else if (options.ActionStyle === 'list') {
            item += 'class="item-label q-px-none" '
          }

          item += '><q-item-section><q-item-label>{{launch.title}}</q-item-label></q-item-section></q-item>'

          template += item
        } else {
          template += `<q-btn ${loop} ${key} ${onClick} :label="launch.title" color="primary" unelevated no-caps class="q-mb-sm q-mr-sm" />`
        }
      } else {
        dottie.get(element, 'actions').forEach(parseElement)
      }

      if (options.ActionStyle === 'dropdown' || options.ActionStyle === 'list') template += '</q-list>'
      if (options.ActionStyle === 'dropdown') template += '</q-btn-dropdown>'

      options.ActionSet = false
      options.ActionStyle = null

      template += '</div>'

      depth--
    }

    if (element.type === 'AdaptiveCard') {
      depth++
      element.body.forEach(parseElement)
      const el = cloneDeep(element)
      el.type = 'EndAdaptiveCard'
      parseElement(el)
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
        template += '<div>'
        element.parametersCard.body.forEach(parseElement)
        const input = { id: element.id, endpoint: element.endpoint, ctxPaths: element.ctxPaths }

        const getDataPath = element => {
          const dataPath = ['data']

          if (cardListTracker.insideACardList()) dataPath.push(cardListTracker.getCurrentCardList())

          dataPath.push(element.id)
          return dataPath.join('.')
        }

        const dataPath = getDataPath(element)

        // template += `<div class="text-right q-mt-md"><q-btn label="${element.buttonText || 'Go'}" color="primary" :loading="${dataPath}.loading" @click="action('InputApiLookupParamsChanged', ${inspect(input)})" /></div></div>`
        template += '<div class="row q-mt-md q-mx-sm">'
        template += '<div class="col">'
        if (element.actionSet) {
          const { actions, justifyContent = 'space-between' } = element.actionSet
          if (actions && Array.isArray(actions)) {
            if (justifyContent) template += '<div class="row justify-between">' // todo: justify depend on justifyContent
            actions.forEach(parseElement)
            if (justifyContent) template += '</div>'
          }
        }
        template += '</div>'
        template += '<div class="col-auto">'
        template += `<q-btn label="${element.buttonText || 'Go'}" unelevated no-caps class="q-mb-sm q-mr-sm" color="primary" :loading="${dataPath}.loading" @click="action('InputApiLookupParamsChanged', ${inspect(input)})" />`
        template += '</div></div></div>'

        depth--
      }

      if (element.resultsCard) {
        template += `<div id="inputApiLookup${element.id}">`
        element.resultsCard.body.forEach(parseElement)
        template += '</div>'
      }

      const el = cloneDeep(element)
      el.type = 'EndInput.ApiLookup'
      parseElement(el)
      depth--
    }

    if (element.type === 'Timeline') {
      if (element.arrayPath) {
        const loop = `v-for="(item, idx) in ${element.arrayPath}"`
        const key = ':key="idx"'

        template += `<template ${loop} ${key}>`
      }

      element.items.forEach(parseElement)

      if (element.arrayPath) {
        template += '</template>'
      }

      template += '</q-timeline>'
    }
  }

  if (cardscript.body) {
    cardscript.body.forEach(parseElement)
  }

  if (cardscript.actions) {
    template += '<div class="q-mt-md">'
    cardscript.actions.forEach(parseElement)
    template += '</div>'
  }

  template += '</div>'

  return { template }
}
