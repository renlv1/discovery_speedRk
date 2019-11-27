<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <div class="empty-data" v-show="confirmedList.length === 0">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <p class="text">{{$t('common.noData')}}</p>
      </div>
      <cube-scroll
        class="scroll-content"
        ref="scroll"
        :data="confirmedList"
        :options="options"
        @pulling-up="onPullingUp">
        <ul>
          <li v-for="item in confirmedList" :key="item.index" @click="detail(item.id)">
            <div class="task-address">{{item.address}}</div>
            <div class="other-info">
              <div class="num">
                <span>{{$t('treasure.text32')}}：</span>
                <span>{{item.id}}</span>
              </div>
              <div class="confirm-time">{{$changeDate(item.confirmTime, '.')}}</div>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {confirmedTask} from "../../api/treasure";

export default {
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('treasure.text31'),
      confirmedList: [],
      pageIndex: 1,
      pageSize: 15,
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
  created() {
    this.getTask()
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
    detail(id) {
      this.$router.push({
        path: '/myTaskDetail',
        query: {
          id: id,
          flag: 1
        }
      })
    },
    goPath() {
      this.$router.push('/menu')
      this.$store.commit('SET_FOOTET_TREASURE', 0)
    },
    getTask() {
      confirmedTask(this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        if (res.status) {
          let _list = res.data.data
          if (_list.length === 0) {
            this.emptyDatas = true
          } else {
            this.emptyDatas = false
          }
          if (_list.length) {
            this.confirmedList.push(..._list)
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
      this.getTask()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .scroll-content
      padding-top 0
      height calc(100vh - 50px - 1.1rem)
      overflow hidden
      ul
        min-height 75vh
        li
          padding .3rem
          background-color #eee
          margin-bottom 8px
          .task-address
            font-size .28rem
          .other-info
            margin-top .2rem
            display flex
            flex-direction row
            justify-content space-between
            color #999
            .num
              font-size .28rem
              display flex
            .confirm-time
              font-size .24rem
</style>
