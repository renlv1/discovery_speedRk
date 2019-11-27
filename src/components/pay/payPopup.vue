<template>
  <!-- 支付弹窗 -->
  <transition name="mask-bg-fade">
    <div class="mask" v-show="show">
      <div class="mask_bg"></div>
      <transition name="slide-fade">
        <div class="modelBox" v-show="show">
          <div class="tipIcon" v-on:click="closeModel()"></div>
          <div class="closeModel" v-on:click="closeModel()"></div>
          <p class="title">{{title}}</p>
          <p class="text">{{$t('categories.text7')}}</p>
          <div class="model_inputBox">
            <!--            <slot name="InputBox"></slot>-->
            <input @blur="fixCompatible" :placeholder="$t('verify.text2')" v-model="getPasswordVal" type="password" />
            <input @blur="fixCompatible" :placeholder="$t('verify.text3')" v-model="getCodeVal" type="number" />
          </div>
          <p class="errMsg">{{errMsg}} </p>
          <div class="btn" @click="submitPayFrom">{{$t('categories.text8')}}</div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "payDialog",
    props: {
      title: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        getPasswordVal: '',
        getCodeVal: '',
        errMsg: '',
        show: false,   // 是否显示模态框
      }
    },
    methods: {
      fixCompatible() {
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
      },
      submitPayFrom() {
        this.errMsg = ''
        if(this.getPasswordVal === '' || this.getCodeVal === '') {
        this.errMsg = this.$t('categories.text9')
          return
        }

        this.$emit('paySubmit')
      },
      closeModel() {
        this.show = false;
        this.getPasswordVal = ''
        this.getCodeVal = ''
        this.errMsg = ''
      },
      showModel() {
        this.show = true;
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .mask
    .mask_bg
      height 100%
      position fixed
      z-index 1000
      top 0
      right 0
      left 0
      bottom 0
      background rgba(0, 0, 0, 0.6)
    .modelBox
      width 85%
      position fixed
      left 50%
      top 50%
      transform translate(-50%, -50%)
      z-index 3000
      background-color #fff
      border-radius 5px
      .tipIcon
        position absolute
        right 0.3rem
        top 0.35rem
        width 0.22rem
        height 0.22rem
        background-image url("../../assets/img/common/delete.png")
        background-size cover
      .title
        text-align center
        font-size 0.34rem
        color #060f26
        margin-top 0.58rem
      .message
        font-size 16px
        text-align center
        margin 50px auto 42px
        width 80%
        color #1a1a1a
        line-height 1.5
      .text
        width 100%
        padding 0 15px
        margin-top 25px
        font-size 13px
        color #060f26
        line-height 18px
        text-align center
      .model_inputBox
        margin 0 auto
        width 90%
      .btn
        margin 30px auto
        width 90%
        height 0.7rem
        line-height 0.7rem
        font-size 0.28rem
        color #fff
        text-align center
        background-color #ffb64b
        border-radius 4px
        margin-bottom 0.4rem
  input
    width 100%
    height 0.7rem
    border 1px solid #ebebeb
    border-radius 4px
    color #060f26
    font-size 0.3rem
    margin-top 0.45rem
    padding-left 0.25rem

  input::-webkit-input-placeholder { /* 使用webkit内核的浏览器 */
    color #b3b3b3
    font-size 0.3rem
  }

  input::-moz-placeholder { /* Firefox版本4-18 */
    color #b3b3b3
    font-size 0.3rem
  }

  input::-moz-placeholder { /* Firefox版本19+ */
    color #b3b3b3
    font-size 0.3rem
  }

  input::-ms-input-placeholder { /* IE浏览器 */
    color #b3b3b3
    font-size 0.3rem
  }
  .errMsg {
    color red
    padding-left 0.25rem
    margin-top 0.3rem
    font-size .26rem
  }
</style>
