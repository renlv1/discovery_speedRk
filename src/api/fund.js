import axios from "axios";
import {HOST, BossHOST} from "../assets/js/config";

// export function billRecord(page, pageSize) { // 账单列表
//   let params = new URLSearchParams()
//   params.append('page', page)
//   params.append('pageSize', pageSize)
//   return axios({
//     method: 'POST',
//     url: HOST + `tx/transactionlist`,
//     data: params
//   })
// }

export function transInfo() { // 账单详情
  return axios({
    method: 'POST',
    url: HOST + `fund/get_fund_data`,
  })
}

export function getLine(num) {
  return axios({
    method: 'POST',
    url: HOST + `fund/get_price_list?num=${num}`,
  })
}

export function getCurrentPrice() {
  return axios({
    method: 'POST',
    url: HOST + `fund/get_price`,
  })
}

export function canBuy() {
  return axios({
    method: 'POST',
    url: HOST + `fund/can_buy`,
  })
}


export function getFundBalance() {
  return axios({
    method: 'POST',
    url: HOST + `fund/get_fund_balance`,
  })
}

export function getLimit() {
  return axios({
    method: 'POST',
    url: HOST + `voucher/getUserVoucherAndLimit`,
  })
}

export function getPresentList(page, pageSize) {
  let params = new URLSearchParams()
  params.append('page', page)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: HOST + `fund/get_present_list`,
    data: params
  })
}

export function fundEntrustList(page, pageSize, orderId, finishState) {
  let params = new URLSearchParams()
  params.append('page', page)
  params.append('pageSize', pageSize)
  params.append('orderId', orderId)
  params.append('finishState', finishState)
  return axios({
    method: 'POST',
    url: HOST + `fund/fundEntrustList`,
    data: params
  })
}

export function entrustList(page, pageSize, orderId, state) {
  let params = new URLSearchParams()
  params.append('page', page)
  params.append('pageSize', pageSize)
  params.append('orderId', orderId)
  params.append('state', state)
  return axios({
    method: 'POST',
    url: HOST + `voucher/entrustlistByPage`,
    data: params
  })
}

export function bookoffer(count) {
  return axios({
    method: 'POST',
    url: HOST + `voucher/voucherBookoffer?count=${count}`,
  })
}

export function canOperate() {
  return axios({
    method: 'POST',
    url: HOST + `voucher/userCanBuyAmount`,
  })
}



export function createEntrust(price, amount, eType) {
  let params = new URLSearchParams()
  params.append('price', price)
  params.append('amount', amount)
  params.append('eType', eType)
  return axios({
    method: 'POST',
    url: HOST + `voucher/submitEntrust`,
    data: params
  })
}

export function submitCoupon(price, amount, eType) {
  let params = new URLSearchParams()
  params.append('price', price)
  params.append('amount', amount)
  params.append('eType', eType)
  return axios({
    method: 'POST',
    url: HOST + `voucher/submitEntrust`,
    data: params
  })
}

export function submitEntrust(amount, eType) {
  let params = new URLSearchParams()
  params.append('amount', amount)
  params.append('eType', eType)
  return axios({
    method: 'POST',
    url: HOST + `fund/submit_entrust`,
    data: params
  })
}

export function canSell() {
  return axios({
    method: 'POST',
    url: HOST + `fund/can_sell`,
  })
}

export function getPurseList(pageIndex, pageSize, changeType) {
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('changeType', changeType)
  return axios({
    method: 'POST',
    url: HOST + `purse/getPaiPurseRecordList`,
    data: params
  })
}

export function yueBaoBalance() {
  return axios({
    method: 'POST',
    url: BossHOST + `yuebao/queryUserYueBaoBalance`,
  })
}

export function yueBaoReocrdList(pageIndex, pageSize, assetType) {
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('assetType', assetType)
  return axios({
    method: 'POST',
    url: BossHOST + `yuebao/queryYueBaoAssetReocrdList`,
    data: params
  })
}

export function yueBaoPutOut(assetTotal, assetType) {
  let params = new URLSearchParams()
  params.append('assetTotal', assetTotal)
  params.append('assetType', assetType)
  return axios({
    method: 'POST',
    url: BossHOST + `yuebao/putAndOutYueBaoAsset`,
    data: params
  })
}


export function getParentList() {
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryMyExpeteListOfChild`,
  })
}

export function getExpediteList(userAddress, pageIndex, pageSize) {
  let params = new URLSearchParams()
  params.append('userAddress', userAddress)
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: BossHOST + `pai/queryMyExpediteList`,
    data: params
  })
}

export function ProfitReocrdList(pageIndex, pageSize) {
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: BossHOST + `yuebao/queryYueBaoDayProfitReocrdList`,
    data: params
  })
}

export function getPurseQuota() {
  return axios({
    method: 'POST',
    url: HOST + `purse/getPurseQuota`,
  })
}

export function inputPaiPurse(value) {
  return axios({
    method: 'POST',
    url: HOST + `purse/inputPaiPurse?inputTotal=${value}`,
  })
}

export function outputPaiPurse(value) {
  return axios({
    method: 'POST',
    url: HOST + `purse/outputPaiPurse?outputTotal=${value}`,
  })
}
