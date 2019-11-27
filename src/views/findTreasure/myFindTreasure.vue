<template>
  <div class="trade-order">
    <app-header :titleName="titleName" :isGoBack="isGoBack" @goPathA="goPath" :isGoNumber="true"></app-header>
    <div class="content-b">
      <ul class="ul-status">
        <li class="li-status" v-for="(item, index) in statusArr" :key="index"
            @click="changeTab(index)"><span :class="{activeLi: orderTab === index}">{{item}}</span>
        </li>
      </ul>
      <div class="top-text" v-if="orderTab === 1">{{$t('treasure.tips1')}}<span
        style="color: #b79961"> {{count}} </span>{{$t('treasure.tips2')}} {{$t('treasure.tips3')}}<span
        style="color: #b79961"> {{value}} </span>π
      </div>
      <div class="order-list">
        <div class="empty-data" v-show="emptyDatas">
          <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
          <p class="text">{{$t('digitalTradeOrder.text4')}}</p>
        </div>
        <div class="unfinished" ref="unfinished" :class="{'hasTips': orderTab === 1}">
          <cube-scroll
            ref="scroll"
            :options="options"
            :data="mapList"
            @pulling-up="onPullingDown">
            <ul class="ul-list">
              <li class="li-item" v-for="(item,index) in mapList" :key="index" @click="lookInfo(item)">
                <div class="flex-t">
                  <div class="text-c">{{$t('findBao.text24')}}：{{item.id}}</div>
                  <div class="text-c">{{mapShowType(item.mapShowType)}}</div>
                </div>
                <p class="text-f" v-if="orderTab === 0 || orderTab === 2">{{item.address}}</p>
                <p class="text-f time-text" v-if="orderTab === 1">
                  <span v-show="item.unlocktime">{{$t('treasure.time')}} {{$changeDate(item.unlocktime)}}</span>
                  <span>{{timesFun(item.unlocktime)}}</span>
                </p>
                <div class="buy-box">
                  <div class="status">{{item.everytotal}}π</div>
                  <div class="" v-if="orderTab === 0">{{confirmStatus(item.confirmStatus)}}</div>
                </div>
              </li>
              <v-loading v-show="loadingShow"></v-loading>
            </ul>
          </cube-scroll>
        </div>
      </div>
    </div>
    <bottom-menu :tabState="tabState"></bottom-menu>
  </div>
</template>

