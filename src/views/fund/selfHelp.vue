<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="list-wrapper">
        <div class="list-top">
          <span>{{$t('fund.text101')}}</span>
          <span>{{$t('fund.text102')}}</span>
          <span>{{$t('fund.text103')}}</span>
        </div>
        <div class="list-value">
          <ul class="buy-list">
            <li v-for="item in sellList" :key="item.index" @click="chooseItem(item.price, 0)">
              <span>{{item.price}}</span>
              <span>{{item.amount}}</span>
              <span>{{item.sumAmount}}</span>
            </li>
          </ul>
          <ul class="sell-list">
            <li v-for="item in buyList" :key="item.index" @click="chooseItem(item.price, 1)">
              <span>{{item.price}}</span>
              <span>{{item.amount}}</span>
              <span>{{item.sumAmount}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="order-wrapper" @click="order">
          <img class="order-img" src="./images/order.png" />
          <div class="trans-right">{{$t('fund.text27')}}</div>
        </div>
        <div class="btn">
          <span class="isBuy" @click="pay(0)">{{$t('fund.text28')}}</span>
          <span class="isSell" @click="pay(1)">{{$t('fund.text29')}}</span>
        </div>
      </div>
      <transition name="safeDialog">
        <div class="dialog-w dialog-safe-w" v-show="buyVisible" @click="closeDialog">
          <div class="dialog-m" @click.stop>
            <div class="dialog-safe">
              <div class="dialog-top">
                <div class="method-item" v-for="(item, index) in buyMethod" :key="index"
                     :class="{'active-item': activeIndex === index}" @click="changeTab(index)">{{item}}
                </div>
                <div class="close" @click="closeDialog">
                  <div class="close-icon"></div>
                </div>
              </div>
              <div class="input-item">
                <label>{{$t('fund.text10')}}：</label>
                <input type="text" :placeholder="priceTypeText" class="input" v-model="price" :disabled="isDisable"
                       @input="changeBuyNum('price', 1)">
                <span></span>
              </div>
              <div class="input-item">
                <label>{{$t('fund.text11')}}：</label>
                <input onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :placeholder="maxNumberText" class="input"
                       v-model="maxNumberValue"
                       @input="changeBuyNum('maxNumberValue')">
                <span style="color: #b79961" @click="getAllAmount">{{$t('fund.text36')}}</span>
              </div>
              <div class="order-total-w">
                <div class="flex-w">
                  <span>{{$t('market.text14')}}</span>
                  <span class="total">{{getAllPrice}} π</span>
                </div>
                <p v-if="activeIndex === 0" class="my-money">{{$t('fund.text104')}}：{{canUsePiBalance}}π</p>
                <p v-if="activeIndex === 1" class="my-money">{{$t('fund.text37')}} {{fee}}% {{$t('fund.text37a')}}</p>
              </div>
              <div class="comfirm" @click="okCallbackBuy" :class="[activeIndex === 0 ? 'blue-btn' : 'red-btn']">
                {{activeIndex === 0 ? this.$t('market.text10') : this.$t('market.text11')}}
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!--支付验证-->
      <transition name="safeDialog">
        <div class="dialog-pay-w" v-show="payDialogShow">
          <div class="dialog-safe">
            <div class="close">
              <div class="close-icon"></div>
            </div>
            <div class="pay-title">{{$t('common.payDialog.title')}}</div>
            <div class="form-item">
              <input type="password" :placeholder="$t('common.payDialog.inputTip.text1')" class="input"
                     v-model.trim="safeCode">
            </div>
            <div class="form-item">
              <input type="number" :placeholder="$t('common.payDialog.inputTip.text2')" class="input"
                     v-model.trim="payCode">
            </div>
            <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
            <div class="g-dialog-btn-wrap">
              <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('common.dialog.text1')}}</div>
              <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('common.dialog.text2')}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {HOST} from '../../assets/js/config'
import {bookoffer, submitCoupon, canOperate, createEntrust} from '@/api/fund'

