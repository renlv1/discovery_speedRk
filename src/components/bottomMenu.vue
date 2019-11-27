<template>
  <div class="tabs">
    <ul>
      <li v-for="(item, index) in tabList" :key="item.key" @click="chooseItem(index)"
          :class="{active: tabState === index}">
        <div class="icon"></div>
        <span>{{item}}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      tabList: this.$t('findBao.text53'),
      titleName: this.$t('findBao.text52')
    }
  },
  props: {
    tabState: {
      type: Number,
      default: 0
    }
  },
  methods: {
    chooseItem(index) {
      if (index === 0) this.$router.push('/findTreasure')
      if (index === 1) this.$router.push('/myFindTreasure')
      if (index === 2) this.$router.push('/findMy')
    }
  },
}
</script>

<style scoped lang="stylus">
  @import "../assets/css/mixin.styl"
  .iosx {
    .tabs {
      height: 1.6rem !important
    }
      ul {
        padding-top 10px !important
        height: 1.4rem !important
        justify-content flex-start !important
        li {
          justify-content flex-start !important
        }
    }
  }

  .tabs
    width 100%
    height: 1.1rem
    position fixed
    bottom 0
    background-color: #fff
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
          width .5rem
          height .5rem
        &:nth-child(1)
          .icon
            bg-image ("../../assets/img/find/find-normal")
          &.active
            .icon
              bg-image ("../../assets/img/find/find-active")
        &:nth-child(2)
          .icon
            bg-image ("../../assets/img/find/findmap-normal")
          &.active
            .icon
              bg-image ("../../assets/img/find/findmap-active")
        &:nth-child(3)
          .icon
            bg-image ("../../assets/img/find/my-normal")
          &.active
            .icon
              bg-image ("../../assets/img/find/my-active")
        span
          padding-top .15rem
          font-size .24rem
        &.active
          color #b79961
</style>
