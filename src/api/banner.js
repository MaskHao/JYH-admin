import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 横幅列表
export function bannerList(data) {
  return request({
    url: '/Banner/BannerList',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 横幅添加
export function bannerAdd(data) {
  return request({
    url: '/Banner/BannerAdd',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 横幅删除
export function bannerDelete(data) {
  return request({
    url: '/Banner/BannerDelete',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 管理员发货接口
export function bannerSort(data) {
  return request({
    url: '/Banner/BannerSort',
    method: 'POST',
    data: GetVisitData(data)
  })
}
