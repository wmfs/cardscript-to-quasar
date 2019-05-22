// A helper function for things like Input.Text, Input.Name, Input.Email
const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  default: 'lg',
  extraLarge: 'xl'
}
// TODO: isMultiline, maxLength, title, style (text, tel, url, email) need support?
module.exports = function TextField (definition, elementOptions, additionalOptions) {
  const {
    id,
    placeholder,
    spacing,
    separator,
    editor,
    validation
  } = definition

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  const icon = definition.icon || additionalOptions.icon
  const label = definition.title || additionalOptions.title || placeholder // TODO: Needs to be better, placeholder as well.
  const type = definition.type || additionalOptions.type
  let input
  if (editor) {
    input = div.addChildTag('q-editor')
  } else {
    // const field = div.addChildTag('q-field')
    // field.addAttribute('label', label)
    // field.addAttribute('label-width', '12')
    // if (icon) {
    //   field.addAttribute('icon', icon)
    // } else {
    //   // todo
    //   // field.addAttribute('inset', 'icon')
    // }

    input = div
      .addChildTag('q-input')
      .addAttribute('label', label) // TODO: change for GDS style labels

    if (icon) {
      /*
        TODO
        <template v-slot:prepend>
          <q-icon name="event" />
         </template>
      */
    }
  }

  input.bindToModel(definition)

  const classes = []
  const styles = []

  if (type) {
    // input.addAttribute('type', type)
  }

  if (definition.isMultiline || additionalOptions.isMultiline) {
    input.addAttribute('type', 'textarea')
  }

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)
  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-py-${MARGINS[spacing]}`)
  } else {
    classes.push(`q-py-${MARGINS.default}`)
  }

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))
  if (styles.length > 0) div.addAttribute('style', styles.join('; '))
  if (validation && id) input.addAttribute(':error', `$v.data.${id}.$error`) // TODO: Might be field now?

  return builder.compile()
}
