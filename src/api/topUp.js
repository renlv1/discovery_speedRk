import axios from 'axios'
import {HOST, BossHOST} from '../assets/js/config'

export function getPayType(index) { // 获得充值币种类型
  const url = BossHOST + `account/queryCoinList?sourceType=${index}`

  return axios.post(url)
}


export function getPayAccount(currency, accountType, pageIndex, pageSize) { // 获得支付账号列表
  let params = new URLSearchParams()
  params.append('currency', currency)
  params.append('accountType', accountType)
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: BossHOST + `account/list`,
    data: params
  })
}


export function createOrder(currency, amount, type, remark, bankAccountId) { // 创建充值订单
  let params = new URLSearchParams()
  params.append('currency', currency)
  params.append('amount', amount)
  params.append('type', type)
  params.append('remark', remark)
  params.append('bankAccountId', bankAccountId)
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/createOrder`,
    data: params
  })
}

export function chooseShare(id, sortBy, pageIndex, pageSize) { // 充值订单共享者列表
  let params = new URLSearchParams()
  params.append('id', id)
  params.append('sortBy', sortBy)
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: BossHOST + `pigame/matchListByDeposit`,
    data: params
  })
}

export function chooseBoss(id, bossId) { // 充值订单选择共享者(钱老板)
  let params = new URLSearchParams()
  params.append('id', id)
  params.append('bossId', bossId)
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/chooseBoss`,
    data: params
  })
}

export function orderList(pageIndex, pageSize, type) { // 查询所有的充值订单记录
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('isFinish', type)
  // params.append('orderType', 'pigame')
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/queryMyOrderList`,
    data: params
  })
}

export function getListDetail(id) { // 查询所有的充值订单记录详情
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/queryOrderDetail?orderId=${id}`
  })
}

export function cancel(id) { // 取消订单
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/cancelOrder?id=${id}`
  })
}

export function twiceConfirm(orderId, confirmState) { // 充值订单二次确认
  let params = new URLSearchParams()
  params.append('orderId', orderId)
  params.append('confirmState', confirmState)
  return axios({
    method: 'POST',
    url: BossHOST + `deposit/confirmByStep`,
    data: params
  })
}
