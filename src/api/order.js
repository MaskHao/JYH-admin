import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 查询实物订单一页列表
export function goodOrder(data) {
  return request({
    url: '/Order/GoodOrder',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 查询虚拟订单一页列表
export function order(Order) {
  return request({
    url: '/Order/Order',
    method: 'POST',
    data: GetVisitData(Order)
  })
}

// 订单详情
export function orderInfo(data) {
  return request({
    url: '/Order/OrderInfo',
    method: 'POST',
    data: GetVisitData(data)
  })
}
// 发货接口
export function orderShip(data) {
  return request({
    url: '/Order/OrderShip',
    method: 'POST',
    data: GetVisitData(data)
  })
}

// 导出报表接口
export function orderExport(data) {
  return request({
    url: '/Order/OrderExport',
    method: 'POST',
    data: GetVisitData(data)
  })
}
