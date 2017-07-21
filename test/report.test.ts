import 'mocha'
import { expect } from 'chai'
import { linkClicks, postFormat } from '../src/report'

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

describe('post `type` will map to:', () => {
  it('relativant post format', () => {
    expect(
      postFormat(
        'https://www.just-eat.co.uk/',
        'link',
        'Orders // Facebook // DR // Cyber Monday Discount // Web // Lookalike 1% B - App & Web Customers last 3 months'
      )
    ).to.equal('link, justeat')
    expect(
      postFormat(
        'https://itunes.apple.com/app/id566347057',
        'link',
        'Bear Carousel - 10154983170762552'
      )
    ).to.equal('link, app, carousel')

    expect(postFormat(null, 'offer', 'NYDVideo_Pizza')).to.equal('offer')

    expect(
      postFormat(
        'https://www.facebook.com/justeat/videos/10154977460747552/',
        'link',
        'Pizza Steam Video Carousel 2'
      )
    ).to.equal('link, videos, video carousel')

    expect(
      postFormat(
        'http://play.google.com/store/apps/details?id=com.justeat.app.uk',
        'link',
        'DARK_image_Carousel Post_West Image Brompton'
      )
    ).to.equal('link, app, image carousel')

    expect(
      postFormat('https://fb.com/canvas_doc/205771613217445', 'link', null)
    ).to.equal('link, canvas')

    expect(
      postFormat(
        null,
        'link',
        'DARK_Video Link Post_Chef Factor_Custom Audience Creative'
      )
    ).to.equal('link')
  })
})

//TODO: test adFormat using the bellow
//EXAMPLE AD_NAMEs:
// DARK_Image Carousel Post_W1S
//  DARK_Image Link Post_SE8_Indian
//  Pizza Steam Video Carousel 2
//  Hands DR 2
//  DARK_Image Link Post_G13_Indian
//  DARK_Image Link Post_Paisley_burger
//  New Brand // Video Post Ad // Video Views // TVC
