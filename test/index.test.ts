import 'mocha'
import { expect } from 'chai'
import { creatives } from '../src/index'
import creativeIds from './facebook/util/creativeIds-data.test'
import { Creative, CreativeId } from '../src/facebook/creatives'
import { select } from '../src/model/facebook-creatives'

const params = {
  since: '2016-10-01',
  until: '2017-06-01'
}

const creative = {
  effective_object_story_id: '340627227551_10154502015927552',
  id: '23842508456850246'
}

const creativeId = [
  {
    adcreatives: {
      data: [
        {
          id: '23842532883490246'
        }
      ]
    },
    created_time: '',
    insights: {
      data: [
        {
          date_start: '',
          date_stop: '',
          impressions: '',
          spend: '',
          account_id: '',
          campaign_id: '',
          adset_id: '',
          ad_id: ''
        }
      ],
      paging: {
        cursors: {
          before: '',
          after: ''
        }
      }
    },
    creative: {
      id: '23842508469680246'
    },
    id: '23842508456850246'
  }
]
// interface x {
//   ad_id: string
//   post_id: string
// }
// const MockAPI = {
//   creative: async (
//     authToken: string,
//     creativeId: string,
//     since: string
//   ): Promise<Creative> => creative,
//   creativeIds: async (
//     authToken: string,
//     id: string,
//     since: string
//   ): Promise<CreativeId[]> => creativeIds,
//   update: (): Promise<Creative> => creative
// }

// describe('Creatives', () => {
//   it('', () => {
//     console.log(
//       creatives(
//         params,
//         MockAPI.creative,
//         MockAPI.creativeIds,
//         MockAPI.update
//       ).then(select(creative))
//     )
//   })
// })
