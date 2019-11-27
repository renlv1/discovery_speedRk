<template>
  <ul>
    <li class="item" v-for="item in cityData" :key="item.index" @click="chooseItem(item)">
      <span>{{item.code}}</span>
      <span>{{item.value}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      titleName: this.$t('chooseArea.title'),
      cityData: this.$mockData
    }
  },
  mounted() {
    // console.log(this.$mockData)
    // this._loadData()
  },
  methods: {
    chooseItem(item) {
      this.$emit('chooseItem', item)
    },
    _loadData() {
      this.$axios.get('/areaCode/list').then((res) => {
        if (res.data.errno === 0) {
          this.cityData = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  ul
    width 100%
    position absolute
    top 80px
    padding 0 .3rem
    background-color #fff
    .item
      height 1rem
      line-height 1rem
      font-size .3rem
      display flex
      justify-content space-between
      border-bottom 1px solid #e9e9e9
</style>
