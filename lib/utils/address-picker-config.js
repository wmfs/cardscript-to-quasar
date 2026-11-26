// Works out the data keys and settings for an Input.Address (address picker) element.
//
// The same file is copied into cardscript-to-quasar, cardscript-to-vuelidate and
// cardscript-extract-defaults so each package can be released on its own.
// Keep the copies the same.
//
// Data written by the picker (p = idPrefix + '_', or nothing):
//   <id>                 selected UPRN
//   p + addressLabel     label of the chosen address
//   p + selectedAddress  { uprn, label, line, locality, postcode, status, dataSource, dataSourceLabel, temporary, latitude, longitude,
//                          details: { maskingNumber, classification, status, hierarchy } }
//   p + cannotFindAddress  true when the user enters the address by hand
//   p + addressLine1 ... the manual entry fields
//   p + latitude, p + longitude  pin dropped on the manual entry map

const MANUAL_FIELDS = {
  buildingName: { title: 'Building name or description', hint: 'For example, "Flat above the shop" or "Unit 23".', required: false },
  addressLine1: { title: 'Address line 1', required: true, autocomplete: 'address-line1' },
  addressLine2: { title: 'Address line 2', required: false, autocomplete: 'address-line2' },
  townOrCity: { title: 'Town or city', required: true, autocomplete: 'address-level2' },
  county: { title: 'County', required: false, autocomplete: 'address-level1' },
  postcode: { title: 'Postcode', required: true, postcode: true, autocomplete: 'postal-code', width: 'short' }
}

const DEFAULT_MANUAL_FIELDS = ['addressLine1', 'addressLine2', 'townOrCity', 'county', 'postcode']

const DEFAULT_MESSAGE = 'Choose an address, or select "I can\'t find the address"'
const DEFAULT_MESSAGE_NO_MANUAL = 'Choose an address'

function clean (value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

function resolveManualFields (element, prefix) {
  const wanted = Array.isArray(element.manualEntryFields) && element.manualEntryFields.length > 0
    ? element.manualEntryFields
    : DEFAULT_MANUAL_FIELDS

  return wanted
    .map(f => typeof f === 'string' ? { key: f } : f)
    .filter(f => f && clean(f.key))
    .map(f => {
      const known = MANUAL_FIELDS[f.key] || { title: f.key, required: false }
      return {
        ...known,
        ...f,
        id: `${prefix}${f.key}`
      }
    })
}

module.exports = function addressPickerConfig (element = {}) {
  const idPrefix = clean(element.idPrefix)
  const prefix = idPrefix ? `${idPrefix}_` : ''
  const allowManualEntry = element.allowManualEntry !== false
  const validation = element.validation || {}

  return {
    id: element.id,
    idPrefix,
    prefix,
    keys: {
      uprn: element.id,
      addressLabel: `${prefix}addressLabel`,
      selectedAddress: `${prefix}selectedAddress`,
      cannotFindAddress: `${prefix}cannotFindAddress`,
      latitude: `${prefix}latitude`,
      longitude: `${prefix}longitude`
    },
    title: clean(element.title) || 'Find the address',
    subtitle: element.subtitle === '' ? '' : (clean(element.subtitle) || 'Start typing a postcode, street, building name or UPRN.'),
    placeholder: clean(element.placeholder) || '',
    searchEndpoint: clean(element.searchEndpoint) || 'wmfs_addressPickerSearch_1_0',
    // Property details shown once an address is chosen; false or '' turns them off
    detailsEndpoint: element.detailsEndpoint === false || element.detailsEndpoint === '' ? null : (clean(element.detailsEndpoint) || 'wmfs_addressPickerDetails_1_0'),
    searchFields: Array.isArray(element.searchFields) ? element.searchFields.join(',') : clean(element.searchFields),
    resultsPerPage: Number.isInteger(element.resultsPerPage) && element.resultsPerPage > 0 ? Math.min(element.resultsPerPage, 50) : 8,
    tooManyResults: Number.isInteger(element.tooManyResults) && element.tooManyResults > 0 ? element.tooManyResults : 500,
    searchAsYouType: element.searchAsYouType !== false,
    allowGeoLocation: element.allowGeoLocation !== false,
    showMap: element.showMap !== false,
    allowManualEntry,
    manualEntryTitle: clean(element.manualEntryTitle) || 'Enter the address',
    manualEntryNotice: element.manualEntryNotice === '' ? '' : (clean(element.manualEntryNotice) || 'This creates a temporary record. Data Management will match it to an official address. You can carry on with the form now.'),
    manualEntryFields: allowManualEntry ? resolveManualFields(element, prefix) : [],
    onSelectionEndpoint: element.onSelectionEndpoint || null,
    validation: {
      // Required unless the card says otherwise; requiredIf replaces required
      required: validation.required !== false && !clean(validation.requiredIf),
      requiredIf: clean(validation.requiredIf),
      message: clean(validation.message) || (allowManualEntry ? DEFAULT_MESSAGE : DEFAULT_MESSAGE_NO_MANUAL)
    }
  }
}

module.exports.MANUAL_FIELDS = MANUAL_FIELDS
module.exports.DEFAULT_MANUAL_FIELDS = DEFAULT_MANUAL_FIELDS
