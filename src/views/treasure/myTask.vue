<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <div class="empty-data" v-show="emptyDatas">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <p class="text">{{$t('common.noData')}}</p>
      </div>
      <cube-scroll
        class="scroll-content"
        ref="scroll"
        :data="myTaskList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul>
          <li v-for="item in myTaskList" :key="item.index" @click="detail(item.id)">
            <div class="li-left">
              <div>{{item.address}}</div>
              <div class="time">{{$changeDate(item.updatetime, '.')}}</div>
            </div>
            <div class="li-right">
              <div class="value">{{item.total}}π</div>
              <div class="pay-status">{{item.paystate === 1 ? $t('treasure.text46') : $t('treasure.text47')}}</div>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {myTask} from "../../api/treasure";

export default {
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('treasure.text48'),
      isGoBack: true,
      myTaskList: [],
      pageIndex: 1,
      pageSize: 20,
      isShow: true,
      emptyDatas: false,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  mounted() {
    this.getMyTask()
  },
  methods: {
    detail(id) {
      this.$router.push({
        path: '/myTaskDetail',
        query: {
          id: id
        }
      })
    },
    getMyTask() {
      myTask(this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        if (res.status) {
          let _list = res.data.data
          if (_list.length === 0) {
            this.emptyDatas = true
          } else {
            this.emptyDatas = false
          }
          if (_list.length) {
            this.myTaskList.push(..._list)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.msg)
        }
      })
    },
    onPullingUp() {
      this.getMyTask()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    height 100%
    .scroll-content
      height 100vh
      ul
        li
          display flex
          flex-direction row
          justify-content space-between
          margin-bottom .2rem
          align-items center
          background-color #eee
          padding .3rem
          font-size .28rem
          .li-left
            width 80%
            .time
              margin-top .2rem
              color #999
              font-size .24rem
          .li-right
            width 20%
            text-align right
            color #b79961
            .pay-status
              margin-top .2rem
              font-size .24rem
</style>
