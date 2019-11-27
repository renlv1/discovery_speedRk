<template>
  <div class="trade-order">
    <app-header :titleName="titleName" :isGoBack="isGoBack"></app-header>
    <div class="content-b">
      <ul class="ul-status">
        <li class="li-status" v-for="(item, index) in $t('digitalTradeOrder.status')" :key="index" :class="{activeLi: orderTab === index}"
            @click="changeTab(index)">{{item}}
        </li>
      </ul>
      <div class="search-box">
        <div class="search-img" :class="{'active': activeIcon}"></div>
        <div class="input-box">
          <input :placeholder="$t('digitalTradeOrder.text21')" type="text" v-model.trim="orderNum" @input="searchInput(orderTab)">
        </div>
        <div class="clear-img" @click="closeSearch(orderTab)"><img src="../../assets/img/order/close.svg"></div>
      </div>
      <div class="order-list">
        <div class="empty-data" v-show="emptyDatas">
          <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
          <p class="text">{{$t('digitalTradeOrder.text4')}}</p>
        </div>
        <!--未完成-->
        <div class="unfinished" v-show="orderTab === 0" ref="unfinished">
          <cube-scroll
            ref="scroll"
            :options="options"
            :data="unfinishedList"
            @pulling-up="onPullingDown" v-show="!emptyDatas">
            <ul class="ul-list">
              <li class="li-item" v-for="(item,index) in unfinishedList" :key="index"
                  @click="$router.push({path: '/orderDetail',query:{id:item.id}})">
                <div class="buy-box">
                  <div class="buy-c">
                    <div class="buy-t" :class="{sale:item.etype === 2}">{{orderEtype(item.etype)}}</div>
                    <div class="order-no">{{$t('digitalTradeOrder.text2')}} {{item.id}}</div>
                  </div>
                  <div class="status">{{finishState(item.state)}}</div>
                </div>
<!--                <div class="money"><span>{{item.tradeAmount}} </span>/<span> {{item.amount}}</span><span> {{item.sellCurrency}}</span>-->
<!--                </div>-->
                <div class="price-box">
                  <div class="price tradeAmount">{{$t('digitalTradeOrder.text23')}}：{{item.tradeAmount}} {{item.sellCurrency}}</div>
                  <div class="date tradeAmount">{{$t('digitalTradeOrder.text24')}}： {{item.amount}} {{item.sellCurrency}}</div>
                </div>
                <div class="price-box">
                  <div class="price">{{$t('digitalTradeOrder.text1')}}：{{item.price}} {{item.buyCurrency}}</div>
                  <div class="date" v-show="item.createAt">{{$changeDate(item.createAt, '.', 5)}}</div>
                </div>
                <div class="dotted"></div>
                <div class="sum-box">
                  <div></div>
                  <div class="sum"><span>{{$t('digitalTradeOrder.text3')}} </span> {{parseFloat(item.amount * item.price).toFixed(8)}} {{item.buyCurrency}}</div>
                </div>
              </li>
              <v-loading v-show="loadingShow"></v-loading>
            </ul>
          </cube-scroll>
        </div>
        <!-- 已完成 -->
        <div class="unfinished" v-show="orderTab === 1" ref="finished">
          <cube-scroll
            ref="scroll2"
            :options="options"
            :data="finishedList"
            @pulling-up="onPullingDown2" v-show="!emptyDatas">
            <ul class="ul-list">
              <li class="li-item" v-for="(item,index) in finishedList" :key="index"
                  @click="$router.push({path: '/orderDetail',query:{id:item.id}})">
                <div class="buy-box">
                  <div class="buy-c">
                    <div class="buy-t" :class="{sale:item.etype === 2}">{{orderEtype(item.etype)}}</div>
                    <div class="order-no">{{$t('digitalTradeOrder.text2')}} {{item.id}}</div>
                  </div>
                  <div class="status">{{finishState(item.state)}}</div>
                </div>
