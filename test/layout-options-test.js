/* eslint-env mocha */

const expect = require('chai').expect
const cardscriptToQuasar = require('./../lib')

const build = body => cardscriptToQuasar({ type: 'AdaptiveCard', body }).template

describe('Layout options', () => {
  it('FactSet grid lays facts out in responsive columns', () => {
    const template = build([{
      type: 'FactSet',
      layout: 'grid',
      facts: [
        { title: 'Score', value: '{{ data.score }}', emphasis: true, subtitle: 'Calculated' },
        { title: 'Band', value: 'High', showWhen: 'data.band' }
      ]
    }])
    expect(template).to.contain('class="row q-col-gutter-md q-py-sm"')
    expect(template).to.contain('class="col-12 col-sm-6 col-md-4" v-if="data.score"')
    expect(template).to.contain('font-size: 28px')
    expect(template).to.contain('Calculated')
    expect(template).to.contain('v-if="data.band"')
    expect(template).to.not.contain('<q-list')
  })

  it('FactSet without layout is unchanged', () => {
    expect(build([{ type: 'FactSet', facts: [{ title: 'A', value: 'B' }] }])).to.contain('<q-list')
  })

  it('Container callout has a coloured bar and light background', () => {
    const template = build([{ type: 'Container', style: 'callout', color: 'warning', items: [{ type: 'TextBlock', text: 'Hi' }] }])
    expect(template).to.contain('border-left: 6px solid #f47738')
    expect(template).to.contain('background: #fff4dc')
    expect(template).to.not.contain('bg-orange')
  })

  it('MarkupTable columns take a subtitle, alignment and width', () => {
    const template = build([{
      type: 'MarkupTable',
      arrayPath: 'data.rows',
      columns: [
        { title: 'Factor', value: '{{ item.factor }}', subtitle: '{{ item.source }}' },
        { title: 'Points', value: '{{ item.points }}', align: 'right', width: '80px', emphasis: true }
      ]
    }])
    expect(template).to.contain('{{ item.source }}')
    expect(template).to.contain('<th class="text-right" style="width: 80px">Points</th>')
    expect(template).to.contain('class="text-right text-weight-bold"')
  })
})
