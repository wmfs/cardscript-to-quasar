const cardListTracker = require('./card-list-tracker')
const apiLookupTracker = require('./api-lookup-tracker')

const TagBuilder = require('@wmfs/tag-builder')

function getDataPath () {
  let dataPath = 'data'

  /*
    TODO: refactor!

    nested example:

    internals.currentCardListData.cardList1
    internals.currentCardListData.cardList1.inputApiLookup1
    internals.currentCardListData.cardList1.inputApiLookup1.cardList2
    internals.currentCardListData.inputApiLookup1
  */

  if (cardListTracker.insideACardList()) {
    dataPath = `internals.currentCardListData.${cardListTracker.getCurrentCardList()}`
    // todo: inside ApiLookup
  } else if (apiLookupTracker.insideApiLookup()) {
    dataPath = `data.${apiLookupTracker.getCurrentApiLookup()}.params`
  }

  return dataPath
}
function bindToModel (element, modifier) {
  const attributeName = modifier ? `v-model.${modifier}` : 'v-model'
  const dataPath = `${this.getDataPath(element)}.${element.id}`
  this.addAttribute(attributeName, dataPath)
  return this
}

class ComponentBuilder extends TagBuilder {
  constructor (element, options) {
    super()

    this.TagNodeBuilder.prototype.getDataPath = getDataPath
    this.TagNodeBuilder.prototype.bindToModel = bindToModel

    if (element) this.showWhen = element.showWhen
    if (options) this.disableShowWhen = options.disableShowWhen || false
  }

  compile () {
    let template = ''

    if (this.showWhen && !this.disableShowWhen) template += `<template v-if="${this.showWhen}">`

    function processTagArray (rootTags) {
      rootTags.forEach(tag => {
        let line = `<${tag.name}${tag.attributes.length > 0 ? ` ${tag.attributes.join(' ')}` : ''}>`

        if (tag.tagContent !== null) {
          line += tag.tagContent
        }

        template += line

        processTagArray(tag.childTags)

        if (tag.options.includeClosingTag) {
          template += `</${tag.name}>`
        }
      })
    }

    processTagArray(this.rootTags)

    if (this.showWhen && !this.disableShowWhen) template += '</template>'

    return template
  }
}

module.exports = ComponentBuilder
