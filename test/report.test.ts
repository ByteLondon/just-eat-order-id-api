import 'mocha'
import { expect } from 'chai'
import { linkClicks } from '../src/report'

describe('LINK_CLICKS objective will map to:', () => {
  it('correct marketing objective', () => {
    expect(linkClicks('https://www.just-eat.co.uk/')).to.equal('orders')

    expect(linkClicks('https://itunes.apple.com/app/id566347057')).to.equal(
      'orders/app installs'
    )

    expect(linkClicks('https://itunes.apple.com/app/id566347057')).to.equal(
      'orders/app installs'
    )

    expect(
      linkClicks(
        'http://www.just-eat.co.uk/?utm_source=facebook&utm_medium=social&utm_campaign=22Feb17-24Feb17_Brand_UK_ChewmungousVideo_12_R-F_OPT-Video-Views_CG-Awareness_BTL-Appetite-Appeal-Content_Native'
      )
    ).to.equal('orders')

    expect(
      linkClicks('https://www.facebook.com/justeat/videos/10154977460747552/')
    ).to.equal('awareness')

    expect(
      linkClicks(
        'http://play.google.com/store/apps/details?id=com.justeat.app.uk'
      )
    ).to.equal('orders/app installs')

    expect(linkClicks('https://fb.com/canvas_doc/205771613217445')).to.equal(
      'engagement'
    )
  })
})
