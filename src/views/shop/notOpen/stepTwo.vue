<template>
  <div class="fill-msg">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="content">
      <div class="form-item">
        <div class="label">{{$t('notMerchant.text42')}}</div>
        <div class="input-w">
          <input type="text" :placeholder="$t('notMerchant.text43')" class="input" v-model.trim="legalName">
        </div>
      </div>
      <div class="form-item">
        <div class="label">{{$t('notMerchant.text44')}}</div>
        <div class="input-w">
          <div class="tel-box">
            <div class="area-code" @click="switchCode">
              <span>+ {{mobile[0]}}</span>
            </div>
            <input type="text" maxlength="11" :placeholder="$t('notMerchant.text45')" class="tel-input" v-model.trim="mobile[1]" @input="inputCode()">
          </div>
        </div>
      </div>
<!--      <div class="form-item">-->
<!--        <div class="label">{{$t('notMerchant.text46')}}</div>-->
<!--        <div class="input-w">-->
<!--          <input type="text" :placeholder="$t('notMerchant.text47')" class="input" v-model.trim="idCard">-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="form-item">-->
<!--        <div class="label">{{$t('notMerchant.text48')}}</div>-->
<!--        <input type="text" :placeholder="$t('notMerchant.text49')" class="input" v-model.trim="ocCode">-->
<!--      </div>-->
      <div class="form-item logo-box">
        <div class="label label-t">{{$t('notMerchant.text52')}}</div>
        <div class="file-w">
          <div class="loading" v-show="logoLoading2">
            <img src="../../../assets/img/common/loading.gif" alt="">
          </div>
          <div class="logo-img" v-show="businessImg">
            <img :src="businessImg" alt="" class="logo-a">
            <div class="zhe" @click="deleteBusiness">
              <img src="./img/delete.png" alt="" class="delete">
            </div>
          </div>
          <div class="file-box" v-show="idCard3">
            <input type="file" class="file-input" @change="fillImg2" ref="uploadFile2" accept="image/*" multiple="multiple">
          </div>
        </div>
      </div>
      <div class="form-item logo-box logo-noline">
        <div class="label label-t">{{$t('notOpen.text14')}}</div>
        <div class="logo-img">
<!--          正面-->
          <div class="file-w">
            <div class="loading" v-show="logoLoading0">
              <img src="../../../assets/img/common/loading.gif" alt="">
            </div>
            <div class="logo-img" v-show="idCardArr">
              <img :src="idCardArr" alt="" class="logo-a">
              <div class="zhe" @click="deleteIdCard(1)">
                <img src="./img/delete.png" alt="" class="delete">
              </div>
            </div>
            <div class="file-box ic-card" v-show="idCard1">
              <div class="image-border image-border1"></div>
              <div class="image-border image-border2"></div>
              <div class="image-border image-border3"></div>
              <div class="image-border image-border4"></div>
              <input type="file" class="file-input" @change="fillImg0()" ref="uploadFile0" accept="image/*" multiple="multiple">
            </div>
          </div>
<!--          反面-->
          <div class="file-w fan-ic">
            <div class="loading" v-show="logoLoading1">
              <img src="../../../assets/img/common/loading.gif" alt="">
            </div>
            <div class="logo-img" v-show="idCardArr2">
              <img :src="idCardArr2" alt="" class="logo-a">
              <div class="zhe" @click="deleteIdCard(2)">
                <img src="./img/delete.png" alt="" class="delete">
              </div>
            </div>
            <div class="file-box ic-card2"  v-show="idCard2">
              <div class="image-border image-border1"></div>
              <div class="image-border image-border2"></div>
              <div class="image-border image-border3"></div>
              <div class="image-border image-border4"></div>
              <input type="file" class="file-input" @change="fillImg1()" ref="uploadFile1" accept="image/*" multiple="multiple">
            </div>
          </div>
        </div>
<!--        <div class="file-w">-->
<!--          <div class="logo-img" v-show="idCardArr">-->
<!--            <img :src="idCardArr" alt="" class="logo-a">-->
<!--            <div class="zhe" @click="deleteIdCard(1)">-->
<!--              <img src="./img/delete.png" alt="" class="delete">-->
<!--            </div>-->
<!--          </div>-->
<!--          &lt;!&ndash;          <div class="loading" v-show="logoLoading0">&ndash;&gt;-->
<!--          &lt;!&ndash;            <img src="../../assets/img/common/loading.gif" alt="">&ndash;&gt;-->
<!--          &lt;!&ndash;          </div>&ndash;&gt;-->
<!--          <div class="file-box">-->
<!--            <input type="file" class="file-input" @change="fillImg0()" ref="uploadFile0" accept="image/*" multiple="multiple">-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="btn-tip">
        <div class="tip-l">{{$t('notMerchant.text59')}}</div>
        <div class="tip-r">{{$t('notMerchant.text60')}}</div>
      </div>
