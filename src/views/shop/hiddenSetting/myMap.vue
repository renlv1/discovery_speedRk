<template>
    <transition name="slide">
        <div class="map-m slide-w">
          <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="hide" :isGoBack="true"></mFixedTop>
          <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler" style="width: 100%; height:100%;" ></baidu-map>
            <commonPopup class="popup-ref" ref="CustomPopupRef">
                <div slot="PoperContent" class="PoperContentView">
                    <div class="ServiceNoteTitle">
                        <div class="top">
                            <div class="title">{{$t('paiPay.text1')}}</div>
                            <div class="close" @click="close"></div>
                        </div>
                        <p class="treasure-address">{{address}}</p>
                        <div class="btn" @click="next">{{btnName}}</div>
                    </div>
                </div>
            </commonPopup>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    /* eslint-disable */
    import mFixedTop from '@/components/mFixedTop'
    import commonPopup from '../../../components/bottomPopup'
    // import vMap from '@/components/map2'
    export default {
        data() {
            return {
                zoom: 18,
                address: '',
                center: {lng: 0, lat: 0},
            }
        },
        props: {
            titleName: String,
            btnName: String,
        },
        mounted() {
            this.$refs.CustomPopupRef.showCustom()
        },
        methods: {
            hide () {
                this.$emit('hideMap')
                // this.$router.push('/paiPay')
            },
            getPosition (pos, address) {
                this.$emit('positon2', pos, address)
            },
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
                    var circle = new BMap.Circle(_this.center, 90, {
                        strokeColor: '#fff',
                        fillColor: '#6FBFEE',
                        strokeWeight: '2',
                        fillOpacity: '0.3'
                    });
                    map.addOverlay(circle);

                    // 五公里点击事件
                    map.addEventListener('click', function (e) {
                        if (e.overlay) {
                            if (e.overlay && e.overlay.toString() !== '[object Circle]') {
                                map.addEventListener("click", showInfo)

                                function showInfo(e) {
                                    map.clearOverlays();
                                    map.addOverlay(marker);
                                    map.addOverlay(circle);
                                    let placeCenter = {lng: e.point.lng, lat: e.point.lat}
                                    var place = new BMap.Icon(require('../../../assets/img/notice/place.png'), new BMap.Size(30, 40), {});
                                    var marker1 = new BMap.Marker(placeCenter, {icon: place}, {});  // 创建标注
                                    map.addOverlay(marker1)

                                    _this.$refs.CustomPopupRef.showCustom()
                                    // 通过逆解析生成具体的城市地址
                                    var geoc = new BMap.Geocoder();
                                    var pt = e.point;
                                    geoc.getLocation(pt, function (rs) {
                                        var addComp = rs.addressComponents;
                                        if(addComp.street) {
                                            _this.address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
                                        } else {
                                            _this.address = addComp.province + ", " + addComp.city + ", " + addComp.district
                                        }

                                    });
                                }
                            }
                        } else {
                            throw new Error('五公里之外不能点')
                        }
                    })

                }, {enableHighAccuracy: true})


                // 自定义当前位置图标
                var myIcon = new BMap.Icon(require('../../../assets/img/notice/arrow.png'), new BMap.Size(150, 150), {
                    // offset: new BMap.Size(0, 0), // 指定定位位置
                    imageOffset: new BMap.Size(60, 70) // 设置图片偏移
                });
                var marker = new BMap.Marker(_this.center, {icon: myIcon}, {});  // 创建标注
                map.addOverlay(marker);
            },
            close() {
                this.$refs.CustomPopupRef.closeCustom()
            },
            goPath() {
                this.$router.push('/paiPay')
                // this.$store.commit('SET_FOOTET_TREASURE', 0)
                // this.$store.commit('SET_FRIEND_NUM', 0)
            },
            next() {
                this.$emit('getPosition', this.center, this.address)
            }
            //     if (this.address !== '') {
            //         this.$fetch.post('/bountyorder/userAssignOrderPresent',{
            //             longitude: this.center.lng,
            //             latitude: this.center.lat,
            //         }).then(res => {
            //             if (res.status === 'success') {
            //                 this.toastD('领取成功')
            //                 setTimeout(() => {
            //                     this.$router.push('/paiPay')
            //                 },1000)
            //             } else {
            //                 this.toastD(res.msg)
            //             }
            //         })
            //     } else {
            //         this.toastD('请在五公里内选择地址')
            //     }
            // }
        },
        components: {
            commonPopup,
            mFixedTop
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .map-m
        display: flex
        flex-direction column
        right: 0
        overflow: hidden
    .map-w
        display flex
        flex-direction column
        flex 1
        .search-w
            height: .88rem
            padding: .1rem .3rem
            position: relative
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
        .map-cont
            flex 1
            background-color: #F5F5F5
            .map-a
                width: 100%
                height: 100%
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
                    background-image url("../notOpen/img/close.png")
                    position absolute
                    right .33rem
                    top .33rem
            .treasure-address
                font-size .28rem
                word-wrap break-word
                color #000
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
                margin-top .3rem
        .closerButton
            position absolute
            right 10px
>>>.container {
  position: fixed !important;
  left: 0!important;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 9999;
  &.slide-enter-active, &.slide-leave-active {
    transition: all .3s linear;
  }
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  &.slide-enter-to, &.slide-leave {
    transform: translate3d(0, 0, 0);
  }
}
</style>
