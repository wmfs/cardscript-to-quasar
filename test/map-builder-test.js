/* eslint-env mocha */

const InputMapBuilder = require('./../lib/builders/Input.Map')
const expect = require('chai').expect

const tests = [
  {
    title: 'minimal map',
    cardScript: {
      id: 'minimal',
      type: 'Input.Map',
      showMarkerLabels: false,
      markers: [
        {
          format: 'OSGridRef',
          x: 'actualX',
          y: 'actualY',
          label: 'Minimal'
        }
      ]
    },
    quasar: "<div><q-map :id=\"'minimal'\" :locked=\"false\" :draggable=\"false\"><q-map-circle :data=\"data\" :m=\"{ format: 'OSGridRef',\n  x: 'actualX',\n  y: 'actualY',\n  label: 'Minimal' }\" format=\"OSGridRef\" :x=\"data?.actualX\" :y=\"data?.actualY\" :showMarker=\"true\" :showLaunches=\"false\" :launches=\"[]\" :label=\"[ 'Minimal' ]\" @x=\"v => { data.actualX = v }\" @y=\"v => { data.actualY = v }\"></q-map-circle></q-map></div>"
  },
  {
    title: 'locked minimal map',
    cardScript: {
      id: 'minimal',
      type: 'Input.Map',
      showMarkerLabels: false,
      markers: [
        {
          format: 'OSGridRef',
          x: 'actualX',
          y: 'actualY',
          label: 'Minimal',
          locked: true
        }
      ]
    },
    quasar: "<div><q-map :id=\"'minimal'\" :locked=\"false\" :draggable=\"false\"><q-map-circle :data=\"data\" :m=\"{ format: 'OSGridRef',\n  x: 'actualX',\n  y: 'actualY',\n  label: 'Minimal',\n  locked: true }\" format=\"OSGridRef\" :x=\"data?.actualX\" :y=\"data?.actualY\" :showMarker=\"true\" :showLaunches=\"false\" :launches=\"[]\" :label=\"[ 'Minimal' ]\" locked=\"true\"></q-map-circle></q-map></div>"
  },
  {
    title: 'minimal map locked with label',
    cardScript: {
      id: 'minimal',
      type: 'Input.Map',
      showMarkerLabels: true,
      markers: [
        {
          format: 'OSGridRef',
          x: 'actualX',
          y: 'actualY',
          label: 'Minimal',
          locked: true
        }
      ]
    },
    quasar: "<div><q-map :id=\"'minimal'\" :locked=\"false\" :draggable=\"false\"><q-map-circle :data=\"data\" :m=\"{ format: 'OSGridRef',\n  x: 'actualX',\n  y: 'actualY',\n  label: 'Minimal',\n  locked: true,\n  showCoordinates: true }\" format=\"OSGridRef\" :x=\"data?.actualX\" :y=\"data?.actualY\" :showMarker=\"true\" :showLaunches=\"false\" :launches=\"[]\" :label=\"[ 'Minimal' ]\" locked=\"true\"></q-map-circle></q-map></div><q-card flat style=\"border: 1px solid #BFBFBF;\"><q-card-section><q-list><q-item><q-item-section side top><q-btn icon=\"room\" round flat dense style=\"color: #443DF6;\" @click=\"mapJumpToXY('minimal', data.actualX, data.actualY)\"></q-btn></q-item-section><q-item-section><q-item-label>Minimal</q-item-label><q-item-label caption>{{data.actualX}}, {{data.actualY}}</q-item-label caption></q-item-section></q-item></q-list></q-card-section></q-card>"
  }
]

describe('Input.Map builder', () => {
  it('build map', () => {
    const cardscript = {
      id: 'minimal',
      type: 'Input.Map',
      showMarkerLabels: false,
      markers: [
        {
          format: 'OSGridRef',
          x: 'actualX',
          y: 'actualY',
          label: 'Minimal'
        }
      ]
    }

    const expectedQuasar = "<div><q-map :id=\"'minimal'\" :locked=\"false\" :draggable=\"false\"><q-map-circle :data=\"data\" :m=\"{ format: 'OSGridRef',\n  x: 'actualX',\n  y: 'actualY',\n  label: 'Minimal' }\" format=\"OSGridRef\" :x=\"data?.actualX\" :y=\"data?.actualY\" :showMarker=\"true\" :showLaunches=\"false\" :launches=\"[]\" :label=\"[ 'Minimal' ]\" @x=\"v => { data.actualX = v }\" @y=\"v => { data.actualY = v }\"></q-map-circle></q-map></div>"

    const quasar = InputMapBuilder(cardscript, { })
    expect(quasar).to.equal(expectedQuasar)
  })

  for (const test of tests) {
    it(test.title, () => {
      const quasar = InputMapBuilder(test.cardScript, { })

      expect(quasar).to.eql(test.quasar)
    })
  }
})
