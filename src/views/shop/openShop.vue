<template>
  <div class="open-shop" v-if="merchantData">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="main-c">
      <div class="logo-c" @click="$router.push({path: '/userInformation', query: {merchantId: JSON.parse($store.state.merchantInfo).id}})">
        <div class="logo-box">
          <div class="logo">
            <div class="logo-img">
              <img v-if="merchantData.arLogoImg" :src="imgSplit(merchantData.arLogoImg)"/>
              <img v-else src="./img/2.png"/>
            </div>
            <div class="name-w">
              <p class="name">{{merchantData.merchantName}}</p>
              <p class="profession">{{$productType(merchantData.merType)}}</p>
            </div>
          </div>
          <div class="right">
            <div class="go-icon"><img src="./img/go.png"/></div>
          </div>
        </div>
      </div>
      <div class="business-box">
        <!-- 上架 -->
        <div class="open-business" v-show="merchantData.merchatFlag === 2">{{$t('shops.text1')}}</div>
        <!-- 隐藏 -->
        <div class="open-business" v-show="merchantData.merchatFlag === 1"><img src="./img/openShop.png" alt="">{{$t('shops.text2')}}</div>
        <div class="close-box" @click="openBusiness" v-show="merchantData.merchatFlag === 2"><img src="./img/close.png"></div>
        <div class="close-box" @click="openBusiness" v-show="merchantData.merchatFlag === 1"><img src="./img/open.png"></div>
      </div>
      <div class="grid-menu">
        <div class="web-grid">
          <!-- 待接单 -->
          <li @click="toOrder(0)" class="item order-item">
            <p class="order-text">{{waitingNum}}</p>
            <p>{{$t('shops.text5')}}</p>
          </li>
          <!-- 待发货 -->
          <li @click="toOrder(1)" class="item order-item">
            <p class="order-text">{{sendNum}}</p>
            <p>{{$t('shops.text6')}}</p>
          </li>
          <!-- 全部订单 -->
          <router-link tag="li" to="/paiOrder" class="item order-item" @click.native="toOrder(0)">
            <div class="allOrder-item">
              <img src="./img/allOrder.png" alt="">
              <p>{{$t('shops.text7')}}</p>
            </div>
          </router-link>
        </div>
        <div class="web-grid">
          <!-- 收款码 -->
          <router-link tag="li" to="/payCode" class="item">
            <img src="./img/qrcodeMoney.png" alt="">
            <p>{{$t('addAddress.text51')}}</p>
          </router-link>
          <!-- 当面收款 -->
          <router-link tag="li" to="/facePay" class="item">
            <img src="./img/faceMoney.png" alt="">
            <p>{{$t('addAddress.text52')}}</p>
          </router-link>
          <!-- 交易记录 -->
          <router-link tag="li" to="/shopTransactionList" class="item">
            <img src="./img/orderRecord.png" alt="">
            <p>{{$t('addAddress.text53')}}</p>
          </router-link>
          <!-- 商品管理 -->
          <router-link tag="li" to="/goodsmanage" class="item">
            <img src="./img/shopSetting.png" alt="">
            <p>{{$t('addAddress.text54')}}</p>
          </router-link>
          <!-- 商品分类 -->
          <router-link tag="li" to="/categories" class="item">
            <img src="./img/shopSort.png" alt="">
            <p>{{$t('addAddress.text55')}}</p>
          </router-link>
          <!-- 藏宝设置 -->
          <router-link tag="li" to="/hiddenSetting" class="item">
            <img src="./img/gemSetting.png" alt="">
            <p>{{$t('addAddress.text56')}}</p>
          </router-link>
          <!-- 邮费设置 -->
          <router-link tag="li" to="/postage" class="item">
            <img src="./img/postage.png" alt="">
            <p>{{$t('addAddress.text57')}}</p>
          </router-link>
          <!-- 保证金 -->
          <router-link tag="li" to="/marginTrade" class="item">
            <img src="./img/cashDeposi.png" alt="">
            <p>{{$t('addAddress.text58')}}</p>
          </router-link>
          <!-- 收款币种 -->
          <router-link tag="li" to="/paymentCurrency" class="item">
            <img src="./img/paymentMoney.png" alt="">
            <p>{{$t('addAddress.text59')}}</p>
          </router-link>
        </div>
      </div>
    </div>
    <VFooter />
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import VFooter from '@/components/footer'
import Dialog from '@/components/dialog/index'

