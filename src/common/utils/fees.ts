import request from './request'
import { BTC_RECOMMENDED_FEE_URL } from '../constants'

export const getRecommendedFee = () => {
  return request(`${BTC_RECOMMENDED_FEE_URL}`, { method: 'GET' })
    .then(({ hourFee }: { hourFee: number }) => hourFee)
}
