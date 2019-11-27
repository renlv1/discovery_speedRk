<template>
  <div class="wrap-myShopping">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="main-c">
      <ul class="commercial-tenant-list">
        <!--购物车列表里--每个商户列表-->
        <li class="item-commercial" v-for="(productList,index) in merchantList" :key="index"
            :class="{disablelist: disabelIndex !== index && disabelIndex !== -1}">
          <div class="commercial-li">
            <div class="icon" @click="checkAll(index, productList)" :class="{'checked': checkAllIndex === index}"></div>
            <div class="commercial-name" @click="gotoMerchat(productList)">
              <div class="brand" :style="{backgroundImage:'url('+ productList.shopLogo +')'}">
              </div>
              <div class="name">{{productList.merchantName}}</div>
            </div>
            <div class="deleted-commercial" @click="deleteTheMerchantsList(index, productList)"></div>
          </div>
          <!--// 购物车列表里--每个商户里的商品列表-->
          <ol class="info-commercial">
            <li class="info-commodity" @click.prevent.stop="goToCommodityDetails(item)"
                v-for="(item,indexInItem) in productList.cartProductList" :key="indexInItem">
              <div class="icon" @click.stop="checkedFn(item, productList, index)"
                   :class="{'checked': item.makeChoose}">
              </div>
              <div class="commodity-img">
                <img class="logo-img" :src="imgSplit(item.image.split(',')[0])">
              </div>
              <div class="explain">
                <p class="text">{{item.title}}</p>
                <div class="price-box">
                  <div class="price">{{item.price}} {{item.currency === 'PAI' ? 'π' : item.currency}} <span
                    v-if="item.priceTwo !== 0"> + {{item.priceTwo}} π</span>
                  </div>
                  <div class="counter-component num-box">
                    <div class="subtract" @click.stop="minus(item,index)"></div>
                    <div class="commodity-number">{{item.num}}</div>
                    <button class="add" :disabled="disabled" @click.stop="add(item,index)"></button>
                  </div>
                </div>
              </div>
              <div class="modal-box" @click.stop="" v-if="modalShow">
                <div class="info-content" @click.stop="">
                  <div class="title">{{$t('shopping.text22')}}</div>
                  <div class="form">
                    <div class="subtract" @click.stop="alterMinus"></div>
                    <input type="number" class="commodity-number" :placeholder="countInput" ref="vialte" id="vialte"
                           @click.stop="vialteInput(item,indexInItem)" v-model.number.trim="countInput" />
                    <button class="add" :disabled="disabled" @click.stop="alterAdd"></button>
                  </div>
                  <div class="but">
                    <div class="cancel" @click.stop="cancel()">{{$t('commonBountyHunter.text10')}}</div>
                    <div class="affirm" @click.stop="affirmFn(item,indexInItem)">{{$t('commonBountyHunter.text14')}}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </li>
      </ul>
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
      <div v-if="!merchantList" class="empty">
        <img src="@/assets/img/common/empty.png" alt="">
        <p>{{$t('common.empty')}}</p>
      </div>
    </div>
    <!--购物车底部 -- 结算 -->
    <div class="total-box" v-if="merchantList && merchantList.length">
      <div class="total">
        <span>{{$t('shopping.text24')}}：</span>
        <span class="total-prices" v-if="totalNum > 0">
          <span v-if="allPricePi !== 0">{{allPricePi.toFixed(4)}} π</span>
          <span v-if="(allPricePi !== 0 || allPriceCNY !== 0 )&& allPriceUSD !== 0">+</span>
          <span v-if="allPriceUSD !== 0">{{allPriceUSD.toFixed(4)}} USD</span>
          <span v-if="(allPricePi !== 0 || allPriceUSD !== 0) && allPriceCNY !== 0">+</span>
          <span v-if="allPriceCNY !== 0">{{allPriceCNY.toFixed(4)}} CNY</span>
          <span v-if="totalTwo && totalTwo !== 0">+</span>
          <span v-if="totalTwo && totalTwo !== 0">{{totalTwo}} π</span>
        </span>
        <span class="total-prices" v-else>0</span>
      </div>
      <div class="settlement" @click="clearing" v-if="totalNum >= 100">{{$t('shopping.text25')}}(99+)</div>
      <div class="settlement" @click="clearing" v-else-if="totalNum < 100 && totalNum > 0">
        {{$t('shopping.text25')}}({{totalNum}})
      </div>
      <div class="settlement" @click="clearing" v-else
           :class="{'nototal': totalNum === 0 || typeof totalNum === 'undefined'}">{{$t('shopping.text25')}}(0)
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import Dialog from '@/components/dialog/index'

