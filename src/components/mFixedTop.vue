<template>
  <div class="fixed-top">
    <div class="goback" v-show="isGoBack" @click="goBack">
      <div class="goback-icon"></div>
    </div>
    <div class="name nowrap" :class="{'padding-left': !isGoBack}">{{titleName}}</div>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {}
  },
  props: {
    titleName: String,
    isGoBack: {
      type: Boolean,
      default: true
    },
    isGoNumber: Boolean
  },
  created() {
    if (/iphone/gi.test(navigator.userAgent)) {
      if (screen.height >= 812) {
        document.documentElement.classList.add('iosx-app')
      } else {
        document.documentElement.classList.add('ios-app')
      }
    }
  },
  methods: {
    goBack () {
      if (this.isGoBack === true && !this.isGoNumber) { // 返回上一页
        this.$router.go(-1)
      } else if (this.isGoBack === true && this.isGoNumber === true) { // 返回指定的页面
        this.$emit('goPath')
      }
      this.$emit('goPathA')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.iosx-app
  .fixed-top
    padding-top: 40px
.ios-app
  .fixed-top
    padding-top: 20px

.fixed-top
  position: fixed;
  width: 100%;
  top: 0
  left: 0;
  z-index: 99;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 0.34rem;
  color #000
  background: #fff;
  box-sizing content-box
  .goback
    box-sizing border-box
    padding: .3rem
    position: absolute;
    left: 0;
    bottom: 0
    height: .88rem
    .goback-icon
      height: .28rem;
      width: .36rem;
      background: url("../assets/img/order/back.svg") no-repeat center / cover
</style>
