import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 协议详情
export function setAgreement(data) {
  return request({
    url: '/Setting/SetAgreement',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 协议修改
export function setAgreementUpdate(data) {
  return request({
    url: '/Setting/SetAgreementUpdate',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 协议上传
export function setAgreementAdd(data) {
  return request({
    url: '/Setting/SetAgreementAdd',
    method: 'POST',
    data: GetVisitData(data)
  })
}
