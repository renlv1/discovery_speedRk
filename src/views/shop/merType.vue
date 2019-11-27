<template>
  <div class="mer-type">
    <ul>
      <li v-for="(item,index) in arr" :key="item.index" @click="clickItem(index)">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "merType",
  props: {
    arr: {
      type: Array
    }
  },
  methods: {
    clickItem(index) {
      this.$emit('chooseItem', index)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mer-type
  position fixed
  top 60px
  width 100%
  height 100%
  background-color #fff
  z-index 9
  overflow-y auto
  ul
    padding 0 .3rem
    li
      height 1rem
      line-height 1rem
      font-size .32rem
      border-bottom 1px solid #ccc
</style>
