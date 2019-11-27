<template>
  <div class="wrapper">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <ul>
      <li>
        <div class="tips">LOGO <span class="prompt">{{$t('addAddress.text32')}}</span></div>
        <div class="edit-img-box">
<!--          <ul class="already-pic">-->
<!--            <li v-for="(item, index) in splitImg(info.arLogoImg)" :key="item.index">-->
<!--              <img :src="item" />-->
<!--              <i class="close cubeic-wrong" @click="deleteImg(1, index)"></i>-->
<!--            </li>-->
<!--          </ul>-->
<!--          <div class="upload-pic-box">-->
<!--            <cube-upload-->
<!--              ref="upload"-->
<!--              v-model="files"-->
<!--              :simultaneous-uploads="1"-->
<!--              :max="1"-->
<!--              @file-removed="removedPic"-->
<!--              @file-submitted="submitPic"-->
<!--              @file-error="errHandler">-->
<!--              <div class="clear-fix">-->
<!--                <cube-upload-file v-for="(file, i) in files" :file="file" :key="i"></cube-upload-file>-->
<!--                <cube-upload-btn>-->
<!--                  <div v-show="info.arLogoImg === '' && files.length !== 1">-->
<!--                    <img class="upload_file" src="./img/add.svg" />-->
<!--                  </div>-->
<!--                </cube-upload-btn>-->
<!--              </div>-->
<!--            </cube-upload>-->
<!--          </div>-->
          <div class="file-w">
            <div class="logo-img" v-for="(item, index) in logoImg2" :key="index">
              <img :src="item" alt="" class="logo-a">
              <!--            <i class="close cubeic-wrong" @click="deleteImg(1, index)"></i>-->
              <div class="zhe" @click="deleteLogo(2, index)">
                <img src="./notOpen/img/delete.png" alt="" class="delete">
              </div>
            </div>
            <div class="file-box" v-show="maxlogoImg2">
              <input type="file" class="file-input" @change="fillLogo(2)" ref="uploadFile2" accept="image/*" multiple="multiple">
            </div>
          </div>
        </div>
      </li>
      <li class="no-bottom">
        <div class="tips">{{$t('addAddress.text33')}}</div>
        <div class="textarea-box">
          <textarea v-model="intrShopText" :placeholder="$t('notOpen.text12')" maxlength="500" />
          <span class="calcText">{{calcTextNum ? calcTextNum : 0}}/500</span>
        </div>
      </li>
      <li class="no-bottom">
        <div class="edit-img-box">
          <div class="file-w">
<!--            <div class="loading" v-show="logoLoading">-->
<!--              <img src="../../assets/img/common/loading.gif" alt="">-->
<!--            </div>-->
            <div class="logo-img" v-for="(item, index) in logoImg" :key="index">
              <img :src="item" alt="" class="logo-a">
              <div class="zhe" @click="deleteLogo(1,index)">
                <img src="./notOpen/img/delete.png" alt="" class="delete">
              </div>
            </div>
            <div class="file-box" v-show="maxlogoImg">
              <input type="file" class="file-input" @change="fillLogo(1)" ref="uploadFile" accept="image/*" multiple="multiple">
            </div>
          </div>
