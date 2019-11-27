<template>
  <div class="shaer-footer-wrap">
    <ul class="list" :class="{isIosx: iosx}">
      <li :class="{'active': activeIndex === index}" class="li" v-for="(item,index) in navDatas" :key="index" @click="tabChange(index)">
        <div class="icon"><i></i></div>
        <div class="text">{{item.text}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        activeIndex: this.$store.state.currentShareStatusFooter,
        navDatas: this.$t('sharer.sharerFooter.navDatas'),
        iosx: false
      }
    },
    components: {},
    computed: {
      ...mapGetters([
        'isboss',
      ]),
      tabShareState() {
        return this.$store.state.currentShareStatusFooter
      }
    },
    created() {
      if (/iphone/gi.test(navigator.userAgent)) {
        if (screen.height >= 812) {
          this.iosx = true
        } else {
          this.iosx = false
        }
      }
    },
    beforeDestroy() {
    },
    destroyed() {
    },
    methods: {
      tabChange(index) {
        this.activeIndex = index

        this.$store.commit('SET_CURRENT_SHARE_STATUS_FOOTER', index)


        this.$emit('changeIndex', index)
        // this.activeIndex = index
        // if (index === 2) {
        //   if (this.isboss === 1) { //是boss
        //     this.$router.push({path: item.path})
        //   } else {
        //     Dialog({
        //       title: this.$t('sharer.sharerFooter.title'),
        //       type: 'confirm',
        //       okText: this.$t('sharer.sharerFooter.text1'),
        //       okFn: () => {
        //         this.$router.push('/申请共享者页面')
        //       }
        //     })
        //   }
        // }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  .shaer-footer-wrap{
    width: @width;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    .list{
      width: @width;
      height: 66px;
      padding: 0 .4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .li{
        flex: 1;
        height: 100%;
        &.is-active{
          color: #b79961;
          &:nth-child(1){
            .icon{
              i{
                background: url("../assets/img/common/nav-active-li01.svg") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          &:nth-child(2){
            .icon{
              i{
                background: url("../assets/img/common/nav-active-li02.svg") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          &:nth-child(3){
            .icon{
              i{
                background: url("../assets/img/common/nav-active-li03.svg") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
        }
        &.active{
          color: #b79961;
          &:nth-child(1){
            .icon{
              i{
                background: url("../assets/img/common/nav-active-li01.svg") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          &:nth-child(2){
            .icon{
              i{
                background: url("../assets/img/common/nav-active-li02.svg") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          &:nth-child(3){
            .icon{
              i{
                background: url("../assets/img/common/nav-active-li03.svg") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
        }
        .icon{
          margin-bottom: 10px;
          margin-top: 10px;
          i{
            display: block;
            width: .34rem;
            height: .4rem;
            background-color: #bfbfbf;
            background-size: 100% 100%;
            margin: auto;
          }
        }
        .text{
          font-size: .24rem;
          text-align: center;
        }
        /*&.is-active{
          color: #b79961;
        }*/
        &:nth-child(1){
          i{
            background: url("../assets/img/common/nav-de-li01.svg") no-repeat center;
            background-size: 100% 100%;
          }
        }
        &:nth-child(2){
          i{
            background: url("../assets/img/common/nav-de-li02.svg") no-repeat center;
            background-size: 100% 100%;
          }
        }
        &:nth-child(3){
          i{
            background: url("../assets/img/common/nav-de-li03.svg") no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .isIosx{
      margin-bottom: 20px;
    }
  }
</style>
