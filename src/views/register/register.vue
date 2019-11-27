<template>
  <div class="register">
    <div class="v-content-wrapper">
      <mFixedTop :titleName="titleName"></mFixedTop>
      <div class="common border">
        <span>{{$t('register.username')}}</span>
        <input v-model="username" class="v-placeholder-text" :placeholder="$t('register.usernameTip')" />
      </div>
      <div class="sex">
        <span>{{$t('register.sex.title')}}</span>
        <div class="img-box man" @click="selectSex(1)" :class="{active: flag === 1}">
          <!-- 高亮状态下的性别图标 -->
          <img v-show="flag !== 1" src="./images/unactive-man.svg" />
          <img v-show="flag === 1" src="./images/active-man.svg" />
          <p>{{$t('register.sex.male')}}</p>
        </div>
        <div class="img-box women" @click="selectSex(2)" :class="{active: flag === 2}">
          <!-- 高亮状态下的性别图标 -->
          <img v-show="flag !== 2" src="./images/unactive-woman.svg" />
          <img v-show="flag === 2" src="./images/active-woman.svg" />
          <p>{{$t('register.sex.female')}}</p>
        </div>
      </div>
      <div class="common border">
        <span>{{$t('register.email')}}</span>
        <input v-model="emailAddress" class="v-placeholder-text" :placeholder="$t('register.emailTip')" />
      </div>
      <div class="common border">
        <span>{{$t('register.loginPassword')}}</span>
        <input type="password" v-model="password" class="v-placeholder-text" :placeholder="$t('register.loginPasswordTip')" />
      </div>
      <div class="common border">
        <span>{{$t('register.payPasswordTp')}}</span>
        <input type="password" v-model="pay_password" class="v-placeholder-text" :placeholder="$t('register.loginPasswordTip')" />
      </div>
      <div class="common border">
        <span>{{$t('register.emailVerification')}}</span>
        <input v-model="verifyCode" class="v-placeholder-text email" :placeholder="$t('register.emailVerificationTip')" />
        <button class="get-code" :disabled="!show">
          <span v-show="show" @click="getCode">{{$t('forget.getCode')}}</span>
          <span v-show="!show">{{count}} s</span>
        </button>
      </div>
      <div v-waves class="btn" @click="register_form">{{$t('common.dialog.text2')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {checkEmail, checkMinLength} from '@/utils/validate'
import {sendEmailCode, register} from '@/api/login'
import waves from '@/dircetive/waves/waves'

export default {
  components: {mFixedTop},
  directives: {waves},
  data() {
    return {
      titleName: this.$t('register.title'),
      flag: 1, // 男性/女性标识(1:男; 2:女)
      username: '',
      password: '', // 登录密码
      pay_password: '', // 支付密码
      verifyCode: '',
      emailAddress: '', // 邮箱地址
      show: true,
      count: '',
      timer: null,
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    selectSex(num) {
      if (num === 1) {
        this.flag = 1
      } else if (num === 2) {
        this.flag = 2
      }
    },
    getCode() {
      const TIME_COUNT = 60
      if (checkEmail(this.emailAddress)) {
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.show = false
              this.count--
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
          sendEmailCode(this.emailAddress, 1).then((res) => {
            if (res.data.success) {
              this.toastD(this.$t('common.sendSuccessTip'))
            } else {
              this.toastD(res.data.msg)
            }
          })
        }
      } else {
        this.toastD(this.$t('register.verification.text6'))
      }
    },
    register_form() {
      if (checkMinLength(this.username, 6) && checkEmail(this.emailAddress) && this.verifyCode !== '' && checkMinLength(this.password, 6) && checkMinLength(this.pay_password, 6)) {
        register(this.username, this.password, this.pay_password, this.verifyCode, this.emailAddress, this.flag).then((res) => {
          if (res.data.success) {
            this.toastD(this.$t('register.successRegisterTip'))
            setTimeout(() => {
              localStorage.setItem('userName', this.username)
              this.$router.push('/login')
            }, 2000)
          } else {
            this.toastD(res.data.msg)
          }
        })
      } else {
        this.prompt()
      }
    },
    prompt() {
      let msg
      if (!checkMinLength(this.username, 6)) {
        msg = this.$t('register.verification.text1')
      } else if (!checkEmail(this.emailAddress)) {
        msg = this.$t('register.verification.text2')
      } else if (!checkMinLength(this.password, 6)) {
        msg = this.$t('register.verification.text3')
      } else if (!checkMinLength(this.pay_password, 6)) {
        msg = this.$t('register.verification.text4')
      } else if (this.verifyCode === '') {
        msg = this.$t('register.verification.text5')
      }
      this.toastD(msg)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .register
    .v-content-wrapper
      .common, .sex
        height .8rem
        line-height .8rem
        display flex
        font-size .28rem
        margin-bottom .5rem
        span
          margin-right .4rem
          display block
          min-width 2.19rem
        /*chrome 20+*/
        input
          width 90%
        .email
          width 70%
        .get-code
          span
            margin-right 0
            min-width 0
            width auto
            white-space nowrap
            color #b79961
            font-size .28rem
      .border
        border-bottom 1px solid #000
      .sex
        .img-box
          min-width 1.6rem
          display flex
          justify-content center
          align-items center
          flex-direction row
          border 1px solid #000
          border-radius .1rem
          margin-right .5rem
          img
            width .38rem
            height .45rem
            margin-right .1rem
          &.active
            background-color #6f6fee
            color #fff
            border none
      .btn
        margin-top 1.6rem
        text-align center
        display inline-block
        width 100%
        height 1rem
        line-height 1rem
        color #b79961
        font-size .32rem
        border-1px(#b79961, solid)
</style>
