const ComponentBuilder = require('./../utils/Component-builder')
const { inspect } = require('../utils/local-util')

module.exports = function (definition, options) {
  const { sources, poster, sourceType } = definition
  // sourceType can be mp4, mov, youtube, vimeo

  // const opts = {
  //   muted: false,
  //   language: 'en',
  //   playbackRates: [0.7, 1.0, 1.5, 2.0],
  //   height: '500px',
  //   width: '100%',
  //   sources: sources.map(({ mimeType, url }) => {
  //     return {
  //       type: mimeType,
  //       src: url
  //     }
  //   })
  // }

  const builder = new ComponentBuilder(definition)

  const div = builder.addTag('div')

  // const videoPlayer = builder.addTag('video-player')
  // videoPlayer.addAttribute('class', 'video-player-box q-mt-md')
  // videoPlayer.addAttribute('ref', 'videoPlayer')
  // videoPlayer.addAttribute(':options', inspect(opts))

  if (['mp4', 'mov'].includes(sourceType)) {
    for (const src of sources) {
      const source = [{
        type: src.mimeType,
        src: src.url
      }]

      const mediaPlayer = div
        .addChildTag('q-media-player')
        .addAttribute('type', src.type)
        .addAttribute(':sources', inspect(source))

      if (poster) mediaPlayer.addAttribute('poster', poster)
    }
  } else if (['vimeo', 'youtube'].includes(sourceType)) {
    for (const src of sources) {
      div
        .addChildTag('div')
        .addChildTag('q-video')
        .addAttribute('src', src.url)
        .addAttribute(':ratio', '16/9')
    }
  }

  return builder.compile()
}
