<template>
  <div class="bill">
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="v-content-wrapper" ref="wrapper">
      <cube-scroll
        ref="scroll"
        :data="billList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul>
          <li v-for="item in billList" :key="item.index" class="item" @click="getListDetail(item.id)">
            <div class="inner-box">
              <img :src="billType(item.paymentType, 2)" />
              <div class="text">
                <p class="message">{{billType(item.paymentType, 1)}}<span v-if="item.otherNick">({{item.otherNick}})</span></p>
                <p class="timer">{{$changeDate(item.createAt, '.')}}</p>
              </div>
            </div>
            <p class="money" :class="{changeColor: billType(item.paymentType, 3) === '+'}">{{billType(item.paymentType, 3)}} {{item.amount}} {{item.currency === 'PAI' ? 'π' : item.currency}}</p>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {billRecord} from '../../api/bill'
import {mapGetters} from 'vuex'

export default {
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      isShow: true,
      titleName: this.$t('bill.title'),
      isChange: false,
      pageIndex: 1,
      pageSize: 10,
      billList: [],
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      }
    }
  },
  mounted() {
    this._getBillRecord()
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  computed: {
    ...mapGetters([
      'address'
    ])
  },
  methods: {
    getListDetail(id) {
      this.$router.push(`/bill/${id}`)
    },
    onPullingUp() { // 触发上拉加载
      this._getBillRecord()
    },
    _getBillRecord() {
      billRecord(this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data
          if (_list.length) {
            this.billList.push(...res.data.data)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .bill
    .v-content-wrapper
      position relative
      height 100vh
      padding-bottom 10px
      ul
        .item
          display flex
          flex-direction row
          justify-content space-between
          margin-bottom .3rem
          padding-bottom .3rem
          border-1px-bottom(#bfbfbf)
          .inner-box
            display flex
            flex-direction row
            align-items center
            img
              width .8rem
              height .8rem
            .text
              line-height .4rem
              margin-left .2rem
              display flex
              flex-direction column
              .message
                font-size .28rem
              .timer
                font-size .24rem
                color #bfbfbf
          .money
            line-height .5rem
            font-size .2rem
            &.changeColor
              color #b79961
</style>
