const ComponentBuilder = require('./../utils/Component-builder')
const applyErrorCheck = require('./../utils/apply-error-check')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    max,
    min,
    // placeholder,
    id,
    title,
    spacing,
    separator,
    withSeconds
    // clearable // TODO clearable, see Input.Date
  } = definition

  // const TODAY = new Date()
  //
  const builder = new ComponentBuilder(definition)
  const div = builder.addTag('div')
  // if (placeholder) date.addAttribute('placeholder', placeholder)

  // if (min) date.addAttribute('min', min === '$TODAY' ? TODAY : min)
  // if (max) date.addAttribute('max', max === '$TODAY' ? TODAY : max)

  const classes = []

  if (title) {
    div.content(title)
    classes.push('form-label')
  }

  const input = div
    .addChildTag('q-input')
    .addAttribute('dense', null)
    .addAttribute('readonly', null)
    .addAttribute(':value', `formatDate(${div.getDataPath()}.${id}, 'DD/MM/YYYY HH:mm:ss')`)
    // .bindToModel(definition)

  applyErrorCheck(input, id)

  // Date template
  const dateTemplate = input
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)

  const dateIconEl = dateTemplate
    .addChildTag('q-icon')
    .addAttribute('name', 'event')
    .addAttribute('class', 'cursor-pointer')

  const datePopupProxy = dateIconEl
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')

  const dateEl = datePopupProxy
    .addChildTag('q-date')
    .addAttribute('mask', 'YYYY-MM-DDTHH:mm:ss.SSSZ')

  dateEl.bindToModel(definition)

  const d = new Date().getDate()
  const m = new Date().getMonth() + 1
  const y = new Date().getFullYear()
  const TODAY = `${y}/${m <= 9 ? '0' + m : m}/${d <= 9 ? '0' + d : d}`

  if (min && max) {
    dateEl.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}' && date <= '${max === '$TODAY' ? TODAY : max}'`)
  } else if (min) {
    dateEl.addAttribute(':options', `date => date >= '${min === '$TODAY' ? TODAY : min}'`)
  } else if (max) {
    dateEl.addAttribute(':options', `date => date <= '${max === '$TODAY' ? TODAY : max}'`)
  }

  // Time template
  const timeTemplate = input
    .addChildTag('template')
    .addAttribute('v-slot:append', null)

  const timeIconEl = timeTemplate
    .addChildTag('q-icon')
    .addAttribute('name', 'access_time')
    .addAttribute('class', 'cursor-pointer')

  const timePopupProxy = timeIconEl
    .addChildTag('q-popup-proxy')
    .addAttribute('transition-show', 'scale')
    .addAttribute('transition-hide', 'scale')

  const timeEl = timePopupProxy
    .addChildTag('q-time')
    .addAttribute('mask', 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    .addAttribute('format24h', null)
    .addAttribute(':withSeconds', withSeconds || false)

  timeEl.bindToModel(definition)

  applySpacing({ spacing, classes })
  applySeparator({ separator, source: div })

  if (classes.length > 0) div.addAttribute('class', classes.join(' '))

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
