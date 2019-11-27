<template>
  <transition name="safeDialog">
    <div class="dialog-w dialog-safe-w" v-show="visible">
      <div class="dialog-safe">
        <div class="close" @click="visible = false">
          <div class="close-icon">
            <img src="../img/close_2.png"/>
          </div>
        </div>
        <div class="dialog-title">{{title}}</div>
        <div class="g-dialog-content" :style="{textAlign: align}">{{content}}</div>
        <div class="g-dialog-btn-wrap">
          <div v-if="type !== 'alert'" class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{cancelText}}</div>
          <div class="comfirm g-dialog-btn" @click="okCallback">{{okText}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  props: {
    type: String,
    title: String,
    content: String,
    msg: String,
    okFn: Function,
    okText: String,
    cancelFn: Function,
    cancelText: String,
    align: String
  },
  methods: {
    okCallback () {
      this.visible = false
      this.okFn && this.okFn()
    },
    cancelCallback() {
      this.visible = false
      this.cancelFn && this.cancelFn()
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
      width: 6rem
      background-color: #fff
      position: relative
      border-radius 4px
      color #17161f
      font-size: .28rem;
      transform: translate(0, 0)
      padding: 0 .4rem
      .close
        position absolute
        right 10px
        top 8px
        .close-icon
          img
            width 12px
            height 12px
      .dialog-title
        font-size: .3rem
        font-weight: bold
        color #17161f
        padding: .4rem 0 .3rem
        text-align: center
      .g-dialog-content
        font-size: .3rem;
        color: #17161f;
        margin-bottom .3rem
        line-height 1.2
      .g-dialog-btn-wrap
        display: flex
        align-items center
        justify-content center
        border-top: 1px dashed #000
      .form-item
        margin-bottom: .4rem
        .label
          margin-bottom: .2rem
        .input
          width: 100%
          height: .8rem
          border-radius .4rem
          background-color: #f5f6fa
          padding: 0 .3rem
          color #17161f
      .err-ms
        color: #ff151d;
        text-align: center;
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
        flex 1
        height: 1rem
        display: flex
        align-items center
        justify-content center
      .comfirm
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
        color #b79961
</style>
