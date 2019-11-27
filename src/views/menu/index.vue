<template>
  <div class="wrapper">
    <div class="menu-content">
      <slot>
        <home-page v-show="tabState === 0"></home-page>
        <bill v-show="tabState === 1"></bill>
        <my v-show="tabState === 2"></my>
      </slot>
    </div>
    <div class="tabs">
      <ul>
        <li v-for="(item, index) in tabList" :key="item.key" @click="chooseItem(index)"
            :class="{active: tabState === index}">
          <div class="icon"></div>
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import home from '../menu.vue'
import billManage from '../billManage/billManage'
import my from './my'
import {share} from "../../api/share"

export default {
  components: {HomePage: home, bill: billManage, my},
  name: "index",
  data() {
    return {
      tabList: this.$t('menu.tabList'),
    }
  },
  created() {
    this.isShare()
  },
  methods: {
    chooseItem(index) {
      this.$store.commit('SET_MENU_FOOT_TAB', index)
    },
    isShare() {
      let address = this.$store.state.address
      share(address).then((res) => {
        if (res.data.data) {
          let shareStatus = res.data.data.status // 状态 0--待审核 1--审核通过  2--暂停服务  3--审核被拒绝  4--被封禁(终止服务)
          this.$store.commit('SET_SHARE_STATUS', shareStatus)
        } else {
          this.$store.commit('SET_SHARE_STATUS', -1)
        }
      })
    },
  },
  computed: {
    tabState() {
      return this.$store.state.footTab
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/css/mixin.styl"
  .wrapper
    height 100vh
    overflow hidden
    .menu-content
      margin-top 0
    .tabs
      width 100%
      height: 1.1rem
      position fixed
      bottom 0
      ul
        width 100%
        height: 100%
        display: flex
        align-items center
        justify-content center
        flex-direction row
        li
          flex 1
          height: 100%
          display flex
          flex-direction column
          justify-content center
          align-items center
          .icon
            background-position center
            background-size cover
            background-repeat no-repeat
          &:nth-child(1)
            .icon
              width .45rem
              height .46rem
              bg-image ("../../assets/img/menu/newMenu/home-noactive")
            &.active
              .icon
                bg-image ("../../assets/img/menu/newMenu/home-active")
          &:nth-child(2)
            .icon
              width .41rem
              height .44rem
              bg-image ("../../assets/img/menu/newMenu/bill-noactive")
            &.active
              .icon
                bg-image ("../../assets/img/menu/newMenu/bill-active")
          &:nth-child(3)
            .icon
              width .46rem
              height .46rem
              bg-image ("../../assets/img/menu/newMenu/my-noactive")
            &.active
              .icon
                bg-image ("../../assets/img/menu/newMenu/my-active")
          span
            padding-top .15rem
            font-size .24rem
          &.active
            color #b79961
</style>