<!--          <ul class="already-pic">-->
<!--            <li v-for="(item, index) in imgList" :key="item.index">-->
<!--              <img :src="item" />-->
<!--              <i class="close cubeic-wrong" @click="deleteImg(2, index)"></i>-->
<!--            </li>-->
<!--          </ul>-->
<!--          <div class="upload-pic-box">-->
<!--            <cube-upload-->
<!--              ref="upload"-->
<!--              v-model="filesProduct"-->
<!--              :simultaneous-uploads="1"-->
<!--              :max="calcImgs"-->
<!--              @file-removed="removedProPic"-->
<!--              @file-submitted="submitProPic"-->
<!--              @file-error="errHandler">-->
<!--              <div class="clear-fix">-->
<!--                <cube-upload-file v-for="(proFile, i) in filesProduct" :file="proFile" :key="i"></cube-upload-file>-->
<!--                <cube-upload-btn>-->
<!--                  <div v-show="filesProduct.length !== calcImgs">-->
<!--                    <img class="upload_file" src="./img/add.svg" />-->
<!--                  </div>-->
<!--                </cube-upload-btn>-->
<!--              </div>-->
<!--            </cube-upload>-->
<!--          </div>-->
        </div>
        <div class="tips">{{$t('addAddress.text34')}}</div>
      </li>
    </ul>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <div class="btn common-btn" @click="save">
      <div class="btn-sure">{{$t('addAddress.text35')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {uploadimg} from '../../api/complaint'
import {compress, dataURItoBlob} from '../../assets/js/upload'

export default {
  name: "modifyOne",
  components: {mFixedTop},
  data() {
    return {
      loadShow: true,
      titleName: this.$t('addAddress.text36'),
      info: {},
      files: [],
      filesProduct: [],
      images: [],
      imagesProduct: [],
      intrShopText: '',
      imgList: [],
      maxlogoImg: true,
      maxlogoImg2: true,
      logoImg: [],
      logoImg2: [],
    }
  },
  mounted() {
    this.getMerchantInfo()
  },
  computed: {
    calcTextNum() {
      let len
      if (this.intrShopText && this.intrShopText !== '') {
        len = this.intrShopText.length
      }
      return len
    },
    calcImgs() {
      let len
      if (this.imgList.length !== 0 && this.imgList) {
        if (this.imgList.length > 1) {
          len = 3 - this.imgList.length
        } else {
          len = 2
        }
      } else {
        len = 3
      }
      return len
    },
  },
  methods: {
    async fillLogo (index) {
      let imgVal = ''
      if (index === 1) {
        imgVal = this.$refs.uploadFile
      } else {
        imgVal = this.$refs.uploadFile2
      }
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
              fileImg = imgVal.files[0]
            }
            formData.append('file', imgVal.files[0])
            formData.append('sourceType', 1)
            let config = {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
            self.$fetch.postFormdata(`${self.$api}blobfile/uploadBlobFile`, formData).then(res => {
              if (res.status === 'success') {
                if (index === 1) {
                  self.logoImg.push(res.data[0].fileUrl)
                  if (self.logoImg.length > 3) {
                    self.maxlogoImg = false
                  } else {
                    self.maxlogoImg = true
                  }
                } else {
                  self.logoImg2.push(res.data[0].fileUrl)
                  // self.arLogoImg2.push(res.data[0].fileName)
                  self.maxlogoImg2 = false
                }
              } else {
                // self.logoLoading = false
                self.toastD(res.msg)
              }
            })
          }
        }
      }
    },
    deleteLogo (flag, index) {
      if (flag === 1) {
        this.logoImg.splice(index, 1)
        this.maxlogoImg = true
      } else {
        this.logoImg2.splice(index, 1)
        this.maxlogoImg2 = true
      }
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
    removedProPic() {
      this.imagesProduct.pop()
    },
    removedPic() {
      this.images.pop()
    },
    deleteImg(num, index) {
      if (num === 1) {
        this.info.arLogoImg = ''
      } else {
        this.imgList.splice(index, 1)
      }
    },
    submitPic(file) {
      let f = file.file
      uploadimg(f, 1).then((res) => {
        if (res.data.status === 'success') {
          let list = res.data.data
          let imgUrl = ''
          list.forEach((item) => {
            imgUrl = item.fileUrl
            this.images.push(imgUrl)
          })
        } else {
          this.toastD(this.$t('shops.text8'))
          this.files.pop() // 把不符合的文件删除
        }
      })
    },
    submitProPic(file) {
      let f = file.file
      uploadimg(f, 1).then((res) => {
        if (res.data.status === 'success') {
          let list = res.data.data
          let imgUrl = ''
          list.forEach((item) => {
            imgUrl = item.fileUrl
            this.imagesProduct.push(imgUrl)
          })
        } else {
          this.toastD(this.$t('shops.text8'))
          this.filesProduct.pop() // 把不符合的文件删除
        }
      })
    },
    getMerchantInfo() {
      let id = this.$route.query.id
      this.$http.post(`${this.$api}shopMine/getMerchantInfoByMerchantId?merchantId=${id}`).then(res => {
        if (res.data.status === 'success') {
          this.loadShow = false
          this.info = res.data.data
          this.intrShopText = this.info.merDesc
          if(this.info.arLogoImg) {
            this.logoImg2 = this.info.arLogoImg.split(',')
          }
          if(this.logoImg2.length > 0) {
            this.maxlogoImg2 = false
          } else {
            this.maxlogoImg2 = true
          }
          if(this.info.merImgList) {
            this.logoImg = this.info.merImgList.split(',')
          }
          if(this.logoImg.length > 2) {
            this.maxlogoImg = false
          } else {
            this.maxlogoImg = true
          }
        }
      })
    },
    errHandler(file) {
      this.toastD('Upload failed')
    },
    verifyErr() {
      if(this.logoImg2.length === 0) {
        this.toastD(this.$t('categories.text5'))
        return false
      }
      if(this.intrShopText === '') {
        this.toastD(this.$t('notOpen.text12'))
        return false
      }
      if(this.logoImg.length === 0) {
        this.toastD(this.$t('categories.text6'))
        return false
      }
      return  true
    },
    save() {
    
      if(this.verifyErr()) {
        let arLogoImg = this.logoImg2.join(',')
        let merImgListStr = this.logoImg.join(',')
        let merDesc = this.intrShopText
        this.loadShow = true
        this.$fetch.post(`${this.$api}shopMine/modifyMerchantSet`, {
          arLogoImg: arLogoImg,
          merImgList: merImgListStr,
          merDesc: merDesc,
        }).then(res => {
          this.loadShow = false
          this.toastD(res.msg)
          setTimeout(() => {
            this.$router.push({
              path: '/userInformation',
              query: {
                merchantId: this.$route.query.id
              }
            })
          }, 500)
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .no-bottom {
    border-bottom none !important
  }

  .cube-upload-btn {
    width 1.4rem
    height 1.4rem
    overflow inherit
  }

  .iosx {
    .wrapper {
      padding-top 50px
    }
  }

  .upload-pic-box
    margin-top 20px
    width 1.4rem
    height 1.4rem
    .upload_file
      width 1.4rem
      height 1.4rem
      z-index 999

  .wrapper
    position relative
    /*min-height 100vh*/
    font-size .3rem
    padding-top 30px
    ul
      margin-top 20px
      padding 0 .3rem
      li
        border-bottom 1px solid #eee
        padding 10px 0 10px
        .tips
          .prompt
            color rgb(153, 153, 153)
        .textarea-box
          padding 0 .3rem
          font-size 16px
          height 5rem
          position relative
          border 1px solid #ccc
          textarea
            margin-top 10px
            width 100%
            height 4rem
          .calcText
            position absolute
            bottom 10px
            right 10px
        .edit-img-box
          display flex
          flex-direction row
          align-items center
          margin 0.1rem 0 0.4rem
          .already-pic
            display flex
            flex-direction row
            li
              padding 0
              position relative
              width: 1.4rem !important;
              margin-right 10px
              height: 1.4rem !important;
              border-bottom none
              img
                max-width 100%
                max-height 100%
              .close
                position: absolute;
                z-index: 2;
                top: -2px;
                right: -2px;
                color: rgba(0, 0, 0, 0.8);
                font-size: 16px;
                background-color: #fff;
                border-radius: 50%;
                &::before {
                  display: inline-block;
                  -webkit-transform: scale(1.625);
                  transform: scale(1.625);
                  -webkit-transform-origin: center;
                  transform-origin: center;
                }

        .tips
          margin 15px 0
    .btn {
      position: fixed
      bottom: 0
      left: 0
      width: 100%
      background-color: rgb(255, 182, 75)
      color #fff
      font-size: .28rem
      z-index: 50
      .btn-sure {
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
      }
    }
  .file-w
    display: flex
    flex-wrap wrap
   .loading
     width: 1.4rem
     margin-right: .3rem
     img
       width: 100%
       display: block
    .file-box
      width: 1.4rem
      min-width 1.4rem
      height: 1.4rem
      margin-bottom: .3rem
      overflow: hidden
      background: url("./notOpen/img/upload.png") no-repeat center / cover
      .file-input
        width: 100%
        height: 100%
        opacity: 0
    .loading
      width: 1.4rem
      min-width 1.4rem
      margin-bottom: .3rem
      margin-right: .3rem
      img
        width: 100%
        display: block
    .logo-img
      position: relative
      width: 1.4rem
      min-width 1.4rem
      height: 1.4rem
      margin-bottom: .3rem
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
</style>
