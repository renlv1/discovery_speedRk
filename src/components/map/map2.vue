<template>
  <div>
    <vLoading v-if="isLoading"></vLoading>
<!--    <div class="top" @click="comfirmPosition" v-show="center.lng !== 0">-->
<!--      <div class="left-flex">-->
<!--        <div class="warn"></div>-->
<!--        <p>{{$t('findBao.text55')}}</p>-->
<!--      </div>-->
<!--      <div class="more"></div>-->
<!--    </div>-->
    <div class="map-w" v-if="!isLoading">
      <div class="container">
        <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler">
          <bm-marker v-for="(marker, index) in pointList" :key="index" :position="marker" @click="clickHandler(marker)">
          </bm-marker>
<!--          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>-->
        </baidu-map>
        <div class="baozhang-w" :class="{'baozhang-a': dialogF}">
          <div class=" close" @click="closeF">
            <div class="icn-t ico-m"></div>
          </div>
          <div class="baozhang-title">{{$t('findBao.text56')}}</div>
          <div class="flex-t money-flex">
            <div class="left-flex">
              <div class="icon icon1"></div>
              <div>{{mineMapData.everytotal}}π</div>
            </div>
          </div>
          <div class="flex-t task-flex" @click="gotoTask">
            <div class="icon icon2"></div>
            <div class="left-flex">
              <div class="between-flex">
                <p class="p-text">{{$t('findBao.text2')}}：{{mineMapData.task}}</p>
                <div class="more ico-m"></div>
              </div>
            </div>
          </div>
          <div class="flex-t flex-last">
            <div class="icon icon3"></div>
            <div class="week-w">
              <p>{{mineMapData.minetime}}</p>
              <div class="week">{{mWeeK(mineMapData.minedate)}}</div>
            </div>
          </div>
          <div class="btn-info" @click="lookInfo">{{$t('findBao.text58')}}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {compileStr} from '../../utils/util'
