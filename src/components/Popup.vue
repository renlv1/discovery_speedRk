<template>
  <!-- 底部弹窗层组件 -->
  <div>
    <!-- 弹出层 -->
    <div :class="{'CustomPopup':showCustomPopup}"></div>
    <div class="CustomPopupContent " :class="{'CustomPopupContentShow':showCustomPopup}">
      <slot name="PoperContent"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'commonPopup',
  data() {
    return {
      showCustomPopup: false,
    }
  },
  methods: {
    showCustom() {
      this.showCustomPopup = true
    },
    closeCustom() {
      this.showCustomPopup = false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .iosx {
    .CustomPopupContent {
      bottom 20px
    }
  }

  .CustomPopupContent
    position fixed
    bottom 10px
    left 10px
    right 10px
    transition all 0.3s ease
    transform translateY(110%)
    z-index 3000
    text-align center

  .CustomPopupContentShow
    transform: translateY(-40%)
</style>
