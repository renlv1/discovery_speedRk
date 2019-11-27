<template>
  <div class="v-content-wrapper">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <img src="./images/share.svg" />
    <p>{{$t('sharePeople.description')}}</p>
    <div class="btn" v-waves @click="toOpen">{{$t('sharePeople.openText')}}</div>
    <ul>
      <li class="item" v-for="item in openShareList" :key="item.index">
        <div class="li-left">
          <img :src="item.imgUrl" />
        </div>
        <div class="li-right">
          <h5>{{item.title}}</h5>
          <p class="description">{{item.description}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import waves from '@/dircetive/waves/waves' // 水波纹指令

export default {
  components: {mFixedTop},
  directives: {waves},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('sharePeople.title'),
      openShareList: [
        {
          imgUrl: require('./images/conditions.svg'),
          title: this.$t('sharePeople.list.title1'),
          description: this.$t('sharePeople.list.description1'),
        },
        {
          imgUrl: require('./images/process.svg'),
          title: this.$t('sharePeople.list.title2'),
          description: this.$t('sharePeople.list.description2'),
        },
        {
          imgUrl: require('./images/back.svg'),
          title: this.$t('sharePeople.list.title3'),
          description: this.$t('sharePeople.list.description3'),
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.formApp) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
    }
  },
  methods: {
    goPath() {
      this.$router.push('/menu')
    },
    toOpen() { // 前往开通列表
      let status = this.$store.state.shareStatus
      if (status === -1) {
        this.$store.commit('SET_SHARE_NAME', '')
        this.$store.commit('SET_SHARE_ADDRESS', '')
        this.$store.commit('SET_SHARE_PHONE_NUMBER', '')
        this.$store.commit('SET_SHARE_GUARANTOR', '')
        this.$store.commit('SET_SHARE_RECHARGE_FREE', '')
        this.$store.commit('SET_SHARE_WITHDRAW_FREE', '')
        this.$store.commit('SET_SHARE_ACCOUNT_TYPE', '')
        this.$store.commit('SET_SHARE_ACCOUNT', '')
      }
      this.$router.push('/notOpenShare/apply')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    display flex
    flex-direction column
    align-items center
    img
      width 2.19rem
      height 2.37rem
    p
      margin .8rem 0
      font-size .28rem
      line-height 1.5
      text-align center
    .btn
      background-color #d9f1ff
      font-size .3rem
      width 100%
      height 1rem
      line-height 1rem
      text-align center
      border-radius 4px
    ul
      margin-top .8rem
      .item
        display flex
        flex-direction row
        align-items flex-start
        font-size 0 // 用于消除默认的边距
        .li-left
          margin-right .2rem
          img
            width .35rem
            height .35rem
        .li-right
          h5
            font-size .28rem
          .description
            margin .3rem 0 .8rem
            text-align left
            font-size .24rem
            line-height 1.5
            color #999
</style>
