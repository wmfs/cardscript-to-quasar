class ApiLookupTracker {
  constructor () {
    this.apiLookup = []
  }

  insideApiLookup () {
    return this.apiLookup.length > 0
  }

  getCurrentApiLookup () {
    return this.apiLookup.length === 0
      ? null
      : this.apiLookup[this.apiLookup.length - 1]
  }

  addApiLookup (apiLookupId) {
    this.apiLookup.push(apiLookupId)
  }

  // onRoot () {
  //   return this.apiLookup.length < 2
  // }

  removeApiLookup () {
    return this.apiLookup.pop()
  }
}

module.exports = new ApiLookupTracker()
