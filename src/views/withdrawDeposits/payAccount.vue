<template>
  <div class="pay-account">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="v-content-wrapper">
      <router-link tag='span' class="btn-text" :to="{path: '/addBank', query: {currency: this.currency || 'USD'}}" >
        <img width="11" height="11" src="../payAccount/img/add.svg">
        {{$t('sharer.addBankAccount.text1')}}
      </router-link>
      <ul class="bank-list" :class="{'active': nullDataShow}">
        <cube-scroll
        ref="cubeList"
        :options="options"
        :data="bankList"
        @pulling-up="onPullingUp">
          <li class="item" v-for="item in bankList" @click="itemfn(item)" :key="item.index"  v-show="item.accountType !== 2 && item.accountType !== 3">
            <div class="bank-name">
              <span class="main-name">{{item.bankName}}</span>
              <span class="sub-name">{{item.subBankName}}</span>
            </div>
            <div class="bank-number">
              {{item.accountNumber}}
            </div>
          </li>
        </cube-scroll>
      </ul>
      <div class="null" v-show="emptyShow">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <div class="noText">{{emptyText}}</div>
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
import {ERR_OK} from "../../assets/js/config"
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {mFixedTop},
  data() {
    return {
      accountIndex: 0,
      titleName: this.$t('withdrawalOrder.text10'),
      bankList: [],
      currency: this.$route.query.currentCoin || 'USD',
      pageIndex: 1,
      pageSize: 20,
      emptyText: this.$t('withdrawalOrder.text9'),
      nullDataShow: false,
      emptyShow: true,
      isShow: true,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: {
            more: '',
            noMore: ''
            /*more: '上拉加载更多',
            noMore: '没有更多数据'*/
          }
        }
      },
    }
  },
  created() {
    this._getPayAccount()
  },
  methods: {
    onPullingUp () {
      this._getPayAccount()
    },
    // 充值提现接口》4.2 查询银行帐户列表 account/list
    _getPayAccount() {
      this.$fetch.post(`${this.$api}account/list`,{
        currency: this.$route.query.currentCoin,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.status === 'success') {
          setTimeout(() => {
            this.isShow = false
            const bankList = res.data.list
            if (bankList.length) {
              if (this.pageIndex === 1){
                this.bankList = bankList
              } else {
                this.bankList.push(...bankList)
              }
              this.pageIndex++
            } else {
              if (this.pageIndex === 1){ // 没数据
                this.bankList = []
                this.nullDataShow = true // 数据空时改变样式：高度值
                this.emptyShow = true
                this.options.pullUpLoad = false
              }
            }
            this.$refs.cubeList.forceUpdate()
          },1000)
        }
      })
    },
    itemfn(item) {
      this.setAccountNumber(item.accountNumber) // 银行卡
      this.setAccountType(item.accountType) // 银行卡类型
      this.setAccountBankId(item.id) // 银行卡id
      this.$router.back()
    },
    ...mapMutations({
      setAccountNumber: 'SET_ACCOUNT_NUMBER',
      setAccountType: 'SET_ACCOUNT_TYPE',
      setAccountBankId: 'SET_ACCOUNT_BANK_ID',
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .v-content-wrapper
    position fixed
    padding 20px .4rem
    z-index 99
    .btn-text
      text-align center
      display inline-block
      width 100%
      height 50px
      line-height 50px
      color #b79961
      font-size .32rem
      border 1px dotted #b79961
    .null
      font-size: .28rem;
      color: #999;
      text-align: center;
      padding: .6rem 0;
      padding-top: 100px;
      .noData
        width: 1.8rem;
        height: 1.75rem;
        margin: 0 auto;
        margin-bottom: 0.2rem;
        img
          width: 100%;
          height: 100%;
    .bank-list
      height: calc(100vh - 154px) !important;
      &.active
        height: calc(100vh - 100vh) !important;
      margin-top .6rem
      & /deep/ .cube-scroll-wrapper{
        .cube-scroll-list-wrapper{
          min-height: calc(100vh - 154px) !important;
        }
        .cube-pulldown {
          .cube-pulldown-loaded{
            font-size: 14px;
            color: #999;
          }
        }
        .cube-pullup-wrapper{
          .before-trigger{
            font-size: 14px !important;
            color: #999 !important;
          }
        }
      }
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
