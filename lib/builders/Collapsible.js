module.exports = function (definition, options) {
  const { title, subtitle, badge, showWhen } = definition

  let template = `<q-expansion-item ${showWhen ? `v-if="${showWhen}"` : ''}>`
  template += `<template v-slot:header>`
  template += `<q-item-section>`
  template += `<q-item-label>${title}</q-item-label>`

  if (badge) {
    template += `<q-item-label><q-badge color="primary" text-color="white">${badge}</q-badge></q-item-label>`
  }

  if (subtitle) {
    template += `<q-item-label caption>${subtitle}</q-item-label>`
  }

  template += `</q-item-section>`

  template += `</template><q-card><q-card-section>`

  return template
}
