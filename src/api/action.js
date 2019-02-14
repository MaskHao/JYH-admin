import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 活动参与添加接口
export function activeAdd(data) {
  return request({
    url: '/Good/ActiveAdd',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动参与详情接口
export function activeInfo(data) {
  return request({
    url: '/Good/ActiveInfo',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动参与删除接口
export function activeDelete(data) {
  return request({
    url: '/Good/ActiveDelete',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动参与修改接口
export function activeUpdate(data) {
  return request({
    url: '/Good/ActiveUpdate',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动参与列表接口
export function activePage(data) {
  return request({
    url: '/Good/ActivePage',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动参与迁移为爱心回顾接口
export function upcomingConvertToLove(data) {
  return request({
    url: '/Good/UpcomingConvertToLove',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 活动回顾添加接口
export function loveAdd(data) {
  return request({
    url: '/Good/LoveAdd',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动回顾详情接口
export function loveInfo(data) {
  return request({
    url: '/Good/LoveInfo',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动回顾删除接口
export function loveDelete(data) {
  return request({
    url: '/Good/LoveDelete',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动回顾修改接口
export function loveUpdate(data) {
  return request({
    url: '/Good/LoveUpdate',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动回顾列表接口
export function lovePage(data) {
  return request({
    url: '/Good/LovePage',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 活动回顾迁移为活动参与接口
export function loveConvertToUpcoming(data) {
  return request({
    url: '/Good/LoveConvertToUpcoming',
    method: 'POST',
    data: GetVisitData(data)
  })
}
