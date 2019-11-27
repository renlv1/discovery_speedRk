import axios from 'axios'
import {HOST, BossHOST} from '../assets/js/config'

export function share(address) { // 判断是否是共享者



  const url = BossHOST + `pigame/queryByAddress?address=${address}`

  return axios.post(url)
}
