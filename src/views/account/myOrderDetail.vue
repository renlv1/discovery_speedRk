<template>
  <div class="paiPayDetail">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="m-c">
      <div class="banner">
        <div class="all-box">
          <div class="stat-t" v-if='Number(this.$store.state.orderFlag) === 2'>{{orderStatus4(receiptInfo.status)}}
          </div>
          <div class="stat-t" v-if='Number(this.$store.state.orderFlag) === 3'>{{orderStatus3(receiptInfo.status)}}
          </div>
          <div class="all-top" v-if='Number(this.$store.state.orderFlag) === 2'>{{orderStatus(receiptInfo.status)}}
          </div>
          <div class="all-top" v-if='Number(this.$store.state.orderFlag) === 3'>{{orderStatus2(receiptInfo.status)}}
          </div>
          <!--          <div class="money" v-if="receiptInfo.status === 1">等待您确认订单并进行提交</div>-->
        </div>
      </div>
      <div class="tab-ul">
        <div>
          <div class="wuliu-m" v-show="receiptInfo.status === 4 || receiptInfo.status === 5" @click="wuliuDetails()">
            <div class="li-tab">
              <img src="./img/logisticsDetails.png">
              <div class="address-t">{{$t('paiOrder.text16')}}</div>
            </div>
            <div class="wuliu-box">
              <div class="wuliu-top">
                <div class="wuliu-address">{{deliveryStatus}}</div>
                <img src="./img/right-grey.png" style="width: .14rem;height: .26rem">
              </div>
              <div class="date" v-show="endTime">{{endTime}}</div>
            </div>
          </div>
          <div class="li-tab">
            <img src="./img/shipping-address.png">
            <div class="address-t">{{$t('payReturn.text14')}}</div>
          </div>
          <div class="name-box">
            <div class="name-t">{{receiptInfo.realname}}</div>
            <div class="mobile" v-show="receiptInfo.phone">{{(receiptInfo.phone && receiptInfo.phone.indexOf('+')) > -1
              ? '' : '+'}}{{receiptInfo.phoneCode}} {{receiptInfo.phone}}
            </div>
          </div>
          <div class="shipping-address">
            <div class="choose-address">{{receiptInfo.receiptAddress}}</div>
          </div>
        </div>
        <div class="line-two"></div>
        <div class="goods-box">
          <div class="goods-count">
            <div class="product-name">
              {{$t('payReturn.text15')}}（{{totalNum}}）
            </div>
          </div>
          <ul class="product-m">
            <li class="name-m" v-for="(item,index) in careList" :key="index">
              <div class="product-box">
                <div class="product-img">
                  <img v-if="item.productImg" :src="item.productImg" alt="">
                  <img v-else :src="item.imageList" alt="">
                </div>
                <div class="name-b">
                  <div class="t-b">
                    <div class="name">{{item.productName}}</div>
                    <div class="count">x{{item.num}}</div>
                  </div>
                  <div class="amount-box">
                    <div class="price">{{$t('payReturn.text16')}} {{item.price}}{{item.currency === 'PAI' ? 'π' :
                      item.currency}} <span
                        v-if="item.priceTwo && item.priceTwo !== 0"> + {{item.priceTwo}} π</span></div>
                    <div class="total">{{$t('payReturn.text17')}} {{item.num * item.price}} {{item.currency === 'PAI' ?
                      'π' : item.currency}}
                      <span v-if="item.priceTwo && item.priceTwo !== 0">+ {{item.num * item.priceTwo}} π</span></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <ul class="pay-info">
          <li>
            <span>{{$t('payReturn.text18')}}</span>
            <span v-if="receiptInfo.courierFee > 0">{{receiptInfo.courierFee}} π</span>
            <span v-else>{{$t('shopping.text11')}}</span>
          </li>
          <li>
            <span>{{$t('payReturn.text19')}}</span>
            <div>
              <span>{{totalActualStr}}</span>
            </div>
          </li>
          <li class="has-bottom">
            <span>{{$t('payReturn.text20')}}</span>
            <!-- 商家返回 -->
            <span v-if="$store.state.merIdAddress === receiptInfo.saleUserAddress">{{getStoreBackValue}}π</span>

            <!-- 用户返回 -->
            <span v-else>{{getUserBackValue}}π</span>
          </li>
          <li class="li-pay">
            <span class="hasGary">{{$t('payReturn.text21')}}</span>
            <span class="hasYellow">{{totalActualStr}}</span>
          </li>
        </ul>
      </div>
      <div class="line-two line-bg">
        <div class="tip"></div>
      </div>
      <ul class="order-info">
        <li>
          <div class="info-title">
            <span class="line"></span>
            <span>{{$t('payReturn.text22')}}</span>
          </div>
        </li>
        <li>
          <span>{{$t('payReturn.text23')}}</span>
          <div class="copy-box">
            <span class="content">{{$route.query.orderId}}</span>
            <div class="copy-btn" v-clipboard:copy="$route.query.orderId" v-clipboard:success="success"
                 v-clipboard:error="error">{{$t('account.text14')}}
            </div>
          </div>
        </li>
        <li>
          <span>{{$t('payReturn.text24')}}</span>
          <span v-show="receiptInfo.createAt">{{$changeDate(receiptInfo.createAt)}}</span>
        </li>
        <li v-if="receiptInfo.payDate">
          <span>{{$t('payReturn.text25')}}</span>
          <span v-show="receiptInfo.payDate">{{$changeDate(receiptInfo.payDate)}}</span>
        </li>
      </ul>
      <div class="btn-add"
           v-if="receiptInfo.status === 8 || receiptInfo.status === 9 || receiptInfo.status === 1 || receiptInfo.status === 4 || receiptInfo.status === 6">
        <div class="btn-b common-btn"
             v-if="receiptInfo.status === 8 && receiptInfo.saleUserAddress === this.$store.state.merIdAddress">
          <div class="btn-cancel btn-detail common-btn" @click.stop="refuse($route.query.orderId)">
            {{$t('payReturn.text26')}}
          </div>
          <div class="btn-order btn-detail common-btn" @click.stop="orders($route.query.orderId)">
            {{$t('payReturn.text27')}}
          </div>
        </div>
        <div class="btn-b"
             v-if="receiptInfo.status === 9 && receiptInfo.saleUserAddress === this.$store.state.merIdAddress">
          <div class="btn-pay btn-detail btn-men" @click.stop="checkLogistics($route.query.orderId)">
            {{$t('payReturn.text28')}}
          </div>
        </div>
        <div class="btn-b" v-if="receiptInfo.saleUserAddress !== this.$store.state.merIdAddress">
          <div class="btn-cancel btn-detail btn-men" @click.stop="cancel($route.query.orderId)"
               v-if="receiptInfo.status === 1">{{$t('payReturn.text29')}}
          </div>
          <div class="btn-pay btn-detail btn-men" style="width: 50%" v-if="receiptInfo.status === 1"
               @click.stop="pay(receiptInfo.payId)">{{$t('payReturn.text30')}}
          </div>
          <!--          <div class="btn-cancel btn-detail btn-men" v-if="receiptInfo.status === 4 || receiptInfo.status === 6"-->
          <!--               @click.stop="checkLogistics($route.query.orderId)">{{$t('my.text84')}}-->
          <!--          </div>-->
          <div class="btn-pay btn-detail btn-men" v-if="receiptInfo.status === 4"
               @click.stop="confirmReceipt($route.query.orderId, 1)">
            {{$t('my.text85')}}
          </div>
        </div>
      </div>
    </div>
    <div class="loadingShow" v-show="loadingShow">
      <img src="../../assets/img/common/loading.gif" style="width: 40px;height: 40px">
    </div>
    <pay-dialog :title="payTitle" ref="payDialog" @paySubmit="paySubmit"></pay-dialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import payDialog from '@/components/pay/payPopup'
