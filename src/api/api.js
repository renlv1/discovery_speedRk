import axios from 'axios'
import qs from 'qs'
import router from '../router'
import store from "../store"

let baseURL = process.env.VUE_APP_LOGIN_URL

axios.defaults.withCredentials = true
let ax = axios.create({
  // withCredentials: true, // 允许cookie
  // timeout: 30000, // 请求超时时间
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})


// 添加request拦截器
ax.interceptors.request.use(config => {
  // store.commit('SET_LOADING', true) // 开始触发loading
  return config
}, error => {
  // this.toast(error)
  Promise.reject(error)
})

// 添加response拦截器
ax.interceptors.response.use(response => {
  // store.commit('SET_LOADING', false)
  let res = {};
  res.status = response.status
  res.data = response.data
  if (res.data.status !== 'success') {
    // this.toast(res.data.msg)
    if (res.data.msg === '已在别处登录,请重新登录') {
       router.replace('/login')
    }
  }
  return res
})


export default {
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      ax({
        url,
        method: 'get',
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post: (url, params) => {
    return new Promise((resolve, reject) => {
      ax({
        method: 'post',
        url,
        data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  postFormdata: (url, params) => {
    return new Promise((resolve, reject) => {
      ax.post(url, params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
