<template>
  <div class="wrap-commodityDetails">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="main-c">
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
      <div class="banner">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in proList" :key="index">
            <img class="logo-img" style="-webkit-user-select: none;margin: auto;cursor: zoom-in;" :src="item"
                 alt="">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="description">
        <div class="commodity-price">{{articleItem.productPrice}} {{articleItem.currency === 'PAI' ? 'π' : articleItem.currency}} <span v-if="articleItem.productPriceTwo !== 0">+ {{articleItem.productPriceTwo}} π</span></div>
        <div class="standard">{{articleItem.productName}}</div>
        <div class="sales-volume-inventory">
          <!--<div class="sales-volume">{{$t('shopping.text4')}} <span class="num">{{articleItem.saleCount}}</span></div>-->
          <div class="inventory">{{$t('shopping.text9')}} <span class="num">{{articleItem.stock}}</span></div>
        </div>
        <div class="expressage">
          <div class="tit">
            <!-- {{$t('shopping.text32')}}-->
            <span class="postage" v-if="articleItem2.courierFee === 0 || articleItem2.courierFee === null"><span style="color: #999">快递</span> {{$t('shopping.text11')}}</span>
            <span class="postage" v-else><span style="color: #999">快递   </span> {{articleItem2.courierFee}}  π</span>
          </div>
          <div>
            <span><span style="color: #999">让利</span> {{articleItem.productProfitRate}}%, 周期{{articleItem.presentCount}}个月</span>
          </div>
        </div>
      </div>
      <!--商品详情-->
      <div class="commodityDetails-content">
        <div class="title"><i class="icon"></i>{{$t('shopping.text10')}}</div>
        <div class="introduce">{{articleItem.productContent}}</div>
        <div class="imgthumb"  v-for="(item,index2) in contentImgList" :key="index2">
          <img class="con-img" style="-webkit-user-select: none;margin: auto;cursor: zoom-in;" :src="item" alt="">
        </div>
      </div>
    </div>
    <!--nav-->
    <ul class="footer-nav">
      <li @click="goToCurrentBusiness">
        <div class="icon"></div>
        <div class="text">{{$t('shopping.text13')}}</div>
      </li>
      <li @click="$router.push({path: '/myShopping',query: {productId: productId, way: 2, merchantUserAddress: $route.query.merchantUserAddress}})" class="ball-rect">
        <!--小球动画-->
        <transition
          name="ball"
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:after-enter="afterEnter"
          v-bind:css="true"
        >
          <div class="addcar-mask" v-show="ball.show">
            <img :style="{backgroundImage:'url('+ splitImg(ball.img) +')'}"
                 style="-webkit-user-select: none;margin: auto;cursor: zoom-in;" class="mask-item" alt="">
          </div>
        </transition>
        <div class="icon">
          <div class="num" :class="{'active2': totalExistence > 99}" v-if="totalExistence > 99">99+</div>
          <div class="num" v-else-if="totalExistence <= 99 && totalExistence >= 1">{{totalExistence}}</div>
          <div class="num active3" v-else-if="totalExistence <= 0">{{totalExistence}}</div>
        </div>
        <div class="text">{{$t('shopping.text14')}}</div>
      </li>
      <li class="add-car-but" @click="addCarBut(1)">{{$t('shopping.text15')}}</li>
      <li class="add-car-but" @click="addCarBut(2)">{{$t('shopping.text16')}}</li>
    </ul>
    <!--加入购物车and立即购买-->
    <transition name="safeDialog">
      <div class="mask-box" v-show="maskShow">
        <div class="footer-content">
          <div class="info-box">
            <div class="commodity-img">
              <img class="logo-img" style="-webkit-user-select: none;margin: auto;cursor: zoom-in;"
                   :src="proList[0]" alt="">
            </div>
            <div class="introduce">
              <div class="product-name">{{articleItem.productName}}</div>
              <div class="total-prices">{{articleItem.productPrice}} {{articleItem.currency === 'PAI' ? 'π' : articleItem.currency}} <span v-if="articleItem.productPriceTwo !== 0">+ {{articleItem.productPriceTwo}} π</span></div>
            </div>
            <div class="close-icon" @click="close"></div>
            <div class="quantity">
              <div class="tit">{{$t('shopping.text17')}}</div>
              <div class="form">
                <div class="subtract" @click="alterMinus"></div>
                <input type="number" class="commodity-number" :placeholder="countInput" @input="vialteInput"
                       v-model.number.trim="countInput" />
                <button class="add" :disabled="disabled" @click="alterAdd"></button>
              </div>
            </div>
            <div class="add-cart" v-if="addcartBg1" :class="{'active1': addcartBg1 }" @click="addCarPanelhandle()">
              {{$t('shopping.text20')}}
            </div>
            <div class="add-cart" v-if="addcartBg2" :class="{'active2': addcartBg2 }" @click="buyNow()">
              {{$t('shopping.text16')}}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {swiper, swiperSlide} from 'vue-awesome-swiper'

