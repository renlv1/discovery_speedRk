<template>
  <div class="v-content-wrapper">
    <ul>
      <li class="input-box" v-show="googleCode !== 2">
        <input v-model="code" class="v-placeholder-text" :placeholder="$t('forget.emailTip')" />
        <button class="get-code" :disabled="!show">
          <span v-show="show" @click="getCode">{{$t('forget.getCode')}}</span>
          <span v-show="!show">{{count}} s</span>
        </button>
      </li>
      <li v-show="googleCode === 2">
        <input v-model="code" class="v-placeholder-text" :placeholder="$t('forget.googleTip')" />
      </li>
      <li>
        <input v-model="password" type="password" class="v-placeholder-text" :placeholder="$t('forget.password')" />
      </li>
      <li>
        <input v-model="passwordAgain" type="password" class="v-placeholder-text" :placeholder="$t('forget.passwordAgain')" />
      </li>
    </ul>
    <div class="btn" @click="submit">{{$t('forget.nextStep')}}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {checkEmail} from '@/utils/validate'
import {sendEmailCode, findPassword} from '@/api/login'

export default {
  data() {
    return {
      timer: null,
      code: '',
      password: '',
      passwordAgain: '',
      count: '',
      show: true,
    }
  },
  methods: {
    getCode() {
      const TIME_COUNT = 60
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
        sendEmailCode(this.email, 1).then((res) => {
          if (res.data.success) {
            this.toastD(this.$t('common.sendSuccessTip'))
          } else {
            this.toastD(res.data.msg)
          }
        })
      }
    },

    submit() { // 提交修改密码的表单
      const username = this.userName
      const code = this.code
      const password = this.password
      const codeType = this.googleCode === 2 ? 1 : 2

      if (this.password === this.passwordAgain) {
        findPassword(username, code, password, codeType).then((res) => {
          if (res.data.success) {
            this.toastD(this.$t('common.modifySuccessTip'))
            setTimeout(() => {
              this.$router.push('/login')
            }, 2000)
          } else {
            this.toastD(res.data.msg)
          }
        })
      } else {
        this.toastD(this.$t('common.passwordAgainError'))
      }
    }
  },
  computed: {
    ...mapGetters([
      'googleCode',
      'userName',
      'email'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .v-content-wrapper
    margin-top 0
    padding 0
    ul
      li
        margin-top .4rem
        input
          width 100%
          font-size .32rem
          height .8rem
          line-height .8rem
          color #000
          border-bottom 1px solid #bfbfbf
      .input-box
        position relative
        display flex
        flex-direction row
        align-items center
        .get-code
          position absolute
          right 0
          span
            color #b79961
            font-size .28rem
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
