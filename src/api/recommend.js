import request from '@/utils/request'

import { GetVisitData } from '@/utils'

// 新增推荐商品接口
export function addRecommend(data) {
  return request({
    url: '/Recommend/RecommendAdd',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// DeleteRecommend
export function deleteRecommend(data) {
  return request({
    url: '/Recommend/RecommendDelete',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// RecommendList
export function recommendList(data) {
  return request({
    url: '/Recommend/RecommendList',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// RecommendSort
export function recommendSort(data) {
  return request({
    url: '/Recommend/RecommendSort',
    method: 'POST',
    data: GetVisitData(data)
  })
}
