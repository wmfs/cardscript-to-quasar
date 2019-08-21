const { defaults } = require('lodash')
const cardListTracker = require('./card-list-tracker')
const apiLookupTracker = require('./api-lookup-tracker')

class TagNode {
  constructor (name, options) {
    this.options = defaults(options || {}, { includeClosingTag: true })
    this.name = name
    this.tagContent = null
    this.attributes = []
    this.childTags = []
  }

  content (tagContent) {
    if (tagContent !== undefined) {
      this.tagContent = tagContent
    }
    return this
  }

  addAttribute (name, value) {
    if (value !== undefined) {
      if (value === null) {
        this.attributes.push(name)
      } else {
        this.attributes.push(`${name}="${value}"`)
      }
    }
    return this
  }

  getDataPath () {
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

  bindToModel (element, modifier) {
    const attributeName = modifier ? `v-model.${modifier}` : 'v-model'
    const dataPath = `${this.getDataPath(element)}.${element.id}`
    this.addAttribute(attributeName, dataPath)
    return this
  }

  addChildTag (tagName, options) {
    const tagNode = new TagNode(tagName, options)
    this.childTags.push(tagNode)
    return tagNode
  }
}

module.exports = class ComponentBuilder {
  constructor (element, options) {
    this.rootTags = []
    if (element) this.showWhen = element.showWhen
    if (options) this.disableShowWhen = options.disableShowWhen || false
  }

  addTag (tagName, options) {
    const tagNode = new TagNode(tagName, options)
    this.rootTags.push(tagNode)
    return tagNode
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
