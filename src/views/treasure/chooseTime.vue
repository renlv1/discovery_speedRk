<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" @goPath="goPath" :isGoNumber="true"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="choose-week">
        <ul>
          <li @click="choose(index)" :class="{'highLight': item.isHighLight}" v-for="(item,index) in weekList"
              :key="item.index">
            {{item.title}}
          </li>
        </ul>
      </div>
      <div class="panel">
        <div class="panel-time startTime">
          <span class="panel-title start-title">{{$t('treasure.text19')}}</span>
          <div class="wrapper" @click="chooseTime(0)">
            <span class="panel-value start-value">{{startHour}}:{{startMins}}</span>
            <span class="right-icon">
                <img src="../../assets/img/treasure/right.png">
              </span>
          </div>
        </div>
        <div class="panel-time endTime">
          <span class="panel-title end-title">{{$t('treasure.text20')}}</span>
          <div class="wrapper" @click="chooseTime(1)">
            <span class="panel-value end-value">{{endHour}}:{{endMins}}</span>
            <span class="right-icon">
                <img src="../../assets/img/treasure/right.png">
              </span>
          </div>
        </div>
      </div>
      <time-picker :chooseTimeType="type" :title=title :isShow=isShow @sure="sure" @cancel="cancel"></time-picker>
      <div class="btn" @click="sureChooseTime">{{$t('treasure.text21')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import timePicker from '@/components/timePicker'

export default {
  name: "chooseTime",
  components: {mFixedTop, timePicker},
  data() {
    return {
      title: '',
      isShow: false, // 默认隐藏时间选择panel
      type: 0,
      isGoBack: true,
      titleName: this.$t('treasure.text22'),
      startHour: '00',
      startMins: '00',
      endHour: '23',
      endMins: '59',
      value: true,
      weekList: this.$t('treasure.text23'),
      value1: new Date(0, 0, 0, 0, 0)
    }
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
    goPath () {
      if (this.$route.query.flag) {
        this.$router.push({
          path: '/modify',
          query: {
            time: this.$route.query.time
          }
        })
      } else {
        this.$router.push({
          path: '/treasureNext',
          query: {
            time: this.$route.query.time
          }
        })
      }
    },
    /**
     *
     * @param type
     * 0 为选择开始时间, 1 为选择结束时间
     */
    chooseTime(type) { // 选择开始时间
      if (this.value) {
        this.isShow = true
        this.type = type
        if (type === 0) {
          this.title = this.$t('treasure.text19')
        } else {
          this.title = this.$t('treasure.text20')
        }
      }
    },
    choose(index) {
      if (this.value) {
        this.weekList[index].isHighLight = !this.weekList[index].isHighLight
      }
    },

    /**
     * 关闭重置按钮时间都处于初始状态
     */
    sure(type, hour, mins) {
      if (type === 0) {
        this.startHour = hour < 10 ? '0' + hour : hour
        this.startMins = mins < 10 ? '0' + mins : mins
      } else {
        this.endHour = hour < 10 ? '0' + hour : hour
        this.endMins = mins < 10 ? '0' + mins : mins
      }
      this.isShow = false
    },
    cancel() {
      this.isShow = false
    },
    sureChooseTime() {
      let indexArr = []
      let weekArr = []
      this.weekList.forEach((item) => {
        if (item.isHighLight) {
          let weekIndex = this.weekList.indexOf(item)
          weekArr.push(this.weekList[weekIndex].title)
          if (weekIndex === 0) {
            weekIndex = 7
          }
          indexArr.push(weekIndex)
        }
      })
      this.$store.commit('SET_WEEKS', indexArr.join(","))

      let startTime = ''
      let endTime = ''

      if (!(this.startHour > this.endHour || (this.startHour === this.endHour && this.startMins >= this.endMins))) {
        startTime = this.startHour + ':' + this.startMins
        endTime = this.endHour + ':' + this.endMins

        if (this.$route.query.flag) {
          this.$router.push({
            path: '/modify',
            query: {
              startTime: startTime,
              endTime: endTime,
              time: this.$route.query.time,
              weekArr: indexArr.join(","),
              id: this.$route.query.id
            }
          })
        } else {
          this.$router.push({
            path: '/treasureNext',
            query: {
              address: this.$route.query.address,
              time: this.$route.query.time,
              startTime: startTime,
              endTime: endTime,
              weekArr: indexArr.join(",")
            }
          })
        }
      } else {
        this.toastD(this.$t('treasure.text24'))
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 10px
    padding-bottom 0
    background-color #fff
    min-height calc(100vh - 1.6rem)
    position relative
    .time-top
      height 1rem
      font-size .3rem
      width 100%
      justify-content space-between
      align-items center
      display flex
      flex-direction row
    .choose-week
      margin-top .4rem
      ul
        display flex
        flex-direction row
        flex-wrap wrap
        li
          margin-bottom .3rem
          float left
          margin-left .2rem
          width 1.42rem
          height .8rem
          text-align center
          color #999
          font-size .28rem
          line-height .8rem
          background-color #f0f0f0
          border-radius 8px
          &.highLight
            color #000
            background-color #ffe600
    .panel
      margin-top .8rem
      border 1px solid #e6e6e6
      border-radius 8px
      padding 0 .35rem
      width 100%
      .startTime
        border-bottom 1px dotted #e6e6e6
      .panel-time
        height 1rem
        align-items center
        display flex
        flex-direction row
        justify-content space-between
        font-size .3rem
        .panel-title
          margin-right .3rem
        .wrapper
          flex 1
          display flex
          justify-content space-between
          align-items center
          .panel-value
            color #b79961
          .right-icon
            img
              width .3rem
              height .3rem
    .btn
      width 100%
      position fixed
      bottom 0
      right 0
      font-size .32rem
      border 1px solid #b79961
      color #b79961
      height 1rem
      line-height 1rem
      text-align center
</style>
