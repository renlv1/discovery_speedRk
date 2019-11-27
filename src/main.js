import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill' // 兼容旧浏览器
import router from './router'
import fetch from './api/api'
import Cube from 'cube-ui'
import store from './store'
import {i18n} from './i18n/config'
import BaiduMap from 'vue-baidu-map'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import echarts from "echarts";
import VueClipboard from 'vue-clipboard2'
import 'swiper/dist/css/swiper.min.css'

Vue.use(VueClipboard)


Vue.use(ElementUI)

Vue.use(BaiduMap, {
  ak: 'OZtbPgSN7UZkfiwnGU1x3ennD0Ila1N5'
})

// import store from './vuex/store'
import axios from 'axios'

Vue.use(Cube)

// 引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 这个样式必须引入

// require('./permission')

Vue.prototype.$echarts = echarts;
Vue.prototype.$http = axios
Vue.prototype.$fetch = fetch
Vue.prototype.$axios = axios

Vue.prototype.$api = process.env.VUE_APP_URL
Vue.prototype.$api2 = process.env.VUE_APP_URL

// Vue.prototype.$url = 'discoverytest.pigamegroup.com' // 测试域名用于后台扫码

// Vue.prototype.$api = 'https://newboss.wallet202018.com/'
// Vue.prototype.$api2 = 'https://newboss.wallet202018.com/'


Vue.prototype.$mockData = require('../public/code/local_cn.json');

// if(i18n.locale === 'EN') {
//   axios.defaults.headers = {'pwallet-language': 'en'}
// }