export default {
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('fund.text38'),
      buyList: [],
      sellList: [],
      buyVisible: false,
      buyMethod: this.$t('fund.text39'),
      maxNumberValue: '',
      activeIndex: 0,
      payDialogShow: false,
      price: '',
      isDisable: false,
      priceTypeText: this.$t('fund.text40'),
      maxNumberText: '',
      maxNumShow: false,
      maxNumber: '',
      safeCode: '',
      payCode: '',
      errInputMsg: '',
      fee: '',
      canUsePiBalance: ''
    }
  },
  name: "paiFund",
  computed: {
    getAllPrice() {
      return (this.price * this.maxNumberValue).toFixed(4)
    },
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.getBookoffer()
    this.getCanOperateMax()
  },
  methods: {
    chooseItem(price, type) {
      this.activeIndex = type
      this.price = price
      this.maxNumberValue = ''
      this.buyVisible = true
      this.getCanOperateMax()
    },
    closePayDialog() {
      this.payDialogShow = false
    },
    changeTab(index) {
      this.activeIndex = index
      this.price = ''
      if (this.activeIndex === 0) {
        this.priceTypeText = this.$t('fund.text40')
      } else {
        this.priceTypeText = this.$t('fund.text41')
      }
      this.maxNumShow = false
      this.getCanOperateMax()
    },
    getCanOperateMax() {
      canOperate().then((res) => {

        if (this.activeIndex === 0) {

          // 副本用于与输入的最大值比较
          this.maxNumber = res.data.data.canBuyAmount
          this.canUsePiBalance = res.data.data.canUsePiBalance

          if (this.maxNumShow) {
            this.maxNumberValue = res.data.data.canBuyAmount
          } else {
            this.maxNumberValue = ''
            this.maxNumberText = `${this.$t('fund.text42')} ${res.data.data.canBuyAmount} ${this.$t('fund.text43')}`
          }
        } else {

          this.fee = res.data.data.tradeFee
          // 副本用于与输入的最大值比较
          this.maxNumber = res.data.data.canSellAmount

          if (this.maxNumShow) {
            this.maxNumberValue = res.data.data.canSellAmount
          } else {
            this.maxNumberValue = ''
            this.maxNumberText = `${this.$t('fund.text44')} ${res.data.data.canSellAmount} ${this.$t('fund.text43')}`
          }
        }
      })
    },
    getAllAmount() {
      this.maxNumShow = true
      this.getCanOperateMax()
    },

    okCallback() {
      if (this.safeCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text4')
      }
      if (this.payCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text5')
      }
      if (this.safeCode !== '' && this.payCode !== '') {
        this.$fetch.post(`${HOST}tx/unlock`, {
          tradePwd: this.safeCode,  // 支付密码（选填）
          mobileCode: this.payCode,  // 手机验证码 （选填） 邮箱
          codeType: 1
        }).then((re) => {
          if (re.status === 'success') {
            this.payDialogShow = false
            this.flag = false
            this.okCallbackBuy()
          } else {
            this.errInputMsg = re.msg
          }
        })
      }
    },

    okCallbackBuy() {
      if (this.price !== '' && this.maxNumberValue !== '') {
        this.createOrder(this.price, this.maxNumberValue, this.activeIndex + 1)
      } else {
        this.toastD(this.$t('fund.text45'))
      }
    },

    createOrder(price, amount, eType) {
      createEntrust(price, amount, eType).then((res) => {
        if (res.data.success) {
          this.toastD(this.$t('fund.text46'))
          this.maxNumberValue = ''
          this.getCanOperateMax()
          this.closeDialog()
        } else {
          if (res.data.resultCode === 'ACCOUNT_LOCK') {
            this.closeDialog()
            this.payDialogShow = true
          } else {
            this.toastD(res.data.msg)
          }
        }
      })
    },


    closeDialog() {
      this.buyVisible = false
    },
    // 只能输入数字
    changeBuyNum(field, type) {
      let val = this[field]
      if (type) {
        if (!/^\d*\.{0,1}\d{0,2}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
          this[field] = val.substring(0, val.length - 1)
        }
        if (/^\./.test(this[field])) { // 如果是"."
          this[field] = ''
        }
        this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
      } else {
        if (this[field] > this.maxNumber) {
          this[field] = this.maxNumber
        } else {
          if (!/^\d*\.{0,1}\d{0,2}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
            this[field] = val.substring(0, val.length - 1)
          }
          if (/^\./.test(this[field])) { // 如果是"."
            this[field] = ''
          }
          this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
        }
      }
    },
    order() {
      this.$router.push('/fundTransDetail')
    },
    pay(type) {
      this.price = ''
      this.maxNumberValue = ''
      this.buyVisible = true
      this.changeTab(type)
      // submitCoupon(price, amount, type).then((res) => {
      //   console.log(res)
      // })
    },
    getBookoffer() {
      bookoffer(10).then((res) => {
        this.buyList = res.data.data.buy
        this.sellList = res.data.data.sell
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog-safe-w
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
    &.safeDialog-enter, &.safeDialog-leave-to
      opacity: 0;
      .dialog-safe
        transform: translate(0, 50%)
    &.safeDialog-enter-active
      transition: .3s;
      .dialog-safe
        transition: .3s
    &.safeDialog-leave-active
      transition: .1s;
      .dialog-safe
        transition: .1s
    .dialog-m
      position: absolute
      width: 100%
      bottom: .3rem
      padding: .3rem
    .dialog-safe
      width: 100%
      background-color: #fff
      border-radius 4px
      color #17161f
      font-size: .28rem;
      transform: translate(0, 0)
      padding: .3rem
      border: 1px solid #000
      position: relative
      .close
        width: .8rem
        height: .88rem
        display: flex
        align-items center
        justify-content center
        margin-left: .1rem
        .close-icon
          width: .26rem
          height: .26rem
          background: url("../../assets/img/order/close.svg") no-repeat center / cover
      .dialog-top
        display: flex
        align-items center
        margin-bottom: .4rem
        .method-item
          width: 2.6rem
          height: .88rem
          color #999
          background-color: #f0f0f0
          border-radius 4px
          display: flex
          align-items center
          justify-content center
          &:first-child
            margin-right: .2rem
          &.active-item
            background-color: #ffe941
            color #000
      .input-item
        width: 100%
        height: 1rem
        display: flex
        align-items center
        color #000
        border-bottom: 1px solid #000
        font-size: .3rem
        margin-bottom: .4rem
        .input
          flex 1
          height: 100%
      .order-total-w
        width: 100%
        height: 1.2rem
        border-radius 4px
        display: flex
        justify-content center
        flex-direction column
        padding: 0 .3rem
        border: 1px dashed #b79961
        margin: .5rem 0
        .flex-w
          font-size: .28rem
          color #000
          display: flex
          align-items center
          justify-content space-between
          .total
            color #b79961
        .my-money
          font-size: .24rem
          color #999
          margin-top: .1rem
      .comfirm
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
        border-radius 4px
        color #fff
        &.blue-btn
          background-color: #4cd282
        &.red-btn
          background-color: #ff717d

  .dialog-pay-w {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    color: #000;
    background-color: rgba(0, 0, 0, .4);
    &.safeDialog-enter, &.safeDialog-leave-to {
      opacity: 0;
      .dialog-safe {
        transform: translate(0, -5%)
      }
    }
    &.safeDialog-enter-active {
      transition: .3s;
      .dialog-safe {
        transition: .3s
      }
    }
    &.safeDialog-leave-active {
      transition: .1s;
      .dialog-safe {
        transition: .1s
      }
    }
    .dialog-safe {
      width: 6.9rem;
      background-color: #fff;
      position: relative;
      border-radius: 4px;
      color: #17161f;
      font-size: .28rem;
      transform: translate(0, 0);
      padding: 0 .4rem;
      .g-dialog-btn-wrap {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px dashed #000;
      }
      .pay-title {
        font-size: .28rem;
        text-align: center;
        padding: 20px 0;
      }
      .form-item {
        margin-bottom: .4rem;
        .label {
          margin-bottom: .2rem
        }
        .input {
          border-bottom: 1px solid #000;
          width: 100%;
          height: 1rem;
          color: #000;
        }
      }
      .err-ms {
        color: #ff717d;
        font-size: .24rem;
        margin-top: .3rem;
      }
      .shortMsg {
        position: relative;
        .payMsg-box {
          .payMsg {
            width: 100%;
            height: .8rem;
            background-color: #f5f6fa;
            border-radius: .4rem;
            font-size: .28rem;
            padding: 0 .3rem;
          }
          .sendMsg {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            padding: 0 .2rem;
            background-color: transparent;
            border: none;
            outline: none;
            font-size: .28rem;
            color: #00a6f1;
          }
        }
      }
      .g-dialog-btn {
        text-align: center;
        flex: 1;
        height: 100%;
      }
      .g-dialog-cancel {
        height: 50px;
        line-height: 50px;
        display: block;
      }
      .comfirm {
        width: 100%;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b79961;
      }
    }
  }

  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .list-wrapper
      .list-top
        height .56rem
        line-height .56rem
        width 100%
        display flex
        font-size .24rem
        flex-direction row
        span
          text-align center
          flex 1
      .list-value
        margin-top .2rem
        ul
          li
            font-size .24rem
            height .8rem
            line-height .8rem
            width 100%
            display flex
            span
              text-align center
              flex 1
        .buy-list
          li
            color #ff717d
        .sell-list
          li
            color #4cd282
    .bottom-wrapper
      background-color #fff
      width 90%
      position fixed
      bottom 0
      padding-bottom .6rem
      display flex
      flex-direction row
      margin-top .4rem
      align-items center
      .order-wrapper
        display flex
        border 1px solid #000
        width 1rem
        height 1rem
        flex-direction column
        align-items center
        font-size .14rem
        border-radius 4px
        margin-right .2rem
        img
          width .3rem
          height .4rem
          margin .1rem .05rem
      .btn
        display flex
        flex-direction row
        justify-content space-between
        flex 1
        font-size .32rem
        color #fff
        height 1rem
        line-height 1rem
        text-align center
        border-radius 5px
        span
          width 48%
          display block
          border-radius 4px
        .isBuy
          background-color #4cd282
        .isSell
          background-color #ff717d
</style>
