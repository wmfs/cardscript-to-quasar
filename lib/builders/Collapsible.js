const { COLORS, TEXT_WHITE } = require('./../utils/color-reference')

module.exports = function (definition, options) {
  const { title, subtitle, badge, badgeColor, showWhen } = definition

  let template = `<q-expansion-item ${showWhen ? `v-if="${showWhen}"` : ''}>`
  template += `<template v-slot:header>`
  template += `<q-item-section>`
  template += `<q-item-label>${title}</q-item-label>`

  if (badge) {
    let color = `primary`
    let textColor = `white`

    if (badgeColor && COLORS[badgeColor]) {
      color = COLORS[badgeColor]
      if (TEXT_WHITE.includes(badgeColor)) {
        textColor = 'white'
      }
    }

    template += `<q-item-label><q-badge color="${color}" text-color="${textColor}">${badge}</q-badge></q-item-label>`
  }

  if (subtitle) {
    const subtitles = Array.isArray(subtitle) ? subtitle : [subtitle]

    subtitles.forEach(st => {
      template += `<q-item-label caption>${st}</q-item-label>`
    })
  }

  template += `</q-item-section>`

  template += `</template><q-card><q-card-section>`

  return template
}
