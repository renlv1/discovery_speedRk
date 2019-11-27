<template>
  <div class="v-page wallet-w">
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <ul class="v-content">
      <!--   π富基金      -->
      <li class="list" @click="gotoDetail($t('wallet.text1'), fundBalance, $t('wallet.text2'), 1)">
        <div class="top">
          <div class="left-t">
            <div class="icon">
              <img src="../../assets/img/currency/logo.svg" alt="">
            </div>
            <span>{{$t('wallet.text1')}}</span>
          </div>
          <div class="right">
            <img src="../../assets/img/common/arrows.svg" alt="">
          </div>
        </div>
        <p class="money">{{fundBalance | fourNumber}} {{$t('wallet.text2')}}</p>
      </li>
      <!--    π付钱包    -->
      <li class="list" @click="gotoDetail($t('wallet.text3'), userData.paiPurseBalance, 'π')">
        <div class="top">
          <div class="left-t">
            <div class="icon">
              <img src="../../assets/img/currency/logo.svg" alt="">
            </div>
            <span>{{$t('wallet.text3')}}</span>
          </div>
          <div class="right">
            <img src="../../assets/img/common/arrows.svg" alt="">
          </div>
        </div>
        <p class="money">{{userData.paiPurseBalance | fourNumber}} π</p>
      </li>
      <!--      自助餐券  -->
      <li class="list" @click="gotoDetail($t('wallet.text4'), voucherBalance, 'a', 2)">
        <div class="top">
          <div class="left-t">
            <div class="icon">
              <img src="../../assets/img/currency/logo.svg" alt="">
            </div>
            <span>{{$t('wallet.text4')}}</span>
          </div>
          <div class="right">
            <img src="../../assets/img/common/arrows.svg" alt="">
          </div>
        </div>
        <p class="money">{{voucherBalance | fourNumber}}</p>
      </li>
      <!--      资产列表-->
      <li class="list" @click="gotoDetail(item.currency, item.balance)" v-for="(item, index) in allBalance" :key="index">
        <div class="top">
          <div class="left-t">
            <div class="icon">
              <img :src="isIcon(item.currency)" alt="">
            </div>
            <span>{{item.currency}}</span>
          </div>
          <div class="right">
            <img src="../../assets/img/common/arrows.svg" alt="">
          </div>
        </div>
        <p class="money">{{item.balance | fourNumber}} {{item.currency}}</p>
      </li>
      <!--      USD 余额-->
      <li class="list" @click="gotoDetail('USD', usdBalance)">
        <div class="top">
          <div class="left-t">
            <div class="icon">
              <img :src="imgUrl + newData[0].coinImg" alt="">
            </div>
            <span>USD</span>
          </div>
          <div class="right">
            <img src="../../assets/img/common/arrows.svg" alt="">
          </div>
        </div>
        <p class="money">{{usdBalance | fourNumber}} USD</p>
      </li>
      <!--&lt;!&ndash;      SIE 余额&ndash;&gt;-->
      <!--<li class="list" @click="gotoDetail('SIE', sieBalance)" v-show="sieFlag">-->
        <!--<div class="top">-->
          <!--<div class="left-t">-->
            <!--<div class="icon">-->
              <!--<img :src="imgUrl + 'ethcoin.png'" alt="">-->
            <!--</div>-->
            <!--<span>SIE</span>-->
          <!--</div>-->
          <!--<div class="right">-->
            <!--<img src="../../assets/img/common/arrows.svg" alt="">-->
          <!--</div>-->
        <!--</div>-->
        <!--<p class="money">{{sieBalance | fourNumber}} SIE</p>-->
      <!--</li>-->
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
	export default {
		data() {
			return {
        isGoBack: true,
        sieFlag: false,
        balanceArr: [],
        currencyArr: [],
        allBalance: [],
        sieBalance: 0,
        titleName: this.$t('wallet.text5'),
        imgUrl: 'http://ofjn5cjui.bkt.clouddn.com/',
        newData: [
          {currency: 'USD', coinImg: 'unitedstatescoin.png'},
          {currency: 'ETH', coinImg: 'ethcoin.png'},
          {currency: 'SIE', coinImg: 'siecoin.png'},
          {currency: 'BTC', coinImg: 'btccoin.png'},
          {currency: 'LTC', coinImg: 'ltccoin.png'},
          {currency: 'XRP', coinImg: 'xrpcoin.png'},
          {currency: 'BCH', coinImg: 'bthcoin.png'},
          {currency: 'KLB', coinImg: 'bthcoin.png'}
        ]
      }
		},
    created () {
		  this.getBalance()
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
      gotoDetail (currency, money, target, type) {
        if (type === 1) {
          this.$router.push({
            path: '/fundDetail',
            query: {currency, money, target}
          })
        } else if (type === 2) {
          this.$router.push({
            path: '/coupon',
            query: {currency, money, target}
          })
        } else {
          this.$router.push({
            path: '/walletMoney',
            query: {currency, money, target}
          })
        }
      },
      isIcon (currency) {
        if (currency === 'BTC') return this.imgUrl + 'btccoin.png'
        if (currency === 'USD') return this.imgUrl + 'unitedstatescoin.png'
        if (currency === 'SIE') return this.imgUrl + 'siecoin.png'
        if (currency === 'LTC') return this.imgUrl + 'ltccoin.png'
        if (currency === 'XRP') return this.imgUrl + 'xrpcoin.png'
        if (currency === 'BCH') return this.imgUrl + 'bthcoin.png'
        if (currency === 'KLB') return this.imgUrl + 'bthcoin.png'
        if (currency === 'ETH') return this.imgUrl + 'ethcoin.png'
        if (currency === 'TIP') return require('../../assets/img/currency/TIP.png')
        if (currency === 'л') return require('../../assets/img/currency/logo.svg')
        return this.imgUrl + 'bthcoin.png'
      },
      getBalance () {
        this.$fetch.post('/coinaccount/queryCoinUserAccount').then(res => {
          if (res.success) {
            this.allBalance = res.data
            let arr = res.data
            if (arr.length > 0) {
              let balanceArr = []
              let currencyArr = []
              arr.forEach((item) => {
                balanceArr.push(item.balance)
                currencyArr.push(item.currency)
                if (item.currency === 'SIE') {
                  this.sieBalance = item.balance
                  this.sieFlag = true
                }
              })
              this.balanceArr = balanceArr
              this.currencyArr = currencyArr
            }
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'userData',
        'account',
        'usdBalance',
        'fundBalance',
        'voucherBalance'
      ])
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    }
	}
</script>

<style scoped lang="stylus">
.wallet-w
  .list
    width: 100%
    height: 2rem
    background-color: #fafafa
    padding: .3rem .4rem
    color #000
    font-size: .34rem
    margin-bottom: .3rem
    .top
      display: flex
      align-items center
      justify-content space-between
      .left-t
        display: flex
        align-items center
        .icon
          width: .64rem
          height: .64rem
          border-radius 50%
          margin-right: .2rem
          img
            width: .64rem
            height: .64rem
            border-radius 50%
      .right
        img
          width: .3rem
          height: .3rem
          display: block
    .money
      margin-top: .3rem
</style>
