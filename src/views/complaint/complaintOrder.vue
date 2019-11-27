<template>
  <div class="template-wrapper" ref="wrapper">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <top-up-order :tabs="tabsList" @currentStatus="getStatus"></top-up-order>
    <div class="search-box">
      <i class="search-icon"></i>
      <!--@input="searchId(orderId)"-->
      <input type="number" ref="search" v-model="orderId" class="v-placeholder-text"
             :placeholder="$t('common.labList.searchText')" @input="_getOrderList(orderId)" />
      <i class="delete-icon" @click="del"></i>
    </div>
    <div class="web-list">
      <div class="scroll-list-wrap">
        <cube-scroll
          ref="scroll"
          :data="orderList"
          :options="options"
          @pulling-up="onPullingUp">
          <ul class="list-wrapper" ref="list">
            <li class="item" v-for="item in orderList" :key="item.index" ref="item" @click="getListDetail(item)">
              <div class="li-top">
                <p>
                  <span class="order-text"><i class="order-type"
                                              :class="{isBlue: item.aType !== 1}">{{item.aType === 1 ? $t('menu.home.text1') : $t('menu.home.text2')}}</i>
                    <span style="text-align: right">{{$t('topUp.topUpList.item.text1')}}{{item.orderId}}</span>
                  </span>
                  <span class="status">{{$arbitration(item.aState)}}</span></p>
                <p>{{$t('complaint.text1')}} {{item.orderTotal}} {{item.orderCurreny}}</p>
                <p>
                  <span v-if="item.bossNick === $store.state.userName">{{item.desUsername}}</span>
                  <span v-if="item.bossNick !== $store.state.userName">{{item.reqUsername}}</span>
                  <span>{{$changeDate(item.createAt, '.')}}</span></p>
              </div>
              <!--<div class="li-bottom">-->
              <!--<span>应付</span>-->
              <!--<span class="calculate">{{item.rule || 0}} {{item.unlineCurrency}}</span>-->
              <!--</div>-->
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
import topUpOrder from '@/components/topUpOrder/topUpOrder'
import mFixedTop from '@/components/mFixedTop'
import {arbitration, arbitrationFindId} from '../../api/complaint'
import {Debounce} from '../../utils/util'
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {topUpOrder, mFixedTop},
  data() {
    return {
      isGoBack: true,
      tabsList: [{label: this.$t('common.labList.text1')}, {label: this.$t('common.labList.text2')}],
      titleName: this.$t('complaint.title'),
      orderId: '', // 订单id
      isShow: true,
      orderList: [], // 订单列表
      pageIndex: 1, // 总的页数
      pageSize: 20,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
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
  activated() {
    this.$refs.list.scrollTop = this.scroll
  },
  computed: {
    ...mapGetters([
      'label',
      'address'
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
      this.orderId = ''
      this.pageIndex = 1
      this.orderList = []
      this._getOrderList(this.orderId)
    },
    getListDetail(item) { // 获得列表详情
      const id = item.orderId
      if (item.aType !== 1) {
        this.$router.push(`/complaintOrder/${id}?fals='1'`) // 提现
      } else {
        this.$router.push(`/complaintOrder/${id}`) // 充值
      }
    },
    onPullingUp() { // 触发上拉加载
      this._getOrderList()
    },
    getStatus(label) { // 切换Tab
      let flag = true
      const obj = this.tabState
      let index = label === this.$t('common.labList.text1') ? 0 : 1
      if (index === obj.head) {
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


    _getOrderList(id) { // 获得提现申诉订单列表
      let type
      if (this.tabState.head === 0) {
        type = 2
      } else {
        type = 1
      }
      if (!id) {
        id = ''
      } else {
        this.pageIndex = 1
      }
      arbitration(this.pageIndex, this.pageSize, type, id).then((res) => {
        if (res.data.status === 'success') {
          this.isShow = false
          let _list = res.data.data.list
          if (_list.length) {
            if (!id) {
              this.orderList.push(...res.data.data.list)
            } else {
              this.orderList = res.data.data.list
            }
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
    }),
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
        background-image url("../OrderTemplete/img/unactive-search.svg")
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
        background-image url("../OrderTemplete/img/detele.svg")
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
          background-image url("../OrderTemplete/img/active-search.svg")
        .delete-icon
          transition .3s
          opacity 1
    .web-list
      position relative
      .scroll-list-wrap
        height 70vh
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        overflow hidden
        ul
          .item
            padding .4rem .3rem 0
            background-color #f7f7f7
            margin-bottom 10px
            .li-top
              height 1.6rem
              // border-bottom 1px dotted #000
              p
                display flex
                flex-direction row
                justify-content space-between
                font-size .28rem
                .order-text
                  .order-type
                    margin-right .2rem
                    padding .08rem .1rem
                    background-color #ffe941
                    border-radius .04rem
                    &.isBlue
                      background-color #a2f2ed
                .status
                  color #999
                  font-size .24rem
                  text-align right
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
