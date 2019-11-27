<template>
  <div>
    <transition name="dialog">
      <div class="dialog"  @click="hide" v-show="areaAddressShow">
      </div>
    </transition>
    <transition name="fade-up">
      <div class="dialog-w" v-show="areaAddressShow" @click="hide">
        <div @click.stop class="address-box">
          <div class="address-top">
            <div class="address-choose">
              <div class="address-left">{{$t('shippingAddress.text20')}}</div>
              <img src="./img/Close_2.png"  @click="hide">
            </div>
            <div class="address-area" v-if="!province">{{$t('shippingAddress.text21')}}</div>
            <div class="address-area" v-if="province">
              <div class="province">{{province}}</div>
              <div class="line" v-if="province"></div>
              <div class="city">{{city}}</div>
              <div class="line" v-if="city"></div>
              <div class="area">{{area}}</div>
            </div>
          </div>
          <ul class="uls" v-if="provinceShow">
            <li v-for="(item, index) in areaArr" :key="index" class="list" @click="switchOne(item.name, index)">
              <div class="one-name">{{item.name}}</div>
            </li>
            <li class="other list" >{{$t('shippingAddress.text22')}}</li>
            <li class="list" @click="switchFour()">{{$t('shippingAddress.text23')}}</li>
          </ul>
          <ul class="uls" v-if="cityShow">
            <li v-for="(item, index) in cityArr" :key="index" class="list" @click="switchTwo(item.name, index)">
              <div class="one-name">{{item.name}}</div>
            </li>
          </ul>
          <ul class="uls" v-if="areaShow">
            <li v-for="(item, index) in regionArr" :key="index" class="list" @click="switchThree(item, index)">
              <div class="one-name">{{item}}</div>
            </li>
          </ul>
          <!--                    <button class="cancel" @click="hide">{{$t('notMerchant.text69')}}</button>-->
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
export default {
  data() {
    return {
      areaArr: [],
      cityArr: [],
      addressArr: [],
      regionArr: [],
      pageSize: 10,
      pageIndex: 1,
      province: '',
      city: '',
      area: '',
      provinceShow: true,
      cityShow: false,
      areaShow: false
    }
  },
  props: {
    areaAddressShow: Boolean,
    merchantsType: Array
  },
  computed: {
    options () {
      return {
        pullUpLoad: {
          txt: {
            more: this.$t('common.loading'),
            noMore: this.$t('common.noMore')
          }
        }
      }
    }
  },
  created () {
    this.areaArr = require('@/assets/js/area.json')
    this.getData()
  },
  methods: {
    getData() {
    },
    hide () {
      this.$emit('hideDialog')
    },
    switchOne (item, index) {
      this.province = item
      this.provinceShow = false
      this.cityShow = true
      this.cityArr = this.areaArr[index].city
    },
    switchTwo(item,index) {
      this.city = item
      this.provinceShow = false
      this.cityShow = false
      this.areaShow = true
      this.regionArr = this.cityArr[index].area
    },
    switchThree(item){
      this.area = item
      this.provinceShow = true
      this.cityShow = false
      this.areaShow = false
      if(this.province.substring(0,2) === this.city || this.province === this.city) {
        this.$emit('selectOne',this.province,this.area,'')
      } else {
        this.$emit('selectOne',this.province,this.city,this.area)
      }
    },
    switchFour() {
      this.$emit('switchFour')
    },
    onPullingDown () {
      this.getData()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 100
    background-color: rgba(2,5,13, .6)
    &.dialog-enter-active, &.dialog-leave-active
      transition: all .2s linear;
    &.dialog-enter, &.dialog-leave-to
      opacity: 0
    &.dialog-enter-to, &.dialog-leave
      opacity: 1
  .dialog-w
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    padding: 0 .2rem .2rem
    z-index: 200
    transform translate3d(0,0,0)
    &.fade-up-enter-active, &.fade-up-leave-active
      transition: all .3s linear;
    &.fade-up-enter, &.fade-up-leave-to
      transform translate3d(0,100%,0)
    &.fade-up-enter-to, &.fade-up-leave
      transform translate3d(0,0,0)
    .address-box{
      border-radius 10px 10px 0 0
      background-color: #fff
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height 10rem
    }
    .address-top{
      padding 0 .3rem
      position: fixed
      bottom: 8rem
      height 2rem
      width 100%
      .address-choose{
        padding .3rem 0
        width 100%
        display flex
        justify-content space-between
        align-items center
      }
      .address-area{
        margin-top .2rem
        color #3495f1
        font-size: .28rem
        display flex
        align-items center
      }
      .line{
        width .6rem
        height .02rem
        background #3495f1
        margin 0 .3rem
      }
      .address-left{
        color #060f26
        font-size: .28rem
      }
      img{
        width .28rem
      }
    }
    .uls
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height 8rem
      overflow-y scroll
      .list
        padding-left .3rem
        cursor pointer
        width: 100%
        height .8rem
        display: flex
        align-items center
        justify-content flex-start
        color #060f26
        font-size: .28rem
        /*border-bottom: 1px solid #dfdfdf*/
        &:last-child
          border-bottom: none
      .other{
        color #999
      }
    .ul-two{
      .list-two{
        cursor pointer
        width: 100%
        padding .3rem
        display: flex
        align-items center
        justify-content flex-start
        color #060f26
        font-size: .28rem
      }
    }
    .cancel
      cursor pointer
      border-radius 6px
      margin-top: .2rem
      width: 100%
      height: 1.2rem
      background-color: #fff
      color #999999
      font-size: .28rem
      display: flex
      align-items center
      justify-content center
</style>