<!--                <div class="money">-->
<!--                  <span>{{item.tradeAmount}} </span>/<span> {{item.amount}}</span><span> {{item.sellCurrency}}</span>-->
<!--                </div>-->
                <div class="price-box">
                  <div class="price tradeAmount">{{$t('digitalTradeOrder.text23')}}：{{item.tradeAmount}} {{item.sellCurrency}}</div>
                  <div class="date tradeAmount">{{$t('digitalTradeOrder.text24')}}： {{item.amount}} {{item.sellCurrency}}</div>
                </div>
                <div class="price-box">
                  <div class="price">{{$t('digitalTradeOrder.text1')}}：{{item.price}} {{item.buyCurrency}}</div>
                  <div class="date" v-show="item.createAt">{{$changeDate(item.createAt, '.', 5)}}</div>
                </div>
                <div class="dotted"></div>
                <div class="sum-box">
                  <div></div>
                  <div class="sum"><span>{{$t('digitalTradeOrder.text3')}} </span> {{parseFloat(item.amount * item.price).toFixed(8)}} {{item.buyCurrency}}</div>
                </div>
              </li>
              <v-loading v-show="loadingShow2"></v-loading>
            </ul>
          </cube-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appHeader from '../../components/mFixedTop'
// import BScroll from 'better-scroll'
export default {
  data() {
    return {
      isGoBack: true,
      activeIcon: false,
      orderNum: '',
      orderTab: 0,
      status: ['未完成', '已完成'],
      unfinishedList: [],
      finishedList: [],
      loadingShow: true,
      loadingShow2: true,
      emptyDatas: false,
      emptyFinish: false, // 已完成
      pageIndex: 1, // 页码
      pageIndex2: 1,
      pageSize: 10, // 页面数量
      timer: null,
      titleName: this.$t('digitalTradeOrder.text22')
    }
  },
  created() {
    // this.getUnfinishedList(1)
    this.getData()
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.scroll1 && this.scroll1.refresh()
    //     this.scroll2 && this.scroll2.refresh()
    //     this._initScroll()
    //   }, 20)
    //   let _this = this
    //   window.onresize = function () {
    //     this.scroll1 && _this.scroll1.refresh()
    //     this.scroll2 && _this.scroll2.refresh()
    //   }
    // })
  },
  methods: {
    onPullingDown() {
      this.getData()
      // 没有数据，结束此次刷新
      setTimeout(() => {
        this.$refs.scroll.forceUpdate()
      }, 1000)
    },
    onPullingDown2() {
      this.getData2()
      // 没有数据，结束此次刷新
      setTimeout(() => {
        this.$refs.scroll2.forceUpdate()
      }, 1000)
    },
    searchInput(index) {
      if (this.orderNum !== '') {
        this.activeIcon = true
      } else {
        this.activeIcon = false
      }
      this.pageIndex = 1
      this.unfinishedList = []
      this.loadingShow = true
      this.emptyDatas = false
      this.finishedList = []
      this.loadingShow2 = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (index === 0) {
          this.getData()
        } else if (index === 1) {
          this.getData2()
        }
      }, 300)
    },
    // 清除搜索
    closeSearch(index) {
      this.pageIndex = 1
      this.unfinishedList = []
      this.loadingShow = true
      this.emptyDatas = false
      this.finishedList = []
      this.loadingShow2 = true
      this.orderNum = ''
      if (index === 0) {
        this.getData()
      } else if (index === 1) {
        this.getData2()
      }
    },
    // 搜索订单
    searchBtn(index) {
      this.pageIndex = 1
      this.unfinishedList = []
      this.loadingShow = true
      this.emptyDatas = false
      this.finishedList = []
      this.loadingShow2 = true
      this.emptyFinish = false
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (index === 0) {
          this.getData()
        } else if (index === 1) {
          this.getData2()
        }
      }, 300)
    },
    // _initScroll() {  // 执行滚动
    //   // 未完成
    //   this.scroll1 = new BScroll(this.$refs.unfinished, {
    //     click: true,
    //     probeType: 1,
    //     pullup: true,
    //     pulldown: true
    //   })
    //   // 已完成
    //   this.scroll2 = new BScroll(this.$refs.finished, {
    //     click: true,
    //     probeType: 1,
    //     pullup: true,
    //     pulldown: true
    //   })
    //   this.scroll1.on('scrollEnd', (pos) => {
    //     if (!this.loadingShow) {
    //       return
    //     }
    //     if (this.scroll1.y <= (this.scroll1.maxScrollY + 50)) {
    //       this.pageIndex++
    //       this.$fetch.post('/coinentrust/queryCoinEntrustList', {
    //         state: 1,
    //         pageIndex: this.pageIndex,
    //         pageSize: this.pageSize
    //       }).then(res => {
    //         if (res.success === true) {
    //           // this.loadingShow = false
    //           let getList =  res.data
    //           this.unfinishedList = this.unfinishedList.concat(getList)
    //           if (!getList.length || getList.length < this.pageSize) {
    //             this.loadingShow = false
    //           } else {
    //             this.loadingShow = true
    //           }
    //         } else {
    //           this.loadingShow = false
    //           this.emptyDatas = true
    //         }
    //       }).catch(err => {
    //         this.loadingShow = false
    //         this.emptyDatas = true
    //         console.log(err)
    //       })
    //     }
    //   })
    //   // this.scroll1.on('touchEnd', (pos) => {
    //   //   if (pos.y > 50) {
    //   //     this.pageIndex = 1
    //   //     this.getUnfinishedList(1)
    //   //     this.loadingShow = true
    //   //   }
    //   // })
    //   this.scroll2.on('scrollEnd', (pos) => {
    //     if (!this.loadingShow2) {
    //       return
    //     }
    //     if (this.scroll2.y <= (this.scroll2.maxScrollY + 50)) {
    //       this.pageIndex2++
    //       this.$fetch.post('/coinentrust/queryCoinEntrustList', {
    //         state: 2,
    //         pageIndex: this.pageIndex2,
    //         pageSize: this.pageSize
    //       }).then(res => {
    //         if (res.success === true) {
    //           let getList =  res.data
    //           this.finishedList = this.finishedList.concat(getList)
    //           if (!getList.length || getList.length < this.pageSize) {
    //             this.loadingShow2 = false
    //           } else {
    //             this.loadingShow2 = true
    //           }
    //         } else {
    //           this.loadingShow2 = false
    //           this.emptyDatas = true
    //         }
    //       }).catch(err => {
    //         this.loadingShow2 = false
    //         this.emptyDatas = true
    //         console.log(err)
    //       })
    //     }
    //   })
    //   // this.scroll2.on('touchEnd', (pos) => {
    //   //   if (pos.y > 50) {
    //   //     this.pageIndex2 = 1
    //   //     this.getFinishedList(1)
    //   //     this.loadingShow2 = true
    //   //   }
    //   // })
    // },
    getData() {
      let dataObj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        state: 1
      }
      if (this.orderNum) {
        dataObj.orderId = this.orderNum
      }
      this.$fetch.post('/coinentrust/queryCoinEntrustList', dataObj).then(res => {
        if (res.success) {
          this.loadingShow = false
          let dataList = res.data
          if (dataList.length > 0) {
            if (this.pageIndex === 1) {
              this.unfinishedList = dataList
            } else {
              this.unfinishedList.push(...dataList)
            }
            this.pageIndex++
          } else {
            if (this.pageIndex === 1) {
              this.unfinishedList = []
              this.emptyDatas = true
            }
          }
        } else {
          this.loadingShow = false
          this.emptyDatas = true
          this.pageIndex = 1
          this.unfinishedList = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getData2() {
      let dataObj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        state: 2
      }
      if (this.orderNum) {
        dataObj.orderId = this.orderNum
      }
      this.$fetch.post('/coinentrust/queryCoinEntrustList', dataObj).then(res => {
        if (res.success) {
          this.loadingShow2 = false
          let dataList = res.data
          if (dataList.length > 0) {
            if (this.pageIndex === 1) {
              this.finishedList = dataList
            } else {
              this.finishedList.push(...dataList)
            }
            this.pageIndex++
          } else {
            if (this.pageIndex === 1) {
              this.finishedList = []
              this.emptyDatas = true
            }
          }
        } else {
          this.loadingShow2 = false
          this.emptyDatas = true
          this.pageIndex = 1
          this.finishedList = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 未完成
    // getUnfinishedList(page) {
    //   let dataObj = {
    //     pageIndex: page,
    //     pageSize: this.pageSize,
    //     state: 1
    //   }
    //   if(this.orderNum) {
    //     dataObj.orderId = this.orderNum
    //   }
    //   this.$fetch.post('/coinentrust/queryCoinEntrustList',dataObj).then(res => {
    //     if(res.success === true) {
    //       let getList = res.data
    //       if (getList.length < this.pageSize) {
    //         this.loadingShow = false
    //       } else {
    //         this.loadingShow = true
    //       }
    //       if (getList.length === 0) {
    //         this.emptyDatas = true
    //       } else {
    //         this.unfinishedList = res.data
    //         this.emptyDatas = false
    //       }
    //     } else {
    //       this.loadingShow = false
    //       this.emptyDatas = true
    //     }
    //   }).catch(err => {
    //     this.emptyDatas = true
    //     this.loadingShow = false
    //     console.log(err)
    //   })
    // },
    // 已完成
    // getFinishedList(page) {
    //   let dataObj = {
    //     pageIndex: page,
    //     pageSize: this.pageSize,
    //     state: 2
    //   }
    //   if(this.orderNum) {
    //     dataObj.orderId = this.orderNum
    //   }
    //   this.$fetch.post('/coinentrust/queryCoinEntrustList',dataObj).then(res => {
    //     if(res.success === true) {
    //       let getList = res.data
    //       if (getList.length < this.pageSize) {
    //         this.loadingShow2 = false
    //       } else {
    //         this.loadingShow2 = true
    //       }
    //       if (getList.length === 0) {
    //         this.loadingShow2 = false
    //         this.emptyDatas = true
    //       } else {
    //         this.finishedList = res.data
    //         this.emptyDatas = false
    //       }
    //     } else {
    //       this.loadingShow2 = false
    //       this.emptyDatas = true
    //     }
    //   }).catch(err => {
    //     this.emptyDatas = true
    //     this.loadingShow2 = false
    //     console.log(err)
    //   })
    // },
    // 切换Tab
    changeTab(index) {
      this.loadingShow = true
      this.loadingShow2 = true
      this.unfinishedList = []
      this.finishedList = []
      this.emptyDatas = false
      this.orderNum = ''
      this.orderTab = index
      this.pageIndex = 1
      this.pageIndex2 = 1
      // this._initScroll()
      if (index === 0) {
        this.getData()
      } else if (index === 1) {
        this.getData2()
      }
    },
    // 1:创建订单 2: 完全成交 3:部分成交 4:部分成交,撤单完成 5:撤单 6:系统异常
    finishState(state) {
      if (state === 1) return this.$t('digitalTradeOrder.text12') // 交易中
      if (state === 2) return this.$t('digitalTradeOrder.text13') // 已成交
      if (state === 3) return this.$t('digitalTradeOrder.text14') // 部分成交
      if (state === 4) return this.$t('digitalTradeOrder.text14') // 部分成交
      if (state === 5) return this.$t('digitalTradeOrder.text15') // 已取消
      if (state === 6) return this.$t('digitalTradeOrder.text16') // 系统异常
    },
    orderEtype(status) { // 1: 买入  2:卖出
      if (status === 1) return this.$t('digitalTradeOrder.text17') // 买入
      if (status === 2) return this.$t('digitalTradeOrder.text18') // 卖出
    },
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
    appHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-container
    padding 0!important
  .iosx .main-container
    padding 0!important
  .ul-status {
    margin 2rem 0 .4rem
    display flex
    justify-content space-between
    .li-status {
      flex 50%
      height 1rem
      color #999
      background #f0f0f0
      font-size .28rem
      margin-right .3rem
      border-radius 8px
      line-height 1rem
      text-align center
      &.activeLi {
        background #ffe600
        color #000
      }
      &:nth-child(2) {
        margin-right 0
      }
    }
  }

  .search-box {
    margin-bottom .4rem
    display flex
    align-items center
    height .8rem
    background #f7f7f7
    border-radius 4px
    width 100%
    .search-img {
      padding 0 .3rem
      width: .32rem;
      height: .32rem;
      line-height: .32rem;
      background: url("../../assets/img/order/search-01.svg") no-repeat center;
      background-size: 100% 100%;
      transition: all .4s cubic-bezier(0, .67, .98, .42);
      &.active {
        background: url("../../assets/img/order/search-02.svg") no-repeat center;
        background-size: 100% 100%;
      }
    }
    .input-box {
      display flex
      align-items center
      width 80%
      input {
        color #999
        font-size .28rem
        width 100%
        padding-right .5rem
        &::-webkit-input-placeholder {
          color: #999;
        }
        &:-moz-placeholder {
          color: #999;
        }
        &::-moz-placeholder {
          color: #999;
        }
        &:-ms-input-placeholder {
          color: #999;
        }
      }
    }
    .clear-img {
      width .26rem
      img {
        width 100%
      }
    }
  }

  .order-list {
    .unfinished {
      width: 100%;
      overflow: hidden;
      position: fixed;
      padding 0 .4rem
      top: 4.5rem;
      left: 0;
      bottom: .1rem;
    }
  }
</style>