<!--      <div class="form-item">-->
<!--        <div class="label">{{$t('notMerchant.text51')}}</div>-->
<!--        <div class="file-w">-->
<!--          <div class="logo-img" v-show="idCardArr2">-->
<!--            <img :src="idCardArr2" alt="" class="logo-a">-->
<!--            <div class="zhe" @click="deleteIdCard(2)">-->
<!--              <img src="./img/delete.png" alt="" class="delete">-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="file-box">-->
<!--            <input type="file" class="file-input" @change="fillImg1()" ref="uploadFile1" accept="image/*" multiple="multiple">-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="btn-w common-btn" @click="submit">
        <div class="btn">{{$t('notMerchant.text53')}}</div>
      </div>
    </div>
    <area-code
      @codeSelect="codeSelect"
      @gobackCode="gobackCode"
      v-show="areaCodeShow"></area-code>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  import mFixedTop from '@/components/mFixedTop'
  import areaCode from './areaCode.vue'
  import Dialog from '@/components/dialog/index'
  export default {
    data() {
      return {
        idCard3: true,
        idCard2: true,
        idCard1: true,
        titleName: this.$t('notMerchant.text31'),
        idCardArr2: '',
        idCardArr: '',
        idCardFile: '',
        idCardFile2: '',
        logoLoading0: false,
        logoLoading1: false,
        logoLoading2: false,
        idCardPositiveImg: '',
        idCardNegativeImg: '',
        businessLicenseImg: '',
        legalName: '',
        mobile: ['86', ''],
        ocCode: '',
        idCard: '',
        businessImg: '',
        areaCodeShow: false
      }
    },
    created () {
      if (this.$route.query.editMe) {
        let merchatM = JSON.parse(this.$route.query.editMe)
        this.legalName = merchatM.legalName
        let mobil = merchatM.mobile
        let m2 = mobil.split(',')
        if (m2.length > 1) {
          this.mobile = m2
        } else {
          let mNUm = mobil.substring(mobil.indexOf(')') + 1, mobil.length)
          let reg = /\((.+?)\)/g
          let ar = mobil.match(reg)[0]
          let areC = ar.substring(1, ar.length - 1)
          this.mobile = [areC, mNUm]
        }
        this.idCard = merchatM.legalCardNumber
        // this.ocCode = merchatM.licenseNumber
        this.idCardArr = merchatM.idCardPositiveImg
        this.idCardArr2 = merchatM.idCardNegativeImg
        this.idCardFile = merchatM.idCardPositiveImg
        this.idCardFile2 = merchatM.idCardNegativeImg
        this.businessLicenseImg = merchatM.businessLicenseImg
        this.businessImg = merchatM.businessLicenseImg
      }
    },
    methods: {
      inputCode () {
        let val = String(this.mobile[1])
        if (!/^\d/.test(val)) { // 不能输入特殊符号+-等
          this.mobile[1] = val.substring(0, val.length - 1)
        }
        if (/^\./.test(this.mobile[1])) { // 如果是"."
          this.mobile[1] = ''
        }
        this.mobile[1] = this.mobile[1].replace(/[^0-9]/g, '') // 只能是数字
      },
      deleteIdCard (tag) {
        if (tag === 1) {
          this.idCardArr = ''
          this.idCardFile = ''
          this.idCard1 = true
        } else {
          this.idCardArr2 = ''
          this.idCardFile2 = ''
          this.idCard2 = true
        }
      },
      deleteBusiness () {
        this.businessImg = ''
        this.businessLicenseImg = ''
        this.idCard3 = true
      },
      switchCode () {
        this.areaCodeShow = true
      },
      gobackCode () {
        this.areaCodeShow = false
      },
      codeSelect (item) {
        this.mobile[0] = item.code
        this.areaCodeShow = false
      },
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      // 表单验证
      verifyInput () {
        if (this.legalName === '') {
          this.toastD(this.$t('notMerchant.text54'))
          return
        }
        let regTel = /^[0-9]+$/
        if (this.mobile[1] === '') {
          this.toastD(this.$t('notMerchant.text55'))
          return
        } else if (!regTel.test(this.mobile[1])) {
          this.toastD(this.$t('notMerchant.text56'))
          return
        }
        // if (this.idCard === '') {
        //   this.toastD(this.$t('notMerchant.text57'))
        //   return
        // }
        // if (this.ocCode === '') {
        //   this.toastD(this.$t('notMerchant.text58'))
        //   return
        // }
        if (this.idCardFile === '') {
          this.toastD(this.$t('notMerchant.text59'))
          return
        }
        if (this.idCardFile2 === '') {
          this.toastD(this.$t('notMerchant.text60'))
          return
        }
        if (this.businessLicenseImg === '') {
          this.toastD(this.$t('notMerchant.text61'))
          return
        }
        return true
      },
      // 提交
      submit () {
        let areC
        if (this.mobile[0]) {
          areC = this.mobile[0]
        } else {
          areC = '86'
        }
        // let mobil = `(${areC})${this.mobile[1]}`
        if (this.verifyInput()) {
          let merchOne = JSON.parse(this.$route.query.merchOne)
          let merchTwo = {
            merchantName: merchOne.merchantName,
            arLogoImg: merchOne.arLogoImg,
            merType: merchOne.mTypeIndex,
            merDesc: merchOne.introduceShop,
            merImgList: merchOne.merImgList,
            applyType: merchOne.applyType,
            longitude : merchOne.longitude,
            latitude: merchOne.latitude,
            legalName: this.legalName,//法人名字
            phoneCode:areC, //(必填)手机区号
            mobile: this.mobile[1],//商家电话
            // legalCardNumber: this.idCard,//法人证件号码
            // licenseNumber: this.ocCode, // 营业执照号
            idCardPositiveImg: this.idCardFile,//身份证正面图片地址
            idCardNegativeImg: this.idCardFile2,//身份证反面图片地址
            businessLicenseImg: this.businessLicenseImg//营业执照图片
          }
          if (merchOne.applyType === 1) {
            merchTwo.shopUrl = merchOne.shopNetUrl
          } else if (merchOne.applyType === 2) {
            merchTwo.merchantAddress = merchOne.merchantAddress,
            merchTwo.detailedAddress = merchOne.detailedAddress
          }
          let data = Object.assign(JSON.parse(this.$route.query.merchOne), merchTwo)
          let url = ''
          if(this.$route.query.editMe) {
            url = `${this.$api}shopMine/modifyMerchantAudit` // 1.6.1 支付即藏宝修改商户信息（需后台审核）
          } else {
            url = `${this.$api}shopMine/applyMerchant`  // //1.6 支付即藏宝申请成为商户
          }
          Dialog({
            content: this.$t('notOpen.text1'),
            // okText: this.$t('notMerchant.text63'),
            // cancelText: '取消',
            type: 'confirm',
            okFn: () =>{  // 申请类型 1：在线商户 2：实体商户
                this.$fetch.post(url, merchTwo).then(res => {
                  if (res.status === 'success') {
                    let status = res.data.status
                    if(status === 1 || status === 3 || status === 4 || status === 5) {
                      this.$router.push({
                        path: '/reason',
                        query: {
                          merchatData: JSON.stringify(res.data)
                        }
                      })
                    } else if(status === 2) {
                      this.$router.push({
                        path: '/openShop'
                      })
                    }
                  } else {
                    this.toastD(res.msg)
                  }
                })
              }
          })
        }
      },
      meStatus() {
        this.$fetch.post('/bountyMerchant/merchantStatus').then(res => {
          if (res.state === 'success') {
            let status = res.data.status
            if (status === 1 || status === 3 || status === 4 || status === 5) {
              this.$router.push({
                path: '/reason',
                query: {
                  merchatData: JSON.stringify(res.data)
                }
              })
            } else if (status === 2) {
              this.$router.push({
                path: '/openShop',
                query: {
                  merchatData: JSON.stringify(res.mapData),
                  count: res.mCount
                }
              })
            }
          }
        })
      },
      // 身份证正面
      fillImg0 () {
        let imgVal = this.$refs.uploadFile0
        let imgObj = imgVal.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD(this.$t('notOpen.text15'))
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        this.logoLoading0 = true
        this.idCard1 = false
        let formData = new FormData()
        formData.append('file', this.$refs.uploadFile0.files[0])
        formData.append('sourceType', 1)
        this.$fetch.postFormdata(`${this.$api}blobfile/uploadBlobFile`, formData).then(res => {
          if (res.status === 'success') {
            this.logoLoading0 = false
            this.idCard1 = false
            this.idCardArr = res.data[0].fileUrl
            this.idCardFile = res.data[0].fileName
          } else {
            this.logoLoading0 = false
            this.toastD(res.msg)
          }
        }).catch(() => {
          this.logoLoading0 = false
          this.toastD(this.$t('notOpen.text16'))
        })
        imgVal.value = ''
      },
      // 身份证反面
      fillImg1 () {
        let imgVal = this.$refs.uploadFile1
        let imgObj = imgVal.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD(this.$t('notOpen.text15'))
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        this.logoLoading1 = true
        this.idCard2 = false
        let formData = new FormData()
        formData.append('file', this.$refs.uploadFile1.files[0])
        formData.append('sourceType', 1)
        this.$fetch.postFormdata(`${this.$api}blobfile/uploadBlobFile`, formData).then(res => {
          if (res.status === 'success') {
            this.logoLoading1 = false
            this.idCard2 = false
            this.idCardArr2 = res.data[0].fileUrl
            this.idCardFile2 = res.data[0].fileName
          } else {
            this.logoLoading1 = false
            this.toastD(res.msg)
          }
        }).catch(() => {
          this.logoLoading1 = false
          this.toastD(this.$t('notOpen.text16'))
        })
        imgVal.value = ''
      },
      // 营业执照
      fillImg2 (e) {
        let imgVal = this.$refs.uploadFile2
        let imgObj = imgVal.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD(this.$t('notOpen.text15'))
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        this.logoLoading2 = true
        this.idCard3 = false
        let formData = new FormData()
        formData.append('file', this.$refs.uploadFile2.files[0])
        formData.append('sourceType', 1)
        this.$fetch.postFormdata(`${this.$api}blobfile/uploadBlobFile`, formData).then(res => {
          if (res.status === 'success') {
            this.logoLoading2 = false
            this.idCard3 = false
            this.businessImg = res.data[0].fileUrl
            this.businessLicenseImg = res.data[0].fileName
          } else {
            this.logoLoading2 = false
            this.toastD(res.msg)
          }
        }).catch(() => {
          this.logoLoading2 = false
          this.toastD(this.$t('notOpen.text16'))
        })
        imgVal.value = ''
      },
    },
    components: {
      mFixedTop,
      areaCode
    }
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
      padding: .5rem .3rem 3rem
      box-sizing border-box
      display flex
      flex-direction column
      background-color: #fff
      .file-w
        display: flex
        margin-right .6rem
        &.fan-ic
          margin-right 0!important
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
      .btn-tip
        display flex
        justify-content center
        font-size .14rem
        color #000
        .tip-l
          margin-right .6rem
      .form-item
        display flex
        align-items center
        margin-bottom: .4rem
        &.logo-box
          display block
          border-bottom 1px solid #e5e5e5
          padding-bottom .3rem
        &.logo-noline
          border-bottom none
          margin-bottom: 0
        .logo-img
          display flex
          justify-content center
        .tel-box
          display: flex
          height: .88rem
          width: 100%
          /*border: 1px solid #ebebeb*/
          border-radius 4px
          .area-code
            font-size: 12px
            color #060f26
            text-align: center
            display: flex
            align-items center
            justify-content center
            height: 100%
            span
              /*padding: 0 .3rem*/
              padding-right .3rem
              border-right: 1px solid #ebebeb
          .tel-input
            flex 1
            height: 100%
            padding: 0 .3rem
            font-size: 12px
            color #060f26
        .label
          font-size: .28rem
          color #060f26
          margin-right .2rem
          &.label-t
            margin-bottom .3rem
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
          display: block
          /*border: 1px solid #ebebeb*/
          /*padding: 0 .3rem*/
          height: .88rem
          width: 100%
          /*border-radius 4px*/
          font-size: .28rem
          color #060f26
        .file-box
          width: 1.4rem
          height: 1.4rem
          /*overflow: hidden*/
          background: url("./img/upload.png") no-repeat center / cover
          position relative
          .image-border {
            position: absolute;
            width: 15px;
            height: 15px;
          }
          .image-border1 {
            top: 0;
            left: -6px;
            border-left: 2px solid #E9E9E9;
            border-top: 2px solid #E9E9E9;
          }
          .image-border2 {
            top: 0;
            right: -6px;
            border-right: 2px solid #E9E9E9;
            border-top: 2px solid #E9E9E9;
          }
          .image-border3 {
            bottom: 0;
            left: -6px;
            border-bottom: 2px solid #E9E9E9;
            border-left: 2px solid #E9E9E9;
          }
          .image-border4 {
            bottom: 0;
            right: -6px;
            border-right: 2px solid #E9E9E9;
            border-bottom: 2px solid #E9E9E9;
          }
          &.ic-card
            width: 2rem
            height: 1.6rem
            background url("./img/ic-zheng.png") no-repeat center / cover
          &.ic-card2
            width: 2rem
            height: 1.6rem
            background url("./img/ic-fan.png") no-repeat center / cover
          .file-input
            width: 100%
            height: 100%
            opacity: 0
      .btn-w
        position: fixed
        bottom: 0
        left: 0
        width: 100%
        background-color:  rgb(255,182,75)
        color #fff
        font-size: .28rem
        .btn
          width: 100%
          height: 1rem
          display: flex
          align-items center
          justify-content center
</style>
