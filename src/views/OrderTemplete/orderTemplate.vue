<template>
  <div class="template-wrapper" ref="wrapper">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <top-up-order :tabs="tabsList" @currentStatus="getStatus"></top-up-order>
    <div class="search-box">
      <i class="search-icon"></i>
      <input type="number" ref="search" v-model="orderId" class="v-placeholder-text" :placeholder="$t('common.labList.searchText')" />
      <i class="delete-icon" @click="del"></i>
    </div>
    <div class="web-list">
      <div class="scroll-list-wrap">
        <cube-scroll
          ref="scroll"
          :data="orderList"
          :options="options"
          @pulling-up="onPullingUp">
          <ul>
            <li v-show="!orderId || String(item.id).includes(orderId)" class="item" v-for="item in orderList" :key="item.index" ref="item" @click="getListDetail(item)">
              <div class="li-top">
                <p>{{$t('topUp.topUpList.item.text1')}} {{item.id}} <span class="status">{{item.tipMsg}}</span></p>
                <p>{{$t('topUp.topUpList.item.text2')}} {{item.amount}} {{item.currency}}</p>
                <p><span>{{item.bossNick}}</span><span>{{$changeDate(item.createAt, '.')}}</span></p>
              </div>
              <div class="li-bottom">
                <span>{{$t('topUp.topUpList.item.text3')}}</span>
                <span class="calculate">{{item.rule || 0}} {{item.unlineCurrency}}</span>
              </div>
            </li>
          </ul>
        </cube-scroll>
      </div>
    </div>
    <div class="empty-data" v-show="orderList.length === 0 && orderList">
      <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
      <p class="text">{{$t('common.noData')}}</p>
    </div>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import topUpOrder from '@/components/topUpOrder/topUpOrder'
import {orderList} from '../../api/topUp'
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {topUpOrder, mFixedTop},
  data() {
    return {
      isGoBack: true,
      emptyDatas: false,
      errInputMsg: '',
      payDialogShow: false,
      tabsList: [{label: this.$t('common.labList.text1')}, {label: this.$t('common.labList.text2')}],
      titleName: this.$t('topUp.topUpList.title'),
      orderId: '', // 订单id
      isShow: true,
      orderList: [], // 订单列表(副本) 在模糊查询中使用
      original: [], // 原始数组
      pageIndex: 1, // 总的页数
      pageSize: 10,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  created() {
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this._getOrderList()
  },
  computed: {
    ...mapGetters([
      'label'
    ]),
    tabState() {
      return this.$store.state.votePageState
    }
  },
  methods: {
    goPath() {
      this.$router.push('/menu')
    },
    del() { // 删除input内容
      let reg = this.orderId.substring(0, this.orderId.length-1)
      this.orderId = reg
    },
    getListDetail(item) { // 获得列表详情
      const id = item.id
      this.$router.push(`/topUp/topUpOrder/${id}`)
    },
    onPullingUp() { // 触发上拉加载
      this._getOrderList()
    },
    getStatus(label) { // 切换Tab
      let flag = true
      const obj = this.tabState
      let index = label === this.$t('common.labList.text1') ? 0 : 1
      if(index === obj.head) {
        flag = false
      }
      obj.head = index
      this.$store.commit('SET_TAB_RECORD', obj)
      this.setLabel(label)
      this.orderId = '' // 每次切换tabs之前清空input中的id
      this.pageIndex = 1 // 每次切换tabs之前页码格式化为1
      if (flag) {
        this.isShow = true
        this.orderList = [] // 每次切换tabs之前清空数组
        this._getOrderList()
      }
    },
    _getOrderList() { // 获得充值订单列表
      let type
      if (this.tabState.head === 0) {
        type = 2
      } else {
        type = 1
      }
      orderList(this.pageIndex, this.pageSize, type).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data.list
          if ( _list.length === 0) {
            this.emptyDatas = true
          }
          if (_list.length) {
            this.orderList.push(...res.data.data.list)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
            this.options.pullUpLoad = false
          }
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    ...mapMutations({
      setLabel: 'SET_LABEL',
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .iosx
    .template-wrapper
      padding 1.4rem .4rem 0
  .template-wrapper
    height 100vh
    width 100%
    padding 1rem .4rem 0
    overflow hidden
    .search-box
      display flex
      align-items center
      margin-bottom .4rem
      position relative
      height .8rem
      width 100%
      background-color #f7f7f7
      .search-icon
        position absolute
        left .3rem
        top 50%
        transform translateY(-50%)
        display inline-block
        width .27rem
        height .27rem
        background-image url("./img/unactive-search.svg")
        background-repeat no-repeat
        background-size cover
      .delete-icon
        opacity 0
        position absolute
        right .3rem
        top 50%
        transform translateY(-50%)
        display inline-block
        width .27rem
        height .27rem
        background-image url("./img/detele.svg")
        background-repeat no-repeat
        background-size cover
      .v-placeholder-text
        width 100%
        margin-left .77rem
        height 100%
        font-size .28rem
      &:focus-within
        .search-icon
           transition .3s
           background-image url("./img/active-search.svg")
        .delete-icon
           transition .3s
           opacity 1

    .web-list
      position relative
      .scroll-list-wrap
        position absolute
        left 0
        width 100%
        top 0
        height 70vh
        padding-bottom .5rem
        overflow hidden
        ul
          padding-bottom .4rem
          .item
            padding .4rem .3rem 0
            background-color #f7f7f7
            margin-bottom 10px
            .li-top
              height 1.6rem
              border-bottom 1px dotted #000
              p
                display flex
                flex-direction row
                justify-content space-between
                font-size .28rem
                .status
                  color #999
                  font-size .24rem
                &:nth-child(2)
                  margin .2rem 0
                &:nth-child(3)
                  font-size .24rem
                  color #999
            .li-bottom
              display flex
              justify-content space-between
              height .8rem
              line-height .8rem
              font-size .24rem
              .calculate
                color #b79961
</style>
