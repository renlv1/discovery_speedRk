<template>
  <div class="template-wrapper" ref="wrapper">
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <top-up-order class="v-content-wrapper" :tabs="tabsList" @currentStatus="getStatus"></top-up-order>
    <cube-scroll
      class="scroll-content"
      ref="scroll"
      :data="orderList"
      :options="options"
      @pulling-up="onPullingUp">
      <ul>
        <li class="item" v-for="item in orderList" :key="item.key" @click="toDetail(item.id)">
          <h5>{{item.title}}</h5>
          <p>{{$t('voteCenter.text1')}} {{$changeDate(item.deadline, '.', 5)}}</p>
        </li>
      </ul>
    </cube-scroll>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
    <div class="empty-data" v-show="orderList.length === 0">
      <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
      <p class="text">{{$t('common.noData')}}</p>
    </div>
    <ul class="bottom-tabs">
      <li class="item" @click="chooseMenu(0)">
        <img v-show="tabState.foot === 1" src="./images/un_select.svg" />
        <img v-show="tabState.foot === 0" src="./images/select.svg">
        <p :class="{active: tabState.foot === 0}">{{$t('voteCenter.text2')}}</p>
      </li>
      <li class="item" @click="chooseMenu(1)">
        <img v-show="tabState.foot === 1" src="./images/un_active-join.svg" />
        <img v-show="tabState.foot === 0" src="./images/active_join.svg" />
        <p :class="{active: tabState.foot === 1}">{{$t('voteCenter.text3')}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import topUpOrder from '@/components/topUpOrder/topUpOrder'
import {queryVoteList, queryMyVoteList} from '@/api/vote'
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {mFixedTop, topUpOrder},
  data() {
    return {
      isGoBack: true,
      emptyDatas: false,
      titleName: this.$t('voteCenter.title'),
      tabsList: [{label: this.$t('common.labelList.text1')}, {label: this.$t('common.labelList.text2')}],
      isShow: true,
      orderList: [],
      pageIndex: 1,
      pageSize: 10,
      flag: false, // 标识为是否是我参与的
      isActive: true, // 底部tabs切换
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  mounted() {
    this.getData()
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  computed: {
    ...mapGetters([
      'voteLabel'
    ]),
    tabState() {
      return this.$store.state.votePageState
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push(`/voteCenter/${id}`)
    },

    chooseMenu(num) {  // num: 1 为全部  2 为已参与
      const obj = this.tabState
      if (num !== obj.foot) { // 防止重复点击
        obj.foot = num
        this.getData()
      }
      this.$store.commit('SET_TAB_RECORD', obj)

    },
    getStatus(label) {
      this.pageIndex = 1
      let flag = true
      const obj = this.tabState
      let clickIndex = label === this.$t('common.labelList.text1') ? 0 : 1
      if (clickIndex === obj.head) {
        flag = false
      }
      obj.head = clickIndex
      this.$store.commit('SET_TAB_RECORD', obj)
      if (flag) {
        this.isShow = true
        this.orderList = [] // 每次切换tabs之前清空数组
        this.getData()
      }
    },

    onPullingUp() {
      this.getData()
    },

    getData() {
      this.emptyDatas = false
      const url = this.tabState.foot === 0 ? '/vote/queryAllVotes' : '/vote/queryMyVotes'
      this.$fetch.post(url, {
        status: this.tabState.head === 0 ? 1 : 2,
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then((res) => {
        this.isShow = false
        if (res.success) {
          let _list = res.data
          if (_list.length) {
            this.orderList.push(...res.data)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.msg)
        }
      })
    },

    ...mapMutations({
      setLabel: 'SET_VOTE_LABEL'
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .v-content-wrapper {
    margin-top 50px
    padding-bottom 0
  }
  .template-wrapper
    height 100vh
    width 100%
    padding 0 .4rem
    position relative
    .scroll-content
      ul
        margin-top .4rem
        .item
          margin-bottom .4rem
          border-1px-bottom(#bfbfbf)
          h5
            font-size .3rem
          p
            font-size .24rem
            color #ccc
            padding .15rem 0
    .bottom-tabs
      z-index 999
      background white
      height 1.2rem
      width 100%
      left 0
      position fixed
      display flex
      justify-content space-between
      align-items center
      bottom 0
      box-sizing border-box
      .item
        width 50%
        display flex
        flex-direction column
        align-items center
        font-size .2rem
        img
          margin-bottom .15rem
          width .44rem
          height .44rem
        p
          color #000
          &.active
            color #b79961
</style>
