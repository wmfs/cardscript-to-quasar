class CardListTracker {
  constructor () {
    this.cardLists = []
  }

  insideACardList () {
    return this.cardLists.length > 0
  }

  getCurrentCardList () {
    return this.cardLists.length === 0
      ? null
      : this.cardLists[this.cardLists.length - 1]
  }

  addCardList (cardListId) {
    this.cardLists.push(cardListId)
  }

  onRoot () {
    return this.cardLists.length < 2
  }

  removeCardList (cardListId) {
    return this.cardLists.pop()
  }
}

module.exports = new CardListTracker()
