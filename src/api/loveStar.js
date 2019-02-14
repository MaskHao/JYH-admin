import request from '@/utils/request'
import { GetVisitData } from '@/utils'

export function starAdd(data) {
  return request({
    url: '/Star/StarAdd',
    method: 'post',
    data: GetVisitData(data)
  })
}
export function starDelete(data) {
  return request({
    url: '/Star/StarDelete',
    method: 'post',
    data: GetVisitData(data)
  })
}
export function starSort(data) {
  return request({
    url: '/Star/StarSort',
    method: 'post',
    data: GetVisitData(data)
  })
}
export function starList(data) {
  return request({
    url: '/Star/StarList',
    method: 'post',
    data: GetVisitData(data)
  })
}
export function starUpdate(data) {
  return request({
    url: '/Star/StarUpdate',
    method: 'post',
    data: GetVisitData(data)
  })
}
