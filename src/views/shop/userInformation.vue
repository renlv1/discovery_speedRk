<template>
  <div class="wrapper">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
    <ul class="info-wrapper">
      <li>
        <span class="li-left" style="color: #000">{{$t('sellShip.text14')}}</span>
        <div class="li-right box-wrapper" @click="toModifyOne">
          <span class="hasColor">{{$t('sellShip.text29')}}</span>
          <img style="width: 15px; height: 15px" src="../../assets/img/common/goTo-path.svg" />
        </div>
      </li>
      <li class="li-shop">
        <span class="li-left">LOGO</span>
        <div class="li-right flex-left">
          <div class="shop-logo">
            <img style="max-width: 50px; border-radius: 5px" :src='info.arLogoImg' />
          </div>
        </div>
      </li>
      <li class="li-shop">
        <span class="li-left" style="padding-top: .2rem">{{$t('sellShip.text30')}}</span>
        <div class="li-right flex-left no-bottom">
          <p>{{info.merDesc}}</p>
          <ul class="imgList">
            <li class="img" v-for="item in splitImg(info.merImgList)" :key="item.index">
              <div class="li-img">
                <img style="max-width: 50px; border-radius: 5px" :src="item" />
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <ul class="info-wrapper">
      <li>
        <span class="li-left" style=" color: #000">{{$t('sellShip.text30')}}</span>
        <div class="li-right box-wrapper" @click="toModifyTwo">
          <span class="hasColor">{{$t('sellShip.text29')}}</span>
          <img style="width: 15px; height: 15px" src="../../assets/img/common/goTo-path.svg" />
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('sellShip.text9')}}</span>
        <div class="li-right flex-left">{{info.merchantName}}</div>
      </li>
      <li>
        <span class="li-left">{{$t('notMerchant.text42')}}</span>
        <div class="li-right flex-left">
          <p>{{info.legalName}}</p>
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('notMerchant.text44')}}</span>
        <div class="li-right flex-left">
          <p><span v-if="info.phoneCode">+{{info.phoneCode}}</span> {{info.mobile}}</p>
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('sellShip.text10')}}</span>
        <div class="li-right flex-left">
          <p>{{$productType(info.merType)}}</p>
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('notMerchant.text24')}}</span>
        <div class="li-right flex-left">
          <p>{{type(info.applyType)}}</p>
        </div>
      </li>
      <li v-if="info.applyType === 1">
        <span class="li-left">{{$t('addAddress.text45')}}</span>
        <div class="li-right flex-left">
          <p>{{info.shopUrl}}</p>
        </div>
      </li>
      <li v-if="info.applyType === 2">
        <span class="li-left">{{$t('sellShip.text11')}}</span>
        <div class="li-right flex-left">
          <p>{{info.merchantAddress}}</p>
        </div>
      </li>
      <li class="li-shop" v-if="info.applyType === 2">
        <span class="li-left" style="margin-top: .2rem">{{$t('sellShip.text12')}}</span>
        <div class="li-right flex-left">
          <p>{{info.detailedAddress}}</p>
        </div>
      </li>
    </ul>
    <p class="tips">
      {{$t('sellShip.text31')}}
    </p>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  name: "userInformation",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('sellShip.text14'),
      info: {},
    }
  },
  mounted() {
    this.getMerchantInfo()
  },
  methods: {
    goPath() {
      this.$router.push('/openShop')
    },
    type(num) {
      if (num === 1) {
        return this.$t('addAddress.text48')
      } else {
        return this.$t('addAddress.text49')
      }
    },
    toModifyOne() {
      this.$router.push({
        path: '/modifyOne',
        query: {
          id: this.$route.query.merchantId
        }
      })
    },
    toModifyTwo() {
      this.$router.push({
        path: '/modifyTwo',
        query: {
          id: this.$route.query.merchantId
        }
      })
    },
    splitImg(imgs) {
      let imgArr = []
      if (imgs) {
        if (imgs.indexOf(',') > -1) {
          imgArr = imgs.split(',')
        } else {
          imgArr.push(imgs)
        }
        return imgArr
      }
    },
    getMerchantInfo() {
      let id = this.$route.query.merchantId
      this.$http.post(`${this.$api}shopMine/getMerchantInfoByMerchantId?merchantId=${id}`).then(res => {
        if (res.data.status === 'success') {
          this.info = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .iosx
    .main-container
      overflow scroll
  .imgList
    display flex
    flex-direction row
    li
      margin-right 5px
      width auto !important
      .li-img{
        display flex
        justify-content center
        align-items center
        width 50px
        height 50px
        background-color #ccc
        border-radius 5px
        img{
          max-height 100%
          max-width 100%
        }
      }
  .wrapper
    background-color rgb(247, 247, 247)
    min-height 100vh
    .info-wrapper
      font-size .28rem
      background-color #fff
      margin-bottom 15px
      li
        width 100%
        justify-content space-between
        line-height .6rem
        display flex
        flex-direction row
        align-items center
        padding 0 .3rem
        &.li-shop
          align-items flex-start
        .box-wrapper
          display flex
          flex-direction row
          align-items center
        .flex-left
          display flex
          flex-direction column
          justify-content flex-start
        .no-bottom
          border-bottom none !important
        .li-left
          height auto
          width 20%
          margin-right 12px
          color rgb(153, 153, 153)
        .hasTop
          display flex
          justify-content flex-start
        .li-right
          display flex
          flex 1
          border-bottom 1px solid #f1f1f1
          justify-content flex-end
          padding .2rem 0
          .shop-logo{
            display flex
            justify-content center
            align-items center
            width 50px
            height 50px
            background-color #ccc
            border-radius 5px
            img{
              max-height 100%
              max-width 100%
            }
          }
          .hasColor
            color #ffb64b
          .img
            padding 0
          p
            word-break break-all
            word-wrap break-word
    .tips
      padding-left .3rem
      color rgb(153, 153, 153)
      font-size .26rem
      margin-top 20px
      padding-bottom 30px
</style>
