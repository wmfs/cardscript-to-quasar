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
      '<q-map :id="\'minimal\'" :locked="false" :draggable="false">',
      '<q-map-circle :data="data" :m="{ format: \'OSGridRef\',\n  x: \'actualX\',\n  y: \'actualY\',\n  label: \'Minimal\' }" format="OSGridRef" :x="data?.actualX" :y="data?.actualY" :showMarker="true" :showLaunches="false" :launches="[]" :label="[ \'Minimal\' ]"',
      '@x="v => { data.actualX = v }" @y="v => { data.actualY = v }"'
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
      '<q-map :id="\'minimal\'" :locked="false" :draggable="false">',
      '<q-map-circle :data="data" :m="{ format: \'OSGridRef\',\n  x: \'actualX\',\n  y: \'actualY\',\n  label: \'Minimal\',\n  locked: true }" format="OSGridRef" :x="data?.actualX" :y="data?.actualY" :showMarker="true" :showLaunches="false" :launches="[]" :label="[ \'Minimal\' ]"',
      'locked="true">'
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
      '<q-map :id="\'minimal\'" :locked="false" :draggable="false">',
      '<q-map-circle :data="data" :m="{ format: \'OSGridRef\',\n  x: \'actualX\',\n  y: \'actualY\',\n  label: \'Minimal\',\n  locked: true,\n  showCoordinates: true }" format="OSGridRef" :x="data?.actualX" :y="data?.actualY"',
      ':showMarker="true" :showLaunches="false" :launches="[]" :label="[ \'Minimal\' ]" locked="true"',
      '<q-btn icon="room" round flat dense style="color: #443DF6;" @click="mapJumpToXY(\'minimal\', data.actualX, data.actualY)"></q-btn>'
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

    const expectedQuasar = '<div><q-map :id="\'minimal\'" :locked="false" :draggable="false"><q-map-circle :data="data" :m="{ format: \'OSGridRef\',\n  x: \'actualX\',\n  y: \'actualY\',\n  label: \'Minimal\' }" format="OSGridRef" :x="data?.actualX" :y="data?.actualY" :showMarker="true" :showLaunches="false" :launches="[]" :label="[ \'Minimal\' ]" @x="v => { data.actualX = v }" @y="v => { data.actualY = v }"></q-map-circle></q-map></div>'

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
