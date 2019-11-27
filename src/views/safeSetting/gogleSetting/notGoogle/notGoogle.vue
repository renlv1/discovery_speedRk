<template>
  <div class="secret-wrapper">
<!--    绑定谷歌第一步-->
    <div class="secret-container">
      <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath"></m-fixed-top>
      <div class="content">
        <div class="img-box">
          <img src="../../../../assets/img/safeSetting/gogle_gray.svg" alt="">
        </div>
        <p class="text">{{$t('safe.text15')}}</p>
        <div class="btn-m" @click="bindOk">{{$t('safe.text16')}}</div>
      </div>
    </div>
<!--   身份验证 获取谷歌二维码 -->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="gogleShow">
        <div class="dialog-safe" >
          <div class="close">
            <div class="close-icon"></div>
          </div>
          <div class="dialog-title">{{$t('safe.text17')}}</div>
          <div class="form-item">
            <input type="password" :placeholder="$t('safe.text18')" class="input" v-model.trim="payCode">
          </div>
          <div class="form-item">
            <input type="text" :placeholder="$t('safe.text19')" class="input" v-model.trim="duanXinCode">
            <div class="send" @click="sendEmail" :class="{'disable-btn': disabled}">{{countText}}</div>
          </div>
          <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <div class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{$t('safe.text20')}}</div>
            <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('safe.text21')}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        countText: this.$t('safe.text22'),
        disabled: false,
        countTime: 60,
        gogleShow: false,
        titleName: this.$t('safe.text23'),
        isSetting: false,
        errInputMsg: '',
        payCode: '',
        duanXinCode: ''
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    mounted () {
    },
    methods: {
      goPath () {
        this.$router.push('/safeSetting')
      },
      cancelCallback () {
        this.payCode = ''
        this.duanXinCode = ''
        this.errInputMsg = ''
        this.gogleShow = false
      },
      okCallback () {
        this.errInputMsg = ''
        if (this.payCode === '') {
          this.errInputMsg = this.$t('transfer.text27')
          return
        }
        if (this.duanXinCode === '') {
          this.errInputMsg = this.$t('safe.text23')
          return
        }
        this.$fetch.post('/security/google_reset', {
          tradePwd: this.payCode,
          emailCode: this.duanXinCode
        }).then(res => {
          if (res.success) {
            this.$router.push({
              path: '/bindingOne',
              query: {
                qrUrl: res.data.qrUrl,
                secret: res.data.secret
              }
            })
          } else {
            this.errInputMsg = res.msg
          }
        })
      },
      creatToast (msg) {
        let toast1 = this.$createToast({
          txt: msg,
          time: 1500,
          type: 'txt'
        })
        toast1.show()
      },
      sendEmail () {
        this.disabled = true
        this.$fetch.post('/user/sendEmailCode', {
          email: this.userData.email,
          sendType: 2
        }).then(res => {
          if (res.success) {
            this.countDown()
            this.creatToast(this.$t('safe.text24'))
          } else {
            this.disabled = false
            this.creatToast(res.msg)
          }
        })
      },
      countDown () {
        this.disabled = true
        if (this.countTime === 0) {
          this.countText = this.$t('safe.text22')
          this.countTime = 60
          this.disabled = false
        } else {
          this.countTime--
          this.countText = this.countTime
          this.timer = setTimeout(() => this.countDown(), 1000)
        }
      },
      bindOk () {
        this.gogleShow = true
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  img
    display: block
    width: 100%
  .secret-wrapper
    .secret-container
      margin-top: 1.76rem
      padding:  .2rem .4rem 0 .4rem
      .content
        display: flex
        align-items center
        flex-direction column
        .img-box
          width: 3rem
          display: block
          margin: 1.2rem 0 .6rem
        .text
          font-size: .28rem
          color #000
        .btn-m
          width: 5.6rem
          height: 1rem
          border: 2px solid #b79961
          color #b79961
          border-radius 4px
          font-size: .32rem
          margin-top: 1.6rem
          background-color: #fff
          display: flex
          align-items center
          justify-content center
  .dialog-safe-w
    display: flex
    align-items center
    justify-content center
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom:0
    width: 100%
    height: 100%
    z-index: 200
    color #000
    background-color: rgba(0,0,0,.4)
    &.safeDialog-enter, &.safeDialog-leave-to
      opacity: 0;
      .dialog-safe
        transform: translate(0, -5%)
    &.safeDialog-enter-active
      transition: .3s;
      .dialog-safe
        transition: .3s
    &.safeDialog-leave-active
      transition: .1s;
      .dialog-safe
        transition: .1s
    .dialog-safe
      width: 6.9rem
      background-color: #fff
      position: relative
      border-radius 4px
      color #17161f
      font-size: .28rem;
      transform: translate(0, 0)
      padding: 0 .4rem
      .dialog-title
        font-size: .32rem
        font-weight: bold
        color #17161f
        padding: .5rem 0 .6rem
        text-align: center
      .g-dialog-btn-wrap
        margin-top 1rem
        display: flex
        align-items center
        justify-content center
        border-top: 1px dashed #000
      .form-item
        margin-bottom: .4rem
        position: relative
        .label
          margin-bottom: .2rem
        .input
          border-bottom 1px solid #000
          width: 100%
          height: 1rem
          /*border-radius .4rem*/
          /*background-color: #f5f6fa*/
          /*padding: 0 .3rem*/
          color #000
      .err-ms
        color: #ff717d;
        font-size .24rem
        margin-top: .3rem;
      .send
        color #b79961
        position: absolute
        right: 0
        padding: 0 .2rem
        top: 0
        line-height: 1rem
        &.disable-btn
          pointer-events none
      .shortMsg
        position relative
        .payMsg-box
          .payMsg
            width 100%
            height .8rem
            background-color #f5f6fa
            border-radius .4rem
            font-size .28rem
            padding 0 .3rem
          .sendMsg
            position absolute
            top 0
            right 0
            height: 100%
            padding: 0 .2rem
            background-color transparent
            border none
            outline none
            font-size: .28rem
            color #00a6f1
      .g-dialog-btn
        text-align center
        flex 1
      .comfirm
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
        color #b79961
</style>
