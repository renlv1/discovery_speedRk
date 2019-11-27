<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="topUp">
      <div class="v-content-wrapper">
        <h5 class="title">{{$t('topUp.subTitle.text1')}}<span class="subtitle">{{$t('topUp.subTitle.text2')}}</span>
        </h5>
        <div class="input-box">
          <input v-model="amount" type="number" class="v-placeholder-text" :placeholder="$t('topUp.inputTip.text1')" />
          <span class="cur">{{currentUnit}}</span>
        </div>
        <div class="pay-account-box">
          <p>{{$t('topUp.subTitle.text3')}}</p>
          <div class="pay-account">
            <div class="btn-main" @click="chooseType">
              <span class="btn">{{currentCoin || 'USD'}}</span>
              <span class="row"></span>
            </div>
            <div class="input-box" @click="chooseAccount">
              <span class="text">{{payAccount || $t('topUp.inputTip.text2')}}</span>
              <span class="row" v-show="showRow"></span>
            </div>
          </div>
          <div class="note">
            <input v-model="remark" class="v-placeholder-text" maxlength="120"
                   :placeholder="$t('topUp.inputTip.text3')" />
          </div>
        </div>
        <span class="btn-next" v-waves @click="createTopUpOrder()">{{$t('forget.nextStep')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import waves from '@/dircetive/waves/waves' // 水波纹指令
import {mapGetters} from 'vuex'
import {createOrder} from '../../api/topUp'

export default {
  components: {mFixedTop},
  directives: {waves},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('topUp.title'),
      currentCur: 'USD',
      amount: this.$store.state.topUpAmount, // 支付金额
      remark: '', // 备注
      bankAccountId: '' // 充值打款银行帐户id
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },

  methods: {
    createTopUpOrder() { // 创建充值订单
      let actualBankId
      if (this.currentCoin === 'USD' || this.currentCoin === 'CNY' || this.currentCoin === 'HKD' || this.currentCoin === 'CAD' || this.currentCoin === 'KRW') {
        actualBankId = this.$store.state.accountBankId
      } else {
        actualBankId = ''
      }
      createOrder(this.$store.state.currentCoin, this.amount, this.$TopUpOrder(this.currentUnit), this.remark, actualBankId).then((res) => {
        if (res.data.status === 'success') {
          const id = res.data.data.id
          this.$router.push({
            path: '/topUp/chooseShare',
            query: {orderId: id}
          })
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    chooseType() { // 选择支付类型
      this.$store.commit('TOP_UP_AMOUNT', this.amount)
      this.$store.commit('SET_BANK_ID', '')
      this.$router.push('/topUp/payType')
    },
    chooseAccount() { // 选择支付账号
      if (this.currentCoin === 'USD' || this.currentCoin === 'CNY' || this.currentCoin === 'HKD' || this.currentCoin === 'CAD' || this.currentCoin === 'KRW' || this.currentCoin === '') {
        this.$store.commit('TOP_UP_AMOUNT', this.amount)
        this.$router.push('/topUp/payAccount')
      }
    }
  },
  computed: {
    showRow() {
      const coinType = this.$store.state.currentCoin
      if (coinType === 'USD' || coinType === 'CNY' || coinType === 'HKD' || coinType === 'CAD' || coinType === 'KRW' || coinType === '') {
        return true
      } else {
        return false
      }
    },
    currentUnit() {
      if (this.currentCoin === 'USD' || this.currentCoin === 'CNY' || this.currentCoin === 'HKD' || this.currentCoin === 'CAD' || this.currentCoin === 'KRW' || this.currentCoin === '') {
        return 'USD'
      } else {
        return this.currentCoin
      }
    },
    payAccount() {
      if (this.currentCoin === '') {
        return this.$t('topUp.inputTip.text2')
      } else {
        if (this.currentCoin === 'USD' || this.currentCoin === 'CNY' || this.currentCoin === 'HKD' || this.currentCoin === 'CAD' || this.currentCoin === 'KRW') {
          return this.bankId
        } else {
          return this.$t('other.text1')
        }
      }
    },
    ...mapGetters([
      'currentCoin',
      'bankId'
    ])
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .v-content-wrapper
    .title
      font-size .28rem
      color #000
      .subtitle
        color #bfbfbf
    .input-box
      display flex
      justify-content space-between
      margin-top .2rem
      height 1rem
      line-height 1rem
      font-size .34rem
      border-1px-bottom(#bfbfbf)
      input
        padding-right 10px
        width 90%
        font-size .3rem
      .cur
        font-size .3rem
        flex 1
    .pay-account-box
      margin-top .8rem
      p
        font-size .28rem
        color #000
      .pay-account
        display flex
        align-items center
        margin-top .2rem
        .btn-main
          display flex
          align-items center
          justify-content center
          margin-right .4rem
          height 1rem
          width 1.6rem
          background-color #ffe941
          border-radius 4px
          font-size 0
          .btn
            font-size .3rem
          .row
            width 10px
            height 10px
            background-size 10px 10px
            background-image url("./img/row.svg")
            background-repeat no-repeat
        .input-box
          display flex
          align-items center
          margin-top 0
          flex 1
          border-1px-bottom(#bfbfbf)
          .text
            font-size .3rem
            color #bfbfbf
          .row
            width 12px
            height 12px
            display inline-block
            background-size cover
            background-image url("./img/row.svg")
            background-repeat no-repeat
      .note
        margin-top .2rem
        border-1px-bottom(#bfbfbf)
        .v-placeholder-text
          font-size .3rem
          width 100%
          height 1rem
          line-height 1rem
          display block
    .btn-next
      margin-top 1.6rem
      text-align center
      display inline-block
      width 100%
      height 1rem
      line-height 1rem
      color #b79961
      font-size .32rem
      border-1px(#bfbfbf, solid)
</style>
