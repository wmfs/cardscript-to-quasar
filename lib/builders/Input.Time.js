const ComponentBuilder = require('./../utils/Component-builder')
const applySpacing = require('./../utils/apply-spacing')
const applySeparator = require('./../utils/apply-separator')

module.exports = function (definition, options) {
  const {
    // max,
    // min,
    // placeholder,
    spacing,
    separator
  } = definition

  const builder = new ComponentBuilder(definition)
  const input = builder.addTag('q-input')
  input.bindToModel(definition)

  input
    .addAttribute('mask', 'fulltime')
    .addAttribute(':rules', '[\'fulltime\']')
    // template
    .addChildTag('template')
    .addAttribute('v-slot:prepend', null)
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
    .addAttribute('with-seconds', null)
    .addAttribute('format24h', null)
    .bindToModel(definition)

  // if (placeholder) date.addAttribute('placeholder', placeholder)

  applySpacing({ spacing, source: input })
  applySeparator({ separator, source: input })

  return builder.compile()
}

/*
<q-input filled v-model="timeWithSeconds" mask="fulltime" :rules="['fulltime']">
  <template v-slot:append>
    <q-icon name="access_time" class="cursor-pointer">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-time
          v-model="timeWithSeconds"
          with-seconds
          format24h
        />
      </q-popup-proxy>
    </q-icon>
  </template>
</q-input>
 */