<script>
import appHeader from '../../components/mFixedTop'
// import BScroll from 'better-scroll'
export default {
  data() {
    return {
      mapList: [],
      tabState: 1,
      loadingShow: true,
      emptyDatas: false,
      isGoBack: true,
      orderTab: 0,
      statusArr: this.$t('findBao.text25'),
      pageIndex: 1, // 页码
      titleName: this.$t('findBao.text26'),
      count: 0,
      value: 0,
    }
  },
  created() {
    // this.getUnfinishedList(1)
    // this.getData()
    this.getMyMineMapList(2)
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
    lookInfo(item) {
      if (this.orderTab !== 1) {
        this.$router.push({
          path: '/findDetails',
          query: {
            mapData: JSON.stringify(item)
          }
        })
      }
    },
    goPath() {
      this.$router.push('/menu')
    },
    timesFun(old) {       //传入之前的时间  时间格式为(YY-MM-DD HH:MM:SS)
      var returnText = "";
      var nowDate = new Date().getTime();   //当前时间
      var setDate = new Date(old).getTime();
      var times = Math.floor((setDate - nowDate) / 1000);
      if (times > 60 * 60 * 24 * 365) {
        returnText = Math.floor(times / (60 * 60 * 24 * 365)) + this.$t('findBao.text27');
      } else if (times > 60 * 60 * 24 * 30) {
        returnText = Math.floor(times / (60 * 60 * 24 * 30)) + this.$t('findBao.text28')
      } else if (times > 60 * 60 * 24) {
        returnText = Math.floor(times / (60 * 60 * 24)) + this.$t('findBao.text29')
      } else if (times > 60 * 60) {
        returnText = Math.floor(times / (60 * 60)) + this.$t('findBao.text30')
      } else if (times > 60) {
        returnText = Math.floor(times / (60)) + this.$t('findBao.text31')
      } else if (times > 0) {
        returnText = Math.floor(times / 1) + this.$t('findBao.text32')
      } else {
        returnText = "";
      }
      return returnText;
    },
    getMyMineMapList(type) {
      this.$fetch.post(`${this.$api}pai/queryMyMineMapList`, {
        status: type,	//string	1:未解锁2：解锁 3:已完成 （必填）
        page: this.pageIndex,	// int	页码
        pagesize: 20	 //int	页数
      }).then(res => {
        if (res.status === 'success') {
          this.loadingShow = false
          this.mapList = res.data
          if (this.mapList.length === 0) {
            this.emptyDatas = true
          }
          this.count = res.mapData.count
          this.value = res.mapData.locksumtotal
        } else {
          this.loadingShow = false
          this.emptyDatas = true
        }
      })
    },
    confirmStatus(status) {
      if (status === 0) return this.$t('findBao.text33')
      if (status === 1) return this.$t('findBao.text34')
    },
    // mapShowType;  //宝藏图显示类型 1商家任务图 2社交图 3智能寻宝图 4璀璨世界图
    mapShowType(index) {
      if (index === 1) return this.$t('findBao.text35')
      if (index === 2) return this.$t('findBao.text36')
      if (index === 3) return this.$t('findBao.text37')
      if (index === 4) return this.$t('findBao.text38')
      return ''
    },
    onPullingDown() {
      let index = this.orderTab
      let flag
      if (index === 0) {
        flag = 2
      } else if (index === 1) {
        flag = 1
      } else if (index === 2) {
        flag = 3
      }
      this.pageIndex++
      this.$fetch.post(`${this.$api}pai/queryMyMineMapList`, {
        status: flag,	//string	1:未解锁2：解锁 3:已完成 （必填）
        page: this.pageIndex,	// int	页码
        pagesize: 20	 //int	页数
      }).then(res => {
        if (res.status === 'success') {
          this.loadingShow = false
          this.mapList = this.mapList.concat(res.data)
        } else {
          this.loadingShow = false
          this.emptyDatas = true
        }
      })


      // 没有数据，结束此次刷新
      setTimeout(() => {
        this.$refs.scroll.forceUpdate()
      }, 1000)
    },
    // 切换Tab
    changeTab(index) {
      this.mapList = []
      this.loadingShow = true
      this.emptyDatas = false
      this.orderTab = index
      this.pageIndex = 1
      this.$refs.scroll.scrollTo(0, 0)
      if (index === 0) {
        this.getMyMineMapList(2)
      } else if (index === 1) {
        this.getMyMineMapList(1)
      } else if (index === 2) {
        this.getMyMineMapList(3)
      }
    }
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          txt: {
            more: this.$t('digitalTradeOrder.text19'),
            noMore: this.$t('digitalTradeOrder.text20')
          }
        }
      }
    }
  },
  components: {
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    bottomMenu: resolve => require(['@/components/bottomMenu.vue'], resolve),
    appHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-container {
    padding 0 !important
  }

  .hasTips {
    top 3.5rem !important
  }

  .content-b {
    padding: 0
  }

  .flex-t {
    display: flex
    align-items center
    justify-content space-between
    color #999
    font-size: .28rem
    padding-bottom: .2rem
    border-bottom: 1px dashed #999
  }

  .ul-status {
    margin 1.4rem 0 .4rem
    display flex
    justify-content space-between
    .li-status {
      flex 1
      height 1rem
      color #999
      font-size .28rem
      line-height 1rem
      text-align center
      span {
        &.activeLi {
          color #000
          position: relative
          &::before {
            position: absolute
            z-index: -1
            bottom: -.03rem
            padding: 0 .3rem
            left: -.3rem
            content ''
            display: block
            width: 100%
            height: .1rem
            background-color: #ffe600
            border-radius .05rem
          }
        }
      }
    }
  }

  .top-text {
    padding 0 .4rem
    font-size: .28rem
    text-align center
  }

  .order-list {
    .unfinished {
      width: 100%;
      overflow: hidden;
      position: fixed;
      padding 0 .4rem
      top: 2.5rem;
      left: 0;
      bottom: 0
      padding-bottom: 1.3rem
      >>> .cube-pullup-wrapper .before-trigger span {
        display: none
      }
    }
    .li-item {
      padding: .3rem
    }
    .time-text {
      display: flex
      align-items center
      justify-content space-between
    }
    .text-f {
      font-size: .28rem
      color #000
      padding-top: .3rem
    }
    .buy-box {
      font-size: .28rem
      color #999
    }
  }
</style>
