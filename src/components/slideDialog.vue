<template>
  <div>
    <transition name="dialog">
      <div class="dialog"  @click="hide" v-show="merchantShow">
      </div>
    </transition>
    <transition name="fade-up">
      <div class="dialog-w" v-show="merchantShow" @click="hide">
        <div @click.stop>
          <ul class="uls">
            <li v-for="(item, index) in merchantsType" :key="index" class="list" @click="switchOne(item, index)">{{item}}</li>
          </ul>
          <div class="cancel" @click="hide">{{$t('notMerchant.text69')}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {}
  },
  props: {
    merchantShow: Boolean,
    merchantsType: Array
  },
  methods: {
    hide () {
      this.$emit('hideDialog')
    },
    switchOne (item, index) {
      this.$emit('selectOne', item, index)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 100
    background-color: rgba(2,5,13, .6)
    &.dialog-enter-active, &.dialog-leave-active
      transition: all .2s linear;
    &.dialog-enter, &.dialog-leave-to
      opacity: 0
    &.dialog-enter-to, &.dialog-leave
      opacity: 1
  .dialog-w
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    padding: 0 .2rem .2rem
    z-index: 200
    transform translate3d(0,0,0)
    &.fade-up-enter-active, &.fade-up-leave-active
      transition: all .3s linear;
    &.fade-up-enter, &.fade-up-leave-to
      transform translate3d(0,100%,0)
    &.fade-up-enter-to, &.fade-up-leave
      transform translate3d(0,0,0)
    .uls
      border-radius 6px
      background-color: #fff
      .list
        cursor pointer
        width: 100%
        height: 1.2rem
        display: flex
        align-items center
        justify-content center
        color #060f26
        font-size: .28rem
        border-bottom: 1px solid #dfdfdf
        &:last-child
          border-bottom: none
    .cancel
      cursor pointer
      border-radius 6px
      margin-top: .2rem
      width: 100%
      height: 1.2rem
      background-color: #fff
      color #999999
      font-size: .28rem
      line-height 1.2rem
      text-align center
</style>
