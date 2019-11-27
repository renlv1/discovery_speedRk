<template>
  <div id="app">
    <!-- 全局loading -->
    <!--<div class="v-loading" v-show="$store.state.loading">-->
    <!--<cube-loading></cube-loading>-->
    <!--</div>-->
    <!--<transition :name="$store.state.slideMode ? 'slideNext' : 'slidePrev'">-->
    <!--<router-view class="main-container" />-->
    <!--</transition>-->

    <router-view class="main-container" />

  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
  },
  created() {

    if (this.$route.path !== '/login') {
      this.$store.dispatch('getUserBalance')
    }

    // 解决vuex刷新数据丢失
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })

  },
  beforeUpdate() {
    if (parseInt(this.$route.query.languageType) === 1) { // 隐藏从iOS客户端进入H5后首页的返回icon
      localStorage.setItem('discoveryLang', 'CN')
    } else if (parseInt(this.$route.query.languageType) === 2) {
      localStorage.setItem('discoveryLang', 'EN')
    }
  }
}
</script>

<style lang="stylus">
  @import 'assets/css/reset.css';
  @import 'assets/css/tradeOrder.styl';
  @import 'assets/css/base.styl';
  @import "assets/css/transition.styl";
  @import "assets/css/cube-ui.styl"; // 重置cube-ui样式
  .slidePrev-leave,
  .slidePrev-leave-to {
    z-index: 9999;
  }
  body {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  /*兼容iphoneX*/
  /*判断是否是iphoneX，使用@media 媒体查询尺寸*/
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    body {
      top: constant(safe-area-inset-top);
      bottom: constant(safe-area-inset-bottom);
      left: constant(safe-area-inset-left);
      right: constant(safe-area-inset-right);
    }
    .mer-type{
      top 75px!important
    }
    .common-btn{
      height 1.3rem!important
    }
    .btn-men{
      height 1.3rem!important
    }
    .btn-b{
      /*line-height 1.3rem!important*/
    }
    .btn-detail{
      /*line-height 1.3rem!important*/
    }
    .confirm-order{
      margin-top -10px
    }
    .footer {
      height: 1.3rem!important;
    }
    .wrap-shopping{
      padding-top 1.6rem
    }
  }
  .slidePrev-leave-to {
    transform: translateX(100%);
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }

  .slidePrev-enter,
  .slideNext-leave-to {
    transform: translateX(-100%);
  }

  .slideNext-enter {
    transform: translateX(100%);
  }

  .slidePrev-leave-to,
  .slidePrev-enter-to,
  .slideNext-enter-to,
  .slideNext-leave-to {
    transition: transform .35s;

  }

  .slideNext-enter-to,
  .slidePrev-leave-to {
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }

  [class*="slidePrev"].main-container,
  [class*="slideNext"].main-container {
    min-height: 100vh;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
