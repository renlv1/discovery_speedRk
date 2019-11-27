<template>
  <div class="withdrawalOrders-wrap">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath"></m-fixed-top>
    <div class="top-box">
      <div class="tab-box">
        <button class="but unfinished" :disabled="isdisabled1" ref="tab1" :class="{'active': navBgColor === 2 && butStyle === 0,'active2': navBgColor === 2 && butStyle === 1}"
                @click="navTableFn(2)">{{$t('withdrawalOrder.text2')}}
        </button>
        <button class="but completed" :disabled="isdisabled2" ref="tab2" :class="{'active': navBgColor === 1 && butStyle === 0,'active2': navBgColor === 1 && butStyle === 1}"
                @click="navTableFn(1)">{{$t('withdrawalOrder.text3')}}
        </button>
      </div>
      <div class="search-box">
        <div class="icon" :class="{'active': iconShow}"></div>
        <input class="input" type="number" maxlength="18" v-model.trim="search" @input="keepGetLastValue()"
               :placeholder="$t('withdrawalOrder.text4')" autocomplete="off" />
        <div class="close" :class="{'active': closeShow}" @click="closeFn()"><img src="../../assets/img/order/close.svg"
                                                                                  alt=""></div>
      </div>
    </div>
    <div class="main" :class="{'active': nullDataShow}">
      <!--共享者充值订单数据列表-->
      <div class="list-box" :class="{'active': activeShow, 'nullActive': nullActive}" v-if="boxShow">
        <cube-scroll
          ref="cubeList"
          :options="options"
          :data="withdrawalOrderList"
          @pulling-up="onPullingUp">
          <div class="list-item" @click="itemFn(item)" v-for="(item,index) in withdrawalOrderList" :key="index">
            <div class="info-box">
              <div class="lrs">
                <div class="order-number"><span>{{$t('withdrawalOrder.text5')}} {{item.id}}</span> <span
                  class="audit-status">{{item.tipMsg}}</span></div>
                <div class="sum">{{$store.state.currentShareStatusFooter === 0 ? $t('withdrawDeposit.text102') : $t('topUp.topUpDetail.itemContent.text3')}} {{item.amount | fourNumber}} {{item.currency}}</div>
                <div class="account-name"><span>{{item.userNick}}</span><span class="audit-time">{{$changeDate(item.createAt, '.')}}</span>
                </div>
              </div>
            </div>
            <div class="hr"></div>
            <div class="receivable-box">
              <!--应收-->
              <!--<div class="receivable">{{item.whoGiveMoneyStr}}</div>-->
              <div class="receivable">{{$t('withdrawDeposit.text18')}}</div>
              <div class="sum"><span class="count">{{item.rule || 0}}</span> <span
                class="unit"> {{item.unlineCurrency}}</span></div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <!--搜索订单列表-->
      <div class="list-box" :class="{'active': activeShow, 'nullActive': nullActive}" v-else-if="!boxShow">
        <div class="list-item" @click="itemFn(item)" v-for="(item,index2) in orderInquiry" :key="index2">
          <div class="info-box">
            <div class="lrs">
              <div class="order-number"><span>{{$t('withdrawalOrder.text5')}} {{item.id}}</span> <span
                class="audit-status">{{item.tipMsg}}</span></div>
              <div class="sum">充值金额 {{item.amount | fourNumber}} {{item.currency}}</div>
              <div class="account-name"><span>{{item.userNick}}</span><span class="audit-time">{{$changeDate(item.createAt, '.')}}</span>
              </div>
            </div>
          </div>
          <div class="hr"></div>
          <div class="receivable-box">
            <!--应收-->
            <div class="receivable">{{item.whoGiveMoneyStr}}</div>
            <div class="sum"><span class="count">{{item.rule || 0}}</span> <span
              class="unit"> {{item.unlineCurrency}}</span></div>
          </div>
        </div>
      </div>
      <div class="null" v-show="emptyShow">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <div class="noText">{{emptyText}}</div>
      </div>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
    </div>
    <sharer-footer class="share-footer" @changeIndex="changeIndex"></sharer-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isGoBack: true,
      titleName: this.$store.state.currentShareStatusFooter === 0 ? this.$t('withdrawalOrder.text102') : this.$t('withdrawalOrder.text1'),
      closeShow: false,
      iconShow: false,
      search: '',
      isShow: false, // load
      activeShow: false, // 淡入淡出
      boxShow: true, // 订单列表show
      nullDataShow: false,
      withdrawStyle: 1,
      butStyle: this.$store.state.currentShareStatusFooter || 0,
      emptyShow: false,
      emptyText: this.$t('withdrawalOrder.text7'),
      navBgColor: this.$store.state.currentShareStatusHeader || 2,
      pageIndex: 1,
      pageSize: 20,
      isdisabled1: false,
      isdisabled2: false,
      nullActive: false,
      withdrawalOrderList: [], // 订单列表
      orderInquiry: [], // 搜索的订单
      timer: null,
      options: {
        /* pullDownRefresh: {  // 下拉刷新配置
           threshold: 50, // 下拉刷新距离阈值
           stop: 40, // 回弹停留的位置
           stopTime: 1200,
           txt: '刷新成功'
         },*/
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
  components: {
    mFixedTop: () => import('@/components/mFixedTop'),
    sharerFooter: () => import('@/components/sharerFooter')
  },
  computed: {
    tabShareState() {
      return this.$store.state.currentShareStatusHeader
    },
    tabFoot() {
      return this.$store.state.currentShareStatusFooter
    },
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }

    // cube-ui   cube-scroll首次进入页面不能上拉下拉，刷新页面后才可以上下滑动 BUG  ???
    this.$nextTick(() => {
      this.navTableFn(this.tabShareState) // 2 未完成的
    })
  },
  methods: {
    goPath () { // 返回到我的
      this.$router.push('/menu')
      this.$store.commit('SET_CURRENT_SHARE_STATUS_FOOTER', 0)
      this.$store.commit('SET_CURRENT_SHARE_STATUS_HEADER', 2)
    },
    changeIndex(index) {
      if (this.search){
        this.search = ''
      }
      this.isShow = true
      this.nullDataShow = false
      this.pageIndex = 1
      this.withdrawalOrderList = []
      this.$store.commit('SET_CURRENT_SHARE_STATUS_FOOTER', index)
      this.titleName = this.tabFoot === 0 ? this.$t('withdrawalOrder.text102') : this.$t('withdrawalOrder.text1')
      if (index === 0 || index === 1) {
        this.$router.push('/sharer')
        this.theOrderListFn()
      } else {
        this.$router.push('/sharerSettings')
      }
      if (index === 0) {
        this.butStyle = 0
      } else {
        this.butStyle = 1
      }
    },
    toastD(text) {
      this.toast = this.$createToast({
        txt: text,
        time: 2000,
        type: 'txt'
      })
      this.toast.show()
    },
    keepGetLastValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.pageIndex = 1
        this.inputValueFn()
      }, 1000)
    },
    // 搜索查询
    inputValueFn() {
      this.nullDataShow = true
      this.isShow = true
      this.emptyShow = false
      if (this.search !== '') { // 显示，隐藏关闭和搜索icon
        this.closeShow = true
        this.iconShow = true
      } else {
        this.closeShow = false
        this.iconShow = false
      }
      // 过滤查询提现订单ID
      let search = this.search;
      //let searchVal = '';//搜索后的数据
      let url = ''
      url = this.tabFoot === 0 ? `${this.$api}deposit/queryMyOrderList` : `${this.$api}draw/queryMyOrderList`
      if (search) {
        this.$fetch.post(url, {
          id: search,
          orderType: 'pigame' // orderType	string	订单类型 共享者订单时传 pigame
        }).then((res) => {
          if (res.status === "success") {
            this.orderInquiry = res.data.list;
            this.isShow = false
            this.emptyShow = false
            if (this.orderInquiry.length === 0) {
              setTimeout(() => {
                this.emptyShow = true
                this.emptyText = this.$t('withdrawalOrder.text8')
                this.boxShow = true
              }, 100)
            } else { // 搜索订单存在时
              this.boxShow = false  // false,显示搜索列表订单
              this.nullDataShow = false // 改变main容器高度
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 关闭，清空搜索内容id
    closeFn() {
      this.search = ''
      if (this.search === '') {
        this.closeShow = false
        this.iconShow = false
      }
      this.orderInquiry = [] // 清空时，把搜索后的数据清空
      this.isShow = true
      this.pageIndex = 1
      this.emptyShow = false
      this.emptyText = this.$t('withdrawalOrder.text9')
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.theOrderListFn()
      }, 200)
    },
    navTableFn(index) { // Tab切换，完成的与未完成的
      this.emptyShow = false
      this.isShow = true
      this.navBgColor = index
      this.activeShow = !this.activeShow
      this.withdrawalOrderList = []  // 每次切换清空列表
      this.pageIndex = 1
      this.search = ''  // 每次切换清空搜索订单id
      this.boxShow = true
      this.$store.commit('SET_CURRENT_SHARE_STATUS_HEADER', index)
      setTimeout(() => {
        this.theOrderListFn()
      }, 200)
      if (this.navBgColor === 2) { // 防止tab点击事件多次触发
        this.isdisabled1 = true
        this.isdisabled2 = false
      } else if (this.navBgColor === 1) {
        this.isdisabled2 = true
        this.isdisabled1 = false
      }
    },
    // 触发上拉加载 数据
    onPullingUp() {
      this.theOrderListFn()
    },
    // 触发下拉刷新 数据
    /*onPullingDown () {
      this.theOrderListFn()
    },*/
    // 查询提现订单列表数据
    /*1.83 查询充值记录
    接口URL: http://boss.pigamegroup.com/deposit/queryMyOrderList*/
    theOrderListFn() {
      let url = ''
      url = this.tabFoot === 0 ? `${this.$api}deposit/queryMyOrderList` : `${this.$api}draw/queryMyOrderList`
      this.$fetch.post(url, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isFinish: this.navBgColor,
        orderType: 'pigame'   // orderType	string	订单类型 共享者订单时传 pigame
      }).then((res) => {
        if (res.status === "success") {
          this.isShow = false  // 加载
          this.activeShow = true // 淡入动画
          let lists = res.data.list
          this.nullDataShow = false
          this.boxShow = true
          if (lists.length === 0 && this.pageIndex === 1) {
            this.emptyShow = true
            this.nullDataShow = true
          } else {
            this.emptyShow = false
          }
          if (lists.length) {
            this.emptyShow = false
            this.withdrawalOrderList.push(...lists)
            this.pageIndex++
          } else {
            this.$refs.cubeList.forceUpdate()
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获得列表详情
    itemFn(item) {
      const id = item.id
      /*this.$router.push(`/topUp/topUpOrder/${id}`)*/
      this.$router.push({path: `/topUp/topUpOrder/${id}`, query: {SharerTopUp: 1}})
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @activeColor: #a2f2ed;
  @butBgColor: #f0f0f0;
  @butFont: .28rem;
  @textFont: .24rem;
  @hintColor: #999;
  @textColor: #000;
  @stateColor: #b79961;
  .commInput {
    &::-webkit-input-placeholder {
      color: #bfbfbf;
    }
    &:-moz-placeholder {
      color: #bfbfbf;
    }
    &::-moz-placeholder {
      color: #bfbfbf;
    }
    &:-ms-input-placeholder {
      color: #bfbfbf;
    }
  }

  .withdrawalOrders-wrap {
    width: @width;
    height: @width;
    margin-top: 210px;
    min-height: 100vh;
    position: relative;
    .top-box {
      width: 100%;
      height: auto;
      background-color: #fff;
      position: fixed;
      z-index: 20;
      top: 60px;
      left: 0;
      right: 0;
      padding: 0 .4rem;
      padding-top: 20px;
      .tab-box {
        width: @width;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: @hintColor;
        font-size: @butFont;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .but {
          flex: 1;
          height: @width;
          line-height: 50px;
          align-items: center;
          background-color: @butBgColor;
          border-radius: .08rem;
          &.active {
            background-color: #FFE600;
            color: @textColor;
          }
          &.active2 {
            background-color: #a2f2ed;
            color: @textColor;
          }
          &:nth-child(1) {
            margin-right: .3rem;
          }
        }
      }
      .search-box {
        width: @width;
        height: 40px;
        line-height: 40px;
        margin: 20px auto;
        background-color: @butBgColor;
        font-size: @butFont;
        color: @textColor;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 .38rem 0 .3rem;
        .icon {
          width: .32rem;
          height: .32rem;
          line-height: .32rem;
          background: url("../../assets/img/order/search-01.svg") no-repeat center;
          background-size: contain;
          transition: all .2s cubic-bezier(0, .67, .98, .42);
          &.active {
            background: url("../../assets/img/order/search-02.svg") no-repeat center;
            background-size: contain;
          }
          img {
            width: @width;
            height: @width;
          }
        }
        .input {
          flex: 1;
          height: @width;
          padding: 0 .18rem;
          &::-webkit-input-placeholder {
            color: #bfbfbf;
          }
          &:-moz-placeholder {
            color: #bfbfbf;
          }
          &::-moz-placeholder {
            color: #bfbfbf;
          }
          &:-ms-input-placeholder {
            color: #bfbfbf;
          }
        }
        .close {
          width: .28rem;
          height: .28rem;
          line-height: .28rem;
          opacity: 0;
          transition: all .4s cubic-bezier(0, .67, .98, .42);
          &.active {
            opacity: 1;
          }
          img {
            width: @width;
            height: @width;
          }
        }
      }
    }
    .main {
      width: @width;
      height: calc(100vh - 230px);
      &.active {
        height: 0;
      }
      .null {
        font-size: .28rem;
        color: #999;
        position: fixed;
        top: 50%;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
        .noData {
          width: 1.8rem;
          height: 1.75rem;
          margin: 0 auto;
          margin-bottom: 0.2rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .list-box {
        width: @width;
        opacity: 0;
        height: 100%;
        transition: all .4s cubic-bezier(0, .67, .98, .42);
        //overflow: hidden;
        padding: 0 .4rem;
        overflow: scroll;
        &.active {
          opacity: 1;
        }
        & /deep/ .cube-scroll-wrapper {
          height: 100%;
          /*.cube-scroll-content{
            height: 100% !important;
          }*/
          .cube-scroll-list-wrapper {
            min-height: calc(100vh - 230px) !important;
          }
          .cube-pulldown {
            .cube-pulldown-loaded {
              font-size: 14px;
              color: #999;
            }
          }
          .cube-pullup-wrapper {
            .before-trigger {
              font-size: 14px !important;
              color: #999 !important;
            }
          }
        }
        .list-item {
          width: @width;
          background-color: @butBgColor;
          margin-bottom: .2rem;
          padding: .38rem .3rem .3rem;
          font-size: @textFont;
          color: @textColor;
          box-shadow: 0 4px 6px -4px #ccc;
          &:last-of-type {
            box-shadow: 0 15px 10px -15px #ccc;
          }
          .info-box {
            width: @width;
            .lrs {
              div {
                display: flex;
                justify-content: space-between;
                padding-bottom: .3rem;
              }
              .order-number {
                .audit-status {
                  color: @stateColor;
                  text-align: right;
                }
              }
              .sum {
                font-size: .30rem;
              }
              .account-name {
                color: @hintColor;
                .audit-time {
                  text-align: right;
                }
              }
            }
          }
          .hr {
            width: @width;
            height: 1px;
            border-top: 1px dashed @textColor;
          }
          .receivable-box {
            width: @width;
            display: flex;
            justify-content: space-between;
            padding-top: .3rem;
            .receivable {
              color: @textColor;
            }
            .sum {
              color: @stateColor;
            }
          }
        }
      }
    }
    .share-footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
