# cardscript-to-quasar

[![Tymly Cardscript](https://img.shields.io/badge/tymly-cardscript-blue.svg)](https://tymly.io/)
[![CircleCI](https://circleci.com/gh/wmfs/cardscript-to-quasar.svg?style=svg)](https://circleci.com/gh/wmfs/cardscript-to-quasar)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/cardscript-to-quasar.svg)](https://www.npmjs.com/package/@wmfs/cardscript-to-quasar)
[![codecov](https://codecov.io/gh/wmfs/cardscript-to-quasar/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/cardscript-to-quasar)
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/cardscript-to-quasar/badge)](https://www.codefactor.io/repository/github/wmfs/cardscript-to-quasar)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly/blob/master/packages/concrete-paths/LICENSE)

> Produces HTML with Quasar-markup from Cardscript JSON

## <a name="install"></a>Install
```bash
$ npm install @wmfs/cardscript-to-quasar --save
```

## <a name="usage"></a>Usage

```javascript
const cardscriptToQuasar = require('@wmfs/cardscript-to-quasar')

const quasarTemplate = cardscriptToQuasar(
  //
  // Some Cardscript:
  //
  {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0",
    "type": "AdaptiveCard",
    "body": [
      {
        "type": "TextBlock",
        "text": "Change me!",
        "color": "attention",
        "horizontalAlignment": "center"
      }
    ]
  },
  // Some options:
  {
    "fieldLabelWidth": 12,
    "imageSourceTemplate": "url(statics/${imagePath})"
  }
)

// quasarTemplate:
//   HTML string with Quasar components all configured to best represent the supplied Cardscript.

```

## API

### `cardscriptToQuasar(cardscriptJSON, options)`

## Options

* All options are optional

| Option | Description |
| ------ | ----------- |
| `fieldLabelWidth` | For Cardscript components that will be generated within a [Quasar field component](https://quasar-framework.org/components/field.html), this is the value passed to the `label-width` property, defaults to `12` (e.g. labels will always be above field components, and not rendered to the side). |
| `imageSourceTemplate` | This is a string-template for use by Cardscript components such as [Jumbotron](https://wmfs.github.io/tymly-website/reference/cardscript/elements/jumbotron.html#backgroundimage) to conjure a full reference to an image. Defaults to `url(statics/${imagePath})`. Note `imagePath` here is the value provided in the Cardscript config for the component (e.g. the value of `backgroundImage` in the case of the Jumbotron).|


## <a name="test"></a>Testing

```bash
$ npm test
```

## <a name="license"></a>License
[MIT](https://github.com/wmfs/cardscript/blob/master/LICENSE)

