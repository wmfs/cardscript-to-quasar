/* eslint-env mocha */

'use strict'
const TimelineEntry = require('./../lib/builders/TimelineEntry')
const chai = require('chai')
const expect = chai.expect

describe('timeline entry construction tests', function () {
  it('just a title', function () {
    const timelineEntry = TimelineEntry({
      icon: null,
      color: null,
      title: 'TITLE',
      subtitle: null,
      showWhen: null,
      showLaunches: null
    }, null)
    expect(timelineEntry).to.eql('<q-timeline-entry><template v-slot:title><div class="row"><div class="col"><span class="item-label-non-link">TITLE</span></div></div></template><template v-slot:subtitle></template>')
  })

  it('title and subtitle', function () {
    const timelineEntry = TimelineEntry({
      icon: null,
      color: null,
      title: 'TITLE',
      subtitle: 'SUBTITLE',
      showWhen: null,
      showLaunches: null
    }, null)
    expect(timelineEntry).to.eql('<q-timeline-entry><template v-slot:title><div class="row"><div class="col"><span class="item-label-non-link">TITLE</span></div></div></template><template v-slot:subtitle>SUBTITLE</template>')
  })
})
