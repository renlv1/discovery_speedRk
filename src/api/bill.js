import axios from "axios";
import {HOST} from "../assets/js/config";

/**
 * 关于账单的接口
 *
 */

export function billRecord(page, pageSize) { // 账单列表
  let params = new URLSearchParams()
  params.append('page', page)
  params.append('pageSize', pageSize)
  return axios({
    method: 'POST',
    url: HOST + `tx/transactionlist`,
    data: params
  })
}

export function billRecordDetail(id) { // 账单详情
  return axios({
    method: 'POST',
    url: HOST + `tx/queryTransactionDetail?transactionId=${id}`,
  })
}
