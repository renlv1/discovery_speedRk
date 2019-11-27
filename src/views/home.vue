<template>
  <div class="home">
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="content" v-show="mainData.length > 0">
      <!--      主区-->
      <div class="big-uls">
        <h3 class="v-title">{{$t('market.text1')}}</h3>
        <ul class="uls">
          <li class="list" @click="gotodetail(item)" v-for="(item, index) in mainData" :key="index">
            <div class="div-w">
              <div>
                <span class="hei">{{item.secondCurrency}}</span> / {{item.firstCurrency}}
              </div>
              <div class="hei">{{item.newPrice | fourNumber}}</div>
            </div>
            <div class="div-w div-w-t">
              <span>24H{{$t('market.text2')}} {{item.totalAmount}}</span>
              <span :class="{'green': item.riseRate >= 0, 'red': item.riseRate < 0}">{{item.riseRate}}%</span>
            </div>
          </li>
        </ul>
      </div>
      <!--      创新区-->
      <div class="big-uls">
        <h3 class="v-title">{{$t('market.text3')}}</h3>
        <ul class="uls">
          <li class="list" @click="gotodetail(item)" v-for="(item, index) in newData" :key="index">
            <div class="div-w">
              <div>
                <span class="hei">{{item.secondCurrency}}</span> / {{item.firstCurrency}}
              </div>
              <div class="hei">{{item.newPrice | fourNumber}}</div>
            </div>
            <div class="div-w div-w-t">
              <span>24H{{$t('market.text2')}} {{item.totalAmount}}</span>
              <span :class="{'green': item.riseRate >= 0, 'red': item.riseRate < 0}">{{item.riseRate}}%</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <v-loading v-show="loadingShow"></v-loading>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loadingShow: true,
      isGoBack: true,
      titleName: this.$t('market.text4'),
      mainData: [],
      newData: []
    }
  },
  created () {
    this.getCoinRiseRate()
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
    gotodetail (item) {
      this.$router.push({
        path: '/exchange',
        query: {firstCurrency: item.firstCurrency, secondCurrency: item.secondCurrency}
      })
    },
    // 1.7 查询各币种涨跌度 接口URL: http://wallet.pigamegroup.com/coinvolume/coinRiseRate
    getCoinRiseRate () {
      this.$fetch.post(`/coinvolume/coinRiseRate`).then(res => {
        this.loadingShow = false
        if (res.success === true) {
          let menuData = res.data
          let mainData = []
          let newData = []
          menuData.forEach((item) => {
            if (item.coinQueType === 1) {
              mainData.push(item)
            }
            if (item.coinQueType === 2) {
              newData.push(item)
            }
          })
          this.mainData = mainData
          this.newData = newData
        }
      })
    }
  },
  components: {
    mFixedTop: () => import('@/components/mFixedTop'),
    vLoading: () => import('@/components/loading.vue'),
  }
}
</script>

<style lang="stylus" scoped>
.home
  padding: 1.76rem .4rem 0
  .content
    padding-top: .2rem
  .big-uls
    .uls
      margin: .4rem 0 .8rem
      .list
        border-bottom: 1px solid #e6e6e6
        height: 1.4rem
        display: flex
        flex-direction column
        justify-content center
        .div-w
          font-size: .32rem
          color #bfbfbf
          display: flex
          align-items center
          justify-content space-between
          &.div-w-t
            margin-top: .16rem
            font-size: .24rem
          .hei
            color #000
          .red
            color #ff717d
          .green
            color #36c46f
</style>
