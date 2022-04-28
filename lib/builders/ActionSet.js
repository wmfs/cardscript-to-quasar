const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

const ComponentBuilder = require('./../utils/Component-builder')

module.exports = function (definition, options) {
  const {
    showWhen,
    spacing,
    actionStyle = 'list',
    title
  } = definition

  const builder = new ComponentBuilder(definition, { disableShowWhen: true })
  const div = builder.addTag('div', { includeClosingTag: false })

  if (actionStyle === 'buttons') {
    if (showWhen) div.addAttribute('v-if', showWhen)
  } else if (actionStyle === 'list' || actionStyle === 'dropdown') {
    const classes = ['link-item']

    if (actionStyle === 'dropdown') {
      if (spacing === 'padding') {
        classes.push('q-px-md')
      } else if (spacing && MARGINS[spacing]) {
        classes.push(`q-mt-${MARGINS[spacing]}`)
      }
    }

    if (actionStyle === 'list') {
      if (spacing === 'padding') {
        classes.push('q-pa-md')
      } else if (spacing && MARGINS[spacing]) {
        classes.push(`q-mt-${MARGINS[spacing]}`)
        classes.push('q-pa-none')
      } else {
        classes.push('q-pa-none')
      }
    }

    let parent = div

    if (actionStyle === 'dropdown') {
      parent = div
        .addChildTag('q-btn-dropdown', { includeClosingTag: false })
        .addAttribute('auto-close', null)
        .addAttribute('color', 'primary')
        .addAttribute('dense', null)
        .addAttribute('no-icon-animation', null)
        .addAttribute('dropdown-icon', 'more_vert')

      if (!title) parent.addAttribute('rounded', null)

      // parent.addAttribute('class', classes.join(' '))

      if (title) parent.addAttribute('label', title)
      if (showWhen) parent.addAttribute('v-if', showWhen)
    }

    const listGroup = parent.addChildTag('q-list', { includeClosingTag: false })

    // listGroup.addAttribute('no-border', null)

    if (actionStyle === 'list') {
      listGroup.addAttribute('class', classes.join(' '))

      if (showWhen) listGroup.addAttribute('v-if', showWhen)
    }
  }

  return builder.compile()
}
