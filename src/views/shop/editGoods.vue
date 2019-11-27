<template>
  <div class="shop">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="shopInfo">
      <ul class="uls-one">
        <li @click="showCurrType">
          <div class="title">{{$t('addAddress.text8')}}</div>
          <div class="input-box">
            <span class="hasColor">{{curType}}</span>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li>
          <div class="title">{{$t('goodmanage.text3')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text4')" v-model.trim="productName" maxlength="25"
                   style="width: 5rem">
          </div>
        </li>
        <li @click="showCurrency">
          <div class="title">{{$t('goodmanage.text5')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text6')" v-model.trim="currency" disabled>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li @click="gotoPrice(0)">
          <div class="title">{{$t('addAddress.text9')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text8')" v-model.trim="productPrice"
                   @input="inputNum('productPrice', 1)" disabled>
            <span class="precet">{{currency}}</span>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li @click="gotoDialog">
          <div class="title">{{$t('goodmanage.text9')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text10')" v-model.trim="stock"
                   @input="inputNum2('stock', 2)" disabled>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li @click="showGoodsCategory">
          <div class="title">{{$t('goodmanage.text11')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text12')" v-model.trim="curtData" disabled>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li>
          <div class="title">{{$t('goodmanage.text13')}}</div>
          <div class="input-box">
            <cube-switch v-model="status"></cube-switch>
          </div>
        </li>
      </ul>
      <div class="title-w title-tips">{{$t('goodmanage.text14')}}</div>
      <div class="uls-one">
        <li @click="gotoPrice(1)" class="li-item">
          <div class="title">{{$t('goodmanage.text16')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text17')" v-model.trim="productProfitRate"
                   @input="inputNum2('productProfitRate', 3)" disabled>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
      </div>
      <div class="flex-between">
        <div class="gray">{{$t('goodmanage.text18')}}</div>
        <div>{{mapAmount | fourNumber}}π</div>
      </div>
      <div class="flex-between bottom-line">
        <div class="gray">{{$t('goodmanage.text19')}}</div>
        <div>{{presentCount}}{{$t('goodmanage.text20')}}</div>
      </div>
      <div class="title-w">{{$t('goodmanage.text22')}}</div>
      <p class="title-a">{{$t('goodmanage.text23')}}</p>
      <div class="edit-img-box">
<!--        <ul class="already-pic">-->
<!--          <li v-for="(item, index) in contentImgOne" :key="item.index">-->
<!--            <img :src="item" />-->
<!--            <i class="close cubeic-wrong" @click="deleteImg(1, index)"></i>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <div class="upload-pic-box">-->
<!--          <cube-upload-->
<!--            ref="upload"-->
<!--            v-model="files"-->
<!--            :simultaneous-uploads="1"-->
<!--            :max="calcImgs"-->
<!--            @file-removed="removedPic"-->
<!--            @file-submitted="submitPic"-->
<!--            @file-error="errHandler">-->
<!--            <div class="clear-fix">-->
<!--              <cube-upload-file v-for="(file, i) in files" :file="file" :key="i"></cube-upload-file>-->
<!--              <cube-upload-btn>-->
<!--                <div v-show="files.length !== calcImgs">-->
<!--                  <img class="upload_file" src="./img/add.svg" />-->
<!--                </div>-->
<!--              </cube-upload-btn>-->
<!--            </div>-->
<!--          </cube-upload>-->
<!--        </div>-->
        <div class="file-w">
          <div class="logo-img" v-for="(item, index) in logoImg" :key="index">
            <img :src="item" alt="" class="logo-a">
<!--            <i class="close cubeic-wrong" @click="deleteImg(1, index)"></i>-->
            <div class="zhe" @click="deleteLogo(1, index)">
              <img src="./notOpen/img/delete.png" alt="" class="delete">
            </div>
          </div>
          <div class="file-box" v-show="maxlogoImg">
            <input type="file" class="file-input" @change="fillLogo(1)" ref="uploadFile" accept="image/*" multiple="multiple">
          </div>
        </div>
      </div>
      <div class="flex-i">
        <p class="title-a">{{$t('goodmanage.text24')}}（{{productContent.length}}/25）</p>
        <div class="textarea-w">
                    <textarea class="task-textarea" :placeholder="$t('goodmanage.text25')" @input="textareaVal"
                              v-model.trim="productContent"></textarea>
        </div>
      </div>
      <p class="title-a">{{$t('goodmanage.text26')}}</p>
      <div class="upload-pic-box">
<!--        <ul class="already-pic">-->
<!--          <li v-for="(item, index) in contentImg" :key="item.index">-->
<!--            <img :src="item" />-->
<!--            <i class="close cubeic-wrong" @click="deleteImg(2, index)"></i>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <cube-upload-->
<!--          ref="upload"-->
<!--          v-model="filesProduct"-->
<!--          :simultaneous-uploads="1"-->
<!--          :max="calcProImgs"-->
<!--          @file-removed="removedProPic"-->
<!--          @file-submitted="submitProPic"-->
<!--          @file-error="errHandler">-->
<!--          <div class="clear-fix">-->
<!--            <cube-upload-file v-for="(proFile, i) in filesProduct" :file="proFile" :key="i"></cube-upload-file>-->
<!--            <cube-upload-btn>-->
<!--              <div v-show="filesProduct.length !== calcProImgs">-->
<!--                <img class="upload_file" src="./img/add.svg" />-->
<!--              </div>-->
<!--            </cube-upload-btn>-->
<!--          </div>-->
<!--        </cube-upload>-->
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
      <div class="err-class">{{$t('goodmanage.text27')}}</div>
    </div>
    <div class="btn-box common-btn">
      <div class="edit common-btn" @click="submit">{{$t('goodmanage.text28')}}</div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <!-- 收款类型 -->
    <receive-type v-show="showReceiveTypeList" @goback="gobackReceiveList" @hide="hide"
                  :curIndex="obj.priceType"></receive-type>

    <!-- 价格币种 -->
    <currencyData v-show="isCurreny" @goback="goback"></currencyData>

    <!-- 商品类目 -->
    <goods-category v-show="isShowGoodsCategory" @goback="gobackGoodsCategory" @select="select" :curtData="curtData"  @hide="hide2"></goods-category>

    <!-- 输入价格的容器 -->
    <number-rate-dialog v-if="rateShow"
                        :rateShow="rateShow"
                        :fIndex="fIndex"
                        :placeholderTip="placeholderTip"
                        :productPrice="productPrice2"
                        :productProfitRate="productProfitRate2"
                        :currency="currency"
                        @selectOne="selectRate"
                        @hideDialog="hideRate"
    ></number-rate-dialog>

    <slideDialog
      :merchantShow="merchantShow"
      :merchantsType="appliType"
      @selectOne="selectOne"
      @hideDialog="hideDialog">
    </slideDialog>

    <bottomDialog
      v-if="bottomShow"
      :merchantShow="bottomShow"
      :fIndex="fIndex"
      :title="dialogTitle"
      :inputNumber="inputNumber"
      :isTips="isTips"
      :isADD="isADD"
      :stock="stock"
      :placeholderText="placeholderText"
      @selectOne="selectF"
      @hideDialog="hideD">
    </bottomDialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import slideDialog from '@/components/slideDialog'
import currencyData from './currencyData.vue'
import receiveType from './showReceiveTypeList'
import goodsCategory from './goodsCategory'
import numberRateDialog from './numberRateDialog'
import bottomDialog from './bottomDialog'
import {uploadimg} from '../../api/complaint'
import {auditProduct} from '../../api/auditProduct'
import {compress, dataURItoBlob} from '../../assets/js/upload'

export default {
  components: {mFixedTop, currencyData, receiveType, goodsCategory, numberRateDialog, bottomDialog, slideDialog},
  data() {
    return {
      loadShow: true,
      bottomShow: false,
      isGoBack: true,
      files: [],
      filesProduct: [],
      images: [],
      imagesProduct: [],
      placeholderText: '',
      titleName: this.$t('addAddress.text24'),
      curType: this.$t('addAddress.text10'),
      showReceiveTypeList: false,
      isShowGoodsCategory: false,
      maxlogoImg: true,
      maxlogoImg2: true,
      rateShow: false,
      merchantShow: false,
      fIndex: 0,
      placeholderTip: '',
      typeShow: false,
      mapAmount: 0,
      isTips: true,
      isADD: true,
      presentCount: 0,
      systemRate: 0,
      isCurreny: false,
      productName: '', //	string	产品名称
      productPrice2: 0,
      productPrice: '', //		string	产品价格
      currency: 'π', //		string	产品币种
      stock: '', //		int	库存
      catId: '', //		long	产品类目ID
      appliType: [this.$t('goodmanage.text42'), this.$t('goodmanage.text44')],
      status: false, //		int	状态 1上架 2下架
      productImg: '', //		string	产品图片
      productContent: '', //		string	产品内容
      contentImg: '', //		string	产品内容图
      contentImgOne: '',
      productProfitRate2: 0,
      productProfitRate: '', //		string	产品返利比率
      logoImg2: [],
      logoImg: [],
      arLogoImg: [],
      arLogoImg2: [],
      addNum: 0,
      realAddress: '',
      logoLoading: false,
      curtData: '',
      merchantData: JSON.parse(this.$store.state.merchantInfo),
      obj: {},
      imageListStr: [],
      imageList: [],
      imageListPro: []
    }
  },
  mounted() {
    this.getGoodsInfo()
  },
  computed: {
    calcImgs() {
      let len
      if (this.contentImgOne && this.contentImgOne.length !== 0) {
        if (this.contentImgOne.length > 1) {
          len = 4 - this.contentImgOne.length
        } else {
          len = 3
        }
      } else {
        len = 4
      }
      return len
    },
    calcProImgs() {
      let len
      if (this.contentImg && this.contentImg.length !== 0) {
        if (this.contentImg.length > 1) {
          len = 4 - this.contentImg.length
        } else {
          len = 3
        }
      } else {
        len = 4
      }
      return len
    }
  },
  methods: {
    hide2() {
      this.isShowGoodsCategory = false
    },
    deleteLogo (flag, index) {
      if (flag === 1) {
        this.logoImg.splice(index, 1)
        this.arLogoImg.splice(index, 1)
        this.maxlogoImg = true
      } else {
        this.logoImg2.splice(index, 1)
        this.arLogoImg2.splice(index, 1)
        this.maxlogoImg2 = true
      }
    },
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
          this.toastD(this.$t('shop.text5'))
          imgVal.value = ''
          return
        }
      } else {
        return
      }
      let reader = new FileReader()
      let self = this
      reader.readAsDataURL(imgObj)
      // self.logoLoading = true
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
                  self.arLogoImg.push(res.data[0].fileName)
                  if (self.logoImg.length > 3) {
                    self.maxlogoImg = false
                  } else {
                    self.maxlogoImg = true
                  }
                } else {
                  self.logoImg2.push(res.data[0].fileUrl)
                  self.arLogoImg2.push(res.data[0].fileName)
                  if (self.logoImg2.length > 3) {
                    self.maxlogoImg2 = false
                  } else {
                    self.maxlogoImg2 = true
                  }
                }
              } else {
                self.toastD(res.msg)
              }
            })
          }
        }
      }
    },
    gotoDialog() {
      this.fIndex = 0
      this.merchantShow = true
    },
    hideD () {
      this.bottomShow = false
    },
    selectOne(item, index) {
      this.merchantShow = false
      this.dialogTitle = ''
      this.inputNumber = String(this.stock)
      this.fIndex = index
      this.bottomShow = true
    },
    hideDialog() {
      this.merchantShow = false
    },
    selectF (num) {
      this.bottomShow = false
      let stock
      if (this.fIndex === 0) {
        stock = num
      } else {
        stock = '-' + num
      }
      this.$fetch.post(`${this.$api}shopMine/merchantProductAddStock`,{
        productId: this.$route.query.id,
        stock: stock
      }).then(res => {
        if(res.status === 'success'){
          this.toastD(this.$t('goodmanage.text56'))
          this.getGoodsInfo()
        } else {
          this.toastD(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    deleteImg(num, index) {
      if (num === 1) {
        this.contentImgOne.splice(index, 1)
      } else {
        this.contentImg.splice(index, 1)
      }
    },
    hide() {
      this.showReceiveTypeList = false
    },
    goPath() {
      this.$router.push('/goodsmanage')
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
    // 得到商品详情
    getGoodsInfo() {
      let productId = this.$route.query.id
      this.$http.post(`${this.$api}/shopMine/getProductInfoByProductId?productId=${productId}`).then((res) => {
        if (res.data.status === "success") {
          // 商品信息
          // console.log(res.data.data)
          this.loadShow = false
          this.obj = res.data.data
          this.logoImg2 = this.obj.contentImg.split(',')
          this.logoImg = this.obj.imageList.split(',')
          if (this.logoImg.length > 3) {
            this.maxlogoImg = false
          } else {
            this.maxlogoImg = true
          }
          if (this.logoImg2.length > 3) {
            this.maxlogoImg2 = false
          } else {
            this.maxlogoImg2 = true
          }
          // 币种类型
          if (this.obj.priceType === 1) {
            this.curType = this.$t('addAddress.text10')
          } else {
            this.curType = this.$t('addAddress.text25')
          }
          this.productName = this.obj.productName
          if (this.obj.currency === 'PAI') {
            this.currency = 'π'
          } else {
            this.currency = this.obj.currency
          }
          this.stock = this.obj.stock
          this.curtData = this.obj.catName
          if (this.obj.status === 1) {
            this.status = true
          } else {
            this.status = false
          }
          this.productProfitRate = this.obj.productProfitRate
          this.selectRate(this.obj.productProfitRate)
          this.productPrice = this.obj.productPriceTotal
          this.productContent = this.obj.productContent

        }
      })
    },
    gotoPrice(index) {
      this.rateShow = true
      this.fIndex = index
    },
    showCurrType() {
      this.showReceiveTypeList = true
    },
    showCurrency() {
      this.isCurreny = true
    },
    hideRate() {
      this.rateShow = false
    },
    showGoodsCategory() {
      this.isShowGoodsCategory = true
    },
    // 显示商品类型
    gotoType() {
      this.typeShow = true
    },
    // 显示价格币种
    gobackReceiveList(currency) {
      if (currency === this.$t('addAddress.text10')) {
        this.obj.priceType = 1
      } else {
        this.obj.priceType = 2
      }
      this.curType = currency
      this.showReceiveTypeList = false
    },
    // 显示商品类目
    gobackGoodsCategory() {
      this.$store.commit('SET_EDIT_FLAG', 2)
      this.isShowGoodsCategory = false
    },
    // 选择类目
    select(item) {
      this.curtData = item.name
      this.catId = item.id
      this.isShowGoodsCategory = false
    },
    verifyErr() {
      // let productArr = []
      // productArr = this.obj.imageList.split(',').concat(this.images)
      if (this.productName === '') {
        this.toastD(this.$t('goodmanage.text29'))
        return false
      }
      if (this.productPrice === '') {
        this.toastD(this.$t('goodmanage.text30'))
        return false
      }
      if (this.stock === '') {
        this.toastD(this.$t('goodmanage.text31'))
        return false
      }
      if (this.curtData === '') {
        this.toastD(this.$t('goodmanage.text32'))
        return false
      }
      if (this.productProfitRate === '') {
        this.toastD(this.$t('goodmanage.text33'))
        return false
      }
      if (this.logoImg.length === 0) {
        this.toastD(this.$t('goodmanage.text34'))
        return false
      }
      if (this.logoImg2.length === 0) {
        this.toastD(this.$t('goodmanage.text35'))
        return false
      }
      if (this.productContent === '') {
        this.toastD(this.$t('goodmanage.text36'))
        return false
      }
      return true
    },
    // 提交新增
    submit() {
      if (this.verifyErr()) {
        let fStatus = 1
        if (this.status === true) {
          fStatus = 1
        } else {
          fStatus = 2
        }
        let imageListStr = this.logoImg.join(',')
        let merImgListStr = this.logoImg2.join(',')
        // priceType币种类型(1.单币种, 2.双币种)
        let priceType
        this.curType === this.$t('addAddress.text10') ? priceType = 1 : priceType = 2
        let curr = this.currency
        curr === 'π' ? curr = 'PAI' : curr
        if (this.catId === '') {
          this.catId = this.obj.catId
        }
        this.loadShow = true
        auditProduct(this.obj.id, this.catId, this.productName, curr, this.productProfitRate, fStatus, this.productContent, imageListStr, merImgListStr, this.productPrice, 0, priceType).then((res) => {
          if (res.data.status === 'success') {
            this.loadShow = false
            this.toastD(res.data.msg)
            setTimeout(() => {
              if (this.status === true) {
                this.$store.commit('SET_HEAD_TAB', 0)
              } else {
                this.$store.commit('SET_HEAD_TAB', 1)
              }
              this.$router.push('/goodsmanage')
            }, 500)
          } else {
            this.toastD(res.data.msg)
          }
        })
      }
    },
    inputNum2(field, flag) {
      let val = this[field]
      if (!/^\d/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9]/g, '') // 只能是数字或者.
      if (flag === 3) {
        if (this.productProfitRate < 0) {
          this.productProfitRate = ''
          this.presentCount = ''
        } else if (this.productProfitRate > 100) {
          this.productProfitRate = 100
        }
        // 商品价格*（1+让利率*2）/（商品价格*让利率*系统返还比例）
        let rate = this.productProfitRate / 100
        if (this.productProfitRate === '') {
          this.presentCount = ''
        } else {
          if (this.productPrice === '') {
            this.presentCount = ''
          } else {
            this.presentCount = Math.ceil((1 + rate * 2) / (Number(this.productPrice) * rate * this.systemRate))
          }
        }
        // 返还金额 =  商品价格 * 返还比例%

        this.mapAmount = this.productPrice * rate
      }
    },
    selectRate(num) {
      if (this.fIndex === 0) {
        this.productPrice = Number(num)
      } else if (this.fIndex === 1) {
        this.productProfitRate = Number(num)
      }
      if (this.productPrice !== '' && this.productProfitRate !== '') {
        // priceType币种类型(1.单币种, 2.双币种)
        let priceType
        this.curType === this.$t('addAddress.text10') ? priceType = 1 : priceType = 2
        this.$http.post(`${this.$api}/shopMine/productPresentOrProfit?priceType=${priceType}&currency=${this.currency}&productPrice=${this.productPrice}&proftiRate=${this.productProfitRate}`).then(res => {
          if (res.data.status === 'success') {
            this.mapAmount = res.data.data.mapAmount
            this.presentCount = res.data.data.presentCoun
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.rateShow = false
    },
    goback(currency) {
      this.isCurreny = false
      if (currency) {
        this.currency = currency
        let priceType
        this.curType === this.$t('addAddress.text10') ? priceType = 1 : priceType = 2
        if (this.productPrice !== '' && this.productProfitRate !== '') {
          this.$http.post(`${this.$api}/shopMine/productPresentOrProfit?priceType=${priceType}&currency=${this.currency}&productPrice=${this.productPrice}&proftiRate=${this.productProfitRate}`).then(res => {
            if (res.data.status === 'success') {
              this.mapAmount = res.data.data.mapAmount
              this.presentCount = res.data.data.presentCoun
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    // 输入文字控制
    textareaVal() {
      if (this.productContent.length) {
        this.addNum = this.productContent.length
        if (this.productContent.length > 25) {
          this.addNum = 25
          this.productContent = this.productContent.substring(0, 25)
        }
      } else {
        this.addNum = 0
      }
    },
    removedPic() {
      this.images.pop()
    },
    errHandler(file) {
      this.toastD('Upload failed')
    },
    submitPic(file) {
      let f = file.file
      uploadimg(f, 1).then((res) => {
        if (res.data.status === 'success') {
          let list = res.data.data
          let imgUrl = ''
          list.forEach((item) => {
            imgUrl = item.fileUrl
          })
          this.images.push(imgUrl)
        } else {
          this.toastD(this.$t('shops.text8'))
          this.files.pop() // 把不符合的文件删除
        }
      })
    },
    removedProPic() {
      this.imagesProduct.pop()
    },
    submitProPic(file) {
      let f = file.file
      uploadimg(f, 1).then((res) => {
        if (res.data.status === 'success') {
          let list = res.data.data
          let imgUrl = ''
          list.forEach((item) => {
            imgUrl = item.fileUrl
          })
          this.imagesProduct.push(imgUrl)
        } else {
          this.toastD(this.$t('shops.text8'))
          this.filesProduct.pop() // 把不符合的文件删除
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .hasColor {
    color #ffb64b
    font-size .28rem
  }

  .iosx {
    .main-container {
      padding-top 70px
    }
  }

  .main-container {
    height 100% !important
    padding-top 45px
  }

  .btn-box
    z-index 2
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    background-color: rgb(255, 182, 75)
    color #fff
    font-size 16px
    .edit
      width: 100%
      height: 1rem
      line-height 1rem
      text-align center
  .upload-pic-box
    position relative
    display flex
    flex-direction row

    .upload_file
      width 1.4rem
      height 1.4rem

  .shopInfo {
    background-color: #fff;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding-left: .3rem
    padding-right: .3rem
  }

  .uls-one {
    .precet {
      font-size .28rem
      margin-left: .2rem;
    }

    .li-item {
      border-bottom: none;

      .title {
        color: #060f26;
      }
    }

    li {
      display: flex;
      height: 1rem;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;

      .title {
        font-size: .28rem;
        color: #060f26;
      }

      .input-box {
        display: flex;
        align-items: center;

        .phone {
          width: 45%;
        }

        .area-code {
          text-align: right;
          font-size: .28rem;
          color: #3495f1;
          flex: 1;
          margin-right: .2rem;
        }

        .phone {
          font-size: .28rem;
          color: #b2b2b2;
        }

        .go-icon {
          margin-left: .2rem;
          width: 0.15rem;
          height: 0.28rem;

          img {
            display: block;
            width: 100%;
          }
        }

        input {
          font-size: .28rem;
          color: #060f26;
          height: 1rem
          text-align: right;

          &::-webkit-input-placeholder {
            color: #b2b2b2;
          }

          &:-moz-placeholder {
            color: #b2b2b2;
          }

          &::-moz-placeholder {
            color: #b2b2b2;
          }

          &:-ms-input-placeholder {
            color: #b2b2b2;
          }
        }
      }
    }
  }

  .flex-between {
    display: flex
    align-items center
    justify-content space-between
    font-size: .28rem
    height: .6rem

    .gray {
      color #b2b2b2
    }
  }

  .rate-tip {
    height: .6rem
    line-height: .8rem
    color #11589d
    background-color: #fff
    font-size .28rem
    margin .2rem 0
  }

  .bili {
    height: 1rem
    border-bottom: 1px solid #e8e8e8

    input {
      height: 1rem
      width: 2.5rem
      text-align: right
    }
  }

  .uls-two {
    .first-li {
      /*height: 1.68rem;*/

      .shopAdd {
        word-wrap: break-word;
        font-size: .28rem;
        color: #b2b2b2;
        width: 90%;
      }

      .shopTextarea {
        padding-top: .3rem;
      }

      .input-box {
        height: .8rem;
      }
    }

    li {
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: .3rem 0;

      &:nth-of-type(2) {
        border-bottom: none;
      }

      .title {
        font-size: .28rem;
        color: #060f26;
        margin-bottom: .2rem;
      }

      .textarea-box {
        background-color: #fff;
        width: 100%;
        border-radius: 8px;
        font-size: .28rem;
        color: #060f26;
        border-bottom: 1px solid #e8e8e8;
      }

      .input-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .textarea {
          background-color: #fff;
          width: 100%;
          height: .8rem;
          padding: .22rem .2rem 0 .3rem;
          margin-bottom: .4rem;
          text-align: justify;
          color: #b2b2b2;
        }

        .warm-num {
          text-align: right;
          width: 100%;
          font-size: .28rem;
          color: #b2b2b2;
          position: absolute;
          z-index: 30;
          right: 0;
          bottom: 0;
          margin: 0 .2rem .15rem 0;
        }

        .go-icon {
          margin-left: .2rem;
          width: 0.15rem;
          height: 0.28rem;

          img {
            display: block;
            width: 100%;
          }
        }

        input {
          word-wrap: break-word;
          font-size: .28rem;
          color: #b2b2b2;
          height: 1rem

          &::-webkit-input-placeholder {
            color: #b2b2b2;
          }

          &:-moz-placeholder {
            color: #b2b2b2;
          }

          &::-moz-placeholder {
            color: #b2b2b2;
          }

          &:-ms-input-placeholder {
            color: #b2b2b2;
          }
        }
      }
    }
  }

  .err-class {
    font-size: .28rem;
    color: #fe5a5a;
    margin-top: 0.2rem;
    padding-bottom: .3rem
    border-bottom: 1px solid #eeeff1
    margin-bottom 2rem
  }

  .title-w
    line-height: 1.1rem
    height: .88rem
    color #999
    font-size: .28rem
    margin-left: -.3rem
    padding-left: .3rem
    margin-right: -.3rem
    background-color: #f5f5f7

    &.title-tips
      line-height: .8rem
      color rgb(153, 153, 153)
      background-color rgb(247, 247, 247)

  .title-a
    line-height: .88rem
    color #060f26
    font-size: .28rem

  .edit-img-box, .upload-pic-box
    display flex
    flex-direction row
    align-items center
    /*margin 0.1rem 0 0.4rem*/
    .already-pic
      display flex
      flex-direction row
      li
        margin-right 10px
        position relative
        width: 1.4rem !important;
        height: 1.4rem !important;
        img
          width 100%
          height 100%
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

  .flex-content-between
    display: flex
    align-items center
    justify-content space-between
    border-bottom: 1px solid #eeeff1
    padding: .3rem 0

    .left-w
      color #999

      .left-text
        margin-bottom: .36rem

    .go-icon
      img
        width: 0.15rem;
        display: block

  .textarea-w
    width: 100%
    color #060f26
    position: relative
    margin-bottom: .2rem

    .task-textarea
      width: 100%
      font-size: .28rem
      height: 1.2rem

    .number
      position: absolute
      text-align: right
      width: 100%
      z-index: 10
      right: 0
      bottom: 0
      margin: 0 .2rem .15rem 0

  .flex-content
    border-bottom: 1px solid #eeeff1
    padding: .3rem 0

  .file-w
    display: flex
    flex-wrap wrap

    .file-box
      width: 1.4rem
      height: 1.4rem
      overflow: hidden
      background: url("./img/upload.png") no-repeat center / cover

      .file-input
        width: 100%
        height: 100%
        opacity: 0

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
      margin-bottom .2rem

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
        background-color: rgba(0, 0, 0, .5)
        display: flex
        align-items center
        justify-content center
        border-radius 0 0 4px 4px

        .delete
          width: .32rem
          display: block
</style>