import Dialog from '@/components/dialog/index'
import moment from 'moment/moment'

export default {
  name: "confirmOrder",
  components: {mFixedTop, payDialog},
  data() {
    return {
      loadingShow: false,
      isGoBack: true,
      titleName: this.$t('payReturn.text31'),
      payTitle: this.$t('payReturn.text32'),
      receiptInfo: {},
      careList: [],
      totalTwo: 0,
      allPricePi: 0,
      allPriceUSD: 0,
      allPriceCNY: 0,
      totalNum: 0,
      payId: '',
      deliveryStatus: '', // 物流状态
      endTime: '',
      userPayTotal: 0,
      cnyRate: 0,
      paiRate: 0,
      paitocnyRate: 0,
      totalActualStr: ''
    }
  },
  mounted() {
    this.transRateInfo()
  },
  computed: {
    getStoreBackValue() {
      if (this.receiptInfo.userPayTotalTwo && this.receiptInfo.userPayTotalTwo > 0 && this.receiptInfo.productProfitRate > 0) {
        return ((this.receiptInfo.userPayTotalTwo - this.receiptInfo.ecologyFeeTwo + this.receiptInfo.productProfitAmount) * 2).toFixed(4)
      } else {
        if ((!this.receiptInfo.userPayTotalTwo || this.receiptInfo.userPayTotalTwo === '' || this.receiptInfo.userPayTotalTwo === 0) && this.receiptInfo.productProfitRate > 0) {
          return (this.receiptInfo.productProfitAmount * 2).toFixed(4)
        } else {
          return 0
        }
      }
    },

    getUserBackValue() {
      if (this.receiptInfo.userPayTotalTwo && this.receiptInfo.userPayTotalTwo > 0 && this.receiptInfo.productProfitRate > 0) {
        return (this.receiptInfo.paitotal + this.receiptInfo.userPayTotalTwo).toFixed(4)
      } else {
        if ((!this.receiptInfo.userPayTotalTwo || this.receiptInfo.userPayTotalTwo === '' || this.receiptInfo.userPayTotalTwo === 0) && this.receiptInfo.productProfitRate > 0) {
          return this.receiptInfo.paitotal
        } else {
          return 0
        }
      }
    }
  },
  methods: {
    addNum() { // 计算总数
      let allNum = []
      this.careList.forEach((item) => {
        allNum.push(item.num)
      })
      this.totalNum = allNum.reduce(function (prev, curr) {
        return prev + curr;
      })
    },
    getExpress() {
      let orderId = this.$route.query.orderId
      this.$http.post(`${this.$api}shopMine/queryOrderExpress?orderId=${orderId}`).then((res) => {
        if (res.status === 200) {
          let data = res.data.data
          this.expressName = data.expressName
          this.expressNumber = data.expressNumber
          this.expressInfoList = data.expressInfoList
          this.state = data.state
          this.message = data.message
        }
      }).catch(err => {
        console.log(err)
      })
    },
    refuse(id) {
      // 拒绝接单
      Dialog({
        title: '',
        content: this.$t('payReturn.text33'),
        type: 'confirm',
        okFn: () => {
          this.$http.post(`${this.$api}shopMine/receiveOrder?orderId=${id}&flagType=2`).then((res) => {
            if (res.data.status === 'success') {
              this.toastD(this.$t('payReturn.text34'))
              setTimeout(() => {
                this.getDetail()
              }, 500)
            } else {
              this.toastD(res.data.msg)
            }
          })
        }
      })
    },
    orders(id) {
      // 接单
      this.$http.post(`${this.$api}shopMine/receiveOrder?orderId=${id}&flagType=1`).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('payReturn.text35'))
          setTimeout(() => {
            this.getDetail()
          }, 500)
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    // 取消订单
    cancel(id) {
      // 1 确认收货 2删除订单 3取消订单
      let flagType = 3
      this.operating(id, flagType)
    },

    // 确认收货
    confirmReceipt(id) {
      let flagType = 1
      this.operating(id, flagType)
    },

    operating(orderId, flagType) {
      let tip = ''  // 操作前的文案
      let okTip = this.$t('payReturn.text36') // 操作成功后的文案
      if (flagType === 1) {
        tip = this.$t('payReturn.text37')
      } else if (flagType === 2) {
        tip = this.$t('payReturn.text38')
      } else if (flagType === 3) {
        tip = this.$t('payReturn.text39')
      }
      Dialog({
        title: '',
        content: tip,
        okFn: () => {
          this.$http.post(`${this.$api}shopMine/confirmOrderReceive?orderId=${orderId}&flagType=${flagType}`).then((res) => {
            if (res.data.status === 'success') {
              this.toastD(okTip)
              setTimeout(() => {
                this.getDetail()
              }, 500)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },

    pay(id) {
      // 支付订单
      this.$refs.payDialog.showModel()
      this.payId = id
    },
    paySubmit() {
      // 提交支付按钮
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.loadingShow = true
          this.$refs.payDialog.closeModel()
          this.toastD(this.$t('payReturn.text40'))
          this.getDetail()
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    },
    goPath() {
      if (Number(this.$store.state.orderFlag) === 2) {
        this.$router.push({
          path: '/myPiOrder',
          query: {
            activeIndex: this.$route.query.activeIndex
          }
        })
      } else if (Number(this.$store.state.orderFlag) === 3) {
        this.$router.push({
          path: '/paiOrder',
          query: {
            activeIndex: this.$route.query.activeIndex
          }
        })
      } else {
        this.$router.push('/pay')
      }
    },
    // 订单状态 1 待付款 2已付款 3已撤单 4 已发货 5完成 6退货中 7退货完成 8 待商家接单 9 商家已接单待发货 11 商家拒绝接单
    orderStatus(i) { //1待付款 2撤单 3已完成 4待商家接单 5商家已接单待发货 6商家拒绝接单 7运输中
      if (i === 1) return this.$t('payReturn.text41')
      if (i === 2) return this.$t('payReturn.text42')
      if (i === 3) return this.$t('payReturn.text43')
      if (i === 4) return this.$t('payReturn.text44')
      if (i === 5) return this.$t('payReturn.text45')
      if (i === 6) return this.$t('payReturn.text46')
      if (i === 7) return this.$t('payReturn.text47')
      if (i === 8) return this.$t('payReturn.text48')
      if (i === 9) return this.$t('payReturn.text49')
      if (i === 11) return this.$t('payReturn.text50')
    },
    orderStatus4(i) { //1待付款 2撤单 3已完成 4待商家接单 5商家已接单待发货 6商家拒绝接单 7运输中
      if (i === 1) return this.$t('payReturn.text51')
      if (i === 2) return this.$t('payReturn.text52')
      if (i === 3) return this.$t('payReturn.text53')
      if (i === 4) return this.$t('payReturn.text54')
      if (i === 5) return this.$t('payReturn.text55')
      if (i === 6) return this.$t('payReturn.text56')
      if (i === 7) return this.$t('payReturn.text57')
      if (i === 8) return this.$t('payReturn.text58')
      if (i === 9) return this.$t('payReturn.text59')
      if (i === 11) return this.$t('payReturn.text60')
    },
    orderStatus2(i) {
      if (i === 1) return ''
      if (i === 2) return this.$t('payReturn.text61')
      if (i === 3) return this.$t('payReturn.text62')
      if (i === 4) return this.$t('payReturn.text63')
      if (i === 5) return this.$t('payReturn.text64')
      if (i === 6) return this.$t('payReturn.text65')
      if (i === 7) return this.$t('payReturn.text66')
      if (i === 8) return this.$t('payReturn.text67')
      if (i === 9) return this.$t('payReturn.text68')
      if (i === 11) return this.$t('payReturn.text69')
    },
    orderStatus3(i) {
      if (i === 1) return ''
      if (i === 2) return this.$t('payReturn.text70')
      if (i === 3) return this.$t('payReturn.text71')
      if (i === 4) return this.$t('payReturn.text72')
      if (i === 5) return this.$t('payReturn.text73')
      if (i === 6) return this.$t('payReturn.text74')
      if (i === 7) return this.$t('payReturn.text75')
      if (i === 8) return this.$t('payReturn.text76')
      if (i === 9) return this.$t('payReturn.text77')
      if (i === 11) return this.$t('payReturn.text78')
    },
    checkLogistics(id) {
      // 待发货
      this.$router.push({
        path: '/sellShip',
        query: {
          orderId: id
        }
      })
    },
    wuliuDetails() {
      this.$router.push({
        path: '/Logistics',
        query: {orderId: Number(this.$route.query.orderId)}
      })
    },

    transRateInfo() { // 汇率转换
      this.$http.post(`${this.$api}shopMine/getRateInfo`).then((res) => {
        this.cnyRate = res.data.data.cnyRate //美金对人民币汇率
        this.paiRate = res.data.data.paiRate // 派对美金 汇率
        this.paitocnyRate = res.data.data.paitocnyRate // 派对人民币汇率
        this.getDetail()
      })
    },

    getDetail() {
      let orderId = this.$route.query.orderId
      this.$http.post(`${this.$api}shopMine/queryOrderDetailNew?orderId=${orderId}`).then((res) => {
        this.loadingShow = false
        this.careList = res.data.data.orderDetails
        this.receiptInfo = res.data.data.orderRecord
        // 双币种
        if (this.receiptInfo.userPayTotalTwo > 0 && this.receiptInfo.userPayTotalTwo) {
          if (this.receiptInfo.acceptCurrency === 'USD') {
            // 接收币种为USD
            this.totalActualStr = (this.receiptInfo.userPayTotal + this.paiRate * this.receiptInfo.courierFee).toFixed(4) + 'USD' + '+' + this.receiptInfo.userPayTotalTwo + 'π'
          } else if (this.receiptInfo.acceptCurrency === 'CNY') {
            // 接收币种为CNY
            this.totalActualStr = (this.receiptInfo.userPayTotal + this.paitocnyRate * this.receiptInfo.courierFee).toFixed(4) + 'CNY' + '+' + this.receiptInfo.userPayTotalTwo + 'π'
          } else {
            // 接收币种为π
            this.totalActualStr = (this.receiptInfo.userPayTotal + this.receiptInfo.courierFee).toFixed(4) + 'π' + '+' + this.receiptInfo.userPayTotalTwo + 'π'
          }
        } else {
          // 单币种
          if (this.receiptInfo.acceptCurrency === 'USD') {
            this.totalActualStr = (this.receiptInfo.userPayTotal + this.paiRate * this.receiptInfo.courierFee).toFixed(4) + 'USD'
          } else if (this.receiptInfo.acceptCurrency === 'CNY') {
            this.totalActualStr = (this.receiptInfo.userPayTotal + this.paitocnyRate * this.receiptInfo.courierFee).toFixed(4) + 'CNY'
          } else {
            this.totalActualStr = (this.receiptInfo.userPayTotal + this.receiptInfo.courierFee).toFixed(4) + 'π'
          }
        }
        if (this.receiptInfo.status === 4 || this.receiptInfo.status === 5 && res.data.data.expressInfo) {
          if (res.data.data.expressInfo.expressInfoList) {
            this.deliveryStatus = res.data.data.expressInfo.expressInfoList[0].context
            let dateTime = res.data.data.expressInfo.expressInfoList[0].time
            this.endTime = moment(dateTime).format('YYYY/MM/DD HH:mm:ss')
          } else {
            this.deliveryStatus = res.data.data.expressInfo.message
          }
        }
        this.addTotal()
        this.addNum()
      })
    },
    // 合计
    addTotal() {
      let careList = this.careList
      let currency = []
      let price = []
      let pirceTwo = [] // 第二币种
      let allNum = []
      let arrPi = []
      let arrUSD = []
      let arrCNY = []
      careList.forEach((item) => {
        currency.push(item.currency)
        price.push(item.price * item.num)
        pirceTwo.push(item.priceTwo * item.num)
        allNum.push(item.num)
      })
      if (pirceTwo.length > 1) { // 判断数量数组中元素的个数 如果大于1 遍历累加 否则 结算数量为第一个元素的数量
        this.totalTwo = pirceTwo.reduce(function (prev, curr) {
          return prev + curr;
        })
      } else {
        this.totalTwo = pirceTwo[0]
      }
      currency.forEach((cur, index) => {
        if (cur === 'PAI') {
          arrPi.push(index)
        } else if (cur === 'USD') {
          arrUSD.push(index)
        } else if (cur === 'CNY') {
          arrCNY.push(index)
        }
      })
      // 计算单位为pai的金额之和
      let allPricePi = 0
      for (var i = 0; i < arrPi.length; i++) {
        allPricePi = allPricePi + price[arrPi[i]]
      }
      // 计算单位为USD的金额之和
      let allPriceUSD = 0
      for (var i = 0; i < arrUSD.length; i++) {
        allPriceUSD = allPriceUSD + price[arrUSD[i]]
      }
      // 计算单位为CNY的金额之和
      let allPriceCNY = 0
      for (var i = 0; i < arrCNY.length; i++) {
        allPriceCNY = allPriceCNY + price[arrCNY[i]]
      }
      this.allPricePi = allPricePi
      this.allPriceUSD = allPriceUSD
      this.allPriceCNY = allPriceCNY
    },
    // 复制
    success() {
      this.$createToast({
        type: 'plain',
        txt: this.$t('account.text15')
      }).show()
    },
    error() {
      this.$createToast({
        type: 'plain',
        txt: this.$t('account.text16')
      }).show()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .paiPayDetail {
    width 100%
    min-height: 100vh;
    background-color #f5f5f7
  }

  .iosx {
    .main-container {
      overflow scroll !important
    }
  }

  .line-two {
    height 10px
    background-color #f5f5f7
  }

  .banner {
    display flex
    width 100%
    align-items center
    background-color #ffb64b
    overflow hidden
    height 3rem
    .all-box {
      padding-left .3rem
      .all-top {
        font-size .28rem
        color #fff
        margin-bottom .28rem
      }
      .stat-t {
        font-size .4rem
        color #fff
        margin-bottom .28rem
      }
      .money {
        font-size .28rem
        color #fff
      }
    }
  }

  .tab-ul {
    background-color: #fff;
    width: 100%;
    margin-top -.5rem
    .li-tab {
      padding .25rem
      display flex
      align-items center
      img {
        width .28rem
        height .34rem
      }
      .address-t {
        margin-left .2rem
        font-size .28rem
        color #000
      }
    }
    .wuliu-box {
      border-bottom 1px solid #edeef0
      .wuliu-top {
        padding 0 .3rem
        display flex
        justify-content space-between
        .wuliu-address {
          font-size .24rem
          color #060f26
          margin-bottom .2rem
        }
      }
      .date {
        margin-bottom .2rem
        padding 0 .3rem
        font-size .22rem
        color #999
      }
    }
    .name-box {
      padding 0 0 .3rem .3rem
      display flex
      align-items center
      .name-t {
        font-size .24rem
        color #000
        margin-right .4rem
      }
      .mobile {
        font-size .24rem
        color #999
      }
    }
    .shipping-address {
      padding 0 .3rem .3rem
      display flex
      justify-content space-between
      align-items center
      .choose-address {
        line-height 1.45
        width 100%
        word-break normal
        word-wrap break-word
        font-size .26rem
        color #000
      }
      img {
        width .14rem
        height .26rem
      }
      .address-c {
        line-height 1.5
        word-break break-all
        font-size .24rem
        color #ffb64b
      }
    }
    .goods-box {
      .goods-count {
        display flex
        align-items center
        margin .3rem
        font-size .28rem
        color #ffb64b
        .product-img {
          width .44rem
          height .44rem
          border-radius 4px
          background-color #bcbcbc
          img {
            width 100%
            height 100%
          }
        }
        .product-name {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          margin 0 .1rem
          font-size .28rem
          color #000
        }
      }
      .product-m {
        .name-m {
          display flex
          padding 0 0 0 .3rem
          &:last-child {
            .name-b {
              /*border-bottom none*/
            }
          }
          .img-box {
            /*margin .4rem 0*/
            width 1.6rem
            height 1.6rem
            .ul-img {
              display flex
              align-items center
              .li-img {
                /*width 25%*/
                display flex
                align-items center
                justify-content center
                border-radius 4px
                width 1.6rem
                height 1.6rem
                margin-right .16rem;
                position relative
                img {
                  max-width 1.6rem
                  max-height 1.6rem
                  /*border-radius 4px*/
                }
                .count {
                  text-align center
                  line-height .5rem
                  background-color rgba(26, 26, 26, .8)
                  width .54rem
                  height .5rem
                  position absolute
                  right 0
                  bottom 0
                  font-size .28rem
                  color #fff
                }
              }
              .go-more {
                text-align center
                line-height 1.6rem
                width 25%
                height 1.6rem
                border-radius 8px
                background-color #ffb64b
                font-size .28rem
                color #ffb64b
              }
            }
          }
          .product-box {
            width 100%
            display flex
            margin-bottom .3rem
            .product-img {
              border-radius 4px
              display flex
              align-items center
              justify-content center
              width 1.6rem
              height 1.6rem
              background-color #e6e7e7
              img {
                max-width 100%
                max-height 100%
                /*border-radius 4px*/
              }
            }
          }
          .name-b {
            width 75%
            margin-left .2rem
            border-bottom 1px solid #edeef0
            display flex
            flex-direction column
            justify-content center
          }
          .t-b {
            justify-content space-between
            display flex
            line-height 1.5
            padding-right .3rem
            .name {
              width 70%
              font-size .28rem
              color #060f26
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break break-word
            }
            .count {
              font-size .28rem
              color #ffb64b
            }
            .price {
              margin-top .36rem
              font-size .24rem
              color #999
            }
          }
          .amount-box {
            padding-right .3rem
            display block
            justify-content space-between
            margin-top .3rem
            text-align right
            .price {
              margin-bottom .2rem
              font-size .24rem
              color #999
            }
            .total {
              margin-bottom .2rem
              font-size .24rem
              color #000
            }
          }
        }
      }
      .postage-box {
        padding .3rem
        border-bottom 1px solid #ededed
        color #999
        font-size .28rem
        .postage-t {
          display flex
          justify-content space-between
          &.user-pay {
            margin .3rem 0
          }
        }
      }
      .actually-paid {
        display flex
        justify-content space-between
        padding .3rem
        .title {
          font-size .3rem
          color #060f26
        }
        .cost {
          font-size .3rem
          color #ffb64b
        }
      }
      .order-box {
        padding .3rem .3rem 4rem
        .t-box {
          display flex
          align-items center
          margin-bottom .3rem
          .order-t {
            margin-left .2rem
            font-size .28rem
            color #060f26
          }
        }
        .postage-t {
          display flex
          justify-content space-between
          font-size .28rem
          color #999
          &.user-pay {
            margin .3rem 0
          }
          .cost {
            display flex
            .order-number {
              margin-right .5rem
            }
            .copy-btn {
              font-size .28rem
              color #3495f1
            }
          }
        }
      }
    }
    .pay-info {
      display flex
      flex-direction column
      font-size .28rem
      color #999
      .has-bottom {
        padding-bottom .3rem
        border-bottom 1px solid #eee
      }
      .li-pay {
        padding .3rem
      }
      li {
        padding .12rem .3rem
        display flex
        flex-direction row
        justify-content space-between
        .hasGary {
          color #000
          font-size .32rem
          font-weight bold
        }
        .hasYellow {
          color: #ffb64b;
          font-size .32rem
          font-weight bold
        }
      }
    }
    .btn-box {
      text-align center
      background-color #fff
      border-top 1px solid #dcdde1
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      cursor: pointer;
      user-select: none;
      font-size: .28rem;
      align-items center
      .btn-save {
        color #f14f34
        width 50%
        padding .1rem 0
        height: 1rem;
        text-align center
        border-right 2px solid #eeeff1
      }
      .btn-del {
        background-color #3495f1
        color #fff
        width 50%
        height: 1rem;
        text-align center
        line-height 1rem
      }
      .btn-cancel {
        position absolute
        left 50%
        height: 1rem;
        transform translate(-50%)
        color #f14f34
        line-height 1rem
      }
    }
  }

  .order-info {
    display flex
    flex-direction column
    font-size .3rem
    padding .3rem
    background-color #fff
    .info-title {
      display flex
      flex-direction row
      align-items center
      .line {
        display inline-block
        width 5px
        height 20px
        background-color #ffb64b;
        margin-right 10px
        border-radius 5px
      }
      span {
        color #000
        font-weight bold
      }
    }
    li {
      display flex
      flex-direction row
      justify-content space-between
      height .6rem
      line-height .6rem
      color #999
      .copy-box {
        display flex
        flex-direction row
        .content {
          margin-right 15px
        }
        .copy-btn {
          color #ffb64b;
        }
      }
    }
  }
  .btn-add {
    height auto
    background-color #f5f5f7
    .btn-b {
      width 100%
      display flex
      flex-direction row
      line-height 1.2rem
      background-color #f5f5f7
      .btn-cancel {
        height 1.2rem
        text-align center
        flex 1
        background-color #fff
        color #f14f34
        box-shadow 0 0 4px #e0e0e0
      }
      .btn-order {
        height 1.2rem
        text-align center
        flex 1
        background-color #ffb64b;
      }
      .btn-pay {
        height 1.2rem
        background-color #ffb64b;
        text-align center
        flex 1
      }
    }
  }

  .line-bg {
    height 10px
  }

  .loadingShow {
    display: flex
    align-items center
    justify-content center
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 200
    color #000
    background-color: rgba(0, 0, 0, .4)
  }
</style>
