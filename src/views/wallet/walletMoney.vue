<template>
  <div class="v-page wallet-money-w">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="v-content" v-show="!loadingShow">
      <div class="label">{{$t('wallet.text6')}}</div>
      <div class="money-t">
        <span class="num">{{money | fourNumber}}</span>
        <div class="currency" v-if="$route.query.target !== 'a' || !$route.query.target">{{showCurrency()}}</div>
      </div>
      <p class="tips" v-if="currency === 'ETH' || currency === 'SIE' || currency === 'TIP'">{{$t('wallet.text7')}} <span class="bord"> {{minMoney}} {{currency}}</span>，{{$t('wallet.text8')}}</p>
      <!--      PAI USD 货币-->
      <div v-if="currency === 'PAI' || currency === 'USD' || currency === 'л'">
        <div class="trading-address-w">
          <div class="left-a">
            <p class="l-t">{{$t('wallet.text9')}}</p>
            <p class="string" v-if="currency === 'PAI' || currency === 'USD' || currency === 'л'" id="copyAddress_input1">{{userData.address}}</p>
          </div>
          <div class="copy" id="copy1" ref="addressCopy1" data-clipboard-action="copy" data-clipboard-target="#copyAddress_input1" @click="copy(1)" :data-clipboard-text="userData.address">{{$t('wallet.text11')}}</div>
        </div>
<!--        <div class="qrcode" id="qrcode1"></div>-->
<!--        <p class="qrcode-t">扫描二维码获取交易地址</p>-->
      </div>
      <!--      数字币 ETH SIE -->
      <div v-else-if="currency === 'SIE' || currency === 'ETH' || currency === 'TIP'">
        <div class="trading-address-w">
          <div class="left-a">
            <p class="l-t">{{$t('wallet.text10')}}</p>
            <p class="string" id="copyAddress_input2">{{addressM}}</p>
          </div>
          <div class="copy" id="copy2" ref="addressCopy2" data-clipboard-action="copy" data-clipboard-target="#copyAddress_input2" @click="copy(2)" :data-clipboard-text="addressM">{{$t('wallet.text11')}}</div>
        </div>
        <div class="qrcode" id="qrcode2"></div>
        <p class="qrcode-t">{{$t('wallet.text12')}}</p>
      </div>
    </div>
    <div v-show="loadingShow">
      <v-loading></v-loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import QRCode from 'qrcodejs2'
  import Clipboard from 'clipboard'

  export default {
    data() {
      return {
        loadingShow: false,
        copyBtn: null,
        currency: this.$route.query.currency,
        money: this.$route.query.money,
        addressM: '',
        minMoney: 0
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ]),
      titleName () {
        if (this.$route.query.currency === 'PAI') {
          return 'π ' + this.$t('wallet.text13')
        } else {
          return `${this.$route.query.currency} ${this.$t('wallet.text13')}`
        }
      }
    },
    mounted () {
      // this.getQrcode() // USD PAI 的二维码
      // if (this.currency === 'PAI' || this.currency === 'USD') {
      //   this.copyBtn = new Clipboard(this.$refs.addressCopy1)
      // } else
      if (this.currency === 'ETH' || this.currency === 'SIE') {
        this.loadingShow = true
        this.copyBtn = new Clipboard(this.$refs.addressCopy2)
      }
      this.createTokenAddress()
    },
    methods: {
      // 币种显示
      showCurrency () {
        let target = this.$route.query.target
        if (this.currency === 'PAI') return 'π'
        if (target && target === 'a') return ''
        if (target && target === 'π') return 'π'
        if (target && target === this.$t('wallet.text2')) return this.$t('wallet.text2')
        return this.currency
      },
      // SIE ETH 交易地址
      createTokenAddress () {
        if (this.currency === 'SIE' || this.currency === 'ETH' || this.currency === 'TIP') {
          this.$fetch.post(`${this.$api}tokencoindeposit/createTokenAddress`, {
            currency: this.currency
          }).then(res => {
            if (res.status === 'success') {
              this.minMoney = res.data.minDepositAmount
              this.loadingShow = false
              this.addressM = res.data.coinAddress
              this.getQrcode2()
            }
          })
        }
      },
      // SIE ETH 二维码
      getQrcode2() {
        let qrcode2 = new QRCode('qrcode2', {
          width: 187,
          height: 187,
          text: this.addressM, // 二维码地址
          colorDark : "#000",
          colorLight : "#fff",
        })
      },
      // PAI USD 二维码
      getQrcode() {
        if (this.currency === 'PAI' || this.currency === 'USD') {
          let qrcode = new QRCode('qrcode1', {
            width: 187,
            height: 187,
            text: this.userData.address, // 二维码地址
            colorDark : "#000",
            colorLight : "#fff",
          })
        }
      },
      // toast弹窗
      creatToast (msg) {
        let toast1 = this.$createToast({
          txt: msg,
          time: 1500,
          type: 'txt'
        })
        toast1.show()
      },
      // 复制按钮
      copy (index) {
        var clipboard1
        if (index === 1) {
          clipboard1 = new Clipboard('#copy1');
        } else if (index === 2) {
          clipboard1 = new Clipboard('#copy2');
        }
        clipboard1.on('success', (e) => {
          this.creatToast(this.$t('safe.text8'))
          e.clearSelection();
        })
        clipboard1.on('error', function(e) {
          this.creatToast(this.$t('safe.text9'))
        })
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      vLoading: () => import('@/components/loading.vue')
    }
  }
</script>

<style scoped lang="stylus">
  .wallet-money-w
    color #000
    .label
      font-size: .24rem
      margin-bottom: .2rem
    .money-t
      display: flex
      align-items center
      font-size: .34rem
      color #000
      margin-bottom: .2rem
      .num
        font-weight: bold
      .currency
        padding: 0 .1rem
        height: .4rem
        line-height: .4rem
        background-color: #e9c47f
        border-radius .2rem
        font-size: .2rem
        font-weight: normal
        margin-left: .2rem
    .tips
      font-size: .24rem
      line-height: 1.5
      .bord
        color #b79961
        font-weight: bold
    .trading-address-w
      width: 100%
      height: 1.2rem
      background-color: #fbf2df
      border-radius 4px
      display: flex
      align-items center
      margin-top: .6rem
      .left-a
        flex 1
        color #000
        padding-left: .3rem
        .l-t
          font-size: .28rem
          margin-bottom: .14rem
        .string
          font-size: .24rem
          word-break break-all
      .copy
        width: 1rem
        min-width 1rem
        height: 1.2rem
        background-color: #efe2c5
        display: flex
        align-items center
        justify-content center
        font-size: .24rem
    .qrcode
      margin: 1.2rem auto .4rem
      >>> img
        margin: 0 auto
    .qrcode-t
      font-size: .24rem
      text-align: center
</style>
