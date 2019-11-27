<template>
  <div class="account">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="main-c">
      <div class="pai-box">
        <div class="box-title-wrapper">
          <div class="line"></div>
          <div class="box-title">{{$t('payReturn.text1')}}</div>
        </div>
        <div class="bill-box">
          <router-link tag="div" :to="{path:'/myPiOrder',query:{activeIndex: 1}}" class="child">
            <img src="./img/unpaid.png" alt="">
            <p>{{$t('my.text2')}}</p>
            <div class="order-num" v-show="payNum > 0">{{payNum}}</div>
          </router-link>
          <router-link tag="div" :to="{path:'/myPiOrder',query:{activeIndex: 2}}" class="child">
            <img src="./img/waiting-list.png" alt="">
            <p>{{$t('my.text3')}}</p>
          </router-link>
          <router-link tag="div" :to="{path:'/myPiOrder',query:{activeIndex: 3}}" class="child">
            <img src="./img/drop-shipping.png" alt="">
            <p>{{$t('my.text4')}}</p>
          </router-link>
          <router-link tag="div" :to="{path:'/myPiOrder',query:{activeIndex: 4}}" class="child">
            <img src="./img/wait-for-receiving.png" alt="">
            <p>{{$t('my.text5')}}</p>
            <div class="order-num" v-show="receiveNum > 0">{{receiveNum}}</div>
          </router-link>
          <router-link tag="div" :to="{path:'/myPiOrder',query:{activeIndex: 5}}" class="child">
            <img src="./img/completed.png" alt="">
            <p>{{$t('my.text6')}}</p>
          </router-link>
        </div>
        <div class="line-two"></div>
      </div>
      <div class="box-title-wrapper">
        <div class="line"></div>
        <div class="box-title">{{$t('payReturn.text2')}}</div>
      </div>
      <div class="web-grid">
        <router-link tag="div" to="/offlineOrder" class="item">
          <img src="./img/bill.png" alt="">
          <p>{{$t('payReturn.text3')}}</p>
        </router-link>
        <router-link tag="div" to="/payReturn" class="item">
          <img src="./img/Wing-performance.png" alt="">
          <p>{{$t('payReturn.text4')}}</p>
        </router-link>
        <router-link tag="div" to="/shippingAddress" class="item" @click.native="resetValue">
          <img src="./img/shipping-address.png" alt="">
          <p>{{$t('my.text9')}}</p>
        </router-link>
      </div>
    </div>
    <VFooter />
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import VFooter from '@/components/footer'

export default {
  name: "account",
  components: {mFixedTop, VFooter},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('payReturn.text5'),
      userInfo: {},
      payNum: 0, // 待支付
      receiveNum: 0,// 待收货
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  methods: {
    resetValue() {
      this.$store.commit('SET_ENTER_FLAG', 2)
    },
    goPath() { // 返回到我的
      this.$router.push('/menu')
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .box-title-wrapper {
    padding-top: 20px;
    padding-left: .3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    .line {
      width: 4px;
      height: 16px;
      background-color: rgb(255, 182, 75);
      border-radius: 5px;
      margin-right: 10px;
    }
    .box-title {
      font-size: 14px;
      color: #000;
    }
  }

  .account {
    width: 100vw;
    font-size: 14px;
    height: 100vh;
  }
  .iosx .account {
    height: calc(100vh - 90px);
    overflow: hidden;
  }

  .c-page {
    /deep/ .app-header {
      color: #fff;
      background: none;
      border: none;
    }
  }

  .head-bg {
    height: 3rem;
    margin-top: -44px - 50px;
    background-color: #ffb64b;
    .ios & {
      margin-top: -24px - 50px;
    }
    .iosx & {
      margin-top: -44px - 50px;
    }
    text-align: center;
    .user-img {
      background: #fff;
      margin-top: -3.5rem;
      img {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
      }
      p {
        color: #fff;
        font-size: 0.34rem;
        padding: 0.32rem 0 0;
        font-weight: bold;
      }
    }
  }

  .pai-box {
    /*background: #fff;*/
    position: relative;
    background-color: #fff;
    width: 100%;
    .pai-top {
      padding: .44rem .3rem 0;
      .top-title {
        display: flex;
        margin-bottom: .4rem;
      }
      .pai-pay {
        margin-left: .2rem;
        font-size: .28rem;
        color: #060f26;
      }
      .line {
        width: 100%;
        height: 1px;
        background-color: #eeeff1;
      }
    }
    .bill-box {
      display: flex;
      text-align: center;
      flex-wrap: wrap;
      .child {
        position: relative;
        padding: .3rem 0;
        width: 33%;
        img {
          width: 30px;
          height: 30px;
          margin-bottom: .2rem;
        }
        p {
          font-size: .24rem;
          color: #060f26;
        }
        .order-num {
          width: 24px;
          line-height: 24px;
          background: #fe5a5a;
          color: #fff;
          font-size: 12px;
          border-radius: 50%;
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
    }
  }

  .line-box {
    padding: .3rem;
  }

  .line-two {
    width: 100%;
    height: .1rem;
    background-color: #eeeff1;
  }

  .web-grid {
    background-color: #fff;
    padding: .2rem 0 .4rem; // 9/10 修改的
    .item {
      width: 33%;
      img {
        width: 30px;
        height: 30px;
      }
      p {
        font-size: 0.24rem;
      }
    }
  }

  .copy {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    margin: 0 .3rem;
    color: #fff;
    padding: .3rem;
    padding-bottom: 0.5rem;
    font-size: 0.24rem;
    .add {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    img {
      margin-left: 20px;
      width: 0.3rem;

    }
  }

  .break {
    word-break: break-all;
    max-width: 50%;
    padding-left: 10px;
    font-size: 12px;
  }

  .c-page {
    padding-bottom: 1.6rem;
  }
</style>
