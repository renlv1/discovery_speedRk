<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <ul>
        <li>
          <span>{{this.$t('fund.text49')}}</span>
          <span>{{detailObj.id}}</span>
        </li>
        <li>
          <span>{{this.$t('fund.text50')}}</span>
          <span>{{transType(detailObj.eType)}}</span>
        </li>
        <li>
          <span>{{this.$t('fund.text51')}}</span>
          <span>{{$changeDate(detailObj.createAt, '-')}}</span>
        </li>
        <li>
          <span>{{this.$t('fund.text52')}}</span>
          <span>{{detailObj.price}} π</span>
        </li>
        <li>
          <span>{{this.$t('fund.text53')}}</span>
          <span>{{detailObj.amount}}</span>
        </li>
        <li>
          <span>{{this.$t('fund.text54')}}</span>
          <span>{{detailObj.tradeAmount}}</span>
        </li>
        <li>
          <span>{{this.$t('fund.text55')}}</span>
          <span>{{detailObj.turnover}} π</span>
        </li>
        <li>
          <span>{{this.$t('fund.text56')}}</span>
          <span>{{finishState(detailObj.finishState)}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {fundEntrustList, entrustList} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "orderDetail",
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('fund.text57'),
      detailObj: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    finishState(type) {
      let typeText = ''
      if (type === 1) {
        typeText = this.$t('fund.text58')
      } else {
        typeText = this.$t('fund.text59')
      }
      return typeText
    },
    transType(type) {
      let typeText = ''
      if (type === 1) {
        typeText = this.$t('fund.text60')
      } else {
        typeText = this.$t('fund.text61')
      }
      return typeText
    },
    getDetail() {
      let id = this.$route.query.id
      if (this.$route.query.flag) {
        entrustList(1, 10, id, '').then((res) => {
          if (res.data.data.results && res.data.data.results[0]) {
            this.detailObj = res.data.data.results[0]
          }
        })
      } else {
        fundEntrustList('', '', id, '').then((res) => {
          if (res.data.data && res.data.data[0]) {
            this.detailObj = res.data.data[0]
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    ul
      li
        font-size .28rem
        border-bottom 1px solid #ccc
        height 1.2rem
        display flex
        align-items center
        flex-direction row
        justify-content space-between
        span
          &:first-child
            color #999
</style>
