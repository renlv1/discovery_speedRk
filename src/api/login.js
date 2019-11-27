import axios from "axios";
import {HOST, BossHOST} from "../assets/js/config";
import qs from 'qs'


export function login(data) { // 登录api
  return axios({
    method: 'post',
    url: HOST + '/user/userlogin',
    data: qs.stringify(data)
  })
}

export function sendEmailCode(email, sendType) { // 注册发送邮箱验证码(email: 邮箱地址; sendType: (1: 邮箱发送验证码; 2: 登录后发验证码))
  let params = new URLSearchParams()
  params.append('email', email)
  params.append('sendType', sendType)
  return axios({
    method: 'POST',
    url: HOST + `user/sendEmailCode`,
    data: params
  })
}

export function register(username, password, pay_pwd, verifyCode, email, gender) { // gender 性别1男2女
  let params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  params.append('pay_pwd', pay_pwd)
  params.append('verifyCode', verifyCode)
  params.append('email', email)
  params.append('gender', gender)
  return axios({
    method: 'POST',
    url: HOST + `user/register_user`,
    data: params
  })
}

export function checkaccount(account, showFlag) { // 检查用户是否绑定谷歌或者短信验证码
  let params = new URLSearchParams()
  params.append('account', account)
  params.append('showFlag', '')
  return axios({
    method: 'POST',
    url: HOST + `user/checkaccount`,
    data: params
  })
}

export function findPassword(username, code, password, codeType) { // 找回密码
  let params = new URLSearchParams()
  params.append('username', username)
  params.append('code', code)
  params.append('password', password)
  params.append('codeType', codeType)
  return axios({
    method: 'POST',
    url: HOST + `security/findpassword`,
    data: params
  })
}
