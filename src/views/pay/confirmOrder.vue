<template>
  <div class="paiPayDetail">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="m-c confirm-order">
      <div class="banner">
        <div class="all-box">
          <div class="all-top">待提交</div>
          <div class="money">等待您确认订单并进行提交</div>
        </div>
      </div>
      <div class="tab-ul">
        <div @click="chooseAddress()">
          <div class="li-tab">
            <img src="./img/shipping-address.png">
            <div class="address-t">收货地址</div>
          </div>
          <div class="info-box">
            <div class="name-box">
              <div class="box">
                <div class="name-t">{{receiptInfo.realName}}</div>
                <div class="mobile" v-show="receiptInfo.phone">{{(receiptInfo.phoneCode &&
                  receiptInfo.phoneCode.indexOf('+')) > -1 ? '' : '+'}} {{receiptInfo.phoneCode}} {{receiptInfo.phone}}
                </div>
              </div>
              <div class="choose-address">{{receiptInfo.realAddress ?
                `${receiptInfo.district}${receiptInfo.realAddress}` : '请填写收货地址'}}
              </div>
            </div>
            <div class="shipping-address">
              <img src="./img/right-grey.png">
            </div>
          </div>
        </div>
        <div class="line-two"></div>
        <div class="goods-box">
          <div class="goods-count">
            <div class="product-name">
              <div class="product-logo">
                <img v-if="merchantRecord.arLogoImg"
                     :src="splitImg(merchantRecord.arLogoImg)" />
                <img v-else
                     :src="splitImg(merchantRecord.shopLogo)" />
              </div>
              <span>{{merchantRecord.merchantName}}</span>
            </div>
          </div>
          <ul class="product-m">
            <li class="name-m" v-for="(item,index) in careList" :key="index">
              <div class="product-box">
                <div class="product-img">
                  <img v-if="item.productImg" :src="imgSplit(item.productImg)" alt="">
                  <img v-else :src="imgSplit(item.image)" alt="">
                </div>
                <div class="name-b">
                  <div class="t-b">
                    <div class="name">{{item.productName ? item.productName : item.title}}</div>
                    <div class="count">x{{item.num}}</div>
                  </div>
                  <div class="amount-box">
                    <div class="price">单价 {{item.price}}{{item.currency === 'PAI' ? 'π' : item.currency}} <span
                      v-if="item.priceTwo !== 0"> + {{item.priceTwo}} π</span></div>
                    <div class="total">小计 {{hasFour(item.num * item.price)}} {{item.currency === 'PAI' ? 'π' :
                      item.currency}}
                      <span v-if="item.priceTwo !== 0">+ {{item.num * item.priceTwo}} π</span></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="actually-paid ">
            <div class="title">合计</div>
            <div class="cost">
              <span>{{totalActualStr}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="line-two line-bg">
        <div class="tip">合计金额仅供参考,请以提交订单后的实际金额为准</div>
      </div>
      <div class="btn-add ">
        <div class="btn-del " @click="submit()">提交订单</div>
      </div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <pay-dialog :title="payTitle" ref="payDialog" @paySubmit="paySubmit"></pay-dialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import payDialog from '@/components/pay/payPopup'

export default {
  components: {mFixedTop, payDialog},
  name: "confirmOrder",
  data() {
    return {
      loadShow: true,
      isGoBack: true,
      titleName: '确认订单',
      payTitle: '安全验证',
      careList: [],
      list: [],
      receiptInfo: {},
      merchantRecord: {},
      totalTwo: 0,
      allPricePi: 0,
      allPriceUSD: 0,
      allPriceCNY: 0,
      orderId: '', // 订单账号
      payId: '', // 支付id
      flag: true, // 用于防止重复点击
      cnyRate: 0,
      paiRate: 0,
      paitocnyRate: 0,
      totalActualStr: '',
      receiveType: '' // 商家接收币种
    }
  },
  mounted() {
    let receiveType
    if (this.$route.query.merchant) {
      receiveType = JSON.parse(this.$route.query.merchant).merchantUserAddress
    } else {
      receiveType = this.$route.query.merchantUserAddress
    }
    this.getReceiptType(receiveType)
    this.getReceipt()
    this.getDetail()
    this.careList = this.$store.state.productCar
  },
  computed: {},
  methods: {
    paySubmit() {
      // 提交支付按钮
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.toastD('支付成功')
          setTimeout(() => {
            this.$router.push({
              path: '/myOrderDetail',
              query: {
                orderId: this.orderId,
                flag: 1
              }
            })
          }, 500)
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    },
    addTotal() {
      let careList = this.careList
      let currency = []
      let price = []
      let pirceTwo = [] // 第二币种
      let allNum = []
      let arrPi = []
      let arrUSD = []
      let arrCNY = []
      careList.forEach((item) => {
        currency.push(item.currency)
        price.push((item.price * 1000) * item.num / 1000)
        pirceTwo.push(item.priceTwo * item.num)
        allNum.push(item.num)
      })
      if (pirceTwo.length > 1) { // 判断数量数组中元素的个数 如果大于1 遍历累加 否则 结算数量为第一个元素的数量
        this.totalTwo = pirceTwo.reduce(function (prev, curr) {
          return prev + curr;
        })
      } else {
        this.totalTwo = pirceTwo[0]
      }
      currency.forEach((cur, index) => {
        if (cur === 'PAI') {
          arrPi.push(index)
        } else if (cur === 'USD') {
          arrUSD.push(index)
        } else if (cur === 'CNY') {
          arrCNY.push(index)
        }
      })
      // 计算单位为pai的金额之和
      let allPricePi = 0
      for (var i = 0; i < arrPi.length; i++) {
        allPricePi = allPricePi + price[arrPi[i]]
      }
      // 计算单位为USD的金额之和
      let allPriceUSD = 0
      for (var i = 0; i < arrUSD.length; i++) {
        allPriceUSD = allPriceUSD + price[arrUSD[i]]
      }
      // 计算单位为CNY的金额之和
      let allPriceCNY = 0
      for (var i = 0; i < arrCNY.length; i++) {
        allPriceCNY = allPriceCNY + price[arrCNY[i]]
      }
      if (this.receiveType === 'USD') {
        if (this.totalTwo === 0) {
          // 单币种
          this.totalActualStr = this.hasFour((allPricePi * this.paiRate + allPriceUSD) + allPriceCNY * (1 / this.cnyRate)) + 'USD'
        } else {
          // 双币种
          this.totalActualStr = this.hasFour((allPricePi * this.paitocnyRate + allPriceUSD) + allPriceCNY * (1 / this.cnyRate)) + 'USD' + '+' + this.totalTwo + 'π'
        }
      } else if (this.receiveType === 'CNY') {
        if (this.totalTwo === 0) {
          this.totalActualStr = this.hasFour(allPricePi * this.paiRate + allPriceUSD * this.cnyRate + allPriceCNY) + 'CNY'
        } else {
          this.totalActualStr = this.hasFour(allPricePi * this.paiRate + allPriceUSD * this.cnyRate + allPriceCNY) + 'CNY' + '+' + this.totalTwo + 'π'
        }
      } else {
        if (this.totalTwo === 0) {
          this.totalActualStr = this.hasFour(allPricePi + allPriceUSD * (1 / this.paiRate) + allPriceCNY * (1 / this.paitocnyRate)) + 'π'
        } else {
          this.totalActualStr = this.hasFour(allPricePi + allPriceUSD * (1 / this.paiRate) + allPriceCNY * (1 / this.paitocnyRate)) + 'π' + '+' + this.totalTwo + 'π'
        }
      }
    },

    getReceiptType(address) {
      this.$http.post(`${this.$api}shopMine/getMerchantInfoByUserAddress?saleUserAddress=${address}`).then((res) => {
        this.receiveType = res.data.data.acceptCurrency
      })
    },

    transRateInfo() { // 汇率转换
      this.$http.post(`${this.$api}shopMine/getRateInfo`).then((res) => {
        this.cnyRate = res.data.data.cnyRate //美金对人民币汇率
        this.paiRate = res.data.data.paiRate // 派对美金 汇率
        this.paitocnyRate = res.data.data.paitocnyRate // 派对人民币汇率
        this.addTotal()
      })
    },

    imgSplit(img) {
      if (img) {
        if (img.indexOf(',') > -1) {
          let data = img.split(',')[0]
          return this.splitImg(data)
        } else {
          return this.splitImg(img)
        }
      }
    },
    splitImg(imgUrl) { // 加产品前缀的工具方法
      if (imgUrl) {
        if (imgUrl.indexOf('http') > -1) {
          return imgUrl
        } else {
          return 'https://discoverypi.blob.core.windows.net/' + imgUrl
        }
      }
    },
    chooseAddress() {
      if (this.$route.query.merchant) {
        this.$store.commit('SET_ENTER_FLAG', 1)
        this.$router.push({
          path: '/shippingAddress',
          query: {
            merchant: this.$route.query.merchant,
          }
        })
      } else if (this.$route.query.productId) {
        this.$store.commit('SET_ENTER_FLAG', 0)
        this.$router.push({
          path: '/shippingAddress',
          query: {
            productId: this.$route.query.productId,
          }
        })
      }
    },
    goPath() { // 返回到我的
      if (this.$route.query.productId) {
        this.$router.push({
          path: '/productDetail',
          query: {
            productId: this.$route.query.productId,
            merchantUserAddress: this.$route.query.merchantUserAddress
          }
        })
      } else {
        this.$router.push('/myShopping')
      }
    },
    getDetail() {
      let productId = this.$route.query.productId
      if (productId) {
        this.$http.post(`${this.$api}shopMine/getProductInfoByProductId?productId=${productId}`).then((res) => {
          if (res.data.status === 'success') {
            this.loadShow = false
            this.merchantRecord = res.data.mapData.merchantRecord
          } else {
            this.toastD(res.data.msg)
          }
        })
      } else {
        this.merchantRecord = JSON.parse(this.$route.query.merchant)
      }
    },
    submit() {
      this.loadShow = true
      // 线上提交订单
      if (this.flag) {
        this.flag = false
        if (this.receiptInfo.realAddress) {
          if (this.receiptInfo !== '') {
            let orderProductJson = JSON.stringify(this.careList)
            let receiptPlaceId = this.receiptInfo.id


            this.$fetch.post(`${this.$api}shopMine/createOnLineOrder`, {
              orderProductJson: orderProductJson,
              receiptPlaceId: receiptPlaceId
            }).then((res) => {
              if (res.status === 'success') {
                this.toastD('下单成功')
                this.$store.commit('SET_ORDER_FLAG', 1)

                // 线上下单成功
                this.$store.commit('SET_ORDER_FLAG', 2)

                this.loadShow = false
                setTimeout(() => {
                  this.$router.push({
                    path: '/myOrderDetail',
                    query: {
                      orderId: res.data.id
                    }
                  })
                }, 500)
              } else {
                this.loadShow = false
                this.flag = true
                this.toastD(res.msg)
              }
            })
          }
        } else {
          this.loadShow = false
          this.flag = true
          this.toastD('请填写收货地址')
        }
      }
    },
    getReceipt() { // 查询收货地址列表
      this.$http.post(`${this.$api}shopMine/queryOrderReceiptList`).then((res) => {
        this.transRateInfo()
        if (res.status) {
          this.loadShow = false
          if (this.$route.query.item) {
            this.receiptInfo = this.$route.query.item
          } else {
            if (res.data.data && res.data.data.length !== 0) {
              this.receiptInfo = res.data.data[0]
            }
          }
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .line-two {
    height 5px
    background-color #f5f5f7
  }

  .paiPayDetail {
    width 100%
    min-height 100vh
    background-color #f5f5f7
    margin-bottom 1rem
  }

  .banner {
    padding .5rem 0 1rem 0
    display flex
    width 100%
    background-color #ffb64b
    .all-box {
      padding-left .3rem
      .all-top {
        font-size .4rem
        color #fff
        margin-bottom .28rem
      }
      .money {
        font-size .28rem
        color #fff
      }
    }
  }

  .tab-ul {
    background-color: #fff;
    width: 100%;
    margin-top -.5rem
    .li-tab {
      padding .5rem 0 .28rem .3rem
      display flex
      align-items center
      img {
        width .28rem
        height .34rem
      }
      .address-t {
        margin-left .2rem
        font-size .28rem
        color #000
      }
    }
    .wuliu-box {
      border-bottom 1px solid #edeef0
      .wuliu-top {
        padding 0 .3rem
        display flex
        justify-content space-between
        .wuliu-address {
          font-size .24rem
          color #060f26
        }
      }
      .date {
        margin .2rem 0
        padding 0 .3rem
        font-size .22rem
        color #999
      }
    }
    .info-box {
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      .name-box {
        padding 0 0 .3rem .3rem
        display flex
        flex-direction column
        .box {
          display flex
          flex-direction row
          .name-t {
            font-size .24rem
            color #000
            margin-right .4rem
          }
          .mobile {
            font-size .24rem
            color #999
          }
        }
        .choose-address {
          margin-top 10px
          font-size .26rem
          color #000
          line-height 1.45
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all
        }
      }
      .shipping-address {
        padding 0 .3rem .3rem
        display flex
        justify-content space-between
        align-items center
        img {
          width .14rem
          height .26rem
        }
        .address-c {
          line-height 1.5
          word-break break-all
          font-size .24rem
          color #ffb64b
        }
      }
    }
    .goods-box {
      .goods-count {
        display flex
        align-items center
        margin .3rem
        font-size .28rem
        color #ffb64b
        .product-img {
          width .44rem
          height .44rem
          border-radius 4px
          background-color #bcbcbc
          img {
            width 100%
            height 100%
          }
        }
        .product-name {
          display flex
          flex-direction row
          align-items center
          color #000
          .product-logo{
            display flex
            justify-content center
            align-items center
            width 30px
            height 30px
            background-color #ccc
            margin-right 5px
          }
          img {
            max-height 100%
            max-width 100%
          }
        }
      }
      .product-m {
        .name-m {
          display flex
          padding 0 0 0 .3rem
          &:last-child {
            .name-b {
              /*border-bottom none*/
            }
          }
          .img-box {
            /*margin .4rem 0*/
            width 1.6rem
            height 1.6rem
            .ul-img {
              display flex
              align-items center
              .li-img {
                /*width 25%*/
                display flex
                align-items center
                justify-content center
                border-radius 4px
                width 1.6rem
                height 1.6rem
                margin-right .16rem;
                position relative
                img {
                  max-width 1.6rem
                  max-height 1.6rem
                  /*border-radius 4px*/
                }
                .count {
                  text-align center
                  line-height .5rem
                  background-color rgba(26, 26, 26, .8)
                  width .54rem
                  height .5rem
                  position absolute
                  right 0
                  bottom 0
                  font-size .28rem
                  color #fff
                }
              }
              .go-more {
                text-align center
                line-height 1.6rem
                width 25%
                height 1.6rem
                border-radius 8px
                background-color #ffb64b
                font-size .28rem
                color #ffb64b
              }
            }
          }
          .product-box {
            width 100%
            display flex
            margin-bottom .3rem
            .product-img {
              border-radius 4px
              display flex
              align-items center
              justify-content center
              width 1.6rem
              height 1.6rem
              background-color #e6e7e7
              img {
                max-width 100%
                max-height 100%
                /*border-radius 4px*/
              }
            }
          }
          .name-b {
            width 75%
            margin-left .2rem
            border-bottom 1px solid #edeef0
            display flex
            flex-direction column
            justify-content center
          }
          .t-b {
            justify-content space-between
            display flex
            line-height 1.5
            padding-right .3rem
            .name {
              width 70%
              font-size .28rem
              color #060f26
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .count {
              font-size .28rem
              color #ffb64b
            }
            .price {
              margin-top .36rem
              font-size .24rem
              color #999
            }
          }
          .amount-box {
            padding-right .3rem
            /*display flex*/
            /*justify-content space-between*/
            margin-top .3rem
            text-align right
            .price {
              font-size .24rem
              color #999
            }
            .total {
              margin .2rem 0
              font-size .24rem
              color #000
            }
          }
        }
      }
      .postage-box {
        padding .3rem
        border-bottom 1px solid #ededed
        color #999
        font-size .28rem
        .postage-t {
          display flex
          justify-content space-between
          &.user-pay {
            margin .3rem 0
          }
        }
      }
      .actually-paid {
        display flex
        justify-content space-between
        padding .3rem
        .title {
          font-size .3rem
          color #060f26
        }
        .cost {
          font-size .3rem
          color #ffb64b
        }
      }
      .order-box {
        padding .3rem .3rem 4rem
        .t-box {
          display flex
          align-items center
          margin-bottom .3rem
          .order-t {
            margin-left .2rem
            font-size .28rem
            color #060f26
          }
        }
        .postage-t {
          display flex
          justify-content space-between
          font-size .28rem
          color #999
          &.user-pay {
            margin .3rem 0
          }
          .cost {
            display flex
            .order-number {
              margin-right .5rem
            }
            .copy-btn {
              font-size .28rem
              color #3495f1
            }
          }
        }
      }
    }
  }

  .btn-add {
    text-align center
    background-color #fff
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    cursor: pointer;
    user-select: none;
    height: 1.2rem;
    font-size: .28rem;
    align-items center
    .btn-save {
      color #f14f34
      flex 1
      padding .1rem 0
      text-align center
      border-right 2px solid #eeeff1
    }
    .btn-del {
      background-color #ffb64b
      color #fff
      flex 1
      text-align center
      line-height 1.2rem
    }
    .btn-cancel {
      position absolute
      flex 1
      transform translate(-50%)
      color #f14f34
      line-height 1.2rem
    }
  }

  .line-bg {
    height .8rem
    .tip {
      padding .3rem
      font-size 12px
      color #060f26
    }
  }
</style>
