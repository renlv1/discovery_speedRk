<template>
  <div class="v-page account-w">
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <ul class="v-content">
      <li class="list" @click="gotoDetail(item.currency)" v-for="(item, index) in newData" :key="index">
        <div class="top">
          <div class="left-t">
            <div class="icon">
              <img :src="item.coinImg" alt="">
            </div>
            <span>{{item.currency}}</span>
          </div>
          <div class="right">
            <img src="../../assets/img/common/arrows.svg" alt="">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        newData: [],
        isGoBack: true,
        titleName: this.$t('bank.text23'),
      }
    },
    created () {
      this.getBank()
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
      gotoDetail (currency) {
        this.$router.push({
          path: '/accountCurrency',
          query: {currency}
        })
      },
      getBank () {
        this.$fetch.post(`${this.$api2}account/queryCoinList`, {
          sourceType: 5
        }).then(res => {
          if (res.status === 'success') {
            this.newData = res.data
          }
        })
        // this.$fetch.post(`${this.$api2}/account/list`, {
        //   currency: 'TIP'
        // }).then(res => {
        //   console.log(res)
        // })
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    }
  }
</script>

<style scoped lang="stylus">
  .account-w
    .list
      width: 100%
      height: 1.4rem
      background-color: #fafafa
      padding: 0 .4rem
      color #000
      font-size: .34rem
      margin-bottom: .3rem
      display: flex
      align-items center
      .top
        display: flex
        align-items center
        justify-content space-between
        width: 100%
        .left-t
          display: flex
          align-items center
          .icon
            width: .64rem
            height: .64rem
            border-radius 50%
            margin-right: .2rem
            img
              width: 100%
              height: 100%
              border-radius 50%
              display: block
        .right
          img
            width: .3rem
            height: .3rem
            display: block
      .money
        margin-top: .3rem
</style>
