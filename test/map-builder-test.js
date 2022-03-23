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
    quasar: [
      '<q-map :id="\'minimal\'" :locked="false" :draggable="false" aria-label="An interactive map">',
      '<q-map-circle format="OSGridRef" :x="data?.actualX" :y="data?.actualY" label="Minimal"',
      ':showMarker="true" @x="v => { data.actualX = v }" @y="v => { data.actualY = v }"'
    ]
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
    quasar: [
      '<q-map :id="\'minimal\'" :locked="false" :draggable="false" aria-label="An interactive map">',
      '<q-map-circle format="OSGridRef" :x="data?.actualX" :y="data?.actualY" label="Minimal"',
      ':showMarker="true" locked="true">'
    ]
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
    quasar: [
      '<q-map :id="\'minimal\'" :locked="false" :draggable="false" aria-label="An interactive map">',
      '<q-map-circle format="OSGridRef" :x="data?.actualX" :y="data?.actualY" label="Minimal"',
      ':showMarker="true" locked="true"',
      '<q-btn icon="room" round flat dense style="color: #005ea5;" @click="mapJumpToXY(\'minimal\', data.actualX, data.actualY)"></q-btn>'
    ]
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

    const expectedQuasar = "<div><q-map :id=\"'minimal'\" :locked=\"false\" :draggable=\"false\" aria-label=\"An interactive map\"><q-map-circle format=\"OSGridRef\" :x=\"data?.actualX\" :y=\"data?.actualY\" label=\"Minimal\" :showMarker=\"true\" @x=\"v => { data.actualX = v }\" @y=\"v => { data.actualY = v }\"></q-map-circle></q-map></div>"

    const quasar = InputMapBuilder(cardscript, { })
    expect(quasar).to.equal(expectedQuasar)
  })

  for (const test of tests) {
    it(test.title, () => {
      const quasar = InputMapBuilder(test.cardScript, { })

      for (const snippet of test.quasar) {
        expect(quasar).to.have.string(snippet)
      }
    })
  }
})
