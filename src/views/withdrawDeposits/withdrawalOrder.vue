<template>
  <div class="withdrawalOrder-wrap">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
    <div class="top-box">
      <div class="tab-box">
        <button class="but unfinished" :disabled="isdisabled1" :class="{'active': navBgColor === 2}" @click="navTableFn(2)">{{$t('withdrawalOrder.text2')}}</button>
        <button class="but completed" :disabled="isdisabled2" :class="{'active': navBgColor === 1}" @click="navTableFn(1)">{{$t('withdrawalOrder.text3')}}</button>
      </div>
      <div class="search-box">
        <div class="icon" :class="{'active': iconShow}"></div>
        <input class="input" type="number" maxlength="18" v-model.trim="search" @input="searchInputFn()" :placeholder="$t('withdrawalOrder.text4')" autocomplete="off"/>
        <div class="close" :class="{'active': closeShow}" @click="closeFn()"><img src="../../assets/img/order/close.svg" alt=""></div>
      </div>
    </div>
    <div class="main" :class="{'active': nullDataShow}">
      <!--提现订单数据列表-->
      <div class="list-box"  v-if="boxShow">
        <cube-scroll
                ref="cubeList"
                :options="options"
                :data="withdrawalOrderList"
                @pulling-up="onPullingUp">
          <div class="list-item" @click="itemFn(item)" v-for="(item,index) in withdrawalOrderList" :key="index">
            <div class="info-box">
              <div class="lrs">
                <div class="order-number"><span>{{$t('withdrawalOrder.text5')}} {{item.id}}</span> <span class="audit-status">{{item.tipMsg}}</span></div>
                <div class="sum">{{$t('withdrawalOrder.text6')}} {{item.amount | fourNumber}} {{item.currency}}</div>
                <div class="account-name"><span>{{item.bossNick}}</span><span class="audit-time">{{$changeDate(item.createAt, '.')}}</span></div>
              </div>
            </div>
            <div class="hr"></div>
            <div class="receivable-box">
              <!--应收-->
              <!--<div class="receivable">{{item.whoGiveMoneyStr}}</div>-->
              <div class="receivable">{{$t('withdrawDeposit.text18')}}</div>
              <div class="sum"><span class="count">{{item.rule || 0}}</span> <span class="unit"> {{item.unlineCurrency}}</span></div>
            </div>
          </div>
        </cube-scroll>
      </div>
       <!--搜索订单列表-->
      <div class="list-box" v-if="boxShow2">
          <div class="list-item" @click="itemFn(item)" v-for="(item,index2) in orderInquiry" :key="index2">
            <div class="info-box">
              <div class="lrs">
                <div class="order-number"><span>{{$t('withdrawalOrder.text5')}} {{item.id}}</span> <span class="audit-status">{{item.tipMsg}}</span></div>
                <div class="sum">{{$t('withdrawalOrder.text6')}} {{item.amount | fourNumber}} {{item.currency}}</div>
                <div class="account-name"><span>{{item.bossNick}}</span><span class="audit-time">{{$changeDate(item.createAt, '.')}}</span></div>
              </div>
            </div>
            <div class="hr"></div>
            <div class="receivable-box">
              <!--应收-->
              <!--<div class="receivable">{{item.whoGiveMoneyStr}}</div>-->
              <div class="receivable">{{$t('withdrawDeposit.text18')}}</div>
              <div class="sum"><span class="count">{{item.rule || 0}}</span> <span class="unit"> {{item.unlineCurrency}}</span></div>
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
  </div>
</template>

