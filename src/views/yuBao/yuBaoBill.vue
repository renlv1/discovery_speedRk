<template>
  <div>
    <div class="v-content-wrapper">
      <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
      <top-up-order :tabs="tabsList" @currentStatus="getStatus"></top-up-order>
      <cube-scroll
        class="scroll-content"
        ref="scroll"
        :data="orderList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul>
          <li class="item" v-for="item in orderList" :key="item.key">
            <div class="li-left">
              <span class="yu-title">{{transText(item.assetType)}} {{$t('yuBao.text1')}}</span>
              <span class="yu-time">{{$changeDate(item.createAt)}}</span>
            </div>
            <div class="li-right">{{item.assetType === 1 ? '+' : '-'}} {{item.assetTotal}} π</div>
          </li>
        </ul>
        <div class="v-loading" v-show="isShow">
          <cube-loading></cube-loading>
        </div>
        <div class="empty-data" v-show="orderList.length === 0">
          <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
          <p class="text">{{$t('common.noData')}}</p>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import topUpOrder from '@/components/topUpOrder/topUpOrder'
import {yueBaoReocrdList} from '@/api/fund'
import {mapMutations} from 'vuex'

export default {
  components: {mFixedTop, topUpOrder},
  name: "yuBaoBill",
  computed: {
    tabState() {
      return this.$store.state.votePageState
    }
  },
  data() {
    return {
      isGoBack: true,
      emptyDatas: false,
      titleName: this.$t('yuBao.text7'),
      tabsList: [{label: this.$t('yuBao.text6')}, {label: this.$t('yuBao.text5'),}],
      isShow: true,
      orderList: [],
      pageIndex: 1,
      pageSize: 10,
      flag: false, // 标识为是否是我参与的
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    transText(num) {
      let text = ''
      if (num === 1) {
        text = this.$t('yuBao.text6')
      } else {
        text = this.$t('yuBao.text5')
      }
      return text
    },
    getData() {
      let type
      if (this.tabState.head === 0) {
        type = 1
      } else {
        type = 2
      }
      yueBaoReocrdList(this.pageIndex, this.pageSize, type).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data
          if (_list.length) {
            this.orderList.push(...res.data.data)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    getStatus(label) {
      let flag = true
      const obj = this.tabState
      let index = label === this.$t('yuBao.text6') ? 0 : 1
      if (index === obj.head) {
        flag = false
      }
      obj.head = index
      this.$store.commit('SET_TAB_RECORD', obj)
      this.setLabel(label)
      this.pageIndex = 1
      if (flag) {
        this.isShow = true
        this.orderList = [] // 每次切换tabs之前清空数组
        this.getData()
      }
    },
    onPullingUp() {
      this.getData()
    },
    ...mapMutations({
      setLabel: 'SET_LABEL',
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .empty-data {
    top 30%
  }

  .v-loading {
    top 30%
  }

  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    height calc(100vh - 3.5rem)
    .scroll-content
      ul
        margin-top .4rem
        .item
          margin-bottom 8px
          padding 8px 0
          display flex
          flex-direction row
          align-items center
          height 1.2rem
          justify-content space-between
          border-1px-bottom(#bfbfbf)
          .li-left
            display flex
            flex-direction column
            height 100%
            justify-content space-around
            .yu-title
              font-size .3rem
            .yu-time
              margin-top .1rem
              font-size .24rem
              color #999
          .li-right
            font-size .32rem
            color #b79961
</style>
