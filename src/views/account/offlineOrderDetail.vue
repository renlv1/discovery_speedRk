<template>
  <div class="detail">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="top">
      <span class="tips">订单金额</span>
      <span class="value" v-if="orderRecord.userPayTotalTwo <= 0">{{orderRecord.orderAmount}} {{orderRecord.currency === 'PAI' ? 'π' : orderRecord.currency}}
<!--        <span v-show="orderRecord.userPayTotalTwo !== 0">+ {{orderRecord.userPayTotalTwo}} π</span>-->
      </span>
      <span class="value" v-else>{{orderRecord.orderAmount}}  {{orderRecord.currency === 'PAI' ? 'π' : orderRecord.currency}} + {{orderRecord.userPayTotalTwo}} π</span>
      <div class="shop">
        <div class="img-box">
          <img :src="orderRecord.merchantLogo" />
        </div>
        <span class="name">{{orderRecord.merchantName}}</span>
      </div>
    </div>
    <div class="order-info">
      <ul>
        <li>
          <span>{{$t('myPiOrder.text26')}}</span>
          <span style="color: rgb(255, 182, 75)">{{orderStatus(orderRecord.status)}}</span>
        </li>
<!--        实付金额-->
        <li>
          <span>实付金额</span>
          <span >{{getTotalActualStr(orderRecord)}}</span>
        </li>
        <li>
          <span>{{$t('myPiOrder.text27')}}</span>
          <span>{{`${orderRecord.productProfitRate}%`}}</span>
        </li>
        <li>
          <span>{{$t('myPiOrder.text28')}}</span>
          <span>{{getUserBackValue(orderRecord)}} π</span>
        </li>
        <li>
          <span>{{$t('myPiOrder.text29')}}</span>
          <span>{{orderRecord.id}}</span>
        </li>
        <li>
          <span>{{$t('myPiOrder.text30')}}</span>
          <span>{{$changeDate(orderRecord.createAt)}}</span>
        </li>

      </ul>
    </div>
    <div class="btn-wrapper" v-if="orderRecord.status === 1">
      <div class="btn cancel" @click="cancel(orderRecord.id)">{{$t('myPiOrder.text31')}}</div>
      <div class="btn pay" @click="pay(orderRecord.payId)">{{$t('myPiOrder.text32')}}</div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <pay-dialog :title="payTitle" ref="payDialog" @paySubmit="paySubmit"></pay-dialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import payDialog from '@/components/pay/payPopup'
import Dialog from '@/components/dialog/index'

