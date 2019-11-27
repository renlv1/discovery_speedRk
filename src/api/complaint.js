import axios from "axios";
import {HOST, BossHOST} from "../assets/js/config";

/**
 * 关于申诉api
 */

export function uploadimg(myfile, type) { // 七牛上传图片
  let params = new FormData()
  params.append('file', myfile)
  params.append('sourceType', type)
  return axios({
    method: 'POST',
    headers: {'Content-Type': 'multipart/form-data'},
    url: BossHOST + `blobfile/uploadBlobFile`,
    data: params
  })
}


export function createArbitration(orderId, reqImgList, remark, reqType) { // 充值订单提交仲裁
  let params = new URLSearchParams()
  params.append('orderId', orderId)
  params.append('reqImgList', reqImgList)
  params.append('remark', remark)
  params.append('reqType', reqType)
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/createArbitration`,
    data: params
  })
}

export function drawCreateArbitration(orderId, reqImgList, remark, reqType) { // 提现订单提交仲裁
  let params = new URLSearchParams()
  params.append('orderId', orderId)
  params.append('reqImgList', reqImgList)
  params.append('remark', remark)
  params.append('reqType', reqType)
  return axios({
    method: 'POST',
    url: BossHOST + `draw/createArbitration`,
    data: params
  })
}


export function deposit(pageIndex, pageSize, orderState, orderType) { // 查询充值申诉
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('orderState', orderState)
  params.append('orderType', orderType)
  // params.append('isFinish', isFinish)
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/queryMyOrderList`,
    data: params
  })
}

export function draw(pageIndex, pageSize, orderState, orderType) { // 查询提现申诉
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('orderState', orderState)
  params.append('orderType', orderType)
  // params.append('isFinish', isFinish)
  return axios({
    method: 'POST',
    url: BossHOST + `draw/queryMyOrderList`,
    data: params
  })
}

export function arbitration(pageIndex, pageSize, isFinish, id) {
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('isFinish', isFinish)
  params.append('id', id)
  return axios({
    method: 'POST',
    url: BossHOST + `arbitration/queryList`,
    data: params
  })
}

export function arbitrationFindId(id) {
  let params = new URLSearchParams()
  params.append('id', id)
  return axios({
    method: 'POST',
    url: BossHOST + `arbitration/queryList`,
    data: params
  })
}

export function cancel(id) { // 取消申诉
  return axios({
    method: 'POST',
    url: BossHOST + `arbitration/cancel?id=${id}`,
  })
}

export function getPigameInfo(address) { // 得到共享者信息
  return axios({
    method: 'POST',
    url: BossHOST + `pigame/queryByAddress?address=${address}`,
  })
}

export function registerBoss(realname, phoneCode, phoneNumber, contactAddress, depositRate, drawRate, contactWay, contactWayNum ,referenceUsername, source) {
  let params = new URLSearchParams()
  params.append('realname', realname)
  params.append('phoneCode', phoneCode)
  params.append('phoneNumber', phoneNumber)
  params.append('contactAddress', contactAddress)
  params.append('depositRate', depositRate)
  params.append('drawRate', drawRate)
  params.append('referenceUsername', referenceUsername)
  params.append(contactWay, contactWayNum)
  params.append('source', source)
  return axios({
    method: 'POST',
    url: BossHOST + `pigame/registerBoss`,
    data: params
  })
}