let vm = null;

export default {
  name: "productDetail",
  components: {mFixedTop, swiper, swiperSlide},
  data() {
    return {
      isGoBack: true,
      loadShow: true,
      maskShow: false,
      butText: '',
      disabled: false,
      addcartBg1: false,
      addcartBg2: false,
      countInput: 1,
      titleName: '商品详情',
      productId: Number(this.$route.query.productId),
      articleItem: {},
      articleItem2: {},
      contentImgList: [],
      arrItem: [],
      proList: [],
      totalExistence: 0,
      ball: {   // 购物小球参数
        show: false,
        el: null,
        img: ''
      },
      swiperOption: { //以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
        autoplay: false,
        loop: false,
        direction: 'horizontal',
        autoHeight: false,
        pagination: {
          el: '.swiper-pagination',
          type : 'fraction'
        },
        preventClicks : false,//默认true
      }
    }
  },
  created() {
    vm = this;
  },
  mounted() {
    this.getDetail()
    this.shoppingCartList()
  },
  methods: {
    goPath() {
      if(Number(this.$store.state.detailFlag) === 0){
        this.$router.push('/pay')
      } else if(Number(this.$store.state.detailFlag) === 1) {
        this.$router.push({
          path: '/shopDetail',
          query: {
            productId: Number(this.$route.query.productId),
            shopFlag: 1,
            merchantUserAddress:this.$route.query.merchantUserAddress,
          }
        })
      }
    },
    splitImg(imgUrl) { // 加产品前缀的工具方法
      if (imgUrl.indexOf('https') > -1 || imgUrl.indexOf('http') > -1) {
        return imgUrl
      } else {
        return 'https://discoverypi.blob.core.windows.net/' + imgUrl
      }
    },
    // 加入购物车
    addCarPanelhandle () {
      let itemId
      this.arrItem.forEach((item) => {
        itemId = item.id
      })
      for (let i =0; i< this.arrItem.length; i++) {
        // 该商品详情的id = 购物车中该商品的存在的产品id
        if (this.arrItem[i].productId === this.articleItem.id) {
          this.cartNum = this.arrItem[i].num // 购物车中该商品的存在的数量
        }
      }
      if (this.countInput < 1) {
        this.toastD(this.$t('shopping.text18'))
      } else if (this.cartNum >= this.articleItem.stock) {
        this.toastD(this.$t('shopping.text35') + this.articleItem.stock +',' + this.$t('shopping.text34'))
      } else if ((this.countInput + this.cartNum) > this.articleItem.stock) {
        this.toastD(this.$t('shopping.text36') + this.articleItem.stock)
      } else {
        this.$http.post(`${this.$api}shopMine/saveCartProduct?productId=${this.articleItem.id}&num=${this.countInput}&flagType=1`).then((res) => {
          if (res.data.status === 'success') {
            this.shoppingCartList() // 调购物车列表
            this.maskShow = false
            this.toastD('已加入购物车')
          } else {
            this.toastD(res.data.msg)
          }
        })
      }
    },
    // 立即购买
    buyNow() {
      if (this.countInput > this.articleItem.stock) { // 库存不足
        this.toastD(this.$t('shopping.text34' + this.articleItem.stock))
      } else {
        if (this.countInput < 1) {
          this.toastD($t('shopping.text18'))
        } else {
          let cartGoodsArr = []
          let objData = {
            productImg : this.proList[0],
            productName: this.articleItem.productName,
            num: this.countInput,
            price: this.articleItem.productPrice,
            priceTwo: this.articleItem.productPriceTwo,
            productId: this.articleItem.id,
            currency: this.articleItem.currency,
            merchantUserAddress:this.articleItem2.merchantAddress
          }
          cartGoodsArr.push(objData)
          this.$router.push({
            path: '/confirmOrder',
            query: {
              productId: this.$route.query.productId,
              merchantUserAddress: this.$route.query.merchantUserAddress
            }
          })
          this.$store.commit('SET_PRODUCT_CAR', cartGoodsArr)
        }
      }
    },
    // 显示加入购物车，立即购买
    addCarBut(index) {
      if (this.articleItem.stock <= 0) { //库存不足
        this.toastD('库存不足')
      } else {
        this.maskShow = true
        if (index === 1) { // 加入购物车
          this.butText = this.$t('shopping.text15')
          this.addcartBg1 = true
          this.addcartBg2 = false
        } else { // 立即购买
          this.butText = this.$t('shopping.text16')
          this.addcartBg1 = false
          this.addcartBg2 = true
        }
      }
    },
    shoppingCartList () {
      this.$http.post(`${this.$api}shopMine/queryCartProductList`).then((res) => {
        if (res.status) {
          let merchantList = res.data.data.merchantList
          this.totalExistence = 0
          let arr = []
          if (merchantList) {
            for (let i = 0; i < merchantList.length; i++) {
              for (let j = 0; j < merchantList[i].cartProductList.length; j++) {
                arr.push(merchantList[i].cartProductList[j])
              }
            }
          }
          this.arrItem = arr
          arr.forEach((item) => {
            this.totalExistence+=item.num
          });
        }
      })
    },
    close () {
      this.maskShow = false
      this.countInput = 1
    },
    // 减减
    alterMinus () {
      this.disabled = false
      if (this.countInput <= 1) {
        this.countInput = 1
      } else {
        this.countInput--
      }
    },
    // 加加
    alterAdd () {
      if (this.countInput >= 999) {
        this.countInput = 999
      } else {
        if (this.countInput >= this.articleItem.stock) { //库存不足
          this.toastD(this.$t('shopping.text34') + this.articleItem.stock)
          this.disabled = true
          this.countInput = this.articleItem.stock
        } else {
          this.disabled = false
          this.countInput++
        }
      }
    },
    vialteInput() {
      if (this.countInput > this.articleItem.stock) {
        this.toastD(this.$t('shopping.text34') + this.articleItem.stock)
      } else {
        this.disabled = false
        if (this.countInput >= 999) {
          this.toastD(this.$t('shoping.text21'))
          this.countInput = 999
        } else if (this.countInput < 1 ) {
          this.countInput = ''
        }
      }
    },
    goToCurrentBusiness() { // 前往商户
      this.$router.push({
        path: '/shopDetail',
        query: {
          productId: Number(this.$route.query.productId),
          shopFlag: 1,
          merchantUserAddress:this.$route.query.merchantUserAddress,
        }
      })
    },
    //小球过渡动画,进入之前,开始动画,进出之后
    beforeEnter(el) {  //动画初始化
      let rect = this.$refs.globule.getBoundingClientRect()
      let rectEl = document.getElementsByClassName('ball-rect')[0].getBoundingClientRect()
      let ball = document.getElementsByClassName('mask-item')[0]
      let x = (rectEl.left / 2) + (rect.left - rect.width / 2)
      let y = rect.top + rect.height / 2 - rectEl.top
      el.style.transform = 'translate3d(0,' + y + 'px,0)'
      ball.style.transform = 'translate3d(+' + x + 'px,0,0)'
      ball.src = this.ball.img
    },
    enter(el) {
      this.$nextTick(() => {
        el.style.transform = 'translate3d(0,0,0)'
        document.getElementsByClassName('mask-item')[0].style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter() {
      this.ball.show = false
    },
    getDetail() {
      let productId = this.$route.query.productId
      this.$http.post(`${this.$api}shopMine/getProductInfoByProductId?productId=${productId}`).then((res) => {
        this.loadShow = false
        let contentObj = res.data.data
        this.articleItem = contentObj
        this.articleItem2 = res.data.mapData.merchantRecord
        this.proList = contentObj.imageList.split(',')
        if (contentObj.contentImg.indexOf(',') > -1) {
          this.contentImgList = contentObj.contentImg.split(',')
        } else {
          this.contentImgList.push(contentObj.contentImg)
        }
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .v-loading {
    top: 36%;
  }
  .ios {
    .footer-nav {
      height: auto !important;
      padding-top: 6px !important;
      padding-bottom: 20px !important;
    }
    .main-c {
      top: 65px;
    }
  }

  .iosx {
    .footer-nav {
      height: auto !important;
      padding-top: 6px !important;
      padding-bottom: 40px !important;
    }
    .add-cart {
      bottom: 35px !important;
    }
  }

  .wrap-commodityDetails {
    overflow: auto!important;
    font-size: 14px;
    .main-c {
      width: 100%;
      background-color: #eee;
      .banner{
        width: 100%;
        height: 285px;
        background-color: #fff;
        margin-bottom: 4px;
        .swiper-container{
          width: 100% !important;
          height: 100% !important;
          margin: 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          .swiper-wrapper{
            width: 100% !important;
            .swiper-slide{
              width: 100% !important;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 0 !important;
              /* img{
                 width: 100%;
               }*/
              .logo-img{
                max-width: 100%;
                max-height: 100%;
              }
            }
            .swiper-slide-active{
              width: 100% !important;
              height: 100%;
              margin-right: 0 !important;
            }
          }
          .swiper-pagination-fraction{
            width: 1rem !important;
            height: 24px !important;
            line-height: 24px;
            background-color: rgba(0,0,0, .4);
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            position: absolute !important;
            z-index: 999 !important;
            bottom: 16px !important;
            left: auto;
            right: 0 !important;
            font-size: 12px !important;
            color: #fff !important;
            text-align: center;
            /*.ios &{
              bottom: 34px !important;
            }
            .iosx &{
              top: 58px !important;
            }*/
            /deep/.swiper-pagination-current{
              display: inline-block !important;
              margin-right: -1px !important;
            }
            /deep/ .swiper-pagination-total{
              display: inline-block !important;
              margin-left: -1px !important;
            }
          }
          img{
            max-width: 100%;
            max-height: 100%;
            display: block;
          }
        }
      }
      .description {
        background-color: #fff;
        padding: 20px 0;
        padding-bottom: 0;
        .commodity-price {
          padding: 0 15px;
          font-size: 17px;
          color: #ffb64b;
        }
        .standard {
          padding: 0 15px;
          color: #060f26;
          margin: 10px 0 15px;
          line-height: 1.5;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sales-volume-inventory {
          padding: 0 15px;
          font-size: 12px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 15px;
          border-bottom: 1px solid #edeef0;
        }
        .expressage {
          width: 100%;
          background: #F2F2F2;
          padding: 5px 15px !important;
          font-size: 14px;
          line-height: 20px;
          color: #060f26;
          .tit {
            color: #999;
          }
          .postage {
            color: #060f26;
          }
        }
      }
      .commodityDetails-content {
        width: 100vw;
        margin-top: 5px;
        background-color: #fff;
        padding: 0 15px;
        padding-bottom: 100px;
        .title {
          line-height: 40px;
          .icon {
            display: inline-block;
            width: 2px;
            height: 18px;
            background: url("./img/icon.png") no-repeat center;
            vertical-align: middle;
            margin-right: 10px;
          }
        }
        .introduce {
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .imgthumb {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          height: 100%;
          margin-bottom: 10px;
          .con-img {
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
    .footer-nav {
      width: 100vw;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
      background-color: #fff;
      padding: 0 15px;
      li {
        height: 36px;
        line-height: 36px;
        text-align: center;
        .icon {
          width: 18px;
          height: 18px;
          position: relative;
          .num {
            position: absolute;
            top: -11px;
            right: -12px;
            width: 17px;
            height: 15px;
            display: flex;
            padding-top: 1px;
            align-items: center;
            justify-content: center;
            border-radius: 100%;
            background-color: #ff5959;
            border: 1px solid #ff5959;
            font-size: 0.24rem;
            color: #fff;
            box-shadow: 0 1px 2px rgba(255, 89, 89, 0.8);
            &.active2 {
              top: -16px;
              right: -8px;
              width: 22px;
              height: 17px;
              padding-left: 2px;
              padding-top: 1px;
            }
          }
          .active3 {
            top: -11px;
            right: -12px;
            width: 18px;
            height: 15px;
            border-radius: 50%;
            padding-right: 1px;
            border: 1px solid rgba(204, 204, 204, 1);
            background-color: rgba(204, 204, 204, 1);
            box-shadow: 0 1px 2px rgba(204, 204, 204, .8);
            color: #fff;
          }
        }
        .text {
          line-height: 22px;
          color: #666;
        }
        &:nth-child(1) {
          width: 50px;
          .icon {
            background: url("./img/merchant.png") no-repeat center;
            background-size: 100% 100%;
            margin: 0 auto;
          }
        }
        &:nth-child(2) {
          width: 50px;
          margin-left: 10px;
          .icon {
            background: url("./img/Shoppingcart.png") no-repeat center;
            background-size: 100% 100%;
            margin: 0 auto;
          }
        }
        &:nth-child(3) {
          flex: 1;
          height: 36px;
          line-height: 36px;
          background-color: #fff;
          color: #ffb64b;
          border: 1px solid #eee;
          margin-left: 15px;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        &:nth-child(4) {
          flex: 1;
          background-color: #ffb64b;
          width: 110px;
          color: #fff;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
      .ball-rect {
        position: relative;
        .addcar-mask {
          position: absolute;
          left: 12px;
          top: -5px;
          padding: 0;
          width: 28px;
          height: 28px;
          pointer-events: none;
          border-radius: 50%;
          z-index: 240;
          transform: translate3d(0, 0, 0);
          // 小球
          .mask-item {
            pointer-events: none;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            overflow: hidden;
            border-radius: 50%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            transform: translate3d(0, 0, 0);
            box-shadow: 0 2px 2px rgba(255, 89, 89, .4);
          }
        }
      }
    }
    .mask-box {
      width: 100vw;
      height: 100vh;
      background-color: rgba(2, 6, 15, .5);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 102;
      &.safeDialog-enter, &.safeDialog-leave-to {
        opacity: 0;
        .footer-content {
          transform: translate(0, -8%)
        }
      }
      &.safeDialog-enter-active {
        transition: .4s;
        .footer-content {
          transition: .4s
        }
      }
      &.safeDialog-leave-active {
        transition: .2s;
        .footer-content {
          transition: .2s
        }
      }
      .event-hiding {
        position: absolute;
        left: 50%;
        top: 50%;
        background-color: #ffb64b;
        transform: transLate(-50%, -50%);
      }
      .footer-content {
        width: 100vw;
        height: 250px;
        position: fixed;
        background-color: #fff;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 15px;
        transform: translate(0, 0);
        .info-box {
          width: calc(100vw - 30px);
          height: 100%;
          position: relative;
          bottom: 0;
          left: 0;
          right: 0;
          .commodity-img {
            width: 100px;
            height: 100px;
            position: absolute;
            top: -20px;
            left: 0;
            border-radius: 4px;
            background-color: #efefef;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            .logo-img {
              max-width: 100%;
              max-height: 100%;
            }
            /*img{
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 4px;
            }*/
          }
          .introduce {
            width: 181px;
            margin-left: 110px;
            padding-bottom: 40px;
            .product-name {
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              padding-top: 15px;
              margin-bottom: 12px;
              line-height: 1.2;
            }
            .total-prices {
              font-size: 18px;
              color: #ffb64b;
              position: relative;
            }
          }
          .close-icon {
            width: 40px;
            height: 50px;
            position: absolute;
            right: -15px;
            top: 0;
            &:after {
              display: block;
              content: '';
              width: 16px;
              height: 16px;
              position: absolute;
              top: 15px;
              left: 11px;
              background: url("./img/close_2.png") no-repeat center;
              background-size: 100% 100%;
            }
          }
          .quantity {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .tit {
              font-size: 14px;
            }
            .sun {
              width: auto;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .minus, .added {
                width: 26px;
                height: 26px;
              }
              .minus {
                background: url("./img/reduce_2.png") no-repeat center;
                background-size: contain;
              }
              .added {
                background: url("./img/add_2.png") no-repeat center;
                background-size: contain;
              }
              .num {
                margin: 0 20px;
                color: #ffb64b;
                font-size: 18px;
                line-height: 18px;
              }
            }
            .form {
              display: flex;
              align-items: center;
              justify-content: center;
              .subtract {
                width: 20px;
                height: 20px;
                background: url("./img/reduce_2.png") no-repeat center;
                background-size: 100% 100%;
              }
              .commodity-number {
                width: 40px;
                height: 20px;
                font-size: 14px;
                color: #ffb64b;
                margin: 0 12px;
                text-align: center;
                /* background-color: rgba(53, 154, 242, .5);
                 &:focus{
                   background-color: rgba(53, 154, 242, 0);
                 }*/
              }
              .add {
                width: 20px;
                height: 20px;
                background: url("./img/add_2.png") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
          .add-cart {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            position: absolute;
            bottom: 15px;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            &.active1 {
              background-color: #ffb64b;
            }
            &.active2 {
              background-color: #ffb64b;
            }
          }
          .join-now {
            margin-top: 200px;
          }
        }
      }
    }
    .mask-img {
      background-color: #fff;
      display: flex;
      align-items: center;
      flex-flow: wrap;
      justify-content: center;
      &.active1 {
        animation: scaleDraw .6s 1 ease-in-out;
        @keyframes scaleDraw {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      }
      &.active2 {
        animation: scaleDraw2 .4s 1 ease-in-out;
        @keyframes scaleDraw2 {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(0);
          }
        }
      }
      .top1-space, .top2-space {
        width: 100vw;
        height: calc((100vh - 5.6rem) * .5);
      }
      .preview-img {
        display: block;
        width: 100%;
        /*height: 5.6rem;*/
        img {
          max-width: 100%;
          max-height: 100%;
          margin: auto;
          display: block;
        }
      }
      .swiper-pagination-fraction {
        position: fixed;
        height: 60px;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
      }
    }
  }
</style>
