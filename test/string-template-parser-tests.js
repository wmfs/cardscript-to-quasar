/* eslint-env mocha */

'use strict'
const stringTemplateParser = require('./../lib/utils/string-template-parser')
const chai = require('chai')
const expect = chai.expect

describe('String template parser tests', () => {
  const cases = [
    ['{{ item.name }}', 'item.name'],
    ['Product details for {{productDetails?.ProductName}}', "'Product details for ' + productDetails?.ProductName"],
    ['hello world {{data.name}} today is {{data.date}} goodbye!', "'hello world ' + data.name + ' today is ' + data.date + ' goodbye!'"]
  ]

  for (const [input, expected] of cases) {
    it(`Attempt to convert ${input}`, () => {
      const result = stringTemplateParser(input)
      expect(result).to.eql(expected)
    })
  }
})
