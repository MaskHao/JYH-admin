import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 手机号码修改接口
export function setPhoneUpdate(data) {
  return request({
    url: '/Setting/SetPhoneUpdate',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 手机号码显示接口
export function setPhone(data) {
  return request({
    url: '/Setting/SetPhone',
    method: 'post',
    data: GetVisitData(data)
  })
}
