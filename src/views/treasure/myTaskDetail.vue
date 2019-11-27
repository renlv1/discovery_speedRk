<template>
  <div class="wrapper">
    <select-map class="map" v-if="lag !== 0" :titleName="$t('treasure.text33')" :lag="lag" :lat="lat"></select-map>
    <div class="panel" v-if="lag !== 0">
      <ul>
        <li>
          <img src="./images/address.png" />
          <p>{{this.taskObj.address}}</p>
        </li>
        <li>
          <img src="./images/task.png" />
          <p>{{this.taskObj.task === '' ? $t('treasure.text7') : this.taskObj.task}}</p>
          <ul class="img-list">
            <li></li>
          </ul>
        </li>
        <li>
          <img src="./images/time.png" />
          <div class="box">
            <p class="time">{{this.taskObj.minetime}}</p>
            <p class="date">{{this.mWeeK(this.taskObj.minedate)}}</p>
          </div>
        </li>
      </ul>
      <div class="btn-wrapper" v-if="!$route.query.flag">
        <div class="btn" @click="pay" v-if="taskObj.paystate === 1">{{$t('treasure.text34')}}</div>
        <div class="btn" @click="modify">{{$t('treasure.text35')}}</div>
      </div>
      <div class="btn-wrapper" v-if="$route.query.flag">
        <div class="btn" @click="sure">{{$t('treasure.text36')}}</div>
      </div>
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
            <input type="password" :placeholder="$t('common.payDialog.inputTip.text1')" class="input" v-model.trim="safeCode">
          </div>
          <div class="form-item">
            <input type="number" :placeholder="$t('common.payDialog.inputTip.text2')" class="input" v-model.trim="payCode">
          </div>
          <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('common.dialog.text1')}}</div>
            <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('common.dialog.text2')}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import selectMap from '@/components/map/selectMap'
import {myTaskDetail, myMapDetail} from "../../api/treasure";

export default {
  components: {selectMap},
  name: "myTaskDetail",
  data() {
    return {
      isGoBack: true,
      taskObj: {},
      lag: 0,
      lat: 0,
      payDialogShow: false,
      safeCode: '',
      payCode: '',
      errInputMsg: '',
    }
  },
  mounted() {
    this.getTaskDetail()
  },
  methods: {
    // 将'1,2,3,4,5,6,7'转化为星期一, 星期二这种格式

    pay() {
      this.payDialogShow = true
    },

    mWeeK (data) {
      if (data) {
        let f = data.split(',')
        let arr = []
        f.forEach(item => {
          if (item === '1') arr.push(this.$t('treasure.text39'))
          if (item === '2') arr.push(this.$t('treasure.text40'))
          if (item === '3') arr.push(this.$t('treasure.text41'))
          if (item === '4') arr.push(this.$t('treasure.text42'))
          if (item === '5') arr.push(this.$t('treasure.text43'))
          if (item === '6') arr.push(this.$t('treasure.text44'))
          if (item === '7') arr.push(this.$t('treasure.text45'))
        })
        return arr.join('、')
      }
    },

    modify() {
      this.$store.commit('SET_TASK_CONTENT', '')
      this.$router.push({
        path: '/modify',
        query: {
          id: this.taskObj.id
        }
      })
    },

    sure() {
      //everytotal  '/giveFraction'
      this.$router.push({
        path: '/giveFraction',
        query: {
          id: this.taskObj.id,
          total: this.taskObj.everytotal,
          longitude: this.taskObj.longitude,
          latitude: this.taskObj.latitude,
        }
      })
    },

    closePayDialog () {
      this.payDialogShow = false
    },

    okCallback () {
      if (this.safeCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text4')
      }
      if (this.payCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text5')
      }
      if (this.safeCode !== '' && this.payCode !== '') {
        this.$fetch.post(`${this.$api2}pay/payOrder`,{
          id: this.taskObj.payId,
          tradePwd: this.safeCode,  // 支付密码（选填）
          mobileCode: this.payCode  // 手机验证码 （选填） 邮箱
        }).then((re) => {
          if (re.status === 'success') {
            this.payDialogShow = false
            location.reload()
            this.toastD(this.$t('treasure.text38'))
          } else {
            this.errInputMsg = re.msg
          }
        })
      }
    },

    getTaskDetail() {
      if (this.$route.query.flag) {
        myMapDetail(this.$route.query.id).then((res) => {
          this.lag = res.data.data.longitude
          this.lat = res.data.data.latitude
          this.taskObj = res.data.data
        })
      } else {
        myTaskDetail(this.$route.query.id).then((res) => {
          this.lag = res.data.data.longitude
          this.lat = res.data.data.latitude
          this.taskObj = res.data.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
      .g-dialog-cancel{
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


  .wrapper
    height 100vh
    .map
      height 50%
      overflow hidden
    .panel
      position relative
      border 1px solid #ccc
      height 50%
      overflow hidden
      border-radius 15px 15px 0 0;
      ul
        li
          padding .35rem 0
          display flex
          align-items center
          flex-direction row
          font-size .28rem
          margin 0 .4rem
          border-bottom 1px solid #ccc
          .box
            display flex
            flex-direction column
          img
            width .3rem
            height .3rem
            margin-right .3rem
          p
            line-height .4rem
      .btn-wrapper
        position absolute
        bottom 10px
        height .7rem
        right .4rem
        font-size .28rem
        display flex
        flex-direction row
        .btn
          margin-left 10px
          font-size .28rem
          padding 0 5px
          border-radius 5px
          text-align center
          line-height .7rem
          border 1px solid #ccc
</style>
