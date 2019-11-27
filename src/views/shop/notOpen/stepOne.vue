<template>
  <div class="fill-msg">
    <mFixedTop :titleName="titleName" :isGoNumber="true" :isGoBack="isGoBack"  @goPath="$router.go(-1)"></mFixedTop>
    <div class="content">
      <div class="form-item">
        <div class="label">{{$t('notMerchant.text20')}}</div>
        <div class="input-w">
          <input type="text" :placeholder="$t('notMerchant.text21')" class="input" v-model.trim="merchantName">
        </div>
      </div>
      <div class="form-item ">
        <div class="label">{{$t('notMerchant.text22')}}</div>
        <div class="input-w" @click="switchTypes">
          <input type="text" :placeholder="$t('notMerchant.text23')" readonly unselectable="on" class="input" v-model.trim="mType">
          <div class="arrow">
            <img src="./img/right_arrow.png" alt="">
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="label">{{$t('notMerchant.text24')}}</div>
        <div class="input-w" @click="showMerchants">
          <div class="input">{{merchant}}</div>
          <div class="arrow">
            <img src="./img/right_arrow.png" alt="">
          </div>
        </div>
      </div>
      <div class="form-item" v-if="merchantIndex === 1">
        <div class="label">{{$t('notMerchant.text25')}}</div>
        <div class="input-w">
          <input type="text" :placeholder="$t('notMerchant.text26')" class="input" v-model.trim="shopUrl">
        </div>
      </div>
      <div v-else>
        <div class="form-item">
          <div class="label">{{$t('notMerchant.text27')}}</div>
          <div class="input-w" @click="gotoMap">
            <input type="text"  readonly unselectable="on" :placeholder="$t('notMerchant.text28')" class="input" v-model.trim="merchantAddress">
            <div class="arrow">
              <img src="./img/right_arrow.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="form-item shop-addre" v-if="merchantIndex === 0">
        <div class="label label-t">{{$t('notMerchant.text29')}}</div>
        <div class="textarea-w">
          <textarea class="area" :placeholder="$t('notMerchant.text30')" v-model.trim="detailedAddress" @input="textareaVal"></textarea>
          <p class="number">{{textnum}}/200</p>
        </div>
      </div>
      <div class="form-item logo-box logo-line">
        <div class="label label-t">{{$t('notMerchant.text70')}} <span>{{$t('notOpen.text10')}}</span></div>
        <div class="file-w">
          <div class="loading" v-show="logoLoading">
            <img src="../../../assets/img/common/loading.gif" alt="">
          </div>
          <div class="logo-img" v-show="logoImg">
            <img :src="logoImg" alt="" class="logo-a">
            <div class="zhe" @click="deleteLogo">
              <img src="./img/delete.png" alt="" class="delete">
            </div>
          </div>
          <div class="file-box" v-show="maxlogoImg">
            <input type="file" class="file-input" @change="fillLogo" ref="uploadFile" accept="image/*" multiple="multiple">
          </div>
        </div>
      </div>
      <div class="form-item logo-box introduce">
        <div class="label label-t">{{$t('notOpen.text11')}}</div>
        <div class="textarea-w">
          <textarea class="area" :placeholder="$t('notOpen.text12')" v-model.trim="introduceShop" @input="textareaVal2"></textarea>
          <p class="number">{{textnum2}}/200</p>
        </div>
        <div class="file-w shop-img">
          <div class="loading" v-show="logoLoading2">
            <img src="../../../assets/img/common/loading.gif" alt="">
          </div>
          <ul class="uls-item">
            <li v-for="(item, index) in imgDataObj" :key="index" class="li-img">
              <img :src="item" alt="">
              <div class="delete-box"  @click.stop.prevent="deleteLogo2(index)">
                <div class="delete-icon">  <img src="./img/delete.png" alt="" class="delete"></div>
              </div>
            </li>
          </ul>
