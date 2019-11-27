<template>
  <div class="secret-wrapper">
    <div class="secret-container">
      <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath"></m-fixed-top>
      <div class="content">
        <div class="img-box">
          <img src="../../../../assets/img/safeSetting/gogle_gray.svg" alt="">
        </div>
        <p class="text">{{$t('safe.text48')}}</p>
        <div class="btn-m btn-one" @click="bindOk" :class="{'disable-a': disabledShow}">{{$t('safe.text49')}}</div>
        <div class="btn-m btn-two" @click="resetGoogle">{{$t('safe.text28')}}</div>
      </div>
    </div>
    <!--   身份验证 （谷歌） -->
<!--    <vpay-dialog @succeed="okPay" v-show="verifyCodeShow" @cancelDialog="cancelDialog"></vpay-dialog>-->
<!--    重置弹窗  (邮箱)-->
    <reset-google v-show="resetShow" @cancelBtn="cancelBtn" :unlock="unlock" @unlockOK="unlockOK"></reset-google>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        unlock: false,
        resetShow: false,
        disabledShow: false,
        titleName: this.$t('transfer.text23'),
        verifyCodeShow: false
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
      cancelBtn () {
        this.resetShow = false
      },
      bindOk () {
        this.disabledShow = true
        this.$fetch.post('/security/google_open_close', {
          type: '1'
        }).then(res => {
          this.disabledShow = false
          if (res.resultCode === 'ACCOUNT_LOCK') {
            this.unlock = true
            this.resetShow = true
          } else if (res.success) {
            this.toastM(this.$t('safe.text13'))
            this.$router.push('/openGoogle')
            this.$store.dispatch('getUserBalance')
          } else {
            this.toastM(res.msg)
          }
        }).catch(() => {
          this.disabledShow = false
        })
      },
      // 解锁成功后 -- 开启谷歌
      unlockOK () {
        this.$fetch.post('/security/google_open_close', {
          type: '1'
        }).then(res => {
          if (res.success) {
            this.$store.dispatch('getUserBalance')
            this.toastM(this.$t('safe.text13'))
            this.resetShow = false
            this.$router.push('/openGoogle')
          } else {
            this.toastM(res.msg)
          }
        }).catch(() => {
          this.disabledShow = false
        })
      },
      // 重置谷歌
      resetGoogle () {
        this.resetShow = true
      },
      toastM (text) {
        let toast = this.$createToast({
          txt: text,
          time: 1500,
          type: 'txt'
        })
        toast.show()
      },
      okPay () {
        this.$fetch.post('/security/google_open_close', {
          type: '2'
        }).then(res => {
          if (res.success) {
            this.toastM(this.$t('safe.text29'))
            this.$router.push('/notOpenGoogle')
            this.$store.dispatch('getUserBalance')
          } else {
            this.toastM(res.msg)
          }
        })
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      resetGoogle: () => import('@/components/resetGoogle')
      // vpayDialog: () => import('@/components/payDialog')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  img
    display: block
    width: 100%
  .secret-wrapper
    // margin-top: 1.76rem
    // padding: 0 .4rem
    .secret-container
      margin-top: 1.76rem
      padding: .2rem .4rem 0 .4rem
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
          margin-bottom: 1.6rem
        .ok-text
          color #518ef8
        .btn-m
          width: 5.6rem
          height: 1rem
          color #999
          border-radius 4px
          font-size: .32rem
          background-color: #fff
          display: flex
          align-items center
          justify-content center
          margin-bottom: .4rem
        .btn-one
          background-color: #518ef8
          color #fff
        .btn-two
          background-color: #f5f5f5
        .disable-a
          pointer-events none
</style>
