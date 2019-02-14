import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 会员企业列表接口
export function companyList(data) {
  return request({
    url: '/Member/CompanyList',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 企业信息修改接口
export function memberUpdate(data) {
  return request({
    url: '/Member/MemberUpdate',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 会员信息列表接口
export function memberList(data) {
  return request({
    url: '/Member/MemberList',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 会员记录者接口
export function memberReporter(data) {
  return request({
    url: '/Member/MemberReporter',
    method: 'POST',
    data: GetVisitData(data)
  })
}
