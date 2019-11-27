<template>
  <div class="treasure-content">
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="top-wrapper">
        <span>{{$t('treasure.text1')}}(π)</span>
        <input v-model="money" class="value" :placeholder="placeHoldText" @input="inputMoney('money')" />
      </div>
      <div class="treasure-address-wrapper">
        <img width="40" height="40" src="../../assets/img/treasure/place.png" />
        <p class="treasure-address">{{address}}</p>
      </div>
    </div>
    <div class="other-setting">
      <h5 class="label">{{$t('treasure.text2')}}</h5>
      <ul>
        <li>
          <label>{{$t('treasure.text3')}}</label>
          <div class="li-right" @click="setTask">
            <span>{{setValue}}</span>
            <img src="../../assets/img/treasure/right.png" />
          </div>
        </li>
        <li>
          <label>{{$t('treasure.text4')}}</label>
          <div class="li-right" @click="chooseTime">
            <div class="date-wrapper">
              <p class="time">{{this.$route.query.startTime || timeLimit.startTime}} - {{this.$route.query.endTime ||
                timeLimit.endTime}}</p>
              <p class="week">{{(this.$route.query.weekArr && this.$route.query.weekArr.length !== 0) ?
                mWeeK(this.$route.query.weekArr) : weeks}}</p>
            </div>
            <img src="../../assets/img/treasure/right.png" />
          </div>
        </li>
        <li class="li-address">
          <label class="detail-address">{{$t('treasure.text5')}}</label>
          <div class="li-right">
            <textarea v-model="realAddress" :placeholder="$t('treasure.text14')" @input="detailAddress"></textarea>
          </div>
        </li>
        <li>
          <label>{{$t('treasure.text6')}}</label>
          <div class="li-right" @click="PriorityAllocation">
            <span>{{$store.state.setFriendNum === 0 ? this.$t('treasure.text7') : $store.state.setFriendNum}}</span>
            <img src="../../assets/img/treasure/right.png" />
          </div>
        </li>
        <li>
          <label>截止时间</label>
          <div class="li-right">
            <el-date-picker
              v-model="value1"
              type="date"
              :picker-options="pickerBeginDateBefore"
              placeholder="不限">
            </el-date-picker>
            <img src="../../assets/img/treasure/right.png" />
          </div>
        </li>
      </ul>
    </div>

    <!--支付验证-->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="payDialogShow">
        <div class="dialog-safe">
          <div class="close">
            <div class="close-icon"></div>
          </div>
          <div class="pay-title">{{$t('common.payDialog.title')}}</div>
          <div class="form-item">
            <input type="password" :placeholder="$t('common.payDialog.inputTip.text1')" class="input"
                   v-model.trim="safeCode">
          </div>
          <div class="form-item">
            <input type="number" :placeholder="$t('common.payDialog.inputTip.text2')" class="input"
                   v-model.trim="payCode">
          </div>
          <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('common.dialog.text1')}}</div>
            <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('common.dialog.text2')}}</div>
          </div>
        </div>
      </div>
    </transition>

    <div class="btn" @click="sure">{{$t('treasure.text8')}}</div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {unCompileStr} from '../../utils/util'
import {treasure, treasureNoTask} from '../../api/treasure'
import {mapGetters} from 'vuex'

