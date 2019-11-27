<template>
  <div class="v-content-wrapper">
    <mFixedTop :titleName="titleName" :isGoBack="false"></mFixedTop>
    <div class="user-info">
      <img class="avatar" :src="avatar + address" :onerror="defaultImg"/>
      <div class="info-right">
        <h5>{{userName}}</h5>
        <p>{{email}}</p>
      </div>
    </div>
    <div class="line"></div>
    <ul class="phoneNav">
      <li class="phoneNav-li" v-for="(item, index) in nav" :key="index"
          @click="toPath(item, index)">
        <div class="li-left">
          <img :src="item.img" />
          <span>{{item.title}}</span>
        </div>
        <div class="li-right">
          <img src="../../assets/img/menu/row.svg">
        </div>
      </li>
    </ul>
    <div class="btn" @click="openDialog">{{this.$t('common.loginOut.text2')}}</div>

    <!-- 弹窗 -->
    <confirm :confirmModalOptions="confirmCancelOptions" ref="loginOut"></confirm>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import confirm from '@/components/VDialog/VDialog'
import {mapGetters} from 'vuex'
export default {
  components: {mFixedTop, confirm},
  data() {
    return {
      avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
      defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
      titleName: this.$t('menu.my.fixTopTitle'),
      nav: [
        {title: this.$t('menu.my.menu.text1'), img: require('@/assets/img/menu/wallet.svg'), link: '/wallet'},
        {title: this.$t('menu.my.menu.text4'), img: require('@/assets/img/menu/faction.png'), link: '/faction'},
        {title: this.$t('menu.my.menu.text2'), img: require('@/assets/img/menu/trading.svg'), link: '/accountManagement'},
        {title: this.$t('menu.my.menu.text3'), img: require('@/assets/img/menu/share.svg'), link: '/sharer'}
      ],
      confirmCancelOptions: {
        title: "",
        message: this.$t('common.loginOut.text1'), //提示
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
      this.$router.push(item.link)
    },
    openDialog() {
      this.$refs.loginOut.showModel()
    },
    logout() {
      this.$fetch.get('/user/logout').then(res => {
        if (res.success) {
          this.$store.commit('SET_TOKEN', undefined)
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
  .v-content-wrapper
    .user-info
      display flex
      flex-direction row
      align-items flex-start
      .avatar
        width 1rem
        height 1rem
        border-radius 4px
        margin 0 .3rem .6rem 0
      .info-right
        height 1rem
        line-height .5rem
        font-size 0
        h5
          font-size .32rem
          color #000
        p
          width 100%
          line-height 1.1
          word-wrap break-word
          font-size .28rem
          color #bfbfbf

    .line
      overflow hidden
      border-bottom 1px dotted #000
    .phoneNav
      .phoneNav-li
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
      position fixed
      bottom 1.4rem
      width 90%
      height 1rem
      line-height 1rem
      text-align center
      background-color #faf0f1
      font-size .3rem
      border-radius 4px
      user-select none
      color #ff5160
</style>
