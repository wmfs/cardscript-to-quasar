# cardscript-to-quasar

[![Tymly Cardscript](https://img.shields.io/badge/tymly-cardscript-blue.svg)](https://tymly.io/)
[![Build Status](https://travis-ci.com/wmfs/cardscript-to-quasar.svg?branch=master)](https://travis-ci.com/wmfs/cardscript-to-quasar)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/cardscript-to-quasar.svg)](https://www.npmjs.com/package/@wmfs/cardscript-to-quasar) 
[![codecov](https://codecov.io/gh/wmfs/cardscript-to-quasar/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/cardscript-to-quasar) 
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/cardscript-to-quasar/badge)](https://www.codefactor.io/repository/github/wmfs/cardscript-to-quasar) 
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/) 
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) 
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly/blob/master/packages/concrete-paths/LICENSE)

> Produces a template for use with Quasar from some Cardscript.

## <a name="install"></a>Install
```bash
$ npm install cardscript-to-quasar --save
```

## <a name="usage"></a>Usage

```javascript
const cardscriptToQuasar = require('@wmfs/cardscript-extract-defaults')

const quasarTemplate = cardscriptToQuasar(
  {
    "type": "AdaptiveCard",
    "body": [
      {
        "type": "TextBlock",
        "text": "Change me!",
        "color": "attention",
        "horizontalAlignment": "center"
      }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0"
  }
)

```

## <a name="test"></a>Testing

```bash
$ npm test
```

## <a name="license"></a>License
[MIT](https://github.com/wmfs/cardscript/blob/master/LICENSE)


