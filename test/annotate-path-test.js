/* eslint-env mocha */

const expect = require('chai').expect
const cardscriptToQuasar = require('./../lib')
const annotatePath = require('./../lib/utils/annotate-path')

describe('Element path annotation (used by the cardscript designer)', function () {
  it('adds data-cs-path to the first rendered tag, skipping template wrappers', () => {
    expect(annotatePath('<template v-if="x"><q-card class="a"></q-card></template>', 'body.1'))
      .to.equal('<template v-if="x"><q-card data-cs-path="body.1" class="a"></q-card></template>')
  })

  it('escapes quotes in the path', () => {
    expect(annotatePath('<div></div>', 'a"b')).to.equal('<div data-cs-path="a&quot;b"></div>')
  })

  it('annotates elements that carry __csPath, including nested ones', () => {
    const { template } = cardscriptToQuasar({
      type: 'AdaptiveCard',
      body: [
        { type: 'TextBlock', text: 'Hello', __csPath: 'body.0' },
        { type: 'Container', __csPath: 'body.1', items: [{ type: 'TextBlock', text: 'Inner', __csPath: 'body.1.items.0' }] }
      ]
    })
    expect(template).to.contain('data-cs-path="body.0"')
    expect(template).to.contain('data-cs-path="body.1"')
    expect(template).to.contain('data-cs-path="body.1.items.0"')
  })

  it('leaves normal cards unchanged', () => {
    const { template } = cardscriptToQuasar({ type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] })
    expect(template).to.not.contain('data-cs-path')
  })
})
