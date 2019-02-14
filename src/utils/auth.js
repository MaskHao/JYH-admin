import Cookies from 'js-cookie'

const TokenKey = 'adminID'
const userInfo = 'UserInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(UserInfo) {
  return Cookies.set(userInfo, UserInfo)
}

export function getUserInfo() {
  return Cookies.get(userInfo)
}

export function removeUserInfo() {
  return Cookies.remove(userInfo)
}