export default {
  name: "openShop",
  components: {mFixedTop, VFooter},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('addAddress.text60'),
      merchantData: JSON.parse(this.$store.state.merchantInfo),
      waitingNum: 0, // 待接单
      sendNum: 0, // 待发货
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.getWaitingNum()
    this.getSendNum()
  },
  methods: {
    goPath() { // 返回到我的
      this.$router.push('/menu')
    },
    toOrder(index) {
      this.$router.push({
        path: '/paiOrder',
        query: {
          activeIndex: index
        }
      })
    },
    imgSplit(img) {
      if (img) {
        let data = img.split(',')[0]
        if (data.indexOf('http') > -1) {
          return img
        } else {
          return 'https://discoverypi.blob.core.windows.net/' + data
        }
      }
    },
    getWaitingNum() { // 待接单数量
      this.$http.post(`${this.$api}/shopMine/querySellOrder?status=8`).then((res) => {
        this.waitingNum = res.data.data.totalCount
      })
    },
    getSendNum() { // 待发货数量
      this.$http.post(`${this.$api}/shopMine/querySellOrder?status=9`).then((res) => {
        this.sendNum = res.data.data.totalCount
      })
    },
    openBusiness() {
      let text = ''
      let merchatFlag
      if (this.merchantData.merchatFlag === 1) {
        text = this.$t('shops.text3')
        merchatFlag = 2
      } else {
        text = this.$t('shops.text4')
        merchatFlag = 1
      }
      Dialog({
        content: text,
        okFn: () => {
          this.$http.post(`${this.$api}/shopMine/modifyMerchantFlag?merchatFlag=${merchatFlag}`).then(res => {
            if (res.status === 200) {
              this.merchantData.merchatFlag = merchatFlag
              this.$store.commit('SET_MERCHANT_INFO', JSON.stringify(res.data))
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .open-shop {
    width: 100vw;
    // background-color: #f5f5f7;
    font-size: 14px;
  }
  .grid-menu{
    border-top: 10px solid #f5f6fa;
    padding-bottom: 1.5rem;
    .web-grid{
      padding-top: .2rem;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      li{
        text-align: center;
        width: 33.33%;
      }
      .go-icon{
        display: none;
      }
      &:first-child{
        border-bottom: 1px solid #e8e8e8;
      }
      .order-num{
        width: .36rem;
        height: .36rem;
        line-height: .36rem;
        background: #fe5a5a;
        color: #fff;
        font-size: 12px;
        border-radius: 50%;
        position: absolute;
        right: 10px;
        top: 1px;
      }
      .order-item{
        border-bottom: .02rem solid #eeeff1;
        .allOrder-item{
          border-left: .02rem solid #eeeff1;
          color: #ffb64b;
        }
      }
      .order-text{
        height: .6rem;
        line-height: .6rem;
        text-align: center;
        margin-bottom: .2rem;
        font-size: .38rem;
        color: #060f26;
      }
      img{
        height: .6rem;
      }
    }
  }
  .main-c {
    /*padding-top: 1.3rem;*/
    .go-icon {
      width: 0.15rem;
      height: 0.28rem;
      img {
        display: block;
        width: 100%;
      }
    }
    .logo-c {
      background-color: #fff;
      padding: 0 0.3rem;
      .logo-box {
        width: 100%;
        height: 1.68rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ios & {
          height:2rem;
        }
        .logo {
          border-radius: .08rem;
          display: flex;
          align-items: center;
          .logo-img{
            width: 1.2rem;
            height: 1.2rem;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          .name-w{
            /*display: flex;*/
            /*flex-direction: column;*/
            margin-left: .2rem;
            white-space: nowrap;
            .name{
              font-size: .28rem;
              color: #060f26;
              height: .4rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .profession{
              font-size: .24rem;
              color: #666;
            }
          }
        }
        .right {
          display: flex;
          align-items: center;
          position: relative;
          .file-input{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          .exchange {
            font-size: .24rem;
            color: #999;
            margin-right: .2rem;
          }
        }
      }
    }
    .business-box {
      background-color: #fff;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eeeff1;
      border-top: 1px solid #eeeff1;
      padding: 0 .3rem;
      .open-business {
        font-size: .28rem;
        color: #060f26;
        display: flex;
        align-items: center;
        img{
          width: .4rem;
          margin-right: .2rem;
          display: block;
        }
      }
      .close-box {
        width: .6rem;
        height: .32rem;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
</style>
