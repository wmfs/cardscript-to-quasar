const ComponentBuilder = require('./../utils/Component-builder')

const MARGINS = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl'
}

module.exports = function (definition, options) {
  const {
    // max,
    // min,
    // placeholder,
    title,
    spacing,
    separator
  } = definition

  // const TODAY = new Date()
  //
  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')
  // if (placeholder) date.addAttribute('placeholder', placeholder)

  // if (min) date.addAttribute('min', min === '$TODAY' ? TODAY : min)
  // if (max) date.addAttribute('max', max === '$TODAY' ? TODAY : max)

  if (title) {
    div
      .content(title)
      .addAttribute('class', 'form-label')
  }

  const inputDate = div.addChildTag('q-input')
  inputDate.bindToModel(definition)

  inputDate
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)
    // q-icon
    .addChildTag('q-icon')
    .addAttribute('name', 'event')
    .addAttribute('class', 'cursor-pointer')
    // q-popup-proxy
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')
    // q-date
    .addChildTag('q-date')
    .addAttribute('mask', 'YYYY-MM-DD HH:mm')
    .bindToModel(definition)

  const inputTime = div.addChildTag('q-input')
  inputTime.bindToModel(definition)

  inputTime
    .addAttribute('template')
    .addAttribute('v-slot:append', null)
    // q-icon
    .addChildTag('q-icon')
    .addAttribute('name', 'access_time')
    .addAttribute('class', 'cursor-pointer')
    // q-popup-proxy
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')
    // q-time
    .addChildTag('q-time')
    .addAttribute('mask', 'YYYY-MM-DD HH:mm')
    .addAttribute('format24h', null)
    .bindToModel(definition)

  const classes = []
  const styles = []

  if (separator) styles.push(`border-top: 1px solid rgb(238, 238, 238)`, `margin-top: 8px`, `padding-top: 8px`)

  if (spacing === 'padding') {
    classes.push('q-pa-md')
  } else if (MARGINS[spacing]) {
    classes.push(`q-mt-${MARGINS[spacing]}`)
  }

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))
  if (styles.length > 0) div.add('style', styles.join('; '))

  return builder.compile()
}
/*
    <q-input filled v-model="date">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="YYYY-MM-DD HH:mm" />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
 */
