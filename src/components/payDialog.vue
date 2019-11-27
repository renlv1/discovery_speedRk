<template>
  <transition name="safeDialog">
    <div class="dialog-w dialog-safe-w">
      <div class="dialog-safe" >
        <div class="close">
          <div class="close-icon"></div>
        </div>
        <div class="dialog-title">{{$t('payDialog.text1')}}</div>
        <div class="form-item">
          <input type="password" :placeholder="$t('payDialog.text2')" class="input" v-model.trim="safeCode">
        </div>
        <div class="form-item">
          <input type="text" :placeholder="$t('payDialog.text3')" class="input" v-model.trim="payCode">
        </div>
        <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
        <div class="g-dialog-btn-wrap">
          <div class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{$t('payDialog.text4')}}</div>
          <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('payDialog.text5')}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        isOpen: false,
        errInputMsg: '',
        visible: true,
        safeCode: '',
        payCode: '',
        userData: ''
      }
    },
    props: {
      type: String,
      title: String,
      msg: String,
      okFn: Function,
      okText: String,
      cancelFn: Function,
      cancelText: String,
      align: String
    },
    created() {
    },
    methods: {
      cancelCallback() {
        this.safeCode = ''
        this.payCode = ''
        this.errInputMsg = ''
        this.$emit('cancelDialog')
      },
      okCallback() {
        if (this.safeCode === '') {
          this.errInputMsg = this.$t('payDialog.text6')
          return
        }
        if (this.payCode === '') {
          this.errInputMsg = this.$t('payDialog.text7')
          return
        }
        if (this.safeCode !== '' && this.payCode !== '') {
          this.$fetch.post('/tx/unlock', {
            tradePwd: this.safeCode,
            mobileCode: this.payCode,
            codeType: '1'
          }).then(res => {
            if (res.success === true) {
              this.$emit('succeed')
              this.safeCode = ''
              this.payCode = ''
            } else {
              if(localStorage.getItem('discoveryLang') === 'EN') {
                this.errInputMsg = this.$t('transfer.text50')
              } else {
                this.errInputMsg = res.msg
              }
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
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
