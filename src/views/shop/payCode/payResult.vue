<template>
  <div class="pay-result">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="payFaceId-result" v-show="!payFaceId">
      <div class="merchant-info">
        <img v-if="merchant.merchantLogo" :src="imgSplit(merchant.merchantLogo)" />
        <img v-else :src="imgSplit(merchant.arLogoImg)">
        <p>{{merchant.merchantName}}</p>
      </div>
      <ul>
        <li>
<!--          付款金额-->
          <div>
            {{$t('categories.text50')}}
          </div>
          <div class="right">
            <input v-model="productPrice" :placeholder="$t('categories.text51')" @input="getProfit" />
            <span>{{merchant.acceptCurrency === 'PAI' ? 'π' : merchant.acceptCurrency}}</span>
          </div>
        </li>
        <li>
<!--          交易金额-->
          <span>{{$t('categories.text52')}}</span>
          <span>{{trans(productPrice) === 'undefined' ? '0' : trans(productPrice)}}</span>
        </li>
        <li>
<!--          用户待返回金额-->
          <span>{{$t('categories.text53')}}</span>
          <span>{{transPai(productPrice)}}</span>
        </li>
        <li>
<!--          返还周期-->
          <span>{{$t('categories.text54')}}</span>
          <span>{{presentCount}}{{$t('categories.text55')}}</span>
        </li>
      </ul>
      <div class="btn" @click="pay" :class="{'notPay': productPrice === ''}">{{$t('categories.text56')}}</div>
    </div>
    <pay-dialog :title="payTitle" ref="payDialog" @paySubmit="paySubmit"></pay-dialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import payDialog from '@/components/pay/payPopup'

