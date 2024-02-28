/* eslint-env mocha */

'use strict'
const Chip = require('./../lib/builders/Chip')
const chai = require('chai')
const expect = chai.expect

describe('badge construction tests', function () {
  it('just text', function () {
    const badge = Chip({
      style: 'badge',
      icon: null,
      text: 'TEXT',
      topSpacing: null
    }, null)
    expect(badge).to.eql('<q-badge multi-line class="q-mr-sm q-mb-none q-ml-none q-mt-md">TEXT</q-badge>')
  })

  it('icon and text', function () {
    const badge = Chip({
      style: 'badge',
      icon: 'repeat',
      text: 'TEXT',
      topSpacing: null
    }, null)
    expect(badge).to.eql('<q-badge multi-line class="q-mr-sm q-mb-none q-ml-none q-mt-md">TEXT<q-icon name="repeat"></q-icon></q-badge>')
  })

  it('icon and text with undefined top spacing', function () {
    const badge = Chip({
      style: 'badge',
      icon: 'repeat',
      text: 'TEXT',
      topSpacing: null
    }, null)
    expect(badge).to.eql('<q-badge multi-line class="q-mr-sm q-mb-none q-ml-none q-mt-md">TEXT<q-icon name="repeat"></q-icon></q-badge>')
  })

  it('icon and text with medium (default) top spacing', function () {
    const badge = Chip({
      style: 'badge',
      icon: 'repeat',
      text: 'TEXT',
      topSpacing: 'medium'
    }, null)
    expect(badge).to.eql('<q-badge multi-line class="q-mr-sm q-mb-none q-ml-none q-mt-md">TEXT<q-icon name="repeat"></q-icon></q-badge>')
  })

  it('icon and text with small top spacing', function () {
    const badge = Chip({
      style: 'badge',
      icon: 'repeat',
      text: 'TEXT',
      topSpacing: 'small'
    }, null)
    expect(badge).to.eql('<q-badge multi-line class="q-mr-sm q-mb-none q-ml-none q-mt-sm">TEXT<q-icon name="repeat"></q-icon></q-badge>')
  })

  it('icon and text with no top spacing', function () {
    const badge = Chip({
      style: 'badge',
      icon: 'repeat',
      text: 'TEXT',
      topSpacing: 'none'
    }, null)
    expect(badge).to.eql('<q-badge multi-line class="q-mr-sm q-mb-none q-ml-none q-mt-none">TEXT<q-icon name="repeat"></q-icon></q-badge>')
  })
})
