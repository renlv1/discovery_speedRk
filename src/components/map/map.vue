<template>
  <div class="container">
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler"></baidu-map>
    <commonPopup class="popup-ref" ref="CustomPopupRef">
      <div slot="PoperContent" class="PoperContentView">
        <div class="ServiceNoteTitle">
          <div class="top">
            <div class="title">{{$t('treasure.subTitle')}}</div>
            <div class="close" @click="close"></div>
          </div>
          <p class="treasure-address">{{address}}</p>
          <div class="btn" @click="next">{{$t('treasure.nextBtn')}}</div>
        </div>
      </div>
    </commonPopup>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import commonPopup from '../../components/Popup'

export default {
  components: {commonPopup, mFixedTop},
  data() {
    return {
      isGoBack: true,
      center: {lng: 0, lat: 0},
      zoom: 17,
      address: ''
    }
  },
  props: {
    titleName: {
      type: String,
      require: true
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.$refs.CustomPopupRef.showCustom()
  },
  methods: {
    handler({BMap, map}) {

      map.disableDragging();     //禁止拖拽
      map.disableScrollWheelZoom();//禁止缩放

      // 获取自身位置
      let _this = this
      let geolocation = new BMap.Geolocation()
      map.enableScrollWheelZoom(true)
      map.enableDoubleClickZoom(true)
      geolocation.getCurrentPosition(r => {
        _this.center.lng = r.longitude
        _this.center.lat = r.latitude

        new BMap.Point(_this.center.lng,  _this.center.lat)

        var myGeo = new BMap.Geocoder();

        geocodeSearch(new BMap.Point(_this.center.lng, _this.center.lat));

        function geocodeSearch(pt){
          myGeo.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents
            _this.address = addComp.province + ',' + addComp.city + ',' + addComp.district + ',' + addComp.street, + ',' + addComp.streetNumber
          })
        }

        // 增加圆
        var circle = new BMap.Circle(_this.center, 120, {
          strokeColor: '#fff',
          fillColor: '#6FBFEE',
          strokeWeight: '2',
          fillOpacity: '0.3'
        });
        map.addOverlay(circle);

        // 增加设置藏宝地点
        map.addEventListener('click', function (e) {
          if (e.overlay) {
            if (e.overlay && e.overlay.toString() !== '[object Circle]') {
              map.addEventListener("click", showInfo)

              function showInfo(e) {
                map.clearOverlays();
                map.addOverlay(marker);
                map.addOverlay(circle);
                let placeCenter = {lng: e.point.lng, lat: e.point.lat}
                var place = new BMap.Icon(require('./imgs/place.png'), new BMap.Size(30, 40), {});
                var marker1 = new BMap.Marker(placeCenter, {icon: place}, {});  // 创建标注
                map.addOverlay(marker1)

                _this.$refs.CustomPopupRef.showCustom()
                // 通过逆解析生成具体的城市地址
                var geoc = new BMap.Geocoder();
                var pt = e.point;
                geoc.getLocation(pt, function (rs) {
                  var addComp = rs.addressComponents;
                  _this.address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
                });

              }
            }
          } else {
            throw new Error('五公里之外不能点哦')
          }
        })

      }, {enableHighAccuracy: true})


      // 自定义当前位置图标
      var myIcon = new BMap.Icon(require('./imgs/arrow.png'), new BMap.Size(120, 120), {
        // offset: new BMap.Size(0, 0), // 指定定位位置
        imageOffset: new BMap.Size(50, 50) // 设置图片偏移
      });
      var marker = new BMap.Marker(_this.center, {icon: myIcon}, {});  // 创建标注
      map.addOverlay(marker);
    },
    close() {
      this.$refs.CustomPopupRef.closeCustom()
      console.log('111111111')
    },
    goPath() {
      this.$router.push('/menu')
      this.$store.commit('SET_FOOTET_TREASURE', 0)
      this.$store.commit('SET_FRIEND_NUM', 0)
    },
    next() {
      //compileStr
      if (this.address !== '') {
        let center = {}
        center.lng = this.center.lng
        center.lat = this.center.lat
        this.$store.commit('SET_CENTER', this.center)
        this.$store.commit('SET_TASK_CONTENT', '')
        this.$store.commit('SET_MONEY', '')
        this.$store.commit('SET_FRIEND_NUM', '')
        this.$store.commit('SET_SELECT_ADDRESS', this.address)

        this.$router.push({
          path: '/treasureNext', query: {
            address: this.address, // 对藏宝地址加密
          }
        })
      } else {
        this.toastD('请在五公里内选择地址')
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .container {
    position relative
  }

  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }

  .bm-view {
    width 100%
    height: 100vh;
  }

  .popup-ref
    .PoperContentView
      width 100%
      .ServiceNoteTitle
        padding 0 .3rem .4rem
        background-color #fff
        position relative
        .top
          font-size .32rem
          width 100%
          .title
            padding .4rem 0 .2rem
            font-weight 600
            text-align center
          .close
            width .26rem
            height .26rem
            background-size .26rem .26rem
            background-image url("../../assets/img/common/close.svg")
            position absolute
            right .33rem
            top .33rem
        .treasure-address
          font-size .28rem
          word-wrap break-word
          color #000
        .btn
          margin-top .4rem
          width 100%
          color #b79961
          border 1px solid #b79961
          height .7rem
          line-height .7rem
          font-size .24rem
      .closerButton
        position absolute
        right 10px
</style>

