<template>
  <transition name="safeDialog">
    <div class="dialog-w dialog-safe-w">
      <div class="dialog-safe" >
        <div class="close">
          <div class="close-icon"></div>
        </div>
        <div class="dialog-title">{{$t('safe.text17')}}</div>
        <div class="form-item">
          <input type="password" :placeholder="$t('safe.text30')" class="input" v-model.trim="payCode">
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
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
	export default {
		data () {
		  return {
        payCode: '',
        duanXinCode: '',
        disabled: '',
        countText: this.$t('safe.text22'),
        errInputMsg: '',
        countTime: 60
      }
    },
    props: {
      unlock: {
        type: Boolean
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    methods: {
		  // 取消
      cancelCallback () {
        this.payCode = ''
        this.duanXinCode = ''
        this.errInputMsg = ''
        this.$emit('cancelBtn')
      },
      creatToast (msg) {
        let toast1 = this.$createToast({
          txt: msg,
          time: 1500,
          type: 'txt'
        })
        toast1.show()
      },
      // 确定重置
      okCallback () {
        this.errInputMsg = ''
        if (this.payCode === '') {
          this.errInputMsg = this.$t('transfer.text27')
          return
        }
        if (this.duanXinCode === '') {
          this.errInputMsg = this.$t('market.text31')
          return
        }
        if (this.unlock === true) {
          // 解锁
          this.$fetch.post('/tx/unlock', {
            tradePwd: this.payCode,
            mobileCode: this.duanXinCode
          }).then(res => {
            if (res.success) {
              this.$emit('unlockOK')
            } else {
              this.errInputMsg = res.msg
            }
          })
        } else {
          // 重置谷歌
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
        }
      },
      // 发送验证码
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
      // 倒计时
      countDown () {
        this.disabled = true
        if (this.countTime === 0) {
          this.countText = this.$t('safe.text25')
          this.countTime = 60
          this.disabled = false
        } else {
          this.countTime--
          this.countText = this.countTime
          this.timer = setTimeout(() => this.countDown(), 1000)
        }
      },
    }
	}
</script>

<style scoped lang="stylus">
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