<!--            <img :src="logoImg2" alt="" class="logo-a">-->
<!--            <div class="zhe" @click="deleteLogo2">-->
<!--              <img src="./img/delete.png" alt="" class="delete">-->
<!--            </div>-->
          <div class="file-box" v-show="maxlogoImg2">
            <input type="file" class="file-input" @change="fillLogo2" ref="uploadFile2" accept="image/*" multiple="multiple">
          </div>
        </div>
        <div class="shop-tip">{{$t('notOpen.text13')}}</div>
      </div>
      <div class="btn-w common-btn" @click="nextStep">
        <div class="btn">{{$t('notMerchant.text71')}}</div>
      </div>
    </div>
    <slideDialog
      v-show="merchantShow"
      :merchantsType="appliType"
      @selectOne="selectOne"
      @hideDialog="hideDialog">
    </slideDialog>
    <merchantsType
      v-show="merchantsTypeShow"
      @hideMerType="hideMerType"
      @select="select"></merchantsType>
    <m-map v-if="mapShow" @hideMap="hideMap" @positon2="positon2"></m-map>
  </div>
</template>

<script>
  import slideDialog from './chooseMerchant'
  import merchantsType from './merchantsType.vue'
  import mFixedTop from '@/components/mFixedTop'
  import mMap from './map.vue'
  import {compress, dataURItoBlob} from './js/upload'
  export default {
    components: {
      slideDialog,
      merchantsType,
      mFixedTop,
      mMap},
    data() {
      return{
        imgDataObj: [],
        maxlogoImg2: true,
        logoImg2: '',
        textnum2: 0,
        introduceShop: '', // 商户介绍
        isGoBack: true,
        titleName: this.$t('notMerchant.text31'),
        maxlogoImg: true,
        logoLoading: false,
        logoLoading2: false,
        logoImg: '',
        mTypeIndex: '',
        arLogoImg: '',
        merchantName: '',
        shopUrl: '',
        merchantAddress: '',
        detailedAddress: '', // 详细地址
        mapShow: false,
        mType: '',
        merchantsTypeShow: false,
        textnum: 0,
        merchant: this.$t('notMerchant.text32'),
        merchantShow: false,
        merImgList: [],
        merchantIndex: 1,
        merchantsTypeArr:  [this.$t('shops.text36'), this.$t('shops.text37'), this.$t('shops.text38'), this.$t('shops.text39'), this.$t('shops.text40'), this.$t('shops.text41'), this.$t('shops.text42'), this.$t('shops.text43'), this.$t('shops.text44'), this.$t('shops.text47'), this.$t('shops.text45'), this.$t('shops.text46')],
        appliType: [this.$t('notMerchant.text33'),this.$t('notMerchant.text32')],
        longitude: 0,
        latitude: 0
      }
    },
    mounted() {
      if (this.$route.query.bountyMerchant) {
        let merchant = JSON.parse(this.$route.query.bountyMerchant)
        this.merchantName = merchant.merchantName
        this.logoImg = merchant.arLogoImg
        if(this.logoImg) {
          this.maxlogoImg = false
        } else{
          this.maxlogoImg = true
        }
        this.arLogoImg = merchant.arLogoImg
        this.mTypeIndex = merchant.merType
        this.mType = this.merchantsTypeArr[this.mTypeIndex - 1]
        this.longitude = merchant.longitude
        this.latitude = merchant.latitude
        if (merchant.applyType === 1) {
          this.merchantIndex = 1
          this.shopUrl = merchant.shopNetUrl
        } else {
          this.merchantAddress = merchant.merchantAddress
          this.detailedAddress = merchant.realAddress
          this.merchantIndex = 0
        }
        this.merchant = this.appliType[this.merchantIndex]
      }
    },
    methods: {
      positon2 (pos, address) {
        this.latitude = pos.lat
        this.longitude = pos.lng
        this.mapShow = false
        this.merchantAddress = address
      },
      deleteLogo () {
        this.logoImg = ''
        this.arLogoImg = ''
        if(this.logoImg) {
          this.maxlogoImg = false
        } else{
          this.maxlogoImg = true
        }
      },
      deleteLogo2(index) {
        this.imgDataObj.splice(index,1)
        this.maxlogoImg2 = true
      },
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      verifyInput () {
        if (this.merchantName === '') {
          this.toastD(this.$t('notMerchant.text34'))
          return
        }
        if (this.logoImg === '') {
          this.toastD(this.$t('notMerchant.text35'))
          return
        }
        if (this.mType === '') {
          this.toastD(this.$t('notMerchant.text36'))
          return
        }
        // 在线商户
        if (this.merchantIndex === 1) {
          if (this.shopUrl === '') {
            this.toastD(this.$t('notMerchant.text37'))
            return
          }
        }
        // 实体商户
        if (this.merchantIndex === 0) {
          if (this.merchantAddress === '') {
            this.toastD(this.$t('notMerchant.text38'))
            return
          }
          if (this.detailedAddress === '') {
            this.toastD(this.$t('notMerchant.text39'))
            return
          }
        }
        return true
      },
      nextStep () {
        if (this.verifyInput()) {
          let merchOne = {
            merchantName: this.merchantName,
            arLogoImg: this.arLogoImg,
            merType: this.mTypeIndex
          }
          if(this.introduceShop){
            merchOne.merDesc = this.introduceShop // 商户描述
          }
          if(this.merImgList.length > 0) {
            merchOne.merImgList = this.merImgList.join(',') // 商户店铺图片 用 , 分割
          }
          if (this.merchantIndex === 0) {
            merchOne.applyType = 2
            merchOne.merchantAddress = this.merchantAddress
            merchOne.detailedAddress = this.detailedAddress
            merchOne.longitude = this.longitude
            merchOne.latitude = this.latitude
          } else {
            merchOne.longitude = 0
            merchOne.latitude = 0
            merchOne.applyType = 1
            merchOne.shopNetUrl = this.shopUrl
          }
          this.$router.push({
            path: '/stepTwo',
            query: {
              merchOne: JSON.stringify(merchOne),
              editMe: this.$route.query.bountyMerchant
            }
          })
        }
      },
      // 输入文字控制
      textareaVal () {
        this.textnum = this.detailedAddress.length
        if (this.detailedAddress.length > 200) {
          this.textnum = 200
          this.detailedAddress = this.detailedAddress.substring(0, 200)
        }
      },
      textareaVal2() {
        this.textnum2 = this.introduceShop.length
        if (this.introduceShop.length > 200) {
          this.textnum2 = 200
          this.introduceShop = this.introduceShop.substring(0, 200)
        }
      },
      async fillLogo (e) {
//        let image = document.getElementById('img'); //预览对象
//        this.clip(event , {
//          resultObj : image,
//          aspectRatio : 1
//        })
        let imgVal = this.$refs.uploadFile
        let imgObj = imgVal.files[0]
        // console.log(imgObj)
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD('格式不正确')
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        self.logoLoading = true
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let formData = new FormData()
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              let f = new File([this.result], imgObj.name)
              let fileImg
              if (f) {
                fileImg = new File([this.result], imgObj.name)
              } else {
                fileImg = self.$refs.uploadFile.files[0]
              }
              formData.append('file', self.$refs.uploadFile.files[0])
              formData.append('sourceType', 1)
              let config = {
                headers: { 'Content-Type': 'multipart/form-data' }
              }
              self.$fetch.postFormdata(`${self.$api}blobfile/uploadBlobFile`, formData).then(res => {
                if (res.status === 'success') {
                  self.logoLoading = false
                  self.logoImg = res.data[0].fileUrl
                  if(self.logoImg) {
                    self.maxlogoImg = false
                  } else{
                    self.maxlogoImg = true
                  }
                  self.arLogoImg = res.data[0].fileName
                } else {
                  self.logoLoading = false
                  self.toastD(res.msg)
                }
              })
            }
          }
        }
      },
      async fillLogo2 (e) {
        let imgVal = this.$refs.uploadFile2
        let imgObj = imgVal.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD('格式不正确')
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        self.logoLoading2 = true
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let formData = new FormData()
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              let f = new File([this.result], imgObj.name)
              let fileImg
              if (f) {
                fileImg = new File([this.result], imgObj.name)
              } else {
                fileImg = imgVal.files[0]
              }
              formData.append('file', imgVal.files[0])
              formData.append('sourceType', 1)
              let config = {
                headers: {'Content-Type': 'multipart/form-data'}
              }
              self.$fetch.postFormdata(`${self.$api}blobfile/uploadBlobFile`, formData).then(res => {
                if (res.status === 'success') {
                    self.logoLoading2 = false
                    self.imgDataObj.push(res.data[0].fileUrl)
                    self.merImgList.push(res.data[0].fileName)
                    if (self.imgDataObj.length > 2) {
                      self.maxlogoImg2 = false
                    } else {
                      self.maxlogoImg2 = true
                    }
                } else {
                  self.logoLoading2 = false
                  self.toastD(res.msg)
                }
              })
            }
          }
        }
      },
      select (item, index) {
        this.mType = item
        this.mTypeIndex = index + 1
        this.merchantsTypeShow = false
      },
      hideMerType () {
        this.merchantsTypeShow = false
      },
      switchTypes () {
        this.merchantsTypeShow = true
      },
      gotoMap () {
        this.mapShow = true
      },
      hideMap () {
        this.mapShow = false
      },
      showMerchants () {
        this.merchantShow = true
      },
      hideDialog () {
        this.merchantShow = false
      },
      selectOne (t, index) {
        this.merchantIndex = index
        this.merchant = t
        this.hideDialog()
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.fill-msg
  background-color: #fff
  position: absolute
  left: 0
  top: 0
  height: 100%
  width: 100%
  overflow: auto
  .content
    padding: .5rem .4rem 5rem
    box-sizing border-box
    display flex
    flex-direction column
    .file-w
      display: flex
      &.shop-img
        margin-top .3rem
      .uls-item{
        display: flex;
        .li-img{
          position: relative;
          width: 1.4rem;
          height: 1.4rem;
          margin-right: .2rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
          .delete-box{
            border-radius: 0 0 .1rem .1rem;
            background-color: rgba(0,0,0,.5);
            z-index: 9;
            position: absolute;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: .5rem;
            .delete-icon{
              width: .32rem;
              height: .32rem;
              .delete{
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .loading
        width: 1.4rem
        margin-right: .3rem
        img
          width: 100%
          display: block
      .logo-img
        position: relative
        width: 1.4rem
        height: 1.4rem
        margin-right: .3rem
        .logo-a
          width: 100%
          height: 100%
          border-radius 4px
        .zhe
          position: absolute
          left: 0
          bottom: 0
          height: .5rem
          width: 100%
          background-color: rgba(0,0,0,.5)
          display: flex
          align-items center
          justify-content center
          border-radius 0 0 4px 4px
          .delete
            width: .32rem
            display: block
    .shop-tip
      margin-top .2rem
      font-size .14rem
      color #000
    .form-item
      display flex
      align-items center
      &.shop-addre
        align-items flex-start
      &.logo-box
        display block
      &.logo-line
        border-bottom 1px solid rgb(230,230,230)
       padding-bottom  .5rem
      &.introduce
        margin .5rem 0
      .label
        margin-right .2rem
        font-size: .28rem
        color #060f26
        &.label-t
          margin-bottom .5rem
          span
            display inline-block
            color #ccc
            font-size .28rem
      .input-w
        position: relative
        flex 1
        width 100%
        border-bottom 1px solid #e5e5e5
        .arrow
          position: absolute
          right: .3rem
          top: 50%
          transform translateY(-50%)
          width: .15rem
          img
            display block
            width: 100%
      .input
        flex 1
        display: block
        /*border: 1px solid #ebebeb*/
        /*border-bottom #ebebeb*/
        /*padding: 0 .3rem*/
        height: .88rem
        line-height: .88rem
        width: 100%
        /*border-radius 4px*/
        font-size: .28rem
        color #060f26
      .textarea-w
        flex 1
        width: 100%
        height: 2.8rem
        font-size: 12px
        color #060f26
        position: relative
        border-bottom: .02rem solid #BEBEBE
        .area
          padding: .22rem .2rem 0 .3rem 0
          border-radius 6px
          width: 90%
          height: 2rem
        .number
          position: absolute
          text-align: right
          width: 100%
          z-index: 10
          right: 0
          bottom: 0
          margin: 0 .2rem .15rem 0
      .file-box
        width: 1.4rem
        height: 1.4rem
        overflow: hidden
        background: url("./img/upload.png") no-repeat center / cover
        .file-input
          width: 100%
          height: 100%
          opacity: 0
    .btn-w
      position: fixed
      bottom: 0
      left: 0
      width: 100%
      background-color: rgb(255,182,75)
      color #fff
      font-size: .28rem
      z-index: 50
      .btn
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
</style>
