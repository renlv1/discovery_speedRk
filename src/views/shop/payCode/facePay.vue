<template>
  <div class="container">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="" v-show="!isErShow">
      <ul class="uls-one">
        <li @click="showCurrType">
          <div class="title">{{$t('categories.text10')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="curType" disabled>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li @click="showCurrency">
          <div class="title">{{$t('goodmanage.text5')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text6')" v-model.trim="currency" disabled>
            <div class="go-icon"><img src="./img/go.png" /></div>
          </div>
        </li>
        <li>
          <div class="title">{{$t('categories.text11')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('goodmanage.text8')" v-model.trim="productPrice"
                   @input="inputNum('productPrice', 1)">
            <span class="precet">{{currency}}</span>
<!--            <div class="go-icon"><img src="./img/go.png" /></div>-->
          </div>
        </li>
        <li>
          <div class="title">{{curType === $t('categories.text12') ? $t('goodmanage.text16') : $t('categories.text13')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="tips" v-model.trim="productProfitRate"
                   @input="inputNum2('productProfitRate', 3)">
<!--            <div class="go-icon"><img src="./img/go.png" /></div>-->
          </div>
        </li>
      </ul>

      <p class="tips">{{$t('categories.text14')}}</p>

      <ul class="parent-ul">
        <li>
          <div class="parent-li-top">
            <img src="./img/editor.png" />
            <p class="li-title">{{$t('categories.text15')}}</p>
          </div>
          <ul class="child-ul">
            <li>
              <span>{{$t('categories.text16')}}</span>
              <span>{{treasureValue}}π</span>
            </li>
            <li>
              <span>{{$t('categories.text17')}}</span>
              <span>{{free}}</span>
            </li>
            <li>
              <span>{{$t('categories.text18')}}</span>
              <span>{{currency === 'CNY' ? `${this.changeValue('CNYToUSD', receiptValue)}USD` : `${receiptValue}${currency}` }}</span>
            </li>
          </ul>
        </li>
        <li>
          <div class="parent-li-top">
            <img src="./img/setting.png" />
            <p class="li-title">{{$t('categories.text19')}}</p>
          </div>
          <ul class="child-ul no-bottom">
            <li>
              <span>{{$t('categories.text20')}}</span>
              <span>{{this.changeValue(currency, productPrice) === '' ? 0 : this.changeValue(currency, productPrice)}} π</span>
            </li>
            <li>
              <span>{{$t('categories.text21')}}</span>
              <span>{{treasureValue * 2}}π</span>
            </li>
            <li>
              <span>{{$t('categories.text22')}}</span>
              <span>{{cycle}} {{$t('categories.text23')}}</span>
            </li>
          </ul>
        </li>
      </ul>

      <div class="btn common-btn" @click="createQr" :class="{'notClick': productProfitRate === '' || productPrice === ''}">{{$t('categories.text24')}}
      </div>
    </div>

    <div class="" v-show="isErShow">
      <div class="er-box">
        <span class="type-title">{{$t('categories.text25')}}</span>
        <span class="value">{{info.userPayTotal}}{{info.acceptCurrency === 'PAI' ? 'π' : info.acceptCurrency}} <span
          v-show="info.userPayTotalTwo !== 0">+ {{info.userPayTotalTwo}}π</span></span>
        <div id="qrcode"></div>
        <div class="qr-tips">{{$t('categories.text26')}}</div>
      </div>
      <div class="info-box">
        <p class="info-title">{{$t('categories.text27')}}</p>
        <ul>
          <li>
            <span>{{$t('categories.text28')}}</span>
            <span>{{info.id}}</span>
          </li>
          <li>
            <span>{{$t('categories.text29')}}</span>
            <span>{{info.ecologyFee}} {{info.acceptCurrency === 'PAI' ? 'π' : info.acceptCurrency}}</span>
          </li>
          <li>
            <span>{{$t('categories.text30')}}</span>
            <span>{{info.realReceiveAmount}} {{info.acceptCurrency === 'PAI' ? 'π' : info.acceptCurrency}}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 收款类型 -->
    <receive-type v-show="showReceiveTypeList" @goback="gobackReceiveList" @hide="hideCur"></receive-type>

    <!-- 价格币种 -->
    <currencyData v-show="isCurreny" @goback="goback" ></currencyData>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import receiveType from '../../shop/showReceiveTypeList'
import currencyData from '../../shop/currencyData.vue'
import $ from 'jquery'
import '../../../assets/js/jquery.qrcode.min'

export default {
  name: "facePay",
  components: {mFixedTop, receiveType, currencyData},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('categories.text31'),
      showReceiveTypeList: false,
      curType: this.$t('categories.text32'),
      curtData: '',
      productName: '', //	string	产品名称
      isCurreny: false,
      isShowGoodsCategory: false,
      status: false, //		int	状态 1上架 2下架
      currency: 'π', //		string	产品币种
      productPrice: '', //		string	产品价格
      stock: '', //		int	库存
      rateShow: false,
      fIndex: 0,
      productProfitRate: '', //		string	产品返利比率
      userBack: 0, // 用户返回金额
      merchantBack: 0, // 商户返回金额
      systemProfitRate: 0, // 系统返利比例
      presentCount: '',
      isErShow: false,
      info: {},
      address: '',
      tips: this.$t('goodmanage.text17'),
      paiRate: '', // 美金对派
      paitocnyRate: '', // 人民币对派
      cnyRate: ''
    }
  },
  created() {
    this.getBackCycle()
    this.getAddress()
    this.getRateInfo()
  },
  computed: {
    // 价格*（1 + 让利*2）/（1*让利*系统返还比例）
    cycle() {
      if (this.productProfitRate > 0) {
        return Math.ceil(((1 + this.productProfitRate * 0.01 * 2)) / (this.productProfitRate * 0.01 * this.systemProfitRate * 0.01))
      } else {
        return 0
      }
    },

    // 生态建设费
    free() {
      let onePrice = (this.productPrice * 0.01 * (this.productProfitRate / 100)).toFixed(4)
      if (this.curType === this.$t('categories.text32')) {
        if (this.currency === 'CNY') {
          return `${this.changeValue('CNYToUSD', this.productPrice * 0.01)}USD`
        } else {
          return `${this.productPrice * 0.01}${this.currency}`
        }
      } else {
        if (this.currency === 'CNY') {
          let value = (this.changeValue('CNYToUSD', this.productPrice * 0.01 - onePrice))
          return `${value}USD + ${this.changeValue(this.currency, onePrice)}π`
        } else {
          return `${(this.productPrice * 0.01 - onePrice).toFixed(4)}${this.currency} + ${this.changeValue(this.currency, onePrice)}π`
        }
      }
    },

    // 藏宝金额
    treasureValue() {
      let onePrice = ((this.productPrice - this.productPrice * 0.01) * this.productProfitRate * 0.01).toFixed(4)
      if (this.curType === this.$t('categories.text32')) {
        return `${this.changeValue(this.currency, this.productPrice * this.productProfitRate * 0.01)}`
      } else {
        return `${this.changeValue(this.currency, onePrice)}`
      }
    },

    // 收款金额
    receiptValue() {
      let onePrice = ((this.productPrice - this.productPrice * 0.01) * this.productProfitRate * 0.01).toFixed(4)
      let result = ((this.productPrice - this.productPrice * 0.01) - onePrice).toFixed(4)
      if (this.curType === this.$t('categories.text32')) {
        let fee = this.productPrice * 0.01
        let treasureValue = this.productPrice * this.productProfitRate * 0.01
        if (this.productPrice - fee - treasureValue > 0) {
          return this.hasFour(`${this.productPrice - fee - treasureValue}`)
        } else {
          return 0
        }
      } else {
        return this.hasFour(`${result}`)
      }
    }
  },
  methods: {
    showQrPopup() {
      // 控制二维码只绘制一次
      let erContent = this.$utf16to8(`pipay:||${this.info.code}`)
      $('#qrcode').qrcode({
        render: 'canvas', //     table方式
        width: 160, //            宽度
        height: 160, //            高度
        text: erContent //      任意内容
      })
    },

    // 获取汇率
    getRateInfo() {
      this.$http.post(`${this.$api}shopMine/getRateInfo`).then(res => {
        this.paiRate = 1 / res.data.data.paiRate
        this.paitocnyRate = 1 / res.data.data.paitocnyRate
        this.cnyRate = 1 / res.data.data.cnyRate
      })
    },

    changeValue(type, value) {
      if (type === 'USD') {
        return this.hasFour(value * this.paiRate)
      } else if (type === 'CNY') {
        return this.hasFour(value * this.paitocnyRate)
      } else if (type === 'CNYToUSD') {
        return this.hasFour(value * this.cnyRate)
      } else {
        return value
      }
    },

    goPath() {
      if (this.showReceiveTypeList) {
        this.showReceiveTypeList = false
      } else if (this.isCurreny) {
        this.isCurreny = false
      } else {
        if (this.isErShow) {
          this.isErShow = false
          this.$router.push('/openShop')
        } else {
          this.$router.push('/openShop')
        }
      }
    },
    gotoPrice(index) {
      this.rateShow = true
      this.fIndex = index
    },
    showCurrType() {
      this.showReceiveTypeList = true
    },
    showGoodsCategory() {
      this.isShowGoodsCategory = true
    },
    getAddress() {
      this.$http.post(`${this.$api}shopMine/getMerchantInfo`).then(res => {
        this.address = res.data.data.merchantInfo.sourceUserAddress
      })
    },
    getBackCycle() {
      this.$http.post(`${this.$api}shopMine/getMerchantTask`).then(res => {
        if (res.data.status === 'success') {
          this.systemProfitRate = res.data.data.systemProfitRate
          // this.systemEcologyFeeRate = res.data.data.systemEcologyFeeRate
        }
      }).catch(err => {
        console.log(err)
      })
    },
    inputNum(field, flag) {
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
    showCurrency() {
      this.isCurreny = true
    },
    // 显示价格币种
    gobackReceiveList(currency) {
      this.curType = currency
      if (this.curType === this.$t('categories.text32')) {
        this.tips = this.$t('goodmanage.text17')
      } else {
        this.tips = this.$t('categories.text33')
      }
      this.showReceiveTypeList = false
    },
    hideCur() {
      this.showReceiveTypeList = false
    },
    goback(currency) {
      this.isCurreny = false
      if (currency) {
        this.currency = currency
        let priceType
        this.curType === this.$t('categories.text32') ? priceType = 1 : priceType = 2
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

    // 生成二维码
    createQr() {
      if (this.productProfitRate !== '' && this.productPrice !== '') {
        let remark = ''
        let priceType
        let address = this.address
        this.curType === this.$t('categories.text32') ? priceType = 1 : priceType = 2
        let currency
        this.currency === 'π' ? currency = 'PAI' : currency = this.currency
        this.$http.post(`${this.$api}shopMine/createDownLineOrder?productProfitRate=${this.productProfitRate}&currency=${currency}&remark=${remark}&presentRichStarUserAddress=${address}&productPvTotal=0&productPriceTotal=${this.productPrice}&priceType=${priceType}`).then(res => {
          if (res.data.status === 'success') {
            this.isErShow = true
            this.info = res.data.data

            // 控制二维码只绘制一次
            if ($('#qrcode').length === 1) {
              // 绘制二维码
              this.$nextTick(() => {
                $("#qrcode").html("");
                this.showQrPopup()
              })
            }
          } else {
            this.toastD(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-container {
    padding-bottom 90px
  }
  .container {
    background-color: #f5f5f7;
    min-height 100vh
    .uls-one {
      margin-top 10px
      background-color #fff
      padding 0 .3rem
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

    .tips {
      line-height 1.2
      padding .3rem
      color #666
      font-size .32rem
    }
    .parent-ul {
      display flex
      flex-direction column
      font-size .32rem
      padding 0 .3rem
      background-color #fff
      .parent-li-top {
        display flex
        flex-direction row
        align-items center
        height 1rem
        line-height 1rem
        img {
          margin-right .32rem
          width .32rem
          height .32rem
        }
      }
      li {
        .child-ul {
          border-bottom 1px solid #ccc
          font-size 14px
          li {
            display flex
            flex-direction row
            justify-content space-between
            padding-left .64rem
            height .6rem
            line-height .6rem
            color #666
          }
        }
        .no-bottom {
          border-bottom none !important
        }
      }
    }
    .btn {
      position fixed
      bottom 0
      left 0
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      background: rgb(255, 182, 75);
      font-size: .32rem;
    }
    .notClick {
      background-color #ccc
    }
    .er-box {
      padding 20px
      display flex
      flex-direction column
      align-items center
      margin-top 30px
      font-size .32rem
      background-color #fff
      .value {
        margin 10px 0
        color: rgb(255, 182, 75);
      }
      #qrcode {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        height: 180px;
        margin: 0 auto;
        background-color: #fff;
        margin-bottom: 10px;
      }
      .qr-tips {
        margin-top 10px
      }
    }
    .info-box {
      padding 10px
      font-size .32rem
      margin-top 20px
      background-color #fff
      .info-title {
        font-weight bold
        height 1rem
        line-height 1rem
      }
      ul {
        li {
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          height 1rem
          line-height 1rem
        }
      }
    }
  }
</style>