export default {
  name: "payResult",
  components: {mFixedTop, payDialog},
  data() {
    return {
      titleName: this.$t('categories.text57'),
      id: '',
      merchant: {},
      productPrice: '', // 输入金额
      mapAmount: 0.0000,
      presentCount: 0,
      payTitle: this.$t('categories.text58'),
      obj: {}, // 需要给支付成功页面传递的信息
      payId: '',
      payFaceId: '',
      isGoBack: true,
      cnyRate: '',
      paiRate: '',
      paitocnyRate: '',
      orderId: ''
    }
  },
  mounted() {
    this.getRateInfo()
    let href = this.showWindowHref()
    this.payFaceId = href['payId']
    if (!href['payId']) {
      this.$nextTick(() => {
        this.id = href['code']
        this.getInfo()
      })
    } else {
      this.orderId = href['shopId']
      this.$refs.payDialog.showModel()
    }
  },
  computed: {},
  methods: {
    trans(productPrice) {
      // 双币种
      if (Number(this.merchant.codeType) === 2) {
        // 人民币换美金
        if (this.merchant.acceptCurrency === 'CNY') {
          return this.hasFour((productPrice * (1 - this.merchant.profitRate * 0.01)) * (1 / this.cnyRate)) + 'USD' + '+' + this.hasFour((productPrice * this.merchant.profitRate * 0.01) * (1 / this.paitocnyRate)) + 'π'
        } else if (this.merchant.acceptCurrency === 'USD') {
          return this.hasFour(productPrice * (1 - this.merchant.profitRate * 0.01)) + 'USD' + '+' + this.hasFour((productPrice * this.merchant.profitRate * 0.01) * (1 / this.paiRate)) + 'π'
        } else {
          return this.hasFour(productPrice * (1 - this.merchant.profitRate * 0.01)) + 'π' + '+' + this.hasFour(productPrice * this.merchant.profitRate * 0.01) + 'π'
        }
      } else {
        // 单币种
        if (this.merchant.acceptCurrency === 'CNY') {
          return this.hasFour(productPrice * (1 / this.cnyRate)) + 'USD'
        } else {
          return `${productPrice}${this.merchant.acceptCurrency === 'PAI' ? 'π' : this.merchant.acceptCurrency }`
        }
      }
    },
    transPai(productPrice) {
      if (this.merchant.acceptCurrency === 'CNY') {
        return this.hasFour(productPrice * (1 / this.paitocnyRate)) + 'π'
      } else if (this.merchant.acceptCurrency === 'USD') {
        return this.hasFour(productPrice * (1 / this.paiRate)) + 'π'
      } else {
        return productPrice + 'π'
      }
    },
    getRateInfo() {
      this.$http.post(`${this.$api}/shopMine/getRateInfo`).then(res => {
        this.cnyRate = res.data.data.cnyRate  //美金对人民币汇率
        this.paiRate = res.data.data.paiRate  //派对美金 汇率
        this.paitocnyRate = res.data.data.paitocnyRate  //派对人民币汇率
      })
    },
    goPath() {
      window.webkit.messageHandlers.finish.postMessage(null)
    },
    imgSplit(img) {
      if (img) {
        if (img.indexOf('http') > -1) {
          return img
        } else {
          return 'https://discoverypi.blob.core.windows.net/' + img
        }
      }
    },
    showWindowHref() {
      let url = window.location.hash
      var arglists = url.split('?');
      if (arglists[0] === url) {
        return '';
      }
      var arr = arglists[1].split('&');
      var obj = {};
      for (let i = 0; i < arr.length; i++) {
        var arg = arr[i].split('=');
        obj[arg[0]] = arg[1];
      }
      return obj;
    },
    getInfo() {
      this.$http.post(`${this.$api}/shopMine/scanPayCode?payCode=${this.id}`).then(res => {
        if (res.data.status === 'success') {
          this.merchant = res.data.data.merchantPayCode
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    getProfit() {
      if (this.productPrice !== '') {
        if (!/^\d+(\.\d{0,2})?$/.test(this.productPrice)) {
          this.productPrice = this.productPrice.substring(0, this.productPrice.length - 1)
        } else {
          this.selectRate()
        }
      } else {
        this.mapAmount = ''
        this.presentCount = ''
      }
    },
    selectRate() {
      let priceType = this.merchant.codeType
      let currency = this.merchant.acceptCurrency
      let productProfitRate = this.merchant.profitRate
      this.$http.post(`${this.$api}/shopMine/productPresentOrProfit?priceType=${priceType}&currency=${currency}&productPrice=${this.productPrice}&proftiRate=${productProfitRate}`).then(res => {
        if (res.data.status === 'success') {
          this.mapAmount = res.data.data.mapAmount
          this.presentCount = res.data.data.presentCoun
        }
      }).catch(err => {
        console.log(err)
      })
    },
    pay() {
      if (this.productPrice !== '') {
        this.$http.post(`${this.$api}shopMine/payForCode?payCode=${this.id}&payTotal=${this.productPrice}`).then(res => {
          if (res.data.status === 'success') {
            let merchant = res.data.data.orderRecord
            this.payId = merchant.payId
            this.orderId = merchant.id
            this.$refs.payDialog.showModel()
          }
        })
      }
    },
    paySubmit() {
      let payId
      if (this.payFaceId) {
        payId = this.payFaceId
      } else {
        payId = this.payId
      }
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.$refs.payDialog.closeModel()
          setTimeout(() => {
            this.$router.push({
              path: '/payResultSuccess',
              query: {
                orderId: this.orderId
              }
            })
          })
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .pay-result {
    position relative
    height 100vh
    .payFaceId-result {
      display flex
      font-size .32rem
      align-items center
      flex-direction column
      padding-left .3rem
      padding-right .3rem
      .merchant-info {
        margin-top 10px
        display flex
        flex-direction column
        align-items center
        img {
          width: 34px;
          height: 34px;
          border-radius: 5px;
          margin-bottom 10px
        }
      }
      ul {
        margin-top 20px
        width 100%
        li {
          width 100%
          height 1rem
          line-height 1rem
          display flex
          justify-content space-between
          .right {
            width 68%
            text-align center
          }
        }
      }
      .btn {
        position fixed
        bottom 0
        width: 100%;
        height: 1.3rem;
        line-height: 1rem;
        text-align: center;
        color: #fff;
        background: rgb(255, 182, 75);
        font-size: .32rem;
        &.notPay {
          background: #ccc;
        }
      }
    }
  }
</style>