export default {
  name: "treasureNext",
  components: {mFixedTop},
  data() {
    return {
      //        日期控件
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          var date = new Date();
          date.setDate(date.getDate() + 90);
          return time.getTime() <= date
        }
      },
      isGoBack: true,
      titleName: this.$t('treasure.title'),
      placeHoldText: '',
      address: this.$store.state.setSelectAddress,
      setValue: this.$store.state.setTaskContent !== '' ? this.$store.state.setTaskContent : this.$t('treasure.text7'),
      timeLimit: {startTime: '00: 00', endTime: '23:59'},
      endTime: this.$t('treasure.text9'),
      weeks: this.$t('treasure.text10'),
      distribution: this.$t('treasure.text9'),
      longitude: this.$store.state.setCenter.lng,
      latitude: this.$store.state.setCenter.lat,
      value1: '',
      money: this.$store.state.setMoney || '', //藏宝金额,
      realAddress: this.$store.state.setRealAddress, // 具体地址
      minetime: '', // 挖宝时间
      minedate: '', // 挖宝日期
      taskDescription: '', // 任务描述
      payDialogShow: false,
      safeCode: '',
      payCode: '',
      errInputMsg: '',
    }
  },
  computed: {
    ...mapGetters([
      'piBalance'
    ])
  },
  mounted() {
    this.placeHoldText = this.$t('treasure.text11') + this.piBalance + 'π'
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  methods: {
    mWeeK (data) {
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
    detailAddress() {
      this.$store.commit('SET_REAL_ADDRESS', this.realAddress)
    },
    qaWeek(week) {
      return week.join('、')
    },
    inputMoney(field) {
      let val = this[field]
      if (!/^\d*\.{0,1}\d{0,2}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过2位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
      if (this[field] < 1) {
        this[field] = ''
      } else if (this[field] > this.piBalance) {
        let piB = this.piBalance
        if (piB < this.piBalance.toFixed(2)) {
          this[field] = this.piBalance.toFixed(2) - 0.01
        } else {
          this[field] = this.piBalance.toFixed(2)
        }
      }
      this.$store.commit('SET_MONEY', this[field])
    },
    closePayDialog() {
      this.payDialogShow = false
    },
    goPath() {
      this.$router.push('/treasure')
    },
    okCallback() {
      if (this.safeCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text4')
      }
      if (this.payCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text5')
      }
      if (this.safeCode !== '' && this.payCode !== '') {
        this.$fetch.post(`${this.$api2}pay/payOrder`, {
          id: this.id,
          tradePwd: this.safeCode,  // 支付密码（选填）
          mobileCode: this.payCode  // 手机验证码 （选填） 邮箱
        }).then((re) => {
          if (re.status === 'success') {
            this.payDialogShow = false
            this.toastD(this.$t('treasure.text12'))
            this.$router.push('/treasure')
          } else {
            this.errInputMsg = re.msg
          }
        })
      }
    },
    sure() {
      let longitude = this.longitude
      let latitude = this.latitude
      let total = this.money
      let address = this.address
      let realAddress = this.realAddress
      let minetime = (this.$route.query.startTime || '00:00') + '-' + (this.$route.query.endTime || '23:59')
      let minedate = this.$route.query.weekArr && this.$route.query.weekArr.length !== 0 ? this.$route.query.weekArr : '1,2,3,4,5,6,7'
      let firstUser = this.$route.query.addressStr ? this.$route.query.addressStr : ''
      let expiryDate = ''

      if (this.value1) {
        expiryDate = this.$changeDate(this.value1, '-', 1)
      }
      let setValue = this.setValue
      if (total === '') {
        this.toastD(this.$t('treasure.text13'))
      } else {
        if (setValue === this.$t('treasure.text7')) {
          treasureNoTask(longitude, latitude, total, address, realAddress, minetime, minedate, expiryDate, firstUser).then((res) => {
            if (res.data.status === 'success') {
              this.id = res.data.data.payId
              console.log(res.data.data.payId)
              this.payDialogShow = true
            } else {
              this.toastD(res.data.msg)
            }
          })
        } else {
          treasure(longitude, latitude, total, address, realAddress, minetime, minedate, setValue, expiryDate, firstUser).then((res) => {
            if (res.data.status === 'success') {
              this.id = res.data.data.payId
              console.log(res.data.data.payId)
              this.payDialogShow = true
            } else {
              this.toastD(res.data.msg)
            }
          })
        }
      }
    },
    PriorityAllocation() { // 优先分配
      let startTime = this.$route.query.startTime || this.timeLimit.startTime
      let endTime = this.$route.query.endTime || this.timeLimit.endTime
      this.$router.push({
        path: '/PriorityAllocation',
        query: {
          address: this.address,
          money: this.money,
          startTime: startTime,
          endTime: endTime,
          weekArr: this.$route.query.weekArr
        }
      })
    },
    setTask() { // 设置宝藏任务
      this.$store.commit('SET_TASK_INDEX', 0)
      let startTime = this.$route.query.startTime || this.timeLimit.startTime
      let endTime = this.$route.query.endTime || this.timeLimit.endTime
      this.$router.push({
        path: '/task',
        query: {
          address: this.address,
          money: this.money,
          startTime: startTime,
          endTime: endTime,
          weekArr: this.$route.query.weekArr
        }
      })
    },
    openDeadline() { // 点击截止时间
      console.log('111111')
    },
    chooseTime() { // 选择挖宝时间
      this.$router.push({
        path: '/chooseTime',
        query: {
          address: this.$route.query.address,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          weekArr: this.$route.query.weekArr
        }
      })
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  ::-moz-placeholder {
    color: #bfbfbf;
  }

  ::-webkit-input-placeholder {
    color: #bfbfbf;
  }

  :-ms-input-placeholder {
    color: #bfbfbf;
  }

  .li-right >>> .el-date-editor {
    width: 100% !important
  }

  .dialog-safe-w {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    color: #000;
    background-color: rgba(0, 0, 0, .4);
    &.safeDialog-enter, &.safeDialog-leave-to {
      opacity: 0;
      .dialog-safe {
        transform: translate(0, -5%)
      }
    }
    &.safeDialog-enter-active {
      transition: .3s;
      .dialog-safe {
        transition: .3s
      }
    }
    &.safeDialog-leave-active {
      transition: .1s;
      .dialog-safe {
        transition: .1s
      }
    }
    .dialog-safe {
      width: 6.9rem;
      background-color: #fff;
      position: relative;
      border-radius: 4px;
      color: #17161f;
      font-size: .28rem;
      transform: translate(0, 0);
      padding: 0 .4rem;
      .g-dialog-btn-wrap {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px dashed #000;
      }
      .pay-title {
        font-size: .28rem;
        text-align: center;
        padding: 20px 0;
      }
      .form-item {
        margin-bottom: .4rem;
        .label {
          margin-bottom: .2rem
        }
        .input {
          border-bottom: 1px solid #000;
          width: 100%;
          height: 1rem;
          color: #000;
        }
      }
      .err-ms {
        color: #ff717d;
        font-size: .24rem;
        margin-top: .3rem;
      }
      .shortMsg {
        position: relative;
        .payMsg-box {
          .payMsg {
            width: 100%;
            height: .8rem;
            background-color: #f5f6fa;
            border-radius: .4rem;
            font-size: .28rem;
            padding: 0 .3rem;
          }
          .sendMsg {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            padding: 0 .2rem;
            background-color: transparent;
            border: none;
            outline: none;
            font-size: .28rem;
            color: #00a6f1;
          }
        }
      }
      .g-dialog-btn {
        text-align: center;
        flex: 1;
        height: 100%;
      }
      .g-dialog-cancel {
        height: 50px;
        line-height: 50px;
        display: block;
      }
      .comfirm {
        width: 100%;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b79961;
      }
    }
  }

  .treasure-content
    min-height calc(100vh - 3rem)
    position relative
    padding-bottom 1rem
    .v-content-wrapper
      padding-top 0
      padding-bottom 0
      background-color #fff
      .top-wrapper
        display flex
        flex-direction column
        position relative
        border-1px-bottom(#000)
        span
          font-size .28rem
          margin-bottom .25rem
        .value
          display block
          font-size .3rem
          height .6rem
      .treasure-address-wrapper
        display flex
        flex-direction row
        align-items center
        img
          margin .34rem 0 .46rem
        .treasure-address
          color #999
          font-size .28rem
          margin .3rem 0 .42rem .3rem

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
          width 100%
          min-height 1rem
          height auto
          align-items center
          display flex
          flex-direction row
          border-1px-bottom(#f0f0f0)
          padding 10px 0
          &:nth-child(4) {
            height 1.2rem
          }
          label
            margin-right .4rem
          .detail-address
            height .75rem
            text-align top
          .li-right
            display flex
            justify-content space-between
            align-items center
            flex 1
            span
              flex 1
              width 200px
              word-wrap break-word
            textarea
              width 100%
              font-family: "Microsoft YaHei UI"
              border none
              min-height .75rem
              resize none
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
      background-color #fff
      width 100%
      position fixed
      bottom 0
      font-size .32rem
      border 1px solid #b79961
      color #b79961
      height 1rem
      line-height 1rem
      text-align center
</style>
