<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="other-setting">
        <ul>
          <li>
            <label>{{$t('treasure.text59')}}</label>
            <div class="li-right" @click="setTask">
              <span>{{setValue}}</span>
              <img src="../../assets/img/treasure/right.png" />
            </div>
          </li>
          <li>
            <label>{{$t('treasure.text60')}}</label>
            <div class="li-right" @click="chooseTime">
              <div class="date-wrapper">
                <p class="time">{{minetime}}</p>
                <p class="week">{{minedate}}</p>
              </div>
              <img src="../../assets/img/treasure/right.png" />
            </div>
          </li>
          <li class="li-address">
            <label class="detail-address">{{$t('treasure.text61')}}</label>
            <div class="li-right">
              <textarea v-model="address" :placeholder="$t('treasure.text62')"></textarea>
            </div>
          </li>
          <li>
            <label>{{$t('treasure.text70')}}</label>
            <div class="li-right" @click="PriorityAllocation">
              <span>{{this.$route.query.number ? this.$route.query.number : fenPeiCount}}</span>
              <img src="../../assets/img/treasure/right.png" />
            </div>
          </li>
          <li>
            <label>{{$t('treasure.text63')}}</label>
            <div class="li-right" @click="openDeadline">
              <el-date-picker
                v-model="value1"
                type="date"
                :picker-options="pickerBeginDateBefore"
                :placeholder="$t('treasure.text64')">
              </el-date-picker>
              <img src="../../assets/img/treasure/right.png" />
            </div>
          </li>
        </ul>
      </div>
      <div class="btn" @click="sure">{{$t('treasure.text65')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {modifyInfo, myTaskDetail} from '../../api/treasure'

export default {
  components: {mFixedTop},
  name: "modify",
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          var date = new Date();
          date.setDate(date.getDate() + 90);
          return time.getTime() <= date
        }
      },
      titleName: this.$t('treasure.text66'),
      isGoBack: true,
      setValue: '',
      timeLimit: {startTime: '00: 00', endTime: '23:59'},
      endTime: '',
      weeks: this.$t('treasure.text67'),
      realAddress: '',
      value1: '',
      taskObj: {},
      task: '',
      minetime: '',
      minedate: '',
      address: '',
      fenPeiCount: ''
    }
  },
  mounted() {
    this.getTaskDetail()
    if (this.$route.query.time) {
      this.value1 = this.$route.query.time
    }
    this.minetime = this.$store.state.setWeeks
  },
  methods: {
    mWeeK(data) {
      if (data) {
        let f = data.split(',')
        let arr = []
        f.forEach(item => {
          if (item === '1') arr.push(this.$t('findBao.text6'))
          if (item === '2') arr.push(this.$t('findBao.text7'))
          if (item === '3') arr.push(this.$t('findBao.text8'))
          if (item === '4') arr.push(this.$t('findBao.text9'))
          if (item === '5') arr.push(this.$t('findBao.text10'))
          if (item === '6') arr.push(this.$t('findBao.text11'))
          if (item === '7') arr.push(this.$t('findBao.text12'))
        })
        return arr.join('、')
      }
    },
    goPath() {
      this.$router.push({
        path: `/myTaskDetail`,
        query: {
          id: this.$route.query.id
        }
      })
    },
    openDeadline() {
      console.log('111111')
    },
    chooseTime() {

      this.$router.push({
        path: '/chooseTime',
        query: {
          flag: 1,
          time: this.$changeDate(this.value1),
          id: this.$route.query.id
        }
      })
    },
    getTaskDetail() {
      myTaskDetail(this.$route.query.id).then((res) => {
        this.taskObj = res.data.data
        // this.task = this.taskObj.task
        if (this.$route.query.startTime) {
          this.minetime = this.$route.query.startTime + '-' + this.$route.query.endTime
        } else {
          this.minetime = this.taskObj.minetime
        }
        if (this.$route.query.weekArr) {
          this.minedate = this.mWeeK(this.$route.query.weekArr)
        } else {
          this.minedate = this.mWeeK(this.taskObj.minedate)
        }
        this.setValue = this.$store.state.setTaskContent ? this.$store.state.setTaskContent : this.taskObj.task

        this.endTime = this.$changeDate(res.data.data.expiryDate)
        this.address = this.taskObj.address
        if (this.taskObj.friendAddress) {
          this.fenPeiCount = (this.taskObj.friendAddress).toString().split(',').length
        } else {
          this.fenPeiCount = 0
        }
      })
    },
    setTask() {
      this.$store.commit('SET_TASK_INDEX', 0)
      this.$router.push({
        path: '/task',
        query: {
          id: this.taskObj.id,
          flag: 1
        }
      })
    },
    PriorityAllocation() {
      this.$router.push({
        path: '/PriorityAllocation',
        query: {
          flag: 1,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          weekArr: this.$route.query.weekArr,
          id: this.$route.query.id
        }
      })
    },
    sure() {
      let id = this.$route.query.id
      let setValue = this.setValue === this.$t('treasure.text68') ? '' : this.setValue
      let time = this.$route.query.startTime ? (this.$route.query.startTime + '-' + this.$route.query.endTime) : this.taskObj.minetime
      let weeks = (this.$route.query.weekArr && this.$route.query.weekArr.length !== 0) ? this.$route.query.weekArr : this.taskObj.minedate
      let value1 = this.value1
      let realAddress = this.realAddress
      let num = this.$store.state.setFriendNum
      let longitude = this.taskObj.longitude
      let latitude = this.taskObj.latitude
      modifyInfo(longitude, latitude, id, setValue, time, weeks, value1, realAddress, num).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('treasure.text69'))
          this.$router.push({
            path: '/myTaskDetail',
            query: {
              id: this.$route.query.id
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    background-color #fff
    min-height calc(100vh - 2rem)
    .other-setting
      .label
        color #999
        padding .32rem 0 .2rem .4rem
        font-size .28rem
        background-color #eee
      ul
        padding 0 .4rem
        font-size .28rem
        li
          padding: .2rem 0
          min-height 1rem
          align-items center
          display flex
          flex-direction row
          border-bottom 1px solid #ccc
          &:nth-child(4) {
            height 1.2rem
          }
          label
            margin-right .4rem
            white-space: nowrap
          .detail-address
            height .75rem
            text-align top
          .li-right
            display flex
            justify-content space-between
            align-items center
            flex 1
            textarea
              width 100%
              border none
              min-height .75rem
            img
              width .28rem
              height .28rem
            .date-wrapper
              .time
                color #000
              .week
                margin-top .1rem
                color #999
    .btn
      width 100%
      position fixed
      left: 0
      bottom 0
      font-size .32rem
      border 1px solid #b79961
      color #b79961
      height 1rem
      line-height 1rem
      text-align center
</style>