Vue.prototype.$utf16to8 = function (str) { // 二维码转码
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

import Vheader from '@/components/header.js'

Vue.use(Vheader)

Vue.prototype.$changeDate = function (time, str = '/', type = 1) { //   时间戳转换
  function ifTime(value) { //  判断时间是否是个位数
    if (value < 10) {
      return '0' + value
    }
    return value
  }

  let newTime = new Date(time)
  let day = newTime.getDate()
  let month = newTime.getMonth() + 1
  let year = newTime.getFullYear()
  let hours = newTime.getHours()
  let min = newTime.getMinutes()
  let sec = newTime.getSeconds()
  switch (type) {
    case 1:
      return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
    case 2:
      return year + str + ifTime(month) + str + ifTime(day) + ' 00:00:00'
    case 3:
      return year + str + ifTime(month) + str + ifTime(day) + ' 23:59:59'
    case 4:
      return year + str + ifTime(month) + str + ifTime(day)
    case 9:
      return ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
    case 5:
      return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
    case 6:
      return ifTime(hours)
    case 7:
      return ifTime(min)
    case 8:
      return ifTime(hours) + ':' + ifTime(min)
  }
}

Vue.prototype.$productType = function (type) {
  let productArr = this.$t('shops.classifyData')
  return productArr[type]
}

Vue.filter('fourNumber', function (num) { // 保留4位小数点,不四舍五入
  if (!num) {
    return '0.0000'
  }
  let splitNum = String(num).split(".")
  if (splitNum.length > 1) {
    let decimals = String(num).split(".")[1].length
    if (decimals > 4) {
      return String(num).replace(/^(.*\..{4}).*$/, "$1")
    } else {
      return Number(num).toFixed(4)
    }
  } else {
    return Number(num).toFixed(4)
  }
})

Vue.prototype.$TopUpOrder = function (coinType) { // 输入币种返回对应的值
  const toUpperCoinType = coinType.toLowerCase()
  let value
  switch (toUpperCoinType) {
    case 'btc':
      value = 6;
      break;
    case 'ltc':
      value = 7;
      break;
    case 'eth':
      value = 8;
      break;
    case 'xrp':
      value = 9;
      break;
    case 'bch':
      value = 10;
      break;
    case 'sie':
      value = 11;
      break;
    default:
      value = 1;
  }
  return value
}

Vue.prototype.$arbitration = function (type) { // 根据申诉订单状态返回对应的文案  1:申请仲裁2：进入仲裁3：仲裁完成 4:取消仲裁
  switch (type) {
    case 1:
      return this.$t('tranStatus.text10')
      break;
    case 2:
      return this.$t('tranStatus.text11')
      break;
    case 3:
      return this.$t('tranStatus.text12')
      break;
    case 4:
      return this.$t('tranStatus.text13')
      break;
  }
}

Vue.prototype.$conversionText = function (orderType) { // 根据订单状态返回对应的文案
  switch (orderType) {
    case -1:
      return this.$t('tranStatus.text3')
      break;
    case 1:
      return this.$t('tranStatus.text4')
      break;
    case 2:
      return this.$t('tranStatus.text5')
      break;
    case 3:
      return this.$t('tranStatus.text6')
      break;
    case 4:
      return this.$t('tranStatus.text7')
      break;
    case 5:
      return this.$t('tranStatus.text8')
      break;
    case 6:
      return this.$t('tranStatus.text9')
      break;
  }
}

Vue.prototype.toastD = function (text) {
  this.toast = this.$createToast({
    txt: text,
    time: 2000,
    type: 'txt'
  })
  this.toast.show()
}

Vue.prototype.tranStatus = function (status) {
  if (status === 0) {
    return this.$t('tranStatus.text1')
  } else if (status === 2) {
    return this.$t('tranStatus.text2')
  }
}

Vue.prototype.billType = function (type, flag) { // type 类型码
  if (flag === 1) {
    switch (type) {
      case 2:
        return this.$t('bill.text2');
        break;
      case 1:
        return this.$t('bill.text1');
        break;
      case 40:
        return this.$t('bill.text3');
        break;
      case 41:
        return this.$t('bill.text4');
        break;
      case 42:
        return this.$t('bill.text5');
        break;
      case 43:
        return this.$t('bill.text6');
        break;
      case 44:
        return this.$t('bill.text7');
        break;
      case 45:
        return this.$t('bill.text8');
        break;
      case 12:
        return this.$t('bill.text9');
        break;
      case 13:
        return this.$t('bill.text10');
        break;
      case 14:
        return this.$t('bill.text11');
        break;
      case 15:
        return this.$t('bill.text12');
        break;
      case 16:
        return this.$t('bill.text13');
        break;
      case 17:
        return this.$t('bill.text14');
        break;
      case 73:
        return this.$t('bill.text15');
        break;
      case 74:
        return this.$t('bill.text16');
        break;
      case 75:
        return this.$t('bill.text17');
        break;
      case 76:
        return this.$t('bill.text18');
        break;
      case 77:
        return this.$t('bill.text19');
        break;
      case 79:
        return this.$t('bill.text20');
        break;
      case 18:
        return this.$t('bill.text21');
        break;
      case 19:
        return this.$t('bill.text22');
        break;
      case 80:
        return this.$t('bill.text23');
        break;
      case 110:
        return this.$t('bill.text24');
        break;
      case 11:
        return this.$t('bill.text25');
        break;
      case 111:
        return this.$t('bill.text26');
        break;
      case 112:
        return this.$t('bill.text27');
        break;
      case 113:
        return this.$t('bill.text28');
        break;
      case 114:
        return this.$t('bill.text29');
        break;
      case 115:
        return this.$t('bill.text30');
        break;
      case 120:
        return this.$t('bill.text31');
        break;
      case 121:
        return this.$t('bill.text32');
        break;
      case 122:
        return this.$t('bill.text33');
        break;
      case 123:
        return this.$t('bill.text34');
        break;
      case 124:
        return this.$t('bill.text35');
        break;
      case 125:
        return this.$t('bill.text36');
        break;
      case 130:
        return this.$t('bill.text37');
        break;
      case 131:
        return this.$t('bill.text38');
        break;
      case 132:
        return this.$t('bill.text39');
        break;
      case 133:
        return this.$t('bill.text40');
        break;
      case 134:
        return this.$t('bill.text41');
        break;
      case 135:
        return this.$t('bill.text42');
        break;
      case 136:
        return this.$t('bill.text43');
        break;
      case 137:
        return this.$t('bill.text44');
        break;
      case 138:
        return this.$t('bill.text45');
        break;
      case 140:
        return this.$t('bill.text46');
        break;
      case 126:
        return this.$t('bill.text47');
        break;
      case 127:
        return this.$t('bill.text48');
        break;
      case 81:
        return this.$t('bill.text49');
        break;
      case 82:
        return this.$t('bill.text50');
        break;
      case 83:
        return this.$t('bill.text51');
        break;
      case 84:
        return this.$t('bill.text52');
        break;
      case 151:
        return this.$t('bill.text53');
        break;
      case 152:
        return this.$t('bill.text54');
        break;
      case 153:
        return this.$t('bill.text55');
        break;
      case 154:
        return this.$t('bill.text56');
        break;
      case 156:
        return this.$t('bill.text57');
        break;
      case 157:
        return this.$t('bill.text58');
        break;
      case 158:
        return this.$t('bill.text59');
        break;
      case 159:
        return this.$t('bill.text60');
        break;
      case 160:
        return this.$t('bill.text61');
        break;
      case 161:
        return this.$t('bill.text62');
        break;
      case 162:
        return this.$t('bill.text63');
        break;
      case 163:
        return this.$t('bill.text64');
        break;
      case 164:
        return this.$t('bill.text65');
        break;
      case 165:
        return this.$t('bill.text66');
        break;
      case 166:
        return this.$t('bill.text67');
        break;
      case 167:
        return this.$t('bill.text68');
        break;
      case 171:
        return this.$t('bill.text69');
        break;
      case 172:
        return this.$t('bill.text70');
        break;
      case 173:
        return this.$t('bill.text71');
        break;
      case 174:
        return this.$t('bill.text72');
        break;
      case 175:
        return this.$t('bill.text73');
        break;
      case 176:
        return this.$t('bill.text74');
        break;
      case 178:
        return this.$t('bill.text75');
        break;
      case 179:
        return this.$t('bill.text76');
        break;
      case 180:
        return this.$t('bill.text77');
        break;
      case 181:
        return this.$t('bill.text78');
        break;
      case 182:
        return this.$t('bill.text79');
        break;
      case 183:
        return this.$t('bill.text80');
        break;
      case 185:
        return this.$t('bill.text81');
        break;
      case 186:
        return this.$t('bill.text82');
        break;
      case 187:
        return this.$t('bill.text83');
        break;
      case 188:
        return this.$t('bill.text84');
        break;
      case 177:
        return this.$t('bill.text85');
        break;
      case 195:
        return this.$t('bill.text86');
        break;
      case 196:
        return this.$t('bill.text87');
        break;
      case 197:
        return this.$t('bill.text88');
        break;
      case 198:
        return this.$t('bill.text89');
        break;
      case 201:
        return this.$t('bill.text90');
        break;
      case 202:
        return this.$t('bill.text91');
        break;
      case 203:
        return this.$t('bill.text92');
        break;
      case 204:
        return this.$t('bill.text93');
        break;
      case 205:
        return this.$t('bill.text94');
        break;
      case 206:
        return this.$t('bill.text95');
        break;
      case 4:
        return this.$t('bill.text96');
        break;
      case 5:
        return this.$t('bill.text97');
        break;
      case 207:
        return this.$t('bill.text98');
        break;
      case 208:
        return this.$t('bill.text99');
        break;
      case 209:
        return this.$t('bill.text100');
        break;
      case 210:
        return this.$t('bill.text101');
        break;
      case 211:
        return this.$t('bill.text102');
        break;
      case 212:
        return this.$t('bill.text103');
        break;
      case 213:
        return this.$t('bill.text104');
        break;
      case 214:
        return this.$t('bill.text105');
        break;
      case 215:
        return this.$t('bill.text106');
        break;
      case 216:
        return this.$t('bill.text107');
        break;
      case 217:
        return this.$t('bill.text108');
        break;
      case 218:
        return this.$t('bill.text109');
        break;
      case 219:
        return this.$t('bill.text110');
        break;
      case 220:
        return this.$t('bill.text111');
        break;
      case 221:
        return this.$t('bill.text112')
        break;
      case 222:
        return this.$t('bill.text113');
        break;
      case 223:
        return this.$t('bill.text114');
        break;
    }
  } else if (flag === 2) {
    switch (type) {
      case 2:
        return require('./images/user_avatar.png');
        break;
      case 1:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 40:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 41:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 42:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 43:
        return require('./images/arrow_traction_up.png');
        break;
      case 44:
        return require('./images/arrow_traction_up.png');
        break;
      case 45:
        return require('./images/arrow_traction_up.png');
        break;
      case 12:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 13:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 14:
        return require('./images/arrow_traction_up.png');
        break;
      case 15:
        return require('./images/heropost_send.png');
        break;
      case 16:
        return require('./images/heropost_get.png');
        break;
      case 17:
        return require('./images/iv_ar_get.png');
        break;
      case 73:
        return require('./images/iv_bill_props.png');
        break;
      case 74:
        return require('./images/iv_ar_out.png');
        break;
      case 75:
        return require('./images/iv_ar_get.png');
        break;
      case 76:
        return require('./images/iv_ar_get.png');
        break;
      case 77:
        return require('./images/iv_paipay_get.png');
        break;
      case 79:
        return require('./images/iv_paipay_out.png');
        break;
      case 18:
        return require('./images/iv_getpageage.png');
        break;
      case 19:
        return require('./images/iv_pai_chain.png');
        break;
      case 80:
        return require('./images/iv_stock_right.png');
        break;
      case 110:
        return require('./images/iv_buyland.png');
        break;
      case 11:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 111:
        return require('./images/iv_landincome.png');
        break;
      case 112:
        return require('./images/iv_fractionincome.png');
        break;
      case 113:
        return require('./images/iv_alipay.png');
        break;
      case 114:
        return require('./images/iv_wechat.png');
        break;
      case 115:
        return require('./images/iv_landincome.png');
        break;
      case 120:
        return require('./images/iv_ar_game_out.png');
        break;
      case 121:
        return require('./images/iv_ar_game_get.png');
        break;
      case 122:
        return require('./images/iv_ar_game_get.png');
        break;
      case 123:
        return require('./images/iv_golden_out.png');
        break;
      case 124:
        return require('./images/iv_golden_in.png');
        break;
      case 125:
        return require('./images/iv_merge_pai.png');
        break;
      case 130:
        return require('./images/iv_fund_out.png');
        break;
      case 131:
        return require('./images/iv_fund_in.png');
        break;
      case 132:
        return require('./images/iv_mall_pay.png');
        break;
      case 133:
        return require('./images/iv_mall_get.png');
        break;
      case 134:
        return require('./images/iv_mall_refund.png');
        break;
      case 135:
        return require('./images/iv_mall_refund.png');
        break;
      case 136:
        return require('./images/arrow_traction_up.png');
        break;
      case 137:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 138:
        return require('./images/arrow_traction_up.png');
        break;
      case 140:
        return require('./images/iv_bill_star.png');
        break;
      case 126:
        return require('./images/iv_fund_out.png');
        break;
      case 127:
        return require('./images/iv_fund_in.png');
        break;
      case 81:
        return require('./images/iv_online_pay.png');
        break;
      case 82:
        return require('./images/iv_offline_refund.png');
        break;
      case 83:
        return require('./images/iv_chain_out.png');
        break;
      case 84:
        return require('./images/iv_chain_in.png');
        break;
      case 151:
        return require('./images/user_avatar.png');
        break;
      case 152:
        return require('./images/user_avatar.png');
        break;
      case 153:
        return require('./images/user_avatar.png');
        break;
      case 154:
        return require('./images/user_avatar.png');
        break;
      case 156:
        return require('./images/iv_buy_praise_star_out.png');
        break;
      case 157:
        return require('./images/iv_buy_praise_star_out.png');
        break;
      case 158:
        return require('./images/iv_buy_praise_star_out.png');
        break;
      case 159:
        return require('./images/iv_buy_praise_star_out.png');
        break;
      case 160:
        return require('./images/iv_buy_praise_star_out.png');
        break;
      case 161:
        return require('./images/iv_merchant_bond_in.png');
        break;
      case 162:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 163:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 164:
        return require('./images/arrow_traction_up.png');
        break;
      case 165:
        return require('./images/arrow_traction_up.png');
        break;
      case 166:
        return require('./images/arrow_traction_up.png');
        break;
      case 167:
        return require('./images/arrow_traction_up.png');
        break;
      case 171:
        return require('./images/iv_merchant_bond_out.png');
        break;
      case 172:
        return require('./images/iv_chain_store_pv_prebutton.png');
        break;
      case 173:
        return require('./images/iv_chain_store_pv_return.png');
        break;
      case 174:
        return require('./images/iv_chain_ecological_reward.png');
        break;
      case 175:
        return require('./images/iv_chain_store_subsidy.png');
        break;
      case 176:
        return require('./images/iv_commission_award.png');
        break;
      case 178:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 179:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 180:
        return require('./images/arrow_traction_up.png');
        break;
      case 181:
        return require('./images/arrow_traction_up.png');
        break;
      case 182:
        return require('./images/arrow_traction_up.png');
        break;
      case 183:
        return require('./images/arrow_traction_up.png');
        break;
      case 185:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 186:
        return require('./images/iv_red_pack_down.png');
        break;
      case 187:
        return require('./images/iv_red_pack_up.png');
        break;
      case 188:
        return require('./images/iv_red_pack_left.png');
        break;
      case 177:
        return require('./images/iv_advertising_business.png');
        break;
      case 195:
        return require('./images/iv_ico_subscribe_out.png');
        break;
      case 196:
        return require('./images/iv_ico_get_merchant.png');
        break;
      case 197:
        return require('./images/iv_ico_subscribe_in.png');
        break;
      case 198:
        return require('./images/iv_ico_subscribe_back.png');
        break;
      case 201:
        return require('./images/iv_exceptional_spending.png');
        break;
      case 202:
        return require('./images/iv_reward_transferred_out.png');
        break;
      case 203:
        return require('./images/iv_bill_coin_coin.png');
        break;
      case 204:
        return require('./images/iv_vote_freeze.png');
        break;
      case 205:
        return require('./images/iv_vote_unfreeze.png');
        break;
      case 206:
        return require('./images/iv_bill_zu_chong_zhi.png');
        break;
      case 4:
        return require('./images/arrow_traction_bottom.png');
        break;
      case 5:
        return require('./images/arrow_traction_up.png');
        break;
      case 207:
        return require('./images/iv_group_order_pay.png');
        break;
      case 208:
        return require('./images/iv_group_order_refund.png');
        break;
      case 209:
        return require('./images/iv_group_order_pay_to_mer.png');
        break;
      case 210:
        return require('./images/iv_unlimited_competition_pay.png');
        break;
      case 211:
        return require('./images/iv_unlimited_competition_pay.png');
        break;
      case 212:
        return require('./images/iv_unlimited_competition_award.png');
        break;
      case 213:
        return require('./images/iv_unlimited_competition_to_mer.png');
        break;
      case 214:
        return require('./images/bounty_hunter.png');
        break;
      case 215:
        return require('./images/bounty_hunter.png');
        break;
      case 216:
        return require('./images/iv_bidding_tip_deduction.png');
        break;
      case 217:
        return require('./images/iv_auction_tip_refund.png');
        break;
      case 218:
        return require('./images/iv_bidding_tip_success.png');
        break;
      case 219:
        return require('./images/iv_bounty_list_activation.png');
        break;
      case 220:
        return require('./images/iv_bounty_order_replacement_task.png');
        break;
      case 221:
        return require('./images/bill-pay.png');
        break;
      case 222:
        return require('./images/bill-refund.png');
        break;
      case 223:
        return require('./images/shop-proceeds.png');
        break;
    }
  } else if (flag === 3) {
    switch (type) {
      case 2:
        return '+';
        break;
      case 1:
        return '-';
        break;
      case 40:
        return '-';
        break;
      case 41:
        return '-';
        break;
      case 42:
        return '+';
        break;
      case 43:
        return '+';
        break;
      case 44:
        return '+';
        break;
      case 45:
        return '+';
        break;
      case 12:
        return '-';
        break;
      case 13:
        return '-';
        break;
      case 14:
        return '+';
        break;
      case 15:
        return '-';
        break;
      case 16:
        return '+';
        break;
      case 17:
        return '+';
        break;
      case 73:
        return '';
        break;
      case 74:
        return '-';
        break;
      case 75:
        return '+';
        break;
      case 76:
        return '+';
        break;
      case 77:
        return '+';
        break;
      case 79:
        return '-';
        break;
      case 18:
        return '+';
        break;
      case 19:
        return '+';
        break;
      case 80:
        return '-';
        break;
      case 110:
        return '-';
        break;
      case 11:
        return '-';
        break;
      case 111:
        return '+';
        break;
      case 112:
        return '+';
        break;
      case 113:
        return '+';
        break;
      case 114:
        return '+';
        break;
      case 115:
        return '+';
        break;
      case 120:
        return '-';
        break;
      case 121:
        return '+';
        break;
      case 122:
        return '+';
        break;
      case 123:
        return '-';
        break;
      case 124:
        return '+';
        break;
      case 125:
        return '+';
        break;
      case 130:
        return '+';
        break;
      case 131:
        return '+';
        break;
      case 132:
        return '-';
        break;
      case 133:
        return '+';
        break;
      case 134:
        return '+';
        break;
      case 135:
        return '+';
        break;
      case 136:
        return '+';
        break;
      case 137:
        return '-';
        break;
      case 138:
        return '+';
        break;
      case 140:
        return '+';
        break;
      case 126:
        return '-';
        break;
      case 127:
        return '-';
        break;
      case 81:
        return '-';
        break;
      case 82:
        return '+';
        break;
      case 83:
        return '-';
        break;
      case 84:
        return '+';
        break;
      case 151:
        return '-';
        break;
      case 152:
        return '-';
        break;
      case 153:
        return '-';
        break;
      case 154:
        return '-';
        break;
      case 156:
        return '-';
        break;
      case 157:
        return '-';
        break;
      case 158:
        return '+';
        break;
      case 159:
        return '-';
        break;
      case 160:
        return '-';
        break;
      case 161:
        return '+';
        break;
      case 162:
        return '-';
        break;
      case 163:
        return '-';
        break;
      case 164:
        return '+';
        break;
      case 165:
        return '+';
        break;
      case 166:
        return '+';
        break;
      case 167:
        return '+';
        break;
      case 171:
        return '-';
        break;
      case 172:
        return '-';
        break;
      case 173:
        return '+';
        break;
      case 174:
        return '-';
        break;
      case 175:
        return '-';
        break;
      case 176:
        return '-';
        break;
      case 178:
        return '-';
        break;
      case 179:
        return '-';
        break;
      case 180:
        return '+';
        break;
      case 181:
        return '+';
        break;
      case 182:
        return '+';
        break;
      case 183:
        return '+';
        break;
      case 185:
        return '-';
        break;
      case 186:
        return '-';
        break;
      case 187:
        return '+';
        break;
      case 188:
        return '+';
        break;
      case 177:
        return '-';
        break;
      case 195:
        return '-';
        break;
      case 196:
        return '+';
        break;
      case 197:
        return '+';
        break;
      case 198:
        return '+';
        break;
      case 201:
        return '-';
        break;
      case 202:
        return '+';
        break;
      case 203:
        return '+';
        break;
      case 204:
        return '-';
        break;
      case 205:
        return '+';
        break;
      case 206:
        return '-';
        break;
      case 4:
        return '-';
        break;
      case 5:
        return '+';
        break;
      case 207:
        return '-';
        break;
      case 208:
        return '+';
        break;
      case 209:
        return '+';
        break;
      case 210:
        return '-';
        break;
      case 211:
        return '-';
        break;
      case 212:
        return '+';
        break;
      case 213:
        return '+';
        break;
      case 214:
        return '-';
        break;
      case 215:
        return '+';
        break;
      case 216:
        return '-';
        break;
      case 217:
        return '+';
        break;
      case 218:
        return '+';
        break;
      case 219:
        return '-';
        break;
      case 220:
        return '-';
        break;
      case 221:
        return '-';
        break;
      case 222:
        return '+';
        break;
      case 223:
        return '+';
        break;
    }
  }
}

Vue.prototype.hasFour = function (str) {
  let aNew
  let reg = /([0-9]+\.[0-9]{4})[0-9]*/
  aNew = str.toString().replace(reg, "$1")
  return aNew
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

router.afterEach(() => {
  document.body.scrollTop = 0
})
