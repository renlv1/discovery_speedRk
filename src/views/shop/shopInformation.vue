<template>
  <div>
    <mFixedTop :titleName="titleName"></mFixedTop>
    <ul>
      <li>
        <span class="li-left">{{$t('sellShip.text9')}}</span>
        <span class="li-right">{{shopInfo.merchantName}}</span>
      </li>
      <li>
        <span class="li-left">{{$t('sellShip.text10')}}</span>
        <span class="li-right">{{$productType(shopInfo.merType)}}</span>
      </li>
      <li v-if="shopInfo.applyType === 1">
        <span class="li-left">{{$t('addAddress.text45')}}</span>
        <span class="li-right">{{shopInfo.shopUrl}}</span>
      </li>
      <li v-if="shopInfo.applyType === 2">
        <span class="li-left">{{$t('sellShip.text11')}}</span>
        <span class="li-right">{{shopInfo.merchantAddress}}</span>
      </li>
      <li v-if="shopInfo.applyType === 2">
        <span class="li-left">{{$t('sellShip.text12')}}</span>
        <span class="li-right">{{shopInfo.detailedAddress}}</span>
      </li>
      <li>
        <span class="li-left">{{$t('sellShip.text13')}}</span>
        <div class="li-right">
          <span>{{shopInfo.merDesc}}</span>
          <ul v-if="shopInfo.merImgList">
            <li v-for="item in shopInfo.merImgList.split(',')" :key="item.index">
              <img :src="imgSplit(item)">
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
export default {
  name: "shopInformation",
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('sellShip.text14'),
      shopInfo: {},
    }
  },
  mounted() {
    let shopInfo
    shopInfo = JSON.parse(this.$route.query.shopInfo)
    this.shopInfo = shopInfo[0]
    // console.log(this.shopInfo)
  },
  methods: {
    imgSplit(img) {
      if (img) {
        if (img.indexOf('http' || 'https') > -1) {
          return img
        } else {
          return 'https://discoverypi.blob.core.windows.net/' + img
        }
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-container
    overflow scroll
  ul
    margin-top 15px
    padding 0 15px
    font-size 14px
    li
      display flex
      flex-direction row
      align-items flex-start
      margin-bottom 20px
      line-height 1.5
      .li-left
        color #999;
        width 30%
      .li-right
        flex 1
        word-wrap break-word
        word-break break-all
        ul
          padding 0
          display flex
          flex-direction row
          flex-wrap wrap
          li
            display flex
            justify-content center
            align-items center
            width 80px
            height 80px
            background-color #ccc
            margin-right 20px
            border-radius 5px
            img
              max-width 100%
              max-height 100%
             
</style>
