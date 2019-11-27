<template>
  <div class="pay-account">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <span class="btn-text" @click="add">
        <img width="11" height="11" src="./img/add.svg">
        {{$t('topUp.payAccount.addAccount')}}
      </span>
    <div class="v-content-wrapper" ref="wrapper">
      <cube-scroll
        ref="scroll"
        :data="bankList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul class="bank-list">
          <li class="item" v-for="item in bankList" :key="item.index" @click="chooseAccount(item)">
            <div class="bank-name">
              <span class="main-name">{{item.bankName}}</span>
              <span class="sub-name">{{item.subBankName}}</span>
            </div>
            <div class="bank-number">
              {{item.accountNumber}}
            </div>
          </li>
        </ul>
      </cube-scroll>
      <div class="empty-data" v-show="emptyDatas">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <p class="text">{{$t('common.noData')}}</p>
      </div>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getPayAccount} from '@/api/topUp'
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {mFixedTop},
  computed: {
    getAccountType() {
      if (this.currentCoin === 'USD' || this.currentCoin === 'CNY' || this.currentCoin === 'HKD' || this.currentCoin === 'CAD' || this.currentCoin === 'KRW') {
        return 1
      } else {
        return this.currentCoin
      }
    },
    ...mapGetters([
      'currentCoin',
    ])
  },
  data() {
    return {
      emptyDatas: false,
      isShow: true,
      titleName: this.$t('topUp.payAccount.addAccount'),
      bankList: [],
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this._getPayAccount()
  },
  methods: {
    add() {
      this.$router.push({path: '/addBank', query: {currency: this.currentCoin || 'USD'}})
    },
    chooseAccount(item) { // 选择账户
      const accountNumber = item.accountNumber
      const accountBankId = item.id
      this.setBankId(accountNumber)
      this.$store.commit('SET_ACCOUNT_BANK_ID', accountBankId)
      this.$router.back()
    },
    onPullingUp() { // 触发上拉加载
      this._getPayAccount()
    },
    _getPayAccount() {
      getPayAccount(this.currentCoin, this.getAccountType, this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data.list
          if (_list.length) {
            this.bankList.push(...res.data.data.list)
            this.pageIndex++
          } else {
            this.emptyDatas = true
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.data.msg)
        }
        if (this.bankList.length === 0) {
          this.emptyDatas = true
        } else {
          this.emptyDatas = false
        }
      })
    },
    ...mapMutations({
      setBankId: 'SET_BANK_ID',
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .btn-text
    z-index 999
    position fixed
    text-align center
    height 1rem
    width 90%
    top 1.4rem
    margin 0 .4rem
    line-height 1rem
    color #b79961
    font-size .32rem
    border 1px dotted #b79961
    background-color #fff
  // border-1px(#b79961, dotted)
  .v-content-wrapper
    position relative
    height calc(100vh - 1.5rem)
    padding-bottom 10px
    overflow hidden
    // padding-top 1.5rem!important
    .bank-list
      margin-top 1rem
      .item
        padding .3rem
        margin-bottom .3rem
        &:nth-of-type(4n+1)
          background-color #faf0f1
        &:nth-of-type(4n+2)
          background-color #e6faf8
        &:nth-of-type(4n+3)
          background-color #fbf5e7
        &:nth-of-type(4n+4)
          background-color #eaf2f9
        .bank-name
          display flex
          justify-content space-between
          .main-name
            font-size .3rem
          .sub-name
            font-size .24rem
        .bank-number
          margin-top .5rem
          text-align right
          font-size .34rem
</style>
