<template>
  <div class="secret-wrapper">
    <!--    绑定谷歌第三步 完成绑定-->
    <div class="secret-container">
      <m-fixed-top :titleName="titleName"></m-fixed-top>
      <div class="content">
        <div class="step-left">
          <span class="t-m">2/2{{$t('safe.text10')}}</span>
        </div>
        <div class="c-wrap">
          <div class="v-input-item" :class="{'focus': isFocus, 'no-text': isEmpty}">
            <label class="label">{{$t('safe.text11')}}</label>
            <input type="text" class="input" @focus="focusInput()" @blur="blurInput()" v-model.trim="googleCode">
          </div>
          <div class="btn-a btn-one" @click="nextOk">{{$t('safe.text12')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        googleCode: '',
        isFocus: false,
        isEmpty: false,
        titleName: this.$t('safe.text7'),
        isSetting: false
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
      focusInput() {
        this.isFocus = true
      },
      blurInput() {
        if (this.googleCode === '') {
          this.isFocus = false
        } else {
          this.isEmpty = true
        }
      },
      toastM (text) {
        let toast = this.$createToast({
          txt: text,
          time: 1500,
          type: 'txt'
        })
        toast.show()
      },
      nextOk () {
        if (this.googleCode === '') {
          this.toastM(this.$t('safe.text14'))
        } else {
          this.$fetch.post('/security/google_band', {
            code: this.googleCode
          }).then(res => {
            if (res.success) {
              let toast3 = this.$createToast({
                txt: this.$t('safe.text13'),
                time: 1500,
                type: 'txt'
              })
              toast3.show()
              this.$store.dispatch('getUserBalance')
              this.$router.push({
                path: '/openGoogle'
              })
            } else {
              this.toastM(res.msg)
            }
          })
        }
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
    // margin-top: 1.76rem
    // padding: 0 .4rem
    .secret-container
      margin-top: 1.76rem
      padding-top: .2rem
      .content
        .step-left
          .t-m
            font-size: .28rem
            font-weight: bolder
            color #518ef8
            display: inline-block
            background-color: #eff4f9
            height: .8rem
            line-height: .8rem
            padding: 0 .4rem
            border-radius 0 .4rem .4rem 0
        .c-wrap
          display: flex
          align-items center
          justify-content center
          flex-direction column
          padding: 0 .4rem
          color #000
          margin-top: .8rem;
          .label
            color #bfbfbf
            display: block
            word-break:keep-all;
            white-space:nowrap;
            min-width 1.6rem
            font-size: .3rem
          .input
            font-size: .3rem
            height: 100%
            display: block
            flex 1
            padding-left: .2rem
          .btn-a
            width: 100%
            height: 1rem
            display: flex
            align-items center
            justify-content center
            font-size: .32rem
            border-radius 4px
            margin-bottom: .4rem
          .btn-one
            background-color: #518ef8
            color #fff
            margin-top: 1.6rem
</style>
