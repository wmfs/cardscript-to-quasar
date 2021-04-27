class AdaptiveCardTracker {
  constructor () {
    this.adaptiveCard = []
  }

  insideAdaptiveCard () {
    return this.adaptiveCard.length > 0
  }

  getCurrentAdaptiveCard () {
    return this.adaptiveCard.length === 0
      ? null
      : this.adaptiveCard[this.adaptiveCard.length - 1]
  }

  addAdaptiveCard (adaptiveCardId, arrayPath) {
    this.adaptiveCard.push({ adaptiveCardId, arrayPath })
  }

  // onRoot () {
  //   return this.adaptiveCard.length < 2
  // }

  removeAdaptiveCard () {
    return this.adaptiveCard.pop()
  }
}

module.exports = new AdaptiveCardTracker()
