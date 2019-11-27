import axios from "axios";
import {HOST, BossHOST} from "../assets/js/config";



// 藏宝
export function treasureNoTask(longitude, latitude, total, address, realAddress, minetime, minedate, expiryDate, firstUser) {
  let params = new URLSearchParams()
  params.append('longitude', longitude)
  params.append('latitude', latitude)
  params.append('total', total)
  params.append('address', address)
  params.append('realAddress', realAddress)
  params.append('minetime', minetime)
  params.append('minedate', minedate)
  params.append('firstUser', firstUser)
  params.append('expiryDate', expiryDate)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/buryMine`,
    data: params
  })
}

// 藏宝
export function treasure(longitude, latitude, total, address, realAddress, minetime, minedate, task, expiryDate, firstUser) {
  let params = new URLSearchParams()
  params.append('longitude', longitude)
  params.append('latitude', latitude)
  params.append('total', total)
  params.append('address', address)
  params.append('realAddress', realAddress)
  params.append('minetime', minetime)
  params.append('minedate', minedate)
  params.append('task', task)
  params.append('firstUser', firstUser)
  params.append('expiryDate', expiryDate)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/buryMine`,
    data: params
  })
}


// 优先分配好友
export function friend() { // 好友列表
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryUserFriendListOfMine`,
  })
}

// 藏宝任务(模板)
export function taskTemplate() {
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryGuideList`,
  })
}

// 待确认藏宝图
export function confirmedTask(pageIndex, pageSize) {
  let params = new URLSearchParams()
  params.append('page', pageIndex)
  params.append('pagesize', pageSize)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/mineUserNoConfirm`,
    data: params
  })
}

// 我的宝藏
export function myTask(pageIndex, pageSize) {
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryMyMineList`,
    data: params
  })
}

// 我的宝藏详情
export function myTaskDetail(id) {
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryMyMineDetails?mineid=${id}`
  })
}

// 新增加藏宝任务模板
export function addGuide(content, imglist, type) {
  let params = new URLSearchParams()
  params.append('content', content)
  params.append('imglist', imglist)
  params.append('type', type)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/addGuide`,
    data: params
  })
}

// 宝藏图详情
export function myMapDetail(id) {
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryMyMineMapDetails?minemapid=${id}`
  })
}

// 修改藏宝信息
export function modifyInfo(longitude, latitude, id, task, minetime, minedate, expiryDate, realAddress, firstUser) {
  let params = new URLSearchParams()
  params.append('mineid', id)
  params.append('task', task)
  params.append('longitude', longitude)
  params.append('latitude', latitude)
  params.append('minetime', minetime)
  params.append('minedate', minedate)
  params.append('expiryDate', expiryDate)
  params.append('realAddress', realAddress)
  params.append('firstUser', firstUser)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/updateBuryMine`,
    data: params
  })
}

// 宝藏图详情
export function confirmMine(type, mineMapId, longitude, latitude) {
  let params = new URLSearchParams()
  params.append('type', type)
  params.append('mineMapId', mineMapId)
  params.append('longitude', longitude)
  params.append('latitude', latitude)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/confirmMine`,
    data: params
  })
}

