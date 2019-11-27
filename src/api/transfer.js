import axios from "axios";
import {HOST, BossHOST} from "../assets/js/config";

export function transferList(page, pageSize, orderType, paymentType, startDate, endDate) { // 转账记录
  let params = new URLSearchParams()
  params.append('page', page)
  params.append('pageSize', pageSize)
  params.append('orderType', orderType)
  params.append('paymentType', paymentType)
  params.append('startDate', startDate)
  params.append('endDate', endDate)
  return axios({
    method: 'POST',
    url: HOST + `tx/transactionlist`,
    data: params
  })
}
