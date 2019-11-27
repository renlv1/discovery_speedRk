import axios from "axios";
import {BossHOST} from "../assets/js/config";

/**
 * 关于修改的接口
 *
 */

export function auditProduct(productId, catId, productName, currency, productProfitRate, status, productContent, imageList, contentImg, productPriceTotal, productPvTotal, priceType) {
  let params = new FormData()
  params.append('productId', productId)
  params.append('catId', catId)
  params.append('productName', productName)
  params.append('currency', currency)
  params.append('productProfitRate', productProfitRate)
  params.append('status', status)
  params.append('productContent', productContent)
  params.append('imageList', imageList)
  params.append('contentImg', contentImg)
  params.append('productPriceTotal', productPriceTotal)
  params.append('productPvTotal', productPvTotal)
  params.append('priceType', priceType)
  return axios({
    method: 'POST',
    url: BossHOST + `shopMine/modifyProductAudit`,
    data: params
  })
}


/**
 * 添加产品信息的接口
 *
 */

export function addProduct(catId, productName, currency, productProfitRate, stock, status, productContent, imageList, contentImg, productPriceTotal, productPvTotal, priceType) {
  let params = new FormData()
  params.append('catId', catId)
  params.append('productName', productName)
  params.append('currency', currency)
  params.append('productProfitRate', productProfitRate)
  params.append('stock', stock)
  params.append('status', status)
  params.append('productContent', productContent)
  params.append('imageList', imageList)
  params.append('contentImg', contentImg)
  params.append('productPriceTotal', productPriceTotal)
  params.append('productPvTotal', productPvTotal)
  params.append('priceType', priceType)
  return axios({
    method: 'POST',
    url: BossHOST + `shopMine/addProduct`,
    data: params
  })
}
