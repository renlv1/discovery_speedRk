<template>
  <div>
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="softfj">
      <div class="list">
        <div class="li" :class="{'activeLi': merTypeIndex === index }" @click="classiFication(index)"
             v-for="(item,index) in $t('shops.classifyData')" :key="index">{{item}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  name: "filterDom",
  components: {mFixedTop},
  data() {
    return {
      merTypeIndex: this.$route.query.merType,
      titleName: '筛选',
    }
  },
  methods: {
    classiFication(index) {
      this.merTypeIndex = index
      this.$router.push({
        path: '/pay',
        query: {
          merType: index
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .softfj {
    width: 100%;
    height: auto;
    .list {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      flex-flow: wrap;
      flex-direction: row;
      justify-content: flex-start;
      padding-left: 0.3rem;
      .li {
        width: 2.18rem;
        height: 0.6rem;
        line-height: 0.6rem;
        background-color: #f5f5f5;
        margin-right: 0.18rem;
        margin-bottom: 0.3rem;
        border-radius: 0.04rem;
        text-align: center;
        color: #999;
        font-size: 0.24rem;
        &.activeLi {
          background-color: #3495f1;
          color: #fff;
        }
      }
    }
  }
</style>