export default {
  components: {mFixedTop},
  name: "myShopping",
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('shopping.text14'),
      merchantList: [], // 每个商家
      newMerchantList: [], // 每个商家里的商品列表
      disabelIndex: -1,
      checkAllIndex: -1,
      disabled: false,
      modalShow: false,
      productId: this.$route.query.productId,
      stock: '',
      loadShow: true,
      totalTwo: 0, // 总价
      totalNum: 0, // 总数
      merchantUserAddress: '', // 用于判断是否是同一个商户
      cartGoodsArr: [],
      allPricePi: 0,
      allPriceUSD: 0,
      allPriceCNY: 0
    }
  },
  mounted() {
    this.shoppingCartList()
  },
  methods: {
    gotoMerchat() {
    },
    goToCommodityDetails() {
    },
    goPath() {
      this.$router.push('/pay')
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
    // 全选中
    /*删除商户里所有的商品*/
    deleteTheMerchantsList(index, product) {
      Dialog({
        title: '',
        content: this.$t('shopping.text27'),
        type: 'confirm',
        okFn: () => {
          this.$http.post(`${this.$api}shopMine/saveCartProduct?merchantUserAddress=${product.merchantUserAddress}&flagType=3`).then(res => {
            if (res.status === 200) {
              this.toastD(this.$t('shopping.text28'))
              this.shoppingCartList()
              this.calcTotalPrice(index)
              this.merchantList.splice(index, 1)
            } else {
              this.toastD(res.msg)
            }
          })
        }
      })
    },

    // 6.3 创建线上订单
    clearing() {
      if (typeof this.merchantList[this.disabelIndex] !== 'undefined') {
        let merchant = {
          merchantName: this.merchantList[this.disabelIndex].merchantName,
          merchantUserAddress: this.merchantList[this.disabelIndex].merchantUserAddress,
          shopLogo: this.merchantList[this.disabelIndex].shopLogo,
          receiveType: this.merchantList[this.disabelIndex].cartProductList[0].currency
        }

        this.cartGoodsArr.forEach((item) => {
          item.cartId = item.id
        })

        this.$store.commit('SET_PRODUCT_CAR', this.cartGoodsArr)
        this.$router.push({
          path: '/confirmOrder',
          query: {
            productId: this.$route.query.productId,
            merchant: JSON.stringify(merchant),
            path: 2,
            merchantUserAddress: this.$route.query.merchantUserAddress
          }
        })
      } else {
        this.toastD(this.$t('addAddress.text50'))
      }
    },

    // 减去购物商品数量
    minus(item, indexInItem) {
      this.loadShow = true
      if (item.num <= 1) {
        Dialog({
          title: '',
          content: this.$t('shopping.text30'),
          type: 'confirm',
          okFn: () => {
            this.toDeleteA(indexInItem, item)
          }
        })
      } else {
        item.num--
        let newNum = item.num
        this.$http.post(`${this.$api}shopMine/saveCartProduct?cartId=${item.id}&num=${newNum}&flagType=2`).then(res => {
          this.loadShow = false
          if (res.status) {
          } else {
            this.toastD(res.msg)
          }
        })
      }
      this.calcTotalPrice(indexInItem)
    },

    /*删除每个商户里的某一项商品*/
    toDeleteA(index, item) {
      this.calcTotalPrice()
      this.removeGoods(index, item)
    },

    removeGoods(index, item) { // 购物车记录ID(修改与移除产品时传)// 操作类型 1增加 2修改 3移除
      this.$http.post(`${this.$api}shopMine/saveCartProduct?cartId=${item.id}&flagType=3`).then((res) => {
        if (res.data.status) {
          this.toastD(this.$t('shopping.text29'))
          this.shoppingCartList()
        } else {
          this.toastD(res.data.msg)
        }
      })
    },

    // ++增加商品数量
    add(item, indexInItem) {
      this.loadShow = true
      this.$http.post(`${this.$api}shopMine/getProductInfoByProductId?productId=${item.productId}`).then((res) => {
        this.loadShow = false
        if (res.status === 200) {
          this.stock = res.data.data.stock
          if (item.num >= this.stock) {
            this.toastD(this.$t('shopping.text34') + this.stock)
            item.num = this.stock
          } else {
            if (item.num >= 999) {   // 禁用
              this.disabled = true
            } else {
              this.$http.post(`${this.$api}shopMine/saveCartProduct?productId=${item.productId}&num=1&flagType=1`).then(res => {
                if (res.data.status === 'success') {
                  let a = []
                  this.merchantList = a.concat(this.merchantList) // 解决更改数据元素 新数组无法更新到DOM上
                  item.num++
                  this.calcTotalPrice(indexInItem)
                } else {
                  this.toastD(res.data.msg)
                }
              })
            }
          }
        } else {
          this.toastD(res.msg)
        }
      })
    },

    //计算总金额, 总数
    calcTotalPrice(index) {
      let currency = []
      let price = []
      let pirceTwo = [] // 第二币种
      let allNum = []
      //临时存储第一币种
      let arrPi = []
      let arrUSD = []
      let arrCNY = []


      if (this.merchantList[index]) {
        this.merchantList[index].cartProductList.forEach((item) => { // 遍历每个商家下的商品
          if (item.makeChoose) {
            currency.push(item.currency)
            price.push(item.price * item.num)
            pirceTwo.push(item.priceTwo * item.num)
            allNum.push(item.num)
          } else {
            this.totalNum = 0
          }
          if (allNum.length > 1) { // 判断数量数组中元素的个数 如果大于1 遍历累加 否则 结算数量为第一个元素的数量
            this.totalNum = allNum.reduce(function (prev, curr) {
              return prev + curr;
            })
          } else {
            this.totalNum = allNum[0]
          }
          if (pirceTwo.length > 1) { // 判断数量数组中元素的个数 如果大于1 遍历累加 否则 结算数量为第一个元素的数量
            this.totalTwo = pirceTwo.reduce(function (prev, curr) {
              return prev + curr;
            })
          } else {
            this.totalTwo = pirceTwo[0]
          }
        })
      } else {
        this.totalNum = 0
      }
      if (this.disabelIndex === -1) {
        this.totalNum = 0
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
      if (arrPi.length !== 0) {
        for (let i = 0; i < arrPi.length; i++) {
          allPricePi = allPricePi + price[arrPi[i]]
        }
      }
      this.allPricePi = allPricePi

      // 计算单位为USD的金额之和
      let allPriceUSD = 0
      if (arrUSD.length !== 0) {
        for (var i = 0; i < arrUSD.length; i++) {
          allPriceUSD = allPriceUSD + price[arrUSD[i]]
        }
      }
      this.allPriceUSD = allPriceUSD

      // 计算单位为CNY的金额之和
      let allPriceCNY = 0
      if (arrCNY.length !== 0) {
        for (var i = 0; i < arrCNY.length; i++) {
          allPriceCNY = allPriceCNY + price[arrCNY[i]]
        }
      }
      this.allPriceCNY = allPriceCNY
    },

    // 单个的选中
    checkedFn(item, plist, index) {
      if (this.disabelIndex !== index) {
        this.disabelIndex = index
        this.cartGoodsArr = []
        this.merchantList.forEach(m => {
          m.cartProductList.forEach(a => {
            a.makeChoose = false
          })
        })
        item.makeChoose = true
        let a = []
        this.merchantList = a.concat(this.merchantList) // 解决更改数据元素 新数组无法更新到DOM上
        if (plist.cartProductList.length === 1) {
          this.checkAllIndex = index
        } else {
          this.checkAllIndex = -1
        }
      } else {
        this.cartGoodsArr = []
        item.makeChoose = !item.makeChoose
        let a = []
        this.merchantList = a.concat(this.merchantList) // 解决更改数据元素 新数组无法更新到DOM上

        let newArr = []
        plist.cartProductList.forEach((item) => {
          if (item.makeChoose === true) {
            newArr.push(item)
          }
        })
        if (newArr.length === plist.cartProductList.length) {
          this.checkAllIndex = index
        } else {
          this.checkAllIndex = -1
        }
        if (newArr.length === 0) {
          this.totalNum = 0
        }
      }
      this.merchantList.forEach(item => {
        item.cartProductList.forEach((key) => {
          if (key.makeChoose) {
            this.cartGoodsArr.push(key)
          }
        })
      })
      this.calcTotalPrice(index)
    },

    checkAll(index, prolist) {
      let a = []
      if (this.disabelIndex !== index && this.disabelIndex !== -1) { // 全选不同商家
        this.cartGoodsArr = []
        this.cartGoodsArr = this.merchantList[index].cartProductList
        this.merchantList.forEach(m => {
          m.cartProductList.forEach(a => {
            a.makeChoose = false
          })
        })
        this.merchantList = a.concat(this.merchantList) // 解决更改数据元素 新数组无法更新到DOM上
        this.checkAllIndex = index
        this.disabelIndex = index
        prolist.cartProductList.forEach(item => {
          item.makeChoose = true
        })
      } else {  // 全选相同商家
        this.merchantList.forEach(m => {
          m.cartProductList.forEach(a => {
            a.makeChoose = false
          })
        })
        if (this.checkAllIndex === -1) {
          this.checkAllIndex = index
          this.disabelIndex = index
          this.cartGoodsArr = this.merchantList[index].cartProductList
          prolist.cartProductList.forEach(item => {
            item.makeChoose = true
          })
        } else {
          this.checkAllIndex = -1
          this.disabelIndex = -1
          prolist.cartProductList.forEach(item => {
            item.makeChoose = false
          })
        }
      }
      this.calcTotalPrice(index)
    },

    shoppingCartList() {
      this.$http.post(`${this.$api}shopMine/queryCartProductList`).then((res) => {
        if (res.status) {
          this.loadShow = false
          this.merchantList = res.data.data.merchantList
        }
      })
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .empty {
    position: absolute;
    top: 40%;
    left: 30%;
    padding: 0;
    background: none;
  }

  .ios {
    .total-box {
      height: auto !important;
      /*padding-bottom: 20px !important;*/
    }
  }

  .iosx {
    .total-box {
      height: auto !important;
      padding-bottom: 20px !important;
    }
  }

  /deep/ .g-dialog {
    .g-dialog-content {
      font-size: 14px !important;
    }
  }

  .no-data {
    img {
      width: 2.32rem;
      display: block;
      margin: .5rem auto 0;
    }
    .text {
      font-size: 14px;
      text-align: center;
      padding-top: 10px;
      color: #cccccc;
    }
  }

  .wrap-myShopping {
    width: 100%;
    .app-header {
      box-shadow: 0 0 3px rgba(0, 0, 0, .1);
    }
    .main-c {
      width: 100%;
      height: 100%;
      padding-bottom: 80px;
      overflow: auto;
      font-size: 14px;
      .commercial-tenant-list { // list-box
        width: 100%;
        .item-commercial {
          padding: 0 15px;
          background-color: #fff;
          //box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 2px -2px rgba(224, 224, 224, .4);
          &:first-child {
            .ios & {
              padding-top: 20px;
            }
          }
          &.disablelist {
            .icon {
              background-color: #f7f7f7 !important;
            }
          }
          .commercial-li {
            width: 100%;
            height: 50px;
            line-height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .icon {
              width: 18px;
              height: 18px;
              border-radius: 100%;
              border: 1px solid #e5e5e5;
              background-color: #fff;
              margin-right: 20px;
              &.checked {
                width: 18px;
                height: 18px;
                border-radius: 100%;
                background: url("./img/Selected.png") no-repeat center;
                background-color: #fd4537 !important;
                background-size: 50% 50%;
                border: 1px solid #fd4537;
                box-shadow: 0 0 2px rgba(255, 69, 56, .8);
                transition: background-color .3s linear;
              }
            }
            .commercial-name {
              flex: 1;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              .brand {
                width: 22px;
                height: 22px;
                background-color: #bcbcbc;
                border-radius: 4px;
                margin-right: 8px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                /*img{
                  display: block;
                  width: 100%;
                  height: 100%;
                  border-radius: 4px;
                }*/
              }
              .name {
                max-width: 2.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #060f26;
              }
            }
            .deleted-commercial {
              width: 24px;
              height: 24px;
              border-radius: 100%;
              background: url("./img/Delete.png") no-repeat center;
              background-size: 100% 100%;
            }
          }
          //margin-bottom: 10px;
          .info-commercial { // 每个商户里的商品
            width: 100%;
            .info-commodity {
              width: 100%;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              /*margin: 15px 0;*/
              position: relative;
              &:last-child {
                margin-bottom: 10px;
                padding-bottom: 15px;
              }
              &.disabled-list {
                .icon {
                  background-color: #f7f7f7;
                }
              }
              .icon {
                width: 18px;
                height: 18px;
                border-radius: 100%;
                border: 1px solid #e5e5e5;
                background-color: #fff;
                margin-right: 15px;
                &.checked {
                  width: 18px;
                  height: 18px;
                  border-radius: 100%;
                  background: url("./img/Selected.png") no-repeat center;
                  background-color: #fd4537 !important;
                  background-size: 50% 50%;
                  border: 1px solid #fd4537;
                  box-shadow: 0 0 4px rgba(255, 69, 56, 1);
                  transition: background-color .3s linear;
                }
              }
              .commodity-img {
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #e5e5e5;
                border-radius: 4px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                .logo-img {
                  display: block;
                  max-width: 100%;
                  max-height: 100%;
                  border-radius: 4px;
                  vertical-align: middle;
                }
              }
              .explain {
                flex: 1;
                margin-left: 10px;
                .text {
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  line-height: 1.5;
                }
                .price-box {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: 14px;
                  .price {
                    width: 50%;
                    font-size: 16px;
                    color: #ffb64b;
                  }
                  .counter-show input {
                    border: none;
                    border-top: 1px solid #e3e3e3;
                    border-bottom: 1px solid #e3e3e3;
                    height: 23px;
                    line-height: 23px;
                    width: 30px;
                    outline: none;
                    text-indent: 4px;
                  }
                  .num-box {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    position: absolute;
                    right: 0;
                    bottom: 26px;
                    z-index: 10;
                    .subtract {
                      width: 20px;
                      height: 20px;
                      background: url("./img/reduce_2.png") no-repeat center;
                      background-size: 100% 100%;
                    }
                    .commodity-number {
                      width: 30px;
                      font-size: 14px;
                      height: 20px;
                      line-height: 20px;
                      color: #060f26;
                      text-align: center;
                    }
                    .add {
                      width: 20px;
                      height: 20px;
                      background: url("./img/add_2.png") no-repeat center;
                      background-size: 100% 100%;
                    }
                  }
                }
              }
              .modal-box {
                width: 100vw;
                height: 100vh;
                position: fixed;
                background-color: rgba(0, 0, 0, .1);
                z-index: 101;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .info-content {
                  width: calc(100vw - 40px);
                  height: auto;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px 0;
                  border-radius: 10px;
                  box-shadow: 0 0 4px rgba(53, 154, 242, .4);
                  animation: clip .4s 1;
                  animation-timing-function: ease;
                  @keyframes clip {
                    from {
                      transform: scale(.8);
                    }
                    to {
                      transform: scale(1);
                    }
                  }
                  .title {
                    font-size: 16px;
                    text-align: center;
                    padding-bottom: 20px;
                  }
                  .form {
                    margin: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-bottom: 20px;
                    .subtract {
                      width: 20px;
                      height: 20px;
                      background: url("./img/reduce_2.png") no-repeat center;
                      background-size: 100% 100%;
                    }
                    .commodity-number {
                      width: 34px;
                      height: 20px;
                      font-size: 14px;
                      color: #060f26;
                      margin: 0 16px;
                      text-align: center;
                      background-color: rgba(53, 154, 242, .5);
                      &:focus {
                        background-color: rgba(53, 154, 242, 0);
                      }
                    }
                    .add {
                      width: 20px;
                      height: 20px;
                      background: url("./img/add_2.png") no-repeat center;
                      background-size: 100% 100%;
                    }
                  }
                  .but {
                    width: 80%;
                    margin: auto;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .cancel, .affirm {
                      flex: 1;
                      text-align: center;
                      border-radius: 17px;
                    }
                    .cancel {
                      margin-right: 30px;
                      border: 1px solid rgba(53, 154, 242, 1);
                      color: #ffb64b;
                    }
                    .affirm {
                      background-color: #ffb64b;
                      color: #fff;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .total-box {
      width: 100vw;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      font-size: 16px;
      .total {
        flex: 1;
        height: 100%;
        padding-left: 15px;
        padding-right: 5px;
        color: #0e1b2e;
        display: flex;
        overflow: hidden;
        white-space: nowrap;
        .total-prices {
          color: #ffb64b;
          flex: 1;
          overflow: hidden;
          display: block;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .settlement {
        width: 2.8rem;
        height: 100%;
        background-color: #ffb64b;
        color: #fff;
        text-align: center;
        &.nototal {
          background-color: #ccc;
        }
      }
    }
  }
</style>
