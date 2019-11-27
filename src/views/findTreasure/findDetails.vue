<template>
  <div class="findTreasure">
    <mFixedTop :titleName="titleName" @goPathA="goPath" :isGoBack="isGoBack" :isGoNumber="true"></mFixedTop>
    <div class="content">
      <div class="map" :class="{'cs-map': mineMapData.confirmStatus === 2, 'fixbottom': bottomc}">
        <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler">
          <!--      <bm-point-collection :points="pointList" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_SMALL" @click="clickHandler"></bm-point-collection>-->
        </baidu-map>
      </div>
      <div class="bottom-mask" v-show="bottomShow">
        <div class="address-w">
          <div class="position icon"></div>
          <div class="text-address">
            <p class="addres1" id="copyAddress_input1">{{mineMapData.address}}</p>
            <p  class="addres2" v-show="mineMapData.realAddress !== 'null' && mineMapData.realAddress !== null">{{$t('findBao.text1')}}：<span >{{mineMapData.realAddress}}</span></p>
          </div>
          <div class="copy-w icon" @click="copyAddress" id="copy1" ref="addressCopy1" data-clipboard-action="copy" data-clipboard-target="#copyAddress_input1" :data-clipboard-text="mineMapData.address"></div>
        </div>
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
              <div class="more"></div>
            </div>
            <div class="img-w-list" v-show="imgArr.length">
              <div class="img-w" v-for="(ite, nindex) in imgArr" :key="nindex" ref="imgF"><img :src="imgSplit(ite)" alt="" @error="errImg(nindex)" ></div>
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
        <div class="btn-box1" v-show="mineMapData.confirmStatus === 0">
          <div class="more-btn" @click="btnMore()">{{$t('mergeMap.text16')}}</div>
          <div class="btn-wa" @click="btnFn">{{$t('findBao.text3')}}</div>
        </div>
        <div class="btn-w btn-waite" v-show="mineMapData.confirmStatus === 1">
          <div class="btn-c">{{$t('mergeMap.text15')}}</div>
        </div>
      </div>
      <bottom-dialog
        :merchantShow="merchantShow"
        :merchantsType="appliType"
        @selectOne="selectOne"
        @hideDialog="hideDialog">
      </bottom-dialog>
      <transition name="safeDialog">
        <div class="dialog-w dialog-safe-w" v-show="payShow">
          <div class="dialog-safe" >
            <div class="close">
              <div class="close-icon"></div>
            </div>
            <div class="dialog-title">{{$t('transfer.text22')}}</div>
            <div class="form-item">
              <input type="password" :placeholder="$t('transfer.text24')" class="input" v-model.trim="safeCode">
            </div>
            <div class="form-item">
              <input type="text" :placeholder="$t('transfer.text23')" class="input" v-model.trim="payCode">
            </div>
            <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
            <div class="g-dialog-btn-wrap">
              <div class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{$t('transfer.text25')}}</div>
              <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('transfer.text26')}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!--      支付弹窗-->
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import Dialog from '@/components/dialog'
  export default {
    data () {
      return {
        isGoBack: true,
        payShow:false,
        safeCode: '',
        payCode: '',
        errInputMsg: '',
        bottomc:false,
        appliType: [this.$t('mergeMap.text3'),this.$t('mergeMap.text4')],
        merchantShow: false,
        bottomShow:true,
        center: {lng: 0, lat: 0},
        zoom: 16,
        isDataShow: false,
        tabState: 0,
        mineMapData: '',
        titleName: this.$t('findBao.text4'),
        minemapid: '',
        changeCount: '', // 更换次数
        isNotNeedMoneyChangeMine: '', // 是否免费 1 免费
        imgArr: [],
        flag: false,
      }
    },
    created () {
      if (this.$route.query.mapData){
        this.mineMapData = JSON.parse(this.$route.query.mapData)
        if (this.mineMapData.lng) {
          this.center.lng = this.mineMapData.lng
          this.center.lat = this.mineMapData.lat
        } else {
          this.center.lng = this.mineMapData.longitude
          this.center.lat = this.mineMapData.latitude
        }
        this.minemapid = this.mineMapData.id
        if(this.mineMapData.changeCount) {
          this.changeCount = Math.pow(2,this.mineMapData.changeCount)
          } else {
          this.changeCount = 1
        }
        // console.log(this.mineMapData.changeCount)
        this.isNotNeedMoneyChangeMine = this.mineMapData.isNotNeedMoneyChangeMine
        if (this.mineMapData.imglist) {
          this.imgArr = this.mineMapData.imglist.split(',')
        }
      } else if(this.$route.query.minemapid){
        this.getMineMapDetails(this.$route.query.minemapid)
      }
      // this.getPay()
    },
    methods: {
      imgSplit (img) {
        if (img) {
          if (img.indexOf('http') > -1) {
            return img
          } else {
            return 'http://ofjn5cjui.bkt.clouddn.com/' + img
          }
        }
      },
      goPath() {
        this.$router.push('/findTreasure')
      },
      // 更多
      btnMore() {
        this.bottomc = true
        this.bottomShow = false
        this.merchantShow = true
      },
       // 选择更换
      selectOne(index) {
        this.merchantShow = false
        // 0 更换 1 合并
        if(index === 0) {
          let titleText = ''
          if(Number(this.isNotNeedMoneyChangeMine) === 1) {
            // let titleText = '本次更换藏宝图需要消耗'+ this.changeCount + 'π，确认更换？'
             titleText = this.$t('mergeMap.text5')
          } else {
             titleText = this.$t('mergeMap.text6')+ this.changeCount + this.$t('mergeMap.text7')
          }
          Dialog({
            content: titleText,
            type: this.$t('mergeMap.text8'),
            okText: this.$t('mergeMap.text9'),
            okFn: () => {
              this.getPay()
              if(Number(this.isNotNeedMoneyChangeMine) === 1) {
                this.toastD(this.$t('mergeMap.text10'))
                this.merchantShow = false
                this.bottomc = false
                this.bottomShow = true
              } else {
                this.payShow = true
                this.safeCode = ''
                this.payCode = ''
                this.flag = false
              }
              // this.$fetch.post(`${this.$api}pai/changeMineMap`,{
              //   mineMapId: this.minemapid
              // }).then(res => {
              //   console.log(res)
              // }).catch(err => {
              //   console.log(err)
              // })
              // this.$router.push({
              //   path: '/findDetails',
              //   query: {
              //     mapData: JSON.stringify(this.mineMapData)
              //   }
              // })
              // this.$router.push({
              //   path: '/waBao',
              //   query: {id: this.minemapid}
              // })
            },
            cancelFn:() => {
              this.merchantShow = false
              this.bottomc = false
              this.bottomShow = true
            }
          })
        } else if(index === 1) {
          this.$router.push({
            path: '/mergeMap',
            query: {
              everytotal: this.mineMapData.everytotal,
              minemapid: this.minemapid
            }
          })
        }
      },
      cancelCallback() {
        this.safeCode = ''
        this.payCode = ''
        this.errMsg2 = ''
        this.errMsg3 = ''
        this.errInputMsg = ''
        this.payShow = false
        this.merchantShow = false
        this.bottomc = false
        this.bottomShow = true
      },
      okCallback() {
          this.errInputMsg = ''
          if(!this.flag) {
            if (this.safeCode === '') {
              this.errInputMsg =  this.$t('transfer.text27')
              return
            }
            if (this.payCode === '') {
              this.errInputMsg = this.$t('transfer.text28')
              return
            }
            this.flag = true
            if (this.safeCode !== '' && this.payCode !== '') {
              this.$fetch.post(`${this.$api2}pay/payOrder`,{
                id: this.payId,
                tradePwd: this.safeCode,  // 支付密码（选填）
                mobileCode: this.payCode  // 手机验证码 （选填） 邮箱
              }).then((re) => {
                if (re.status === 'success') {
                  this.merchantShow = false
                  this.bottomc = false
                  this.bottomShow = true
                  this.payShow = false
                  this.toastD(this.$t('treasure.text38'))
                } else {
                  if(localStorage.getItem('discoveryLang') === 'EN') {
                    this.errInputMsg = this.$t('transfer.text50')
                  } else {
                    this.errInputMsg = re.msg
                  }
                }
              })
            }
          }
      },
      getPay() {
        this.$fetch.post(`${this.$api}pai/changeMineMap`,{
          mineMapId: this.minemapid,
          currentLon:this.center.lng,
          currentLat: this.center.lat
        }).then(res => {
          if (res.data) {
            this.isNotNeedMoneyChangeMine = res.data.isNotNeedMoneyChangeMine
            this.payId = res.data.payId
            this.mineMapData = res.data
          }
          // if (res.data.lng) {
          //   this.center.lng = res.data.lng
          //   this.center.lat = res.data.lat
          // } else {
          //   this.center.lng = res.data.longitude
          //   this.center.lat = res.data.latitude
          // }
        }).catch(err => {
          console.log(err)
        })
      },
      hideDialog() {
        this.merchantShow = false
        this.bottomc = false
        this.bottomShow = true
      },
      errImg (index) {
        this.$refs.imgF[index].style.display = 'none'
      },
      gotoTask () {
        this.$router.push({
          path: '/taskDetails',
          query: {
            task: this.mineMapData.task,
            imglist: this.mineMapData.imglist
          }
        })
      },
      handler({BMap, map}) {
        // 获取自身位置
        let _this = this
        let geolocation = new BMap.Geolocation()
        map.enableScrollWheelZoom(true)
        map.enableDoubleClickZoom(true)
        // 自定义当前位置图标
        var myIcon = new BMap.Icon(require('./arrow.png'), new BMap.Size(200, 200), {
          // offset: new BMap.Size(0, 0), // 指定定位位置
          imageOffset: new BMap.Size(90, 80) // 设置图片偏移
        });
        if (_this.mineMapData.lng) {
          _this.center.lng = _this.mineMapData.lng
          _this.center.lat = _this.mineMapData.lat
        } else {
          _this.center.lng = _this.mineMapData.longitude
          _this.center.lat = _this.mineMapData.latitude
        }
        var marker = new BMap.Marker(_this.center, {icon: myIcon}, {});  // 创建标注
        map.addOverlay(marker);
      },
      copyAddress () {
        var clipboard1
        clipboard1 = new Clipboard('#copy1');
        let _this = this
        clipboard1.on('success', (e) => {
          _this.creatToast(_this.$t('safe.text8'))
          e.clearSelection();
        })
        clipboard1.on('error', function(e) {
          _this.creatToast(_this.$t('safe.text9'))
        })
      },
      btnFn () {
        let time = this.mineMapData.minetime.split('-')
        let hour1 = Number(time[0].split(':')[0]) // 开 时
        let hour2 = Number(this.$changeDate(new Date(), '', 6)) // 现在时间
        let hour3 = Number(time[0].split(':')[1])// 开 分
        let hour4 = Number(this.$changeDate(new Date(), '', 7)) // 现在分钟
        let min5 = Number(time[1].split(':')[0])// 结束 时
        let min6 = Number(time[1].split(':')[1])// 结束 分
        var week = new Date().getDay();
        if (week === 0) {
          week = 7
        }
        if (this.mineMapData.minedate.indexOf(week) === -1) {
          this.toastD('现在还不是挖宝时间')
        }
        if (min5 < hour2) {
          console.log(min5, hour2)
          this.toastD('现在还不是挖宝时间')
          return
        }
        // if (min5 > hour2 && min6 < hour4) {
        //   console.log(min5, hour2, min6, hour4)
        //   this.toastD('现在还不是挖宝时间')
        //   return
        // }
        if (hour1 > hour2) {
          this.toastD('现在还不是挖宝时间')
          return
        }
        if (hour1 < hour2 && hour3 > hour4) {
          this.toastD('现在还不是挖宝时间')
          return
        }
        this.$router.push({
          path: '/waBao',
          query: {id: this.minemapid}
        })
        // Dialog({
        //   title: '请前往宝藏地址附近完成挖宝',
        //   okText: '好的',
        //   okFn: () => {
        //     this.$router.push({
        //       path: '/waBao',
        //       query: {id: this.minemapid}
        //     })
        //   }
        // })
      },
      // toast弹窗
      creatToast (msg) {
        let toast1 = this.$createToast({
          txt: msg,
          time: 1500,
          type: 'txt'
        })
        toast1.show()
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
      chooseItem (index) {
        this.tabState = index
      },
      getMineList () {
        this.$fetch.post(`${this.$api}pai/queryMyMineMapList`, {
          status: 3,
          page: 1,	// int	页码
          pagesize: 20 //	int	页数
        }).then(res => {
          if (res.status === 'success') {
            this.minemapid = res.data[1].id
            this.getMineMapDetails(res.data[1].id)
          }
        })
      },
      getMineMapDetails () {
        this.$fetch.post(`${this.$api}pai/queryMyMineMapDetails`, {
          minemapid: this.$route.query.minemapid
        }).then(res => {
          if (res.status === 'success') {
            this.isDataShow = true
            this.mineMapData = res.data
            this.minemapid = res.data.id
            if (res.data.lng) {
              this.center.lng = res.data.lng
              this.center.lat = res.data.lat
            } else {
              this.center.lng = res.data.longitude
              this.center.lat = res.data.latitude
            }
            // console.log(this.mineMapData)
          }
        })
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      bottomDialog:  resolve => require(['@/components//bottomDialog'], resolve),
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../assets/css/mixin.styl"
  .iosx-app{
    .btn-box1{
      padding-bottom .5rem
    }
  }
  .findTreasure
    .icon
      width: .4rem
      height: .4rem
      margin-right: .3rem
      background-position center
      background-size cover
      background-repeat no-repeat
    .map
      position: fixed
      top: 1.2rem
      left: 0
      right: 0
      height: 6rem
      background-color: #d9f1ff
      >>> .bm-view
        width: 100%
        height: 100%
      &.cs-map
        height: 7rem
      &.fixbottom{
        height 100vh
      }
    .bottom-mask
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      z-index: 10
      padding: .4rem .4rem 0
      border-radius 8px 8px 0 0
      background-color: #fff
      .address-w
        display: flex
        .position
          width: .4rem
          height: .4rem
          margin-top: .2rem
          bg-image('../../assets/img/find/position')
        .copy-w
          margin-top: .2rem
          width: .4rem
          height: .4rem
          bg-image('../../assets/img/find/copy')
        .text-address
          flex 1
          padding-right: .41rem
          font-size: .28rem
          color #000
          line-height: 1.5
          .addres1
            margin-bottom .2rem
          .addres2
            padding-bottom: .4rem
            font-size: .24rem
            color #bfbfbf
            margin-right: -.6rem
      .flex-t
        display: flex
        border-top: 1px solid #F2F2F2
        font-size: .28rem
        color #000
        &.money-flex
          height: 1rem
          align-items center
        .left-flex
          flex 1
          display: flex
          align-items center
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
        border-bottom: 1px solid #F2F2F2
      .task-flex
        padding: .35rem 0 .3rem
        .left-flex
          display block
          overflow: hidden
        .p-text
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
        margin-right: .2rem
        img
          width: 100%
          display: block
      .week-w
        padding: .35rem 0 .3rem
        .week
          font-size: .28rem
          color #bfbfbf
          margin-top: .2rem
    .btn-w
      width: 100%
      height: .8rem
      color #FFF
      font-size: .28rem
      display: flex
      align-items center
      justify-content center
      background-color: #FFE600
      border-radius 4px
      margin: .4rem 0
    .btn-waite
      background-color: #ccc
    .btn-box1{
      width: 100%
      height: 1.6rem
      color #000
      font-size: .28rem
      display: flex
      align-items center
      justify-content flex-end
      border-radius 4px
      .more-btn, .btn-wa{
        text-align center
        line-height .8rem
        margin-right .2rem
        width 1.8rem
        border 1px solid #999
        border-radius 4px
        height .8rem
        color #000
      }
      .btn-wa{
       background-color #ffe600
       border none !important
      }
    }
  .dialog-safe-w
    display: flex
    align-items center
    justify-content center
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom:0
    width: 100%
    height: 100%
    z-index: 200
    color #000
    background-color: rgba(0,0,0,.4)
    &.safeDialog-enter, &.safeDialog-leave-to
      opacity: 0;
      .dialog-safe
        transform: translate(0, -5%)
    &.safeDialog-enter-active
      transition: .3s;
      .dialog-safe
        transition: .3s
    &.safeDialog-leave-active
      transition: .1s;
      .dialog-safe
        transition: .1s
    .dialog-safe
      width: 6.9rem
      background-color: #fff
      position: relative
      border-radius 4px
      color #17161f
      font-size: .28rem;
      transform: translate(0, 0)
      padding: 0 .4rem
      .dialog-title
        font-size: .32rem
        font-weight: bold
        color #17161f
        padding: .5rem 0 .6rem
        text-align: center
      .g-dialog-btn-wrap
        margin-top 1rem
        display: flex
        align-items center
        justify-content center
        border-top: 1px dashed #000
      .form-item
        margin-bottom: .4rem
        .label
          margin-bottom: .2rem
        .input
          border-bottom 1px solid #000
          width: 100%
          height: 1rem
          /*border-radius .4rem*/
          /*background-color: #f5f6fa*/
          /*padding: 0 .3rem*/
          color #000
      .err-ms
        color: #ff717d;
        font-size .24rem
        margin-top: .3rem;
      .shortMsg
        position relative
        .payMsg-box
          .payMsg
            width 100%
            height .8rem
            background-color #f5f6fa
            border-radius .4rem
            font-size .28rem
            padding 0 .3rem
          .sendMsg
            position absolute
            top 0
            right 0
            height: 100%
            padding: 0 .2rem
            background-color transparent
            border none
            outline none
            font-size: .28rem
            color #00a6f1
      .g-dialog-btn
        text-align center
        flex 1
      .comfirm
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
        color #b79961
</style>
