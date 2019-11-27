<template>
  <div class="menu">
    <div class="v-content-wrapper">
      <div class="menu-header">
        <h5>{{this.$t('menu.homeTitle')}}</h5>
      </div>
      <div class="top-menu">
        <h5>{{this.$t('menu.homeSubTitle.text1')}}</h5>
        <ul>
          <li class="item" v-for="item in topMenuList" :key="item.index" @click="toPath(item)">
            <img :src="item.picUrl" />
            <h5>{{item.title}}</h5>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="bottom-menu">
        <h5>{{this.$t('menu.homeSubTitle.text2')}}</h5>
        <ul>
          <li class="item" v-for="item in bottomMenuList" :key="item.index" @click="toPath(item)">
            <img :src="item.picUrl" />
            <h5>{{item.title}}</h5>
          </li>
        </ul>
      </div>
      <!-- 弹窗 -->
      <confirm :confirmModalOptions="confirmCancelOptions" ref="loginOut"></confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import {mapGetters} from 'vuex'
import confirm from '@/components/VDialog/VDialog'

export default {
  components: {confirm},
  data() {
    return {
      avatar: `${this.$api}` + `file/img?type=user&size=2&id=`,// 头像地址前缀
      topMenuList: [
        {
          picUrl: require('../assets/img/menu/top_up.svg'),
          title: this.$t('menu.home.text1'),
          link: '/topUp'
        },
        {
          picUrl: require('../assets/img/menu/withdrawal.svg'),
          title: this.$t('menu.home.text2'),
          link: '/withdrawDeposit'
        },
        {
          picUrl: require('../assets/img/menu/transfer.svg'),
          title: this.$t('menu.home.text3'),
          link: '/transfer'
        },
        {
          picUrl: require('../assets/img/menu/market.svg'),
          title: this.$t('menu.home.text4'),
          link: '/market'
        }
      ],
      bottomMenuList: [
        {
          picUrl: require('../assets/img/menu/center.svg'),
          title: this.$t('menu.home.text5'),
          link: '/voteCenter'
        },
        {
          picUrl: require('../assets/img/menu/bill.svg'),
          title: this.$t('menu.home.text6'),
          link: '/bill'
        },
        {
          picUrl: require('../assets/img/menu/security_settings.svg'),
          title: this.$t('menu.home.text7'),
          link: '/safeSetting'
        },
        {
          picUrl: require('../assets/img/menu/cang.png'),
          title: this.$t('menu.home.text8'),
          link: '/treasure'
        },
        {
          picUrl: require('../assets/img/menu/find.png'),
          title: this.$t('menu.home.text9'),
          link: '/findTreasure'
        },
        {
          picUrl: require('../assets/img/fund/fund.png'),
          title: this.$t('menu.home.text10'),
          link: '/paiFund'
        },
        {
          picUrl: require('../assets/img/fund/quan.png'),
          title: this.$t('menu.home.text11'),
          link: '/selfHelp'
        },
        {
          picUrl: require('../assets/img/fund/wallet.png'),
          title: this.$t('menu.home.text12'),
          link: '/payWallet'
        },
        {
          picUrl: require('../assets/img/fund/yuBao.png'),
          title: this.$t('yuBao.text1'),
          link: '/yuBao'
        },
        {
          picUrl: require('../assets/img/fund/paiPay.png'),
          title: 'π付',
          link: '/pay'
        },
      ],
      nav: [
        {title: this.$t('menu.home.text13'), img: require('../assets/img/menu/wallet.svg'), link: '/wallet'},
        {title: this.$t('menu.home.text14'), img: require('../assets/img/menu/order_management.svg'), link: '/billManage/billManage'}
      ],
      confirmCancelOptions: {
        title: "",
        message: this.$t('menu.home.text15'), //提示
        confirmCancel: () => {
          this.$refs.loginOut.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this.logout()
          this.$refs.loginOut.closeModel()
        },
      },
    }
  },
  methods: {
    toPath(item) {
      if (item.link.includes('voteCenter')) {
        this.$store.commit('SET_TAB_RECORD', {
          head: 0,
          foot: 0
        })
      } else if (item.link.includes('topUp') || item.link.includes('withdrawDeposit')) {
        this.$store.commit('SET_CURRENT_COIN', 'USD')
        this.$store.commit('TOP_UP_AMOUNT', '')
        this.$store.commit('SET_ACCOUNT_BANK_ID', '')
        this.$store.commit('SET_CURRENT_COIN_INDEX', 0)
        this.$store.commit('SET_BANK_ID', this.$t('topUp.inputTip.text2'))
        this.$store.commit('SET_ACCOUNT_NUMBER', '')
      }
      this.$router.push(item.link)
    },
    openDialog() {
      this.menuFlag = false
      this.$refs.loginOut.showModel()
    },
    logout() {
      this.$fetch.get('/user/logout').then(res => {
        if (res.success) {
          this.$router.push('/login')
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'address',
      'email',
      'userName'
    ])
  }
}
</script>

<style scoped lang="stylus">
  .menu
    display: flex
    align-items center
    justify-content center
    flex-direction column
    .v-content-wrapper
      padding-top 0
      .menu-header
        position relative
        display flex
        flex-direction row
        justify-content center
        align-items center
        height .88rem
        margin-bottom .8rem
        // border 1px solid #ccc
        // box-shadow 0px 3px 3px 0px #e6e6e64d
        .avatar
          left 0
          position absolute
          width .7rem
          height .7rem
          border-radius 50%
          background-color #ccc
        h5
          font-family "微软雅黑 Light"
          font-weight bolder
          text-align center
          font-size .4rem
          a, div
            display: block
            width: 80%
            height: 0.8rem;
            border-radius: 0.4rem;
            font-size: 0.26rem;
            color: #fff;
            text-align: center;
            line-height: 0.8rem;
            background-color: #24a0ff;
            margin-bottom: .3rem
      .top-menu, .bottom-menu
        h5
          padding 0 .3rem
          color #999
          font-size .3rem
        ul
          display flex
          flex-direction row
          flex-wrap wrap
          margin-top .4rem
          .item
            display flex
            align-items center
            flex-direction column
            width 25%
            margin-bottom .8rem
            img
              width .6rem
              height .4rem
              margin-bottom .2rem
            h5
              padding 0
              font-size .24rem
              color #000
              text-align center
      .top-menu
        ul
          .item
            flex 1
      .bottom-menu
        margin-top .5rem
        ul
          .item
            width 25%
            img
              width .47rem
              height .47rem
      .line
        width 100%
        height 1px
        background-color #e6e6e6
      .menuMask
        width 100%
        height 100%
        position fixed
        left 0
        bottom 0
        background-color rgba(0, 0, 0, 0.6)
        display none
        z-index 98
        &.activeMask
          display block
      .popoverMenu
        width 5rem
        position fixed
        top 0
        left -5rem
        background-color #fff
        overflow hidden
        height 100%
        transition all .2s linear
        &.activeMenu
          position fixed
          transition all .2s linear
          top 0
          left 0
          height 100%
          box-shadow 5px 0px 20px rgba(0, 0, 0, 0.6)
          z-index 9999
        .close
          i
            margin 1.15rem 0 1rem .6rem
            display block
            width .38rem
            height .38rem
            background url("../assets/img/common/close.svg") no-repeat
            background-size cover
        .user-info
          display flex
          flex-direction row
          align-items flex-start
          .avatar
            width 1rem
            height 1rem
            border-radius 4px
            margin 0 .3rem 1rem .4rem
          .info-right
            height 1rem
            line-height .5rem
            font-size 0
            h5
              font-size .32rem
              color #000
            p
              width 86%
              line-height 1.1
              word-wrap break-word
              font-size .28rem
              color #bfbfbf
        .phoneNav
          .phoneNav-li
            margin 0 .4rem
            height 1.2rem
            line-height 1.2rem
            display flex
            justify-content space-between
            align-items center
            border-bottom 1px dotted #000
            .li-left
              display flex
              align-items center
              img
                margin-right .32rem
                width .38rem
                height .32rem
              span
                font-size .3rem
            .li-right
              img
                width .38rem
                height .32rem
        .btn
          position absolute
          bottom .8rem
          width 80%
          margin 0 .4rem
          height 1rem
          line-height 1rem
          text-align center
          background-color #faf0f1
          font-size .3rem
          border-radius 4px
          user-select none
          color #ff5160
</style>
