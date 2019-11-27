<template>
  <div class="map-m map-m-bdu">
    <baidu-map style="width: 100%; height:100%;" class="bm-view"
               :center="center"
               :zoom="zoom"
               :scroll-wheel-zoom="true"
               @ready="readyMap"
               @click="getClickInfo"
               @moving="syncCenterAndZoom"
               @moveend="syncCenterAndZoom"
               @zoomend="syncCenterAndZoom">
      <bm-view style="width: 100%; height:100%;"></bm-view>
      <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-context-menu>
            <bm-context-menu-item text="获取坐标"></bm-context-menu-item>
        </bm-context-menu>
      </bm-marker>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-control :offset="{width: '10px', height: '10px'}">
        <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
<!--          <div class="search-w">-->
<!--            <div class="icon">-->
<!--              <img src="../views/shop/notOpen/img/search.png" alt="">-->
<!--            </div>-->
<!--            <input type="text" :placeholder="$t('notMerchant.text2')" class="input">-->
<!--          </div>-->
          <!--<input type="text" placeholder="请输入搜索关键字" class="serachinput">-->
        </bm-auto-complete>
      </bm-control>
      <!--比例尺-->
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <bm-local-search
              @markersset="markersset"
              @searchcomplete="searchcomplete"
              :keyword="keyword"
              :auto-viewport="true"
              style="width:0px;height:0px;overflow: hidden;">
      </bm-local-search>
    </baidu-map>
    <div class="bottom-c">
      <div class="position-w">
        <!--<div class="left">-->
          <!--<div class="long">-->
            <!--<p class="num first-num">0</p>-->
            <!--<div class="line-border line-one"></div>-->
          <!--</div>-->
          <!--<div class="long">-->
            <!--<p class="num">125</p>-->
            <!--<div class="line-border line-two"></div>-->
          <!--</div>-->
          <!--<div class="long">-->
            <!--<p class="num">250米</p>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="right">-->
          <!--<img src="../views/notMerchant/image/position.png" alt="">-->
        <!--</div>-->
      </div>
      <div class="address-w" v-show="addressShow">
        <div class="close" @click="addressShow = false">
          <img src="../views/shop/notOpen/img/close.png" alt="">
        </div>
        <h3 class="title">{{address}}</h3>
        <p class="address">{{addressDetail}}</p>
        <button class="btn" @click="setPositon">{{$t('notMerchant.text68')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    data: function () {
      return {
        address: '',
        addressShow: false,
        bMap: '',
        keyword: '',
        center: {lng: 0, lat: 0},
        postionMap: {lng: 0, lat: 0},
        add: {jd: 0, wd: 0},
        addressDetail: '',
        zoom: 16,
        position: {lng: 0, lat: 0}
      }
    },
    watch: {
      value: function (currentValue) {
        if (currentValue) {
          this.keyword = ''
        }
      }
    },
    props: {
      value: Boolean,
      mapHeight: {
        type: Number
      }
    },
    mounted () {
    },
    ready() {
    },
    methods: {
      readyMap ({BMap, map}) {
        this.bMap = BMap
        let _this = this;   // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
           _this.center = {lng: r.longitude, lat: r.latitude};     // 设置center属性值
        },{enableHighAccuracy: true})
      },
      setPositon () {
        this.$emit('getPosition', this.position, this.address)
      },
      searchcomplete () {
      },
      markersset (e) {
        e.forEach(item => {
          if (this.keyword.lastIndexOf(item.title) > 0) {
            this.addressDetail = item.province + item.city + item.title
            this.address = item.title
            this.addressShow = true
            this.position.lng = item.point.lng
            this.position.lat = item.point.lat
            console.log(this.addressDetail)
          }
        })
      },
      /***
       * 地图点击事件。
       */
      getClickInfo(e) {
        let geocoder= new this.bMap.Geocoder();  //创建地址解析器的实例
        geocoder.getLocation(e.point,rs=>{
          if (rs.surroundingPois.length) {
            this.addressShow = true
            this.address = rs.surroundingPois[0].title
            this.addressDetail = rs.surroundingPois[0].address
            this.position.lng = rs.surroundingPois[0].point.lng
            this.position.lat = rs.surroundingPois[0].point.lat
            this.center.lng = this.position.lng
            this.center.lat = this.position.lat
          } else {
            this.addressShow = true
            this.address = rs.address
            this.addressDetail = rs.address
            this.position.lng = rs.point.lng
            this.position.lat = rs.point.lat
            this.center.lng = this.position.lng
            this.center.lat = this.position.lat
          }
        });
      },
      syncCenterAndZoom(e, target) {
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .map-m{
    width: 100%;
    height: 100%;
  }
  .BMap_noprint{
    width: 100%;
  }
  .serachinput {
    width: 100%;
    box-sizing: border-box;
    padding: 9px;
    border: 1px solid #dddee1;
    line-height: 20px;
    font-size: 16px;
    height: 38px;
    color: #060f26;
    background-color: #fff;
  }
  .iosx{
    .bottom-c{
      bottom: 60px!important
    }
  }
  .bottom-c
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    padding: 0 .3rem .2rem .3rem
    .position-w
      display flex
      justify-content space-between
      margin-bottom: .3rem
      .left
        display: flex
        align-items flex-end
        .long
          .num
            font-size: 12px
            color #060f26
            margin-bottom: 5px
            position: relative
            margin-left: -10px
          .first-num
            margin-left: 0
          .line-border
            width: 1.25rem
            height: 4px
          .line-one
            background-color: #060f26
          .line-two
            border: 1px solid #060f26
      .right
        img
          width: 1.1rem
          display: block
  .address-w
    width: 100%
    background-color: #fff
    border-radius .16rem
    padding: .26rem .26rem .4rem .3rem
    position: relative
    box-shadow 0 0 10px rgba(6,15,38,.2)
    .close
      position: absolute
      right: 0
      top: 0
      padding: .26rem
      img
        width: 15px
    .title
      font-size: .28rem
      margin-top: .12rem
      color #060f26
    .address
      font-size: 12px
      color #999
      line-height: 1.5
      margin: .24rem 0 .64rem
    .btn
      width: 100%
      height: .88rem
      display: flex
      align-items center
      justify-content:center
      color #fff
      background-color: rgb(255,182,75)
      font-size: .28rem
      border-radius 6px
  .search-w
    height: .88rem
    padding: .1rem .3rem
    position: relative
    background-color: #fff
    margin-bottom .2rem
    .icon
      width: .24rem
      position: absolute
      left: .6rem
      top: 50%
      transform translateY(-50%)
      img
        width: 100%
        display: block
    .input
      width: 100%
      height: 100%
      background-color: #F7F7F7
      border-radius 4px
      padding-left: .7rem
      color #060f26
      font-size: 12px
</style>
