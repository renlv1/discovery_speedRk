<template>
  <div class="trade-order">
    <app-header :titleName="titleName"></app-header>
    <div class="content-b">
      <ul class="ul-status">
        <li class="li-status" v-for="(item, index) in statusData" :key="index" :class="{activeLi: orderTab === index}"
            @click="changeTab(index)">{{item}}
        </li>
      </ul>
      <div class="order-list">
        <div class="empty-data" v-show="emptyDatas">
          <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
          <p class="text">{{$t('digitalTradeOrder.text4')}}</p>
        </div>
        <div class="unfinished" ref="unfinished">
          <cube-scroll
            ref="scroll"
            :options="options"
            :data="propsData"
            @pulling-up="onPullingDown" v-show="!emptyDatas">
            <ul class="ul-list">
              <p class="text-p" v-show="propsData.length">{{$t('findBao.text39')}}{{propsObj.totalRecord}}{{$t('findBao.text40')}}</p>
              <li class="li-item" v-for="(item,index) in propsData" :key="index">
                <div class="price-box">
                  <div class="price">{{item.propsName}}</div>
                  <div class="date" v-show="item.createAt && orderTab === 0">{{$changeDate(item.dueDate, '.', 5)}}{{$t('findBao.text54')}}</div>
                  <div class="date" v-show="item.createAt && orderTab === 1">{{$changeDate(item.dueDate, '.', 5)}}</div>
                </div>
              </li>
              <v-loading v-show="loadingShow"></v-loading>
            </ul>
          </cube-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appHeader from '../../components/mFixedTop'
export default {
  data() {
    return {
      isGoBack: true,
      activeIcon: false,
      orderNum: '',
      orderTab: 0,
      statusData: this.$t('findBao.text41'),
      unfinishedList: [],
      finishedList: [],
      loadingShow: true,
      emptyDatas: false,
      emptyFinish: false, // 已完成
      pageIndex: 1, // 页码
      pageIndex2: 1,
      pageSize: 10, // 页面数量
      timer: null,
      titleName: this.$t('findBao.text42'),
      propsData: [],
      propsObj: '',
      dataF: []
    }
  },
  created() {
    this.getProps(1)
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
    getProps (proptype) {
      this.$fetch.post('/user/getProps', {
        proptype: proptype,	// 查询类型(1:查询非过期的列表，2:查询已过期列表)
        page: this.pageIndex,	// 查询页数
        pageSize: 20	// 每页数据条数
      }).then(res => {
        if (res.success) {
          this.loadingShow = false
          this.dataF = res.data.data
          //this.propsData = res.data.data
          this.propsObj = res.data
          let dataList = res.data.data
          if (dataList.length > 0) {
            if (this.pageIndex === 1) {
              this.propsData = dataList
            } else {
              this.propsData.push(...dataList)
            }
            this.pageIndex++
          } else {
            if (this.pageIndex === 1) {
              this.propsData = []
              this.emptyDatas = true
            }
          }
        } else {
          this.loadingShow = false
        }
      })
    },
    onPullingDown() {
      this.getProps(this.orderTab + 1)
      setTimeout(() => {
        this.$refs.scroll.forceUpdate()
      }, 1000)
      // 没有数据，结束此次刷新
    },
    // 切换Tab
    changeTab(index) {
      this.loadingShow = true
      this.emptyDatas = false
      this.orderTab = index
      this.pageIndex = 1
      this.propsData = []
      this.$refs.scroll.scrollTo(0, 0)
      // this._initScroll()
      if (index === 0) {
        this.getProps(1)
      } else if (index === 1) {
        this.getProps(2)
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
    appHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-container
    padding-top 20px!important
  .ul-status {
    margin 1.4rem 0 .4rem
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
      top: 3rem;
      left: 0;
      bottom: .1rem;
      .text-p{
        font-size: .28rem
        color #999
        margin: .6rem 0 .2rem
      }
      .li-item{
        height: 1rem
        padding: 0 .3rem
        border-radius .08rem
        .price-box{
          align-items center
          margin: 0
          height: 1rem
          .price{
            color #000
          }
        }
      }
    }
  }
</style>
