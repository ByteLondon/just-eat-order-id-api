import 'mocha'
import { expect } from 'chai'
import { determinePagination } from '../../../src/facebook/util/paged-data'
import insights from './insights-data.test'
import adCreativeIds from './adcreativeIds-data.test'

describe('It should paginate:', () => {
  it('insight data correctly', () => {
    expect(determinePagination(insights, '2017-07-04')).to.be.true
  })
  it('adcreative data correctly', () => {
    expect(determinePagination(adCreativeIds, '2017-07-04')).to.be.true
  })
})