import Dialog from '@/components/dialog'
export default {
  data() {
    return {
      dialogF: false,
      isGoBack: true,
      currentCenter: {lng: 0, lat: 0},
      center: {lng: 0, lat: 0},
      zoom: 17,
      address: '',
      pointList: [],
      isLoading: true,
      mineMapData: ''
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
  },
  created () {
    this.getMyMineList()
    if (this.$route.query.mapData) {
      this.mineMapData = JSON.parse(this.$route.query.mapData)
      this.dialogF = true
    }
  },
  methods: {
    comfirmPosition () {
      this.mineMapData = this.pointList[0]
      this.dialogF = true
    },
    gotoTask () {
      this.$router.push({
        path: '/taskDetails',
        query: {
          task: this.mineMapData.task,
          mapData: JSON.stringify(this.mineMapData),
          imglist: this.mineMapData.imglist
        }
      })
    },
    lookInfo () {
      this.$router.push({
        path: '/findDetails',
        query: {
          mapData: JSON.stringify(this.mineMapData)
        }
      })
    },
    mWeeK (data) {
      if (data) {
        let f = data.split(',')
        let arr = []
        f.forEach(item => {
          if (item === '1') arr.push(this.$t('findBao.text6'))
          if (item === '2') arr.push(this.$t('findBao.text7'))
          if (item === '3') arr.push(this.$t('findBao.text8'))
          if (item === '4') arr.push(this.$t('findBao.text9'))
          if (item === '5') arr.push(this.$t('findBao.text10'))
          if (item === '6') arr.push(this.$t('findBao.text11'))
          if (item === '7') arr.push(this.$t('findBao.text12'))
        })
        return arr.join('、')
      }
    },
    clickHandler (e) {
      this.mineMapData = e
      this.dialogF = true
      // alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`);
    },
    closeF () {
      this.dialogF = false
    },
    getMyMineList () {
      this.$fetch.post(`${this.$api}pai/queryMyMineMapList`, {
        status: 2,
        page: 1,
        pagesize: 20
      }).then(res => {
        this.isLoading = false
        if (res.status === 'success') {
          if (res.mapData.isCue === true) {
            Dialog({
              title: this.$t('findBao.text57'),
              type: 'confirm',
              okFn: () => {
                this.$router.push({
                  path: '/map3',
                  query: {
                    lng: res.data[0].longitude,
                    lat: res.data[0].latitude
                  }
                })
              }
            })
          }
          let pointData = res.data
          if (pointData.length) {
            // this.center.lng = this.currentCenter.lng
            // this.center.lat = this.currentCenter.lat
            this.pointList = JSON.parse(JSON.stringify(res.data).replace(/longitude/g, 'lng').replace(/latitude/g, 'lat'))
          } else {
            setTimeout(() => { //   center: {lng: 116.46, lat: 39.92},
              // this.center.lng = this.currentCenter.lng
              // this.center.lat = this.currentCenter.lat
            }, 800)
          }
        }
      })
    },
    handler({BMap, map}) {

      // map.disableDragging();     //禁止拖拽
      // map.disableScrollWheelZoom();//禁止缩放

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

        geocodeSearch(new BMap.Point(r.longitude,  r.latitude));

        function geocodeSearch(pt){
          myGeo.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents
            _this.address = addComp.province + ',' + addComp.city + ',' + addComp.district + ',' + addComp.street, + ',' + addComp.streetNumber
          })
        }

      }, {enableHighAccuracy: true})
      // 自定义当前位置图标
      // 自定义当前位置图标
      var myIcon = new BMap.Icon(require('./imgs/arrow.png'), new BMap.Size(120, 120), {
        // offset: new BMap.Size(0, 0), // 指定定位位置
        imageOffset: new BMap.Size(50, 50) // 设置图片偏移
      });
      var marker = new BMap.Marker(_this.center, {icon: myIcon}, {});  // 创建标注
      map.addOverlay(marker);
    },
    // handler({BMap, map}) {
    //   // 获取自身位置
    //   let _this = this
    //   let geolocation = new BMap.Geolocation()
    //   map.enableScrollWheelZoom(true)
    //   map.enableDoubleClickZoom(true)
    //   geolocation.getCurrentPosition(r => {
    //     _this.currentCenter.lng = r.longitude
    //     _this.currentCenter.lat = r.latitude
    //     _this.center.lng = r.longitude
    //     _this.center.lat = r.latitude
    //     new BMap.Point(_this.center.lng,  _this.center.lat)
    //   }, {enableHighAccuracy: true})
    //
    //
    //   // 自定义当前位置图标
    //   var myIcon = new BMap.Icon(require('./imgs/arrow.png'), new BMap.Size(200, 200), {
    //     imageOffset: new BMap.Size(50, 50) // 设置图片偏移
    //   });
    //   var marker = new BMap.Marker(_this.center, {icon: myIcon}, {});  // 创建标注
    //   map.addOverlay(marker);
    // }
  },
  components: {
    vLoading: () => import('@/components/loading')
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../assets/css/mixin.styl"
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
  .map-w
    position: fixed
    top: 60px
    bottom: 1.1rem
    width: 100%
    left: 0
    >>> .container
      height 100%
    >>> .bm-view
      height 100%
  .top
    position: fixed
    top: 60px
    height: .8rem
    left: 0
    right: 0
    background-color: rgba(238,238,238,.8)
    display: flex
    align-items center
    justify-content space-between
    padding: 0 .4rem
    font-size: .28rem
    color #ff717d
    z-index: 20
    cursor pointer
    .left-flex
      display: flex
      align-items center
    .warn
      width: .4rem
      height: .4rem
      margin-right: .2rem
      background-position center
      background-size cover
      background-repeat no-repeat
      bg-image ("../../assets/img/find/warning")
    .more
      width: .26rem
      height: .26rem
      background-position center
      background-size cover
      background-repeat no-repeat
      bg-image ("../../assets/img/find/more")
  .popup-ref
    .PoperContentView
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
  .baozhang-w
    position: fixed
    bottom: 1.5rem
    left: .3rem
    right: .3rem
    z-index: 100
    background-color: #fff
    border-radius .08rem
    padding: 0 .4rem
    transform translateY(200%)
    transition all .3s linear
    &.baozhang-a
      transform translateY(0)
    .baozhang-title
      font-size: .32rem
      color #000
      padding-top: .4rem
      text-align: center
    .btn-info
      padding: .1rem 0 .4rem
      text-align: center
      font-size: .32rem
      color #b79961
    .close
      position: absolute
      padding: .34rem
      right: 0
      top: 0
      cursor pointer
      .icn-t
        width: .5rem
        height: .5rem
        background-position center
        background-size cover
        background-repeat no-repeat
        bg-image('../../assets/img/find/close')
    .flex-t
      display: flex
      border-bottom: 1px solid #F2F2F2
      font-size: .28rem
      color #000
      &.money-flex
        height: 1rem
        align-items center
      .left-flex
        flex 1
        display: flex
        align-items center
      .icon
        width: .4rem
        height: .4rem
        margin-right: .3rem
        background-position center
        background-size cover
        background-repeat no-repeat
      .icon1
        bg-image('../../assets/img/find/money')
      .icon2
        bg-image('../../assets/img/find/task')
      .icon3
        margin-top: .3rem
        bg-image('../../assets/img/find/time')
      .more
        width: .26rem
        min-width: .26rem
        height: .26rem
        background-position center
        background-size cover
        background-repeat no-repeat
        bg-image('../../assets/img/find/more-gray')
    .flex-last
      border-bottom: none
    .task-flex
      padding: .35rem 0 .3rem
      .left-flex
        display block
        overflow: hidden
      .p-text
        line-height: 1.5
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
    .img-w-list
      display: flex
      align-items center
      margin-top: .2rem
    .between-flex
      display: flex
      align-items center
      justify-content space-between
    .img-w
      width: 1.2rem
      height: .9rem
      background-color: #EEEEEE
      img
        width: 100%
        display: block
    .week-w
      padding: .35rem 0 .3rem
      .week
        font-size: .28rem
        color #bfbfbf
        margin-top: .2rem
</style>
