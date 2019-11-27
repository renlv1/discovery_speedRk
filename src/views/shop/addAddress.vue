<template>
  <div class="addAddress">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <ul class="parent" v-show="!isShowSelectArea">
      <li class="common-li">
        <div class="title">{{$t('shippingAddress.text1')}}</div>
        <div class="input-box">
          <input type="text" v-model="legalName" :placeholder="$t('shippingAddress.text2')" class="phone">
        </div>
      </li>
      <li class="common-li">
        <div class="title">{{$t('addAddress.text1')}}</div>
        <div class="input-box" @click="selectArea">
          {{areaCode}}
          <div class="right"><img src="./img/right-grey.png"></div>
        </div>
      </li>
      <li class="common-li">
        <div class="title">{{$t('shippingAddress.text3')}}</div>
        <div class="input-box">
          <!--                    <div class="area-code" @click="switchCode">+{{mobile[0]}}</div>-->
          <!--                    <input class="phone" type="text"  v-model="mobile[1]" placeholder="请输入联系方式">-->
          <input class="phone" type="text" v-model="mobile" :placeholder="$t('shippingAddress.text4')" maxlength="11">
        </div>
      </li>
      <li class="common-li">
        <div class="title">{{$t('addAddress.text2')}}</div>
        <div class="input-box">
          <input class="phone" type="text" v-model="postCode" :placeholder="$t('addAddress.text3')" maxlength="11">
        </div>
      </li>
      <li class="common-li" @click="chooseArea()">
        <div class="title">{{$t('shippingAddress.text5')}}</div>
        <div class="input-box">
          <div class="company">{{region}}</div>
          <div class="right"><img src="./img/right-grey.png"></div>
        </div>
      </li>
      <li class="textarea-box">
        <div class="address">{{$t('shippingAddress.text6')}}</div>
        <div class="textarea-input">
          <textarea class="textarea" :placeholder="$t('shippingAddress.text7')" v-model="realAddress"
                    @input="textareaVal"></textarea>
          <p class="number">{{addNum}}/100</p>
        </div>
      </li>
      <div class="line"></div>
      <!--      <li class="common-li" v-show="operateType === 2 && !isShowSelectArea">-->
      <!--        <div class="title">{{$t('shippingAddress.text8')}}</div>-->
      <!--        <div class="close-box" @click="defaultFn(1)" v-show="defaultShow === 1"><img src="./img/1close.png"></div>-->
      <!--        <div class="close-box" @click="defaultFn(2)" v-show="defaultShow === 2"><img src="./img/open.png"></div>-->
      <!--      </li>-->
    </ul>
    <div class="btn-add common-btn" @click="btnSave()" v-if="operateType === 1 && !isShowSelectArea">
      {{$t('shippingAddress.text9')}}
    </div>
    <div class="btn-box common-btn" v-if="operateType === 2 && !isShowSelectArea">
      <div class="btn-save common-btn" @click="btnSave()">{{$t('shippingAddress.text9')}}</div>
      <div class="btn-del common-btn" @click="btnDel()">{{$t('shippingAddress.text10')}}</div>
    </div>

    <select-area v-if="isShowSelectArea" @chooseItem="chooseItem"></select-area>

    <area-address
      :areaAddressShow="areaAddressShow"
      @selectOne="selectOne"
      @switchFour="switchFour"
      @hideDialog="hideDialog">
      >
    </area-address>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import areaAddress from './areaAddress'
import selectArea from '@/components/selectArea2'
import Dialog from '@/components/dialog/index'

