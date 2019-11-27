<template>
  <div>
    <mFixedTop :titleName="titleName"></mFixedTop>
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
        <bm-control>
          <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
            <div class="search-w">
              <div class="icon">
                <img src="" alt="">
              </div>
              <input type="text" :placeholder="$t('findBao.text21')" class="input">
            </div>
            <!--<input type="text" placeholder="请输入搜索关键字" class="serachinput">-->
          </bm-auto-complete>
        </bm-control>
        <!--比例尺-->
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT" class="werwrwer"></bm-scale>
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
            <img src="../../assets/img/find/close@2x.png" alt="">
          </div>
          <h3 class="title">{{address}}</h3>
          <p class="address">{{addressDetail}}</p>
          <button class="btn" @click="setPositon">{{$t('findBao.text22')}}</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  /* eslint-disable */
  export default {
    data: function () {
      return {
        isGoBack: true,
        titleName: this.$t('findBao.text23'),
        address: '',
        addressShow: false,
        bMap: '',
        keyword: '',
        center: {lng: 0, lat:0},
        postionMap: {lng: 0, lat: 0},
        add: {jd: 0, wd: 0},
        addressDetail: '',
        zoom: 16,
        aCenter:  {lng: 0, lat: 0},
        position: {lng: 0, lat: 0}
      }
    },
    mounted () {
    },
    ready() {
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    },
    methods: {
      readyMap ({BMap, map}) {
        this.bMap = BMap
        let _this = this;   // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
          _this.center = {lng: r.longitude, lat: r.latitude};     // 设置center属性值
          _this.position = {lng: r.longitude, lat: r.latitude};     // 设置center属性值
          new BMap.Point(_this.center.lng,  _this.center.lat)
        },{enableHighAccuracy: true})
        // if (_this.center.lng === 0) {
        //   _this.center.lng = this.$route.query.lng
        //   _this.center.lat = this.$route.query.lat
        // }
      },
      setPositon () {
        this.$fetch.post(`${this.$api}/pai/addUserLocation`, {
          longitude: this.aCenter.lng,
          latitude: this.aCenter.lat,
          address: this.address
        }).then(res => {
          if (res.status === 'success') {
            this.$router.push('/findTreasure')
          }
        })
        // this.$emit('getPosition', this.position, this.address)
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

            this.aCenter.lng = rs.surroundingPois[0].point.lng
            this.aCenter.lat = rs.surroundingPois[0].point.lat
            // this.position.lng = rs.surroundingPois[0].point.lng
            // this.position.lat = rs.surroundingPois[0].point.lat
            // this.center.lng = this.position.lng
            // this.center.lat = this.position.lat
          } else {
            this.addressShow = true
            this.address = rs.address
            this.addressDetail = rs.address
            this.aCenter.lng = rs.point.lng
            this.aCenter.lat = rs.point.lat
            // this.position.lng = rs.point.lng
            // this.position.lat = rs.point.lat
            // this.center.lng = this.position.lng
            // this.center.lat = this.position.lat
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
    position: fixed
    top: 1.3rem
    bottom: 0
    >>>  .BMap_stdMpCtrl.BMap_stdMpType4.BMap_noprint.anchorTR{
      top: 60px !important
    }
    >>>  .BMap_scaleCtrl.BMap_noprint.anchorTR{
      top: 60px !important
    }
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
      background-color: #3495f1
      font-size: .28rem
      border-radius 6px
  .search-w
    height: .88rem
    padding: .1rem .3rem
    position: relative
    background-color: #fff
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