<script>
  import Dialog from '../../components/dialog/index'
  export default {
    data() {
      return {
        isGoBack: true,
        titleName: this.$t('withdrawalOrder.text1'),
        closeShow: false,
        iconShow: false,
        disable: false,
        search: '',
        isShow: false, // load
        activeShow: false, // 淡入淡出
        boxShow: true, // 订单列表show
        boxShow2: false,
        nullDataShow: false,
        emptyShow: false,
        emptyText: this.$t('withdrawalOrder.text7'),
        navBgColor: 2,
        pageIndex: 1,
        pageSize: 20,
        isdisabled1: false,
        isdisabled2: false,
        nullActive: false,
        withdrawalOrderList: [], // 订单列表
        orderInquiry: [], // 搜索的订单
        timer: null,
        options: {
          pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
            threshold: 0,
            txt: {
              /*more: '上拉加载更多',
              noMore: '没有更多数据',*/
              more: '',
              noMore: ''
            }
          }
        },
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    },
    computed: {},
    created() {
    },
    mounted() {
      if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
        this.isGoBack = false
        this.$store.commit('IS_IOS', true)
      } else {
        this.isGoBack = true
      }

      this.$nextTick(() => {
        this.navTableFn(2) // 2 未完成的
      })
    },
    methods: {
      goPath () { // 返回到我的
        this.$router.push('/menu')
      },
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      // 搜索查询
      searchInputFn() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.pageIndex = 1
          this.inputValueFn()
        }, 1000)
      },
      inputValueFn () {
        this.nullDataShow = true
        this.isShow = true
        this.emptyShow = false
        if (this.search !=='') { // 显示，隐藏关闭和搜索icon
          this.closeShow = true
          this.iconShow = true
        } else {
          this.closeShow = false
          this.iconShow = false
        }
        // 过滤查询提现订单ID
        let search = this.search;
        if (search) {
          this.$fetch.post(`${this.$api2}draw/queryMyOrderList`,{
            id: search,
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
                },100)
              } else { // 搜索订单存在时
                this.boxShow = false  // false,显示搜索列表订单
                this.nullDataShow = false // 改变main容器高度
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.pageIndex = 1
          this.theOrderListFn()
        }
      },
      // 关闭，清空搜索内容id
      closeFn () {
        this.search =''
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
      navTableFn (index) { // Tab切换，完成的与未完成的
        this.emptyShow = false
        this.isShow = true
        this.navBgColor = index
        this.activeShow = !this.activeShow
        this.withdrawalOrderList = []  // 每次切换清空列表
        this.pageIndex = 1
        this.search = ''  // 每次切换清空搜索订单id
        if(index === 0) {
          this.boxShow = true
          this.boxShow2 = false
        } else {
          this.boxShow2 = true
          this.boxShow = false
        }
        setTimeout(() => {
          this.theOrderListFn()
        },200)
        if (this.navBgColor === 2) {
          this.isdisabled1 = true
          this.isdisabled2 = false
        } else if (this.navBgColor === 1){
          this.isdisabled2 = true
          this.isdisabled1 = false
        }
        console.log(this.activeShow)
      },
      // 触发上拉加载 数据
      onPullingUp () {
        this.theOrderListFn()
      },
      // 查询提现订单列表数据
      theOrderListFn () {
        this.$fetch.post(`${this.$api2}draw/queryMyOrderList`,{
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          isFinish: this.navBgColor, //1、已完成 2、未完成
        }).then((res) => {
          if (res.status === "success") {
            this.isShow = false  // 加载// 淡入动画
            let lists = res.data.list
            this.nullDataShow = false
            this.boxShow = true
            if (lists.length){
              this.nullActive = false
              this.emptyShow = false
              if (this.pageIndex === 1) { // 数据只有一页时，解决上拉刷新会add数据BUG
                this.withdrawalOrderList = lists
              } else {
                this.withdrawalOrderList.push(...lists)
              }
              this.pageIndex++
              console.log(this.withdrawalOrderList)
            } else {
              if (this.pageIndex === 1) {
                this.withdrawalOrderList = []
                this.nullDataShow = true // 数据空时改变样式：高度值
                this.emptyShow = true
                this.nullActive = true
                this.options.pullUpLoad = false
              }
            }
            this.$refs.cubeList.forceUpdate()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      itemFn (item) {
        this.$router.push({path: '/theOrderDetails', query:{detailsdId: item.id}})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @activeColor: #a2f2ed;
  @butBgColor: #f7f7f7;
  @butFont: .28rem;
  @textFont: .28rem;
  @hintColor: #999;
  @textColor: #000;
  @stateColor: #b79961;
  .commInput{
    &::-webkit-input-placeholder{
      color: #bfbfbf;
    }
    &:-moz-placeholder{
      color: #bfbfbf;
    }
    &::-moz-placeholder{
      color: #bfbfbf;
    }
    &:-ms-input-placeholder{
      color: #bfbfbf;
    }
  }
  .withdrawalOrder-wrap{
    width: @width;
    height: @width;
    padding-top: 210px;
    .top-box{
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
      .tab-box{
        width: @width;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: @hintColor;
        font-size: @butFont;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .but{
          flex: 1;
          height: @width;
          line-height: 50px;
          background-color: @butBgColor;
          border-radius: .08rem;
          &.active{
            background-color: @activeColor;
            color: @textColor;
          }
          &.disable{
            pointer-events: none;
          }
          &:nth-child(1){
            margin-right: .3rem;
          }
        }
      }
      .search-box{
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
        .icon{
          width: .32rem;
          height: .32rem;
          line-height: .32rem;
          background: url("../../assets/img/order/search-01.svg") no-repeat center;
          background-size: contain;
          transition: all .2s cubic-bezier(0,.67,.98,.42);
          &.active{
            background: url("../../assets/img/order/search-02.svg")no-repeat center;
            background-size: contain;
          }
          img{
            width: @width;
            height: @width;
          }
        }
        .input{
          flex: 1;
          height: @width;
          padding: 0 .18rem;
          &::-webkit-input-placeholder{
            color: #bfbfbf;
          }
          &:-moz-placeholder{
            color: #bfbfbf;
          }
          &::-moz-placeholder{
            color: #bfbfbf;
          }
          &:-ms-input-placeholder{
            color: #bfbfbf;
          }
        }
        .close{
          width: .28rem;
          height: .28rem;
          line-height: .28rem;
          opacity: 0;
          transition: all .4s cubic-bezier(0,.67,.98,.42);
          &.active{
            opacity: 1;
          }
          img{
            width: @width;
            height: @width;
          }
        }
      }
    }
    .main{
      width: @width;
      height: calc(100vh - 210px);
      overflow: hidden;
      &.active{
        height: 0;
      }
      .null{
        font-size: .28rem;
        color: #999;
        text-align: center;
        padding: .6rem 0;
        padding-top: 100px;
        .noData{
          width: 1.8rem;
          height: 1.75rem;
          margin: 0 auto;
          margin-bottom: 0.2rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .list-box{
        width: @width;
        height: 100%;
        overflow: hidden;
        padding: 0 .4rem;
        transition: opacity .4s cubic-bezier(0,.67,.98,.42);
        & /deep/ .cube-scroll-wrapper{
          height: 100%;
          .cube-scroll-list-wrapper{
            min-height: calc(100vh - 210px) !important;
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
        .list-item{
          width: @width;
          background-color: @butBgColor;
          margin-bottom: .2rem;
          padding: .38rem .3rem .3rem;
          font-size: @textFont;
          color: @textColor;
          .info-box{
            width: @width;
            .lrs{
              div{
                display: flex;
                justify-content: space-between;
                padding-bottom: .2rem;
              }
              .order-number{
                .audit-status{
                  color: #999;
                  font-size: .24rem;
                  text-align: right;
                }
              }
              .sum{
                font-size: .28rem;
              }
              .account-name{
                color: @hintColor;
                .audit-time{
                  font-size: .24rem;
                  text-align: right;
                }
              }
            }
          }
          .hr{
            width: @width;
            height: 1px;
            border-top: 1px dashed @textColor;
          }
          .receivable-box{
            width: @width;
            display: flex;
            justify-content: space-between;
            padding-top: .3rem;
            .receivable{
              color: @textColor;
            }
            .sum{
              color: @stateColor;
              .count {
                font-size: .24rem;
              }
              .unit {
                font-size: .24rem;
              }
            }
          }
        }
      }
    }
  }
</style>
