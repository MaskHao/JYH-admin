import { login, logout } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo
} from '@/utils/auth'

const user = {
  state: {
    id: null,
    token: getToken(),
    userCode: '',
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_USER_CODE: (state, code) => {
      state.userCode = code
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_STATUS: (state, status) => {
      state.status = status
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(res => {
            const userInfo = res.Value
            userInfo.userCode = username
            setToken(userInfo.AdminID)
            setUserInfo(userInfo)
            commit('SET_TOKEN', userInfo.AdminID)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const userInfo = JSON.parse(getUserInfo())
        const role = userInfo.AdminSuper ? 'AdminSuper' : 'admin'
        commit('SET_ID', userInfo.AdminID)
        commit('SET_USER_CODE', userInfo.userCode)
        commit('SET_NAME', userInfo.AdminName)
        commit('SET_AVATAR', userInfo.AdminHeadUrl)
        commit('SET_STATUS', userInfo.AdminStatus)
        commit('SET_ROLES', role)
        resolve(role)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeUserInfo()
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeUserInfo()
        removeToken()
        resolve()
      })
    }
  }
}

export default user
