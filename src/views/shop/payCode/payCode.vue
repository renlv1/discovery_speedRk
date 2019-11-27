<template>
  <div class="c-page">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="main-c gap" ref="sc">
      <div class="tab">
        <div class="item" v-for="(item, index) in $t('code.list2')" :class="{active: activeIndex === index}"
             @click="changeTab(index)" :key="index">
          {{item}}
        </div>
      </div>
      <!-- 未开启收款码 -->
      <div class="close-ER" v-if="!openEr">
        <img src="@/assets/img/payCode/closeEr.png" />
        <p class="tips">
          {{$t('code.text58')}}
        </p>
        <div class="btn" @click="openSetCode">{{$t('code.text59')}}</div>
      </div>

      <!-- 开启二维码 -->
      <div class="open-ER" v-if="openEr">
        <div class="shop">
          <div class="merchant-box">
            <div class="mer-logo">
              <img :src="imgSplit(merchantLogo)">
            </div>
            <span class="merchant-name">{{merchantName}}</span>
          </div>
          <div class="er-box">
            <span class="type-title">{{`${titleNameSetER}码`}}</span>
            <div id="codeBox">
              <div class="v-loading" v-show="loadShow">
                <cube-loading></cube-loading>
              </div>
              <div id="qrDiv" style="display: none;"></div>
              <div id="qrcode"></div>
            </div>
            <div class="qr-tips">{{$t('categories.text26')}}</div>
            <div class="sub-tips">{{$t('categories.text34')}}</div>
          </div>
        </div>
        <div class="er-info">
          <ul>
            <li>
              <span class="info-title">{{$t('categories.text35')}}</span>
              <span class="info-edit" @click="edit">{{$t('categories.text36')}}</span>
            </li>
            <li>
              <span class="info-left">{{$t('categories.text37')}}</span>
              <span class="info-right">{{acceptCurrency}}</span>
            </li>
            <li>
              <span class="info-left">{{$t('categories.text38')}}</span>
              <span class="info-right">{{`${profitRate}%`}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <set-code class="setCode" ref="setCode" :title="titleNameSetER" @hidePage="hidePage" @checkIsOpenER="checkIsOpenER"
              :flag="flag" :currencyType="acceptCurrency"></set-code>
  </div>
</template>

<script>
import $ from 'jquery'
import '../../../assets/js/jquery.qrcode.min'
import mFixedTop from '@/components/mFixedTop'
import setCode from './setCode'

export default {
  name: "payCode",
  components: {mFixedTop, setCode},
  data() {
    return {
      titleName: this.$t('code.text39'),
      titleNameSetER: this.$t('code.text63'),
      flag: '',
      activeIndex: 0,
      amount: '',
      step: 1,
      show: false,
      detail: {},
      firstCreate: true,
      orderId: '',
      openEr: false,
      merchantName: '', // 商户名
      merchantLogo: '', // 商户logo
      merchantId: '', // 商户id用于客户端
      acceptCurrency: '', // 交易币种
      profitRate: 0, // 返回比例
      loadShow: false,
    }
  },
  mounted() {
    this.getOpenErStatus(this.activeIndex + 1)
  },
  methods: {
    vaInput() {
      if (!/^\d+(\.\d{0,2})?$/.test(this.amount)) {
        this.amount = this.amount.substring(0, this.amount.length - 1)
      }
    },
    submit() {
    },
    edit() {
      this.$nextTick(() => {
        this.$refs.setCode.profitRate = this.profitRate
        this.$refs.setCode.acceptCurrency = this.acceptCurrency
        this.$refs.setCode.isSetCode = true
        this.$refs.setCode.getOpenErStatus()
      })
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
    // 开启设置二维码页面
    openSetCode() {
      this.$refs.setCode.isSetCode = true
    },
    // 关闭组件页
    hidePage() {
      // 关闭组件后重置用户填写的数据
      this.$refs.setCode.profitRate = ''
      this.$refs.setCode.currency = 'π'

      this.$refs.setCode.isSetCode = false
    },
    changeTab(index) {
      this.activeIndex = index
      if (this.activeIndex === 0) {
        this.titleNameSetER = this.$t('categories.text39')
      } else {
        this.titleNameSetER = this.$t('categories.text40')
      }
      this.getOpenErStatus(index + 1)

      this.loadShow = true

      // 控制二维码只绘制一次
      $("#qrDiv").html("");
      $("#qrcode").html("");
    },
    // 子组件设置成功后回调获取是否开启单币种或双币种二维码的开启状态
    checkIsOpenER() {
      this.getOpenErStatus(this.activeIndex + 1)
    },

    showQrPopup() {
      this.loadShow = false
      let erContent = this.$utf16to8(`payQRCode:||${this.merchantId}`)
      let qrcode = $('#qrcode')
      $('#qrDiv').qrcode({
        render: 'canvas', //     table方式
        width: 160, //            宽度
        height: 160, //            高度
        text: erContent //      任意内容
      })

      // 将图片长按保存
      let mycanvas1 = document.getElementsByTagName('canvas')[0]
      var img = this.convertCanvasToImage(mycanvas1);
      qrcode.append(img); //imagQrDiv表示你要插入的容器id
    },

    // 从canvas提取images
    convertCanvasToImage(canvas) {
      var image = new Image()
      image.src = canvas.toDataURL("image/png")
      return image
    },

    setErcode(codeType) {
      // 控制二维码只绘制一次
      let acceptCurrency
      this.acceptCurrency === 'π' ? acceptCurrency = 'PAI' : acceptCurrency = this.acceptCurrency
      this.$http.post(`${this.$api}shopMine/modifyPayCode?codeType=${codeType}&acceptCurrency=${acceptCurrency}&profitRate=${this.profitRate}&pvRate=0`).then((res) => {
        this.merchantId = res.data.data.merchantPayCode.id
        this.$nextTick(() => {
          $("#qrDiv").html("");
          $("#qrcode").html("");
          this.showQrPopup()
        })
      })
    },

    // 获取是否开启单币种或双币种二维码的开启状态(1 单币种 2 双币种)
    getOpenErStatus(codeType) {
      this.$http.post(`${this.$api}shopMine/getPayCode?codeType=${codeType}`).then((res) => {
        if (res.data.data.merchantPayCode) {
          // 开启二维码的用户
          this.openEr = true
          this.loadShow = true
          let merchant = res.data.data.merchantPayCode
          this.merchantName = merchant.merchantName
          this.merchantLogo = merchant.merchantLogo
          this.profitRate = merchant.profitRate
          merchant.acceptCurrency === 'PAI' ? this.acceptCurrency = 'π' : this.acceptCurrency = merchant.acceptCurrency

          this.setErcode(codeType)

        } else {
          // 未开启二维码
          this.openEr = false
        }
      })
    }
  }
}
</script>


<style lang="less" rel="stylesheet/less" scoped>
  .c-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: rgb(247, 247, 247);
  }

  .tab {
    margin: .3rem 0 0.5rem;
    line-height: 1rem;
    display: flex;
    background: #fff;
    font-size: 0.3rem;
    text-align: center;
    .item {
      flex: 1;
      color: rgb(255, 182, 75);
      background-color: #fff;
      &.active {
        background: rgb(255, 182, 75);
        color: #fff;
      }
    }
  }

  .t1 {
    .label {
      padding-top: 0.5rem;
      padding-bottom: 0.2rem;
      font-size: 0.28rem;
      color: #aaa;
    }
    .input-wrap {
      border-bottom: 1px solid #e9e9e9;
      position: relative;

      input {
        padding: 5px 0;
        font-size: .45rem;
        line-height: 50px;
      }
      .unit {
        font-size: .45rem;
        position: absolute;
        right: 0;
        top: 0;
        line-height: 60px;
      }
    }
    .btn {
      margin-top: 80px;
    }
  }

  .close-ER {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 1.26rem;
      height: 1.2rem;
      margin: 1.6rem 0 .8rem;
    }
    .tips {
      color: rgb(191, 191, 191);
      font-size: .28rem;
      margin-bottom: 2rem;
    }
    .btn {
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      background: rgb(255, 182, 75);
      font-size: .32rem;
    }
  }

  .open-ER {
    .shop {
      padding: 15px 15px 20px;
      background-color: #fff;
      .merchant-box {
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid rgb(247, 247, 247);
        .mer-logo{
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e5e5e5;
          border-radius: 4px;
          width: 34px;
          height: 34px;
          margin-right: 10px;
          img {
            max-width: 34px;
            max-height: 34px;
          }
        }
        .merchant-name {
          font-size: .32rem;
        }
      }
      .er-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: .32rem;
        .type-title {
          margin: 20px 0 15px;
          color: rgb(255, 182, 75);
        }
        #codeBox {
          position: relative;
          .v-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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
        }
        .sub-tips {
          margin-top: 10px;
          font-size: .28rem;
          color: rgb(153, 153, 153);
        }
      }
    }
    .er-info {
      margin-top: 15px;
      background-color: #fff;
      padding: 0 .3rem;
      ul {
        padding: 20px 0;
        li {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #000;
          font-size: .28rem;
          .info-edit {
            color: rgb(255, 182, 75);
          }
          .info-left {
            color: rgb(153, 153, 153);
          }
          &:nth-child(2) {
            margin: 15px 0;
          }
        }
      }
    }
  }

  .show-code {
    box-shadow: 0 0 6px rgba(0, 0, 0, .15);
    padding: .4rem;
    padding-bottom: 0.8rem;
    text-align: center;
    .tips {
      color: #aaa;
      padding-top: 15px;
    }
    .amount {
      font-size: 0.35rem;
      padding-top: 20px;
      span {
        color: #3595f2;
        font-size: 0.45rem;
      }
    }
    .shop-name {
      display: flex;
      align-items: center;
      font-size: 0.3rem;
      color: #3d3d3d;
      .img {
        border-radius: 2px;
        background: #ccc;
        overflow: hidden;
        margin-right: 10px;
        width: 0.88rem;
        height: 0.88rem;
        img {
          width: 100%;
          height: 100%;
        }

      }
    }
    .qrcode {
      margin-top: 25px;
      height: 200px;
      overflow: hidden;
      /deep/ img {
        display: inline-block !important;
        width: 200px;
      }
    }
  }

  .edit-btn {
    display: flex;
    padding-top: 25px;
    color: #3595f2;
    font-size: 0.28rem;
    text-align: center;
    justify-content: center;
    padding-bottom: 0.3rem;
    span {
      flex: 1;
    }
  }
</style>
