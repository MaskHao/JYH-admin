import request from '@/utils/request'
import { GetVisitData } from '@/utils'

// 加密方式登录
export function login(LoginCode, LoginPassword) {
  const loginData = GetVisitData({
    LoginCode,
    LoginPassword
  })
  return request({
    url: '/User/AdminLogin',
    method: 'post',
    data: loginData
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '//User/AdminLogin',
    method: 'get',
    params: {
      token
    }
  })
}

// 登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 修改密码

export function updatePwd(User) {
  return request({
    url: '/User/AdminUpdatePwd',
    method: 'post',
    data: GetVisitData(User)
  })
}

// 添加管理员
export function adminAdd(user) {
  return request({
    url: '/User/AdminAdd',
    method: 'post',
    data: GetVisitData(user)
  })
}

// 管理员列表
export function adminList(AdminID) {
  return request({
    url: '/User/AdminList',
    method: 'post',
    data: GetVisitData(AdminID)
  })
}

// 管理员删除
export function adminDelete(AdminID) {
  return request({
    url: '/User/AdminDelete',
    method: 'post',
    data: GetVisitData(AdminID)
  })
}
