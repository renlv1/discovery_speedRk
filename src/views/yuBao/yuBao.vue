<template>
  <div>
    <div class="v-content-wrapper">
      <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
      <div class="top-wrapper">
        <div class="value">
          <span class="pi">{{yueBaoBalance}}</span>
          <img src="./images/paiLogo.png" />
        </div>
        <div class="text">{{$t('yuBao.text2')}}</div>
      </div>
      <div class="value-wrapper">
        <div class="value-left">
          <p class="value">{{income}}</p>
          <p class="value-text">{{$t('yuBao.text3')}}（π）</p>
        </div>
        <div class="line"></div>
        <div class="value-right">
          <p class="value">{{percentage}}%</p>
          <p class="value-text">{{$t('yuBao.text4')}}</p>
        </div>
      </div>
      <ul>
        <li @click="toDetail(0)">
          <p>{{$t('yuBao.text7')}}</p>
          <img src="./images/row.png" />
        </li>
        <li @click="toDetail(1)">
          <p>{{$t('yuBao.text8')}}</p>
          <img src="./images/row.png" />
        </li>
      </ul>
      <div class="btn-wrapper">
        <div class="out btn" @click="trans(2)">{{$t('yuBao.text5')}}</div>
        <div class="in btn" @click="trans(1)">{{$t('yuBao.text6')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {yueBaoBalance} from '@/api/fund'

export default {
  name: "yuBao",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('yuBao.text1'),
      yueBaoBalance: '',
      income: '',
      percentage: '',
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.getBalance()
  },
  methods: {
    trans(num) {
      this.$router.push({
        path: '/transYuBao',
        query: {type: num}
      })
    },
    toDetail(num) {
      if (num === 0) {
        this.$router.push('/yuBaoBill')
      } else {
        this.$router.push('/income')
      }
    },
    getBalance() {
      yueBaoBalance().then((res) => {
        this.yueBaoBalance = res.data.data.yueBaoBalance
        this.income = res.data.data.profitTotal
        this.percentage = res.data.data.profitRate
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    height calc(100vh - 2rem)
    position relative
    padding-top 0
    padding-bottom 0
    .top-wrapper
      margin-bottom .4rem
      text-align center
      padding .6rem 0 .54rem
      background-color #fbf5e7
      border-radius 8px
      .value
        display flex
        flex-direction row
        justify-content center
        height .5rem
        align-items center
        margin-bottom .2rem
        .pi
          line-height .5rem
          display block
          font-size .34rem
          margin-right .2rem
        img
          width .4rem
          height .4rem
      .text
        font-size .24rem
    .value-wrapper
      display flex
      flex-direction row
      justify-content space-between
      .value-left, .value-right
        font-size .28rem
        width 48%
        display flex
        justify-content center
        flex-direction column
        height 1rem
        line-height .4rem
        align-items center
        .value
          margin-bottom .14rem
          color #b79961
        .value-text
          text-align center
      .line
        background-color #707070
        width 1px
        height 1rem
    ul
      margin-top .6rem
      li
        margin-top: .4rem;
        height 1rem
        display flex
        flex-direction row
        align-items center
        justify-content space-between
        border-bottom 1px solid #ccc
        p
          font-size .28rem
        img
          width .28rem
          height .28rem
   .btn-wrapper
     width 90%
     display flex
     flex-direction row
     justify-content space-between
     position fixed
     bottom 30px
     .btn
       width 45%
       border-radius 4px
       text-align center
       font-size 14px
       height 1rem
       line-height 1rem
     .out
       background-color #a2faed
     .in
       background-color #ffe941
</style>
