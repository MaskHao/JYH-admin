import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 爱心进展信息列表接口
export function progressInfoList(data) {
  return request({
    url: '/Progress/ProgressInfoList',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 爱心进展审核接口
export function progressCheck(data) {
  return request({
    url: '/Progress/ProgressCheck',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 爱心项目名单人员列表接口
export function goodReporterList(data) {
  return request({
    url: '/Member/GoodReporterList',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 爱心项目删除列表接口
export function reporterDelete(data) {
  return request({
    url: '/Member/ReporterDelete',
    method: 'POST',
    data: GetVisitData(data)
  })
}
