import request from '@/utils/request'
import { GetVisitData } from '@/utils'
// const IMAGE_API = process.env.IMAGE_API;

// 获取商品信息
export function prodInfo(data) {
  return request({
    url: '/Good/GoodInfo',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 获取一页商品列表
export function prodPage(data) {
  return request({
    url: '/Good/GoodPage',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 添加商品
export function prodAdd(data) {
  return request({
    url: '/Good/GoodAdd',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 商品修改
export function prodUpdate(data) {
  return request({
    url: '/Good/GoodUpdate',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 商品上下架
export function prodOnOff(data) {
  return request({
    url: '/Good/GoodOnOff',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 商品删除
export function prodDel(data) {
  return request({
    url: '/Good/GoodDelete',
    method: 'post',
    data: GetVisitData(data)
  })
}

// 商品搜索列表
export function goodList(GoodName) {
  return request({
    url: '/Good/GoodList',
    method: 'post',
    data: GetVisitData(GoodName)
  })
}

// 商品企业会员列表
export function goodCompanyList(GoodName) {
  return request({
    url: '/Good/GoodCompanyList',
    method: 'post',
    data: GetVisitData(GoodName)
  })
}