export default {
  components: {mFixedTop, areaAddress, selectArea},
  name: "addAddress",
  data() {
    return {
      addNum: 0,
      isGoBack: true,
      isShowSelectArea: false,
      operateType: Number(this.$route.query.flag),
      address: '',
      titleName: '',
      legalName: '', // 收货人
      mobile: '',
      realAddress: '', // 详细地址
      defaultShow: 1,
      region: this.$t('shippingAddress.text12'),
      areaCodeShow: false,
      areaAddressShow: false,
      careList: [],
      areaCode: '+86',
      postCode: ''
    }
  },
  mounted() {
    this.getReceipt()
    this.$nextTick(() => {
      if (Number(this.$route.query.flag) === 1) {
        this.titleName = this.$t('shippingAddress.text11')
      } else {
        this.titleName = this.$t('addAddress.text4')
      }
    })
  },
  methods: {
    // 验证
    verify() {
      if (this.legalName === '') {
        this.toastD(this.$t('shippingAddress.text14'))
        return false
      }
      if (this.mobile === '') {
        this.toastD(this.$t('shippingAddress.text15'))
        return false
      }
      if (this.realAddress === '') {
        this.toastD(this.$t('shippingAddress.text16'))
        return false
      }
      return true
    },
    chooseArea() {
      this.areaAddressShow = true
    },
    selectArea() {
      this.isShowSelectArea = true
    },
    chooseItem(item) {
      this.areaCode = item.code
      this.isShowSelectArea = false
    },
    goPath() { // 返回到我的
      if (this.$route.query.merchant) {
        this.$router.push({
          path: '/shippingAddress',
          query: {
            merchant: this.$route.query.merchant,
          }
        })
      } else if (this.$route.query.productId) {
        this.$router.push({
          path: '/shippingAddress',
          query: {
            productId: this.$route.query.productId,
          }
        })
      } else {
        this.$router.push({
          path: '/shippingAddress',
        })
      }
    },
    //删除
    btnDel() {
      Dialog({
        content: this.$t('shippingAddress.text18'),
        type: 'confirm',
        okFn: () => {
          this.$http.post(`${this.$api}shopMine/deleteOrderReceipt?receiptId=${this.address.id}`).then(res => {
            if (res.data.status === 'success') {
              this.toastD(this.$t('shippingAddress.text19'))
              setTimeout(() => {
                if (this.$route.query.merchant) {
                  this.$router.push({
                    path: '/shippingAddress',
                    query: {
                      merchant: this.$route.query.merchant,
                    }
                  })
                } else if (this.$route.query.productId) {
                  this.$router.push({
                    path: '/shippingAddress',
                    query: {
                      productId: this.$route.query.productId,
                    }
                  })
                } else {
                  this.$router.push({
                    path: '/shippingAddress',
                  })
                }
              }, 500)
            } else {
              this.toastD(res.data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    hideDialog() {
      this.areaAddressShow = false
    },
    switchFour() {
      this.region = this.$t('shippingAddress.text13')
      this.areaAddressShow = false
    },
    defaultFn(index) {
      if (index === 2) this.defaultShow = 1
      if (index === 1) this.defaultShow = 2
      if (this.defaultShow = 2) {
        // 设置默认收货地址
        this.setDefaultAddress()
      }
    },
    setDefaultAddress() {
      this.$http.post(`${this.$api}shopMine/setOrderReceiptOfDefault?receiptId=${this.$route.query.id}`).then(res => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('addAddress.text5'))
        }
      })
    },
    selectOne(province, city, area) {
      this.region = province + city + area
      this.areaAddressShow = false
    },
    btnSave() {
      if (this.verify()) {
        let receiptId
        let country = this.areaCode === '+86' ? this.$t('addAddress.text6') : this.$t('addAddress.text7')
        if (this.address.id) {
          receiptId = Number(this.address.id)
        } else {
          receiptId = ''
        }
        this.$fetch.post(`${this.$api}shopMine/saveOrderReceipt`, {
          realName: this.legalName,
          phone: this.mobile,
          phoneCode: this.areaCode,
          postCode: this.postCode,
          country: country,
          district: this.region,
          realAddress: this.realAddress,
          operateType: this.operateType,
          receiptId: receiptId,
          type: 1
        }).then(res => {
          if (res.status === 'success') {
            this.toastD(this.$t('shippingAddress.text17'))
            setTimeout(() => {
              if (this.$route.query.merchant) {
                this.$router.push({
                  path: '/shippingAddress',
                  query: {
                    merchant: this.$route.query.merchant,
                  }
                })
              } else if (this.$route.query.productId) {
                this.$router.push({
                  path: '/shippingAddress',
                  query: {
                    productId: this.$route.query.productId,
                  }
                })
              } else {
                this.$router.push({
                  path: '/shippingAddress',
                })
              }
            }, 1000)
          } else {
            this.toastD(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })

      }
    },
    // 输入文字控制
    textareaVal() {
      if (this.realAddress.length) {
        this.addNum = this.realAddress.length
        if (this.realAddress.length > 100) {
          this.addNum = 100
          this.realAddress = this.realAddress.substring(0, 100)
        }
      }
    },
    getReceipt() {
      this.$http.post(`${this.$api}shopMine/orderReceiptView?receiptId=${this.$route.query.id}`).then(res => {
        if (res.data.status === 'success') {
          this.address = res.data.data
          this.legalName = this.address.realName
          this.mobile = this.address.phone
          this.region = this.address.district
          this.realAddress = this.address.realAddress
          this.addNum = this.address.realAddress.length
          this.defaultShow = this.address.defaultFlag
          this.postCode = this.address.postCode
          this.areaCode = this.address.phoneCode ? `${this.address.phoneCode}` : '+86'
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .addAddress
      padding-top: 65px

  .iosx
    .addAddress
      padding-top: 90px

  .addAddress {
    position relative
    background-color #fff
  }

  .parent {
    .common-li {
      height: 1rem;
      padding .3rem
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #eeeff1
      .input-box {
        display: flex;
        font-size: .28rem;
        color: #ffb64b;
        .area-code {
          text-align: right;
          font-size: .28rem;
          color: #ffb64b;
          flex: 1;
          margin-right: .2rem;
        }
        .phone {
          color #060f26
          font-size .28rem
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
        .phone {
          text-align right
        }
        .company {
          font-size .28rem
          color: #b2b2b2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width 2.5rem
        }
        .right {
          height .25rem
          margin-left .2rem
          width .14rem
          display flex
          justify-content center
          img {
            height 100%
            width 100%
          }
        }
      }
      .title {
        font-size .28rem
        color #060f26
      }
      .close-box {
        width .62rem
        img {
          width .62rem
        }
      }
    }
    .textarea-box {
      padding 0 .3rem
      .address {
        font-size .28rem
        color #060f26
        margin .36rem 0
      }
      .textarea-input {
        position relative
        width 100%
        height 2rem
        .textarea {
          width 100%
          height 1.6rem
        }
        .number {
          font-size 14px
          position: absolute
          text-align: right
          width: 100%
          z-index: 10
          right: 0
          bottom: 0
        }
      }
    }
    .line {
      width 100%
      height .2rem
      background-color #f5f5f7
    }
  }

  .blacks {
    position: fixed;
    width: 100%;
    height: 50%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.45);
  }

  /*省市区三级联动*/
  .divwrap {
    height: 50%;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 99;
  }

  /*外部*/
  .divwrap > .distpicker-address-wrapper {
    color: #0d0d0d;
    height: 100%;
  }

  /*头部*/
  .divwrap >>> .address-header {
    background: #000;
    color: #fff;
    width: 100%;
    position: fixed;
    bottom: 50%;
    height: 0.5rem;
    font-size: 0.2rem;
  }

  /*头部内容*/
  .divwrap >>> .address-header ul li {
    flex: 1;
    text-align: center;
  }

  /*选择过省市区的头部*/
  .divwrap >>> .address-header .active {
    color: #fff;
    border-bottom: 0.05rem solid #666;
  }

  /*内容部分*/
  .divwrap >>> .address-container {
    overflow: scroll;
    height: 100%;
  }

  /*点过的地区内容*/
  .divwrap >>> .address-container .active {
    color: red;
  }

  .btn-add {
    position: fixed;
    bottom: 0;
    width: 100%;
    color #fff
    text-align center
    line-height 1rem
    background-color #ffb64b
    cursor: pointer;
    user-select: none;
    height: 1rem;
    font-size: .32rem;
  }

  .btn-box {
    background-color #fff
    border-top 1px solid #dcdde1
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    cursor: pointer;
    user-select: none;
    height: 1rem;
    font-size: .32rem;
    align-items center
    .btn-save {
      color #fff
      flex 1
      text-align center
      border-right 2px solid #eeeff1
      background-color #ffb64b
    }
    .btn-del {
      color #f14f34
      flex 1
      text-align center
      line-height 1rem
    }
  }
</style>
