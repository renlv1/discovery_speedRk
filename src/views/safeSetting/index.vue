<template>
  <div class="secret-wrapper">
    <div class="secret-container">
      <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
      <div class="safe-v">
        <div class="flex-item" @click="settingTrade">
          <div class="flex">
            <div class="icon-img">
              <img src="../../assets/img/safeSetting/safe.svg" alt="">
            </div>
            <span>{{$t('safe.text30')}}</span>
          </div>
          <div class="flex">
            <span class="right setting" v-if="userData.openTradePassword === 2">{{$t('safe.text31')}}</span>
            <span class="right" v-else>{{$t('safe.text32')}}</span>
            <div class="more">
              <img src="../../assets/img/common/right_more.svg" alt="">
            </div>
          </div>
        </div>
        <div class="flex-item" @click="gogleClick">
          <div class="flex">
            <div class="icon-img">
              <img src="../../assets/img/safeSetting/gogle.svg" alt="">
            </div>
            <span>{{$t('safe.text11')}}</span>
          </div>
          <div class="flex">
            <span class="right setting" v-if="userData.openGoogleCode === 2">{{$t('safe.text31')}}</span>
            <span class="right" v-else>{{$t('safe.text32')}}</span>
            <div class="more">
              <img src="../../assets/img/common/right_more.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Dialog from '@/components/dialog'
  export default {
    data () {
      return {
        isGoBack: true,
        gogleShow: false,
        titleName: this.$t('safe.text34')
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    mounted () {
      // this.$store.dispatch('getUserBalance')
      if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
        this.isGoBack = false
        this.$store.commit('IS_IOS', true)
      } else {
        this.isGoBack = true
      }
    },
    methods: {
      goPath() {
        this.$router.push('/menu')
      },
      // 谷歌验证跳转
      gogleClick () {
        if (this.userData.openTradePassword !== 2) {
          Dialog({
            msg: this.$t('safe.text33'),
            okText: this.$t('safe.text35'),
            okFn: () => {
              this.$router.push('/safeCode')
            }
          })
        } else {
          if (this.userData.openGoogleCode === 2) {
            this.$router.push('/openGoogle') // 已开启页面
          } else if (this.userData.openGoogleCode === 1) {
            this.$router.push('/notGoogle') // 未绑定谷歌
          } else if (this.userData.openGoogleCode === 3) {
            this.$router.push('/notOpenGoogle') // 已关闭页面
          }
        }
      },
      // 安全密码设置跳转
      settingTrade () {
        let TradePassword = this.userData.openTradePassword
        if (TradePassword === 1 || TradePassword === 3 || this.userData.openGoogleCode !== 2) {
          this.$router.push({path: '/safeCode', query: {password: 1}})
        } else if (TradePassword === 2) {
          this.$router.push({path: '/safeCode', query: {password: 2}})
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
    padding: 1.76rem .4rem 0
  .safe-v
    .flex-item
      display flex
      justify-content space-between
      align-items center
      width: 100%;
      font-size: .28rem
      color #000
      height: 1.2rem
      border-bottom: 1px solid #e6e6e6
      .flex
        display: flex
        align-items center
      .icon-img
        width: .44rem
        height: .44rem
        display: block
        margin-right: .2rem
      .more
        width: .25rem
        height: .25rem
        display: block
      .right
        color #7d7e80
        cursor pointer
        margin-right: .1rem
        &.setting
          color #00d563
      .icon
        cursor pointer
        width: .24rem
        height: .19rem
        display block
</style>