export default {
  name: "offlineOrderDetail",
  components: {mFixedTop, payDialog},
  data() {
    return {
      titleName: this.$t('myPiOrder.text15'),
      orderRecord: {},
      loadShow: true,
      payTitle: this.$t('myPiOrder.text4'),
      nyRate: 0,
      paiRate: 0,
      paitocnyRate: 0,
    }
  },
  mounted() {
    this.transRateInfo()
    this.getDetail()
  },
  methods: {
    transRateInfo() { // 汇率转换
      this.$http.post(`${this.$api}shopMine/getRateInfo`).then((res) => {
        this.cnyRate = res.data.data.cnyRate //美金对人民币汇率
        this.paiRate = res.data.data.paiRate // 派对美金 汇率
        this.paitocnyRate = res.data.data.paitocnyRate // 派对人民币汇率
      })
    },
    getTotalActualStr(item) {
      // 双币种
      if (item.userPayTotalTwo > 0 && item.userPayTotalTwo) {
        if (item.acceptCurrency === 'USD') {
          // 接收币种为USD
          return item.userPayTotal + 'USD' + '+' + item.userPayTotalTwo + 'π'
        } else if (item.acceptCurrency === 'CNY') {
          // 接收币种为CNY
          return (item.userPayTotal * (1 / this.paitocnyRate)) + 'CNY' + '+' + item.userPayTotalTwo + 'π'
        } else {
          // 接收币种为π
          return item.userPayTotal + 'π' + '+' + item.userPayTotalTwo + 'π'
        }
      } else {
        // 单币种
        if (item.acceptCurrency) {
          if (item.acceptCurrency === 'USD') {
            return item.userPayTotal + 'USD'
          } else if (item.acceptCurrency === 'CNY') {
            return (item.userPayTotal * (1 / this.paitocnyRate)) + 'CNY'
          } else {
            return item.userPayTotal + 'π'
          }
        } else {
          if (item.currency === 'USD') {
            return item.orderAmount + 'USD'
          } else if (item.currency === 'CNY') {
            return item.orderAmount + 'CNY'
          } else {
            return item.orderAmount + 'π'
          }
        }
      }
    },
    getUserBackValue(item) {
      if (item.userPayTotalTwo && item.productProfitRate) {
        return (item.paitotal + item.userPayTotalTwo).toFixed(4)
      } else {
        return item.paitotal
      }
    },
    // 订单状态 1 待付款 2已付款 3已撤单 4 已发货 5完成 6退货中 7退货完成 8 待商家接单 9 商家已接单待发货 11 商家拒绝接单
    orderStatus(i) { //1待付款 2撤单 3已完成 4待商家接单 5商家已接单待发货 6商家拒绝接单 7运输中
      if (i === 1) return this.$t('myPiOrder.text5')
      if (i === 2) return this.$t('myPiOrder.text6')
      if (i === 3) return this.$t('myPiOrder.text7')
      if (i === 4) return this.$t('myPiOrder.text8')
      if (i === 5) return this.$t('myPiOrder.text9')
      if (i === 6) return this.$t('myPiOrder.text10')
      if (i === 7) return this.$t('myPiOrder.text11')
      if (i === 8) return this.$t('myPiOrder.text12')
      if (i === 9) return this.$t('myPiOrder.text13')
      if (i === 11) return this.$t('myPiOrder.text14')
      if (i === 21) return this.$t('myPiOrder.text46')
    },
    getDetail() {
      let orderId = this.$route.query.orderId
      this.$http.post(`${this.$api}shopMine/queryOrderDetailNew?orderId=${orderId}`).then((res) => {
        this.loadShow = false
        if (res.data.data.orderRecord) {
          this.orderRecord = res.data.data.orderRecord
        }
      })
    },

    // 取消订单
    cancel(id) {
      // 1 确认收货 2删除订单 3取消订单
      this.operating(id, 3)
    },
    // 支付订单
    pay(id) {
      this.$refs.payDialog.showModel()
      this.payId = id
    },
    paySubmit() {
      // 提交支付按钮
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.$refs.payDialog.closeModel()
          this.loadShow = true
          this.getDetail()
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    },
    operating(orderId, flagType) {
      let tip = ''  // 操作前的文案
      let okTip = this.$t('myPiOrder.text16') // 操作成功后的文案
      if (flagType === 1) {
        tip = this.$t('myPiOrder.text17')
      } else if (flagType === 2) {
        tip = this.$t('myPiOrder.text18')
      } else if (flagType === 3) {
        tip = this.$t('myPiOrder.text19')
      }
      Dialog({
        title: '',
        content: tip,
        okFn: () => {
          this.$http.post(`${this.$api}shopMine/confirmOrderReceive?orderId=${orderId}&flagType=${flagType}`).then((res) => {
            if (res.data.status === 'success') {
              this.toastD(okTip)
              setTimeout(() => {
                this.$router.push({
                  path: '/myOrderDetail',
                  query: {
                    orderId: orderId
                  }
                })
              }, 500)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .iosx {
    .btn-wrapper{
      height 1.3rem!important
      line-height 1rem!important
    }
  }
  .detail {
    height 100vh
    background-color: #f5f5f7;
    font-size 14px
    .top {
      padding-top 21px
      display flex
      flex-direction column
      align-items center
      background-color #fff
      .tips {
        color #999
        font-size 14px
        margin-bottom 10px
      }
      .value {
        font-weight bold
        font-size 24px
        color #000
        margin-bottom 15px
      }
      .shop {
        padding-top 20px
        border-top 1px solid #eee
        display flex
        flex-direction row
        align-items center
        justify-content center
        padding-bottom 15px
        .name{
          word-break break-word
        }
        .img-box {
          width 30px
          height 30px
          background-color #ccc
          margin-right 5px
          border-radius 5px
          display flex
          justify-content center
          align-items center
          img {
            max-width 100%
            max-height 100%
          }
        }
      }
    }
    .order-info {
      margin-top 15px
      background-color #fff
      ul {
        padding 0 15px
        li {
          padding 15px 0
          display flex
          justify-content space-between
        }
      }
    }
    .btn-wrapper {
      width 100%
      position fixed
      bottom 0
      display flex
      height 1rem
      line-height 1rem
      text-align center
      .btn {
        background-color #fff
        width 50%
      }
      .cancel {
        color rgb(255, 182, 75)
      }
      .pay {
        background-color #ffb64b
        color #fff
      }
    }
  }
</style>
