import axios from "axios";
import {HOST} from "../assets/js/config";

export function queryVoteList(pageIndex, pageSize, status) { // 投票箱列表
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('status', status)  // 状态 1 进行中 2 已结束
  return axios({
    method: 'POST',
    url: HOST + `vote/queryAllVotes`,
    data: params
  })
}

export function queryMyVoteList(pageIndex, pageSize, status) { // 我参与过的投票箱列表
  let params = new URLSearchParams()
  params.append('pageIndex', pageIndex)
  params.append('pageSize', pageSize)
  params.append('status', status)  // 状态 1 进行中 2 已结束
  return axios({
    method: 'POST',
    url: HOST + `vote/queryMyVotes`,
    data: params
  })
}

export function detail(id) { // 投票箱详情
  return axios({
    method: 'POST',
    url: HOST + `vote/getVoteDetail?voteId=${id}`,
  })
}


export function submitUserVote(voteId, optionId) { // 提交投票
  let params = new URLSearchParams()
  params.append('voteId', voteId)
  params.append('optionId', optionId)
  return axios({
    method: 'POST',
    url: HOST + `vote/submitVote`,
    data: params
  })
}
