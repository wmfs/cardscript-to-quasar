/* eslint-env mocha */

const expect = require('chai').expect
const cardscriptToQuasar = require('./../lib')
const addressPickerConfig = require('./../lib/utils/address-picker-config')

describe('Input.Address (address picker)', () => {
  it('renders the address picker component with its settings', () => {
    const { template } = cardscriptToQuasar({
      type: 'AdaptiveCard',
      body: [{ type: 'Input.Address', id: 'selectedUprn', title: 'Where is the property?' }]
    })

    expect(template).to.contain('id="CARDSCRIPT_selectedUprn"')
    expect(template).to.contain('<tymly-address-picker')
    expect(template).to.contain(':model="data"')
    expect(template).to.contain('@update="patch => Object.assign(data, patch)"')
    expect(template).to.contain('&quot;title&quot;:&quot;Where is the property?&quot;')
    expect(template).to.not.contain('"title"')
  })

  it('wraps the picker in showWhen', () => {
    const { template } = cardscriptToQuasar({
      type: 'AdaptiveCard',
      body: [{ type: 'Input.Address', id: 'uprn', showWhen: 'data.isReady === true' }]
    })
    expect(template).to.contain('<template v-if="data.isReady === true">')
  })
})

describe('addressPickerConfig', () => {
  it('has sensible defaults', () => {
    const config = addressPickerConfig({ id: 'selectedUprn' })
    expect(config.keys).to.eql({
      uprn: 'selectedUprn',
      addressLabel: 'addressLabel',
      selectedAddress: 'selectedAddress',
      cannotFindAddress: 'cannotFindAddress',
      latitude: 'latitude',
      longitude: 'longitude'
    })
    expect(config.manualEntryFields.map(f => f.id)).to.eql(['addressLine1', 'addressLine2', 'townOrCity', 'county', 'postcode'])
    expect(config.searchEndpoint).to.eql('wmfs_addressPickerSearch_1_0')
    expect(config.validation.required).to.eql(true)
    expect(config.showMap).to.eql(true)
    expect(config.markerClick).to.eql('confirm')
    expect(config.markerActionLabel).to.eql('Choose this address')
  })

  it('can be customised', () => {
    const config = addressPickerConfig({
      id: 'home_uprn',
      idPrefix: 'home',
      manualEntryFields: ['buildingName', { key: 'addressLine1', title: 'Street' }, 'postcode'],
      showMap: false,
      markerClick: 'select',
      allowGeoLocation: false,
      resultsPerPage: 100,
      validation: { requiredIf: 'data.hasHome === true', message: 'Choose the home address' }
    })
    expect(config.keys.cannotFindAddress).to.eql('home_cannotFindAddress')
    expect(config.manualEntryFields.map(f => [f.id, f.title, f.required])).to.eql([
      ['home_buildingName', 'Building name or description', false],
      ['home_addressLine1', 'Street', true],
      ['home_postcode', 'Postcode', true]
    ])
    expect(config.resultsPerPage).to.eql(50)
    expect(config.markerClick).to.eql('select')
    expect(config.validation).to.eql({ required: false, requiredIf: 'data.hasHome === true', message: 'Choose the home address' })
  })
})
