<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="wrapper-title">{{this.$t('fund.text89')}}</div>
      <div class="value">{{value}}</div>
      <div class="most-value">{{this.$t('fund.text90')}} {{mostValue}} {{this.$t('fund.text91')}}</div>
      <div class="already-num">{{this.$t('fund.text92')}}：{{alreadyNum}} {{this.$t('fund.text93')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getLimit} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "fundDetail",
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('fund.text94'),
      value: '',
      mostValue: '',
      alreadyNum: ''
    }
  },
  mounted() {
    this.getNum()
  },
  methods: {
    getNum() {
      getLimit().then((res) => {
        this.value = res.data.data.havaVoucher
        this.alreadyNum = res.data.data.limitAmount
        this.mostValue = res.data.data.totalLimitAmount
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .wrapper-title
      font-size .24rem
      color #bfbfbf
      margin-bottom .24rem
    .value
      color .3rem
      font-size .5rem
      margin-bottom .6rem
    .most-value
      font-size .24rem
      color #bfbfbf
      padding-bottom .3rem
      border-bottom 1px solid #ccc
    .already-num
      font-size .24rem
      color #b79961
      padding-top .3rem
</style>
