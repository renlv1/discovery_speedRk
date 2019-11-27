<template>
  <div class="exchange">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="content">
      <div class="v-title">{{secondCurrency}} / {{firstCurrency}}</div>
      <div class="main-box">
        <div class="div-box">
          <span style="font-size: .32rem;">$ {{f4(exchangeData.closePrice)}}</span>
          <span class="red">H:{{f4(exchangeData.highPrice)}}</span>
        </div>
        <div class="div-box">
          <span :class="{'green': exchangeData.riseRate >= 0, 'red': exchangeData.riseRate < 0}">{{exchangeData.riseRate}}%</span>
          <span>L:{{f4(exchangeData.lowPrice)}}</span>
        </div>
      </div>
      <div class="charts-w">
        <ul class="time-uls">
          <li class="time-list" v-for="(item, index) in timeArr" :key="index"
              :class="{'active-list': currentIndex === index}" @click="changeOne(index)">{{item.list}}
          </li>
        </ul>
        <div class="charts">
          <div class="chart-cont" id="myChart" ref="myChart" style="width: 100%; height: 3.6rem;"></div>
        </div>
      </div>
      <div class="v-title">{{$t('market.text5')}}</div>
      <div class="order-w">
        <div class="order-top">
          <span>{{$t('market.text6')}}</span>
          <span>{{$t('market.text7')}}</span>
          <span>{{$t('market.text8')}}</span>
        </div>
        <div class="order-content">
          <!--          买单价格-->
          <div class="order-flex">
            <div class="order-item left-item" v-for="(item, index) in buyData" :key="index" @click="buyPic(item.price)">
              <span>{{f4(item.amount)}}</span>
              <span class="green">$ {{f4(item.price)}}</span>
            </div>
          </div>
          <!--          卖单价格-->
          <div class="order-flex">
            <div class="order-item right-item" v-for="(item, index) in sellData" :key="index"
                 @click="sellPic(item.price)">
              <span class="red">$ {{f4(item.price)}}</span>
              <span>{{f4(item.amount)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="order" @click="$router.push('/tradeOrder')">
          <img src="../assets/img/order/order.svg" alt="">
          <div>{{$t('market.text9')}}</div>
        </div>
        <div class="btn buy-in" @click="buyIn">{{$t('market.text10')}}</div>
        <div class="btn buy-out" @click="buyOut">{{$t('market.text11')}}</div>
      </div>
    </div>
    <!--   买入弹窗 -->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="buyVisible" @click="closeDialog">
        <div class="dialog-m" @click.stop>
          <div class="dialog-safe">
            <div class="dialog-top">
              <div class="method-item" v-for="(item, index) in buyMethod" :key="index"
                   :class="{'active-item': buyOutIndex === index}" @click="methodOne(index)">{{item}}
              </div>
              <div class="close" @click="closeDialog">
                <div class="close-icon"></div>
              </div>
            </div>
            <div class="input-item">
              <input type="text" :placeholder="$t('market.text12')" class="input" v-model="buyInPrice"
                     :disabled="isDisable" @input="changeBuyNum('buyInPrice')">
              <span>USD</span>
            </div>
            <div class="input-item">
              <input type="text" :placeholder="$t('market.text13')" class="input" v-model="buyInNum"
                     @input="changeBuyNum('buyInNum')">
              <span>{{secondCurrency}}</span>
            </div>
            <div class="order-total-w">
              <div class="flex-w">
                <span>{{$t('market.text14')}}</span>
                <span class="total">{{buyTotalMoney}} USD</span>
              </div>
              <!--              买入为 USD余额-->
              <p class="my-money">USD {{$t('market.text15')}}：{{account.usdBalance | fourNumber}} USD</p>
            </div>
            <div class="comfirm" @click="okCallbackBuy">{{$t('market.text10')}}</div>
          </div>
        </div>
      </div>
    </transition>
    <!--  卖出弹窗  -->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="sellVisible" @click="closeDialogSell">
        <div class="dialog-m" @click.stop>
          <div class="dialog-safe">
            <div class="dialog-top">
              <div class="method-item" v-for="(item, index) in buyMethod" :key="index"
                   :class="{'active-item': buyOutIndex === index}" @click="methodOne(index)">{{item}}
              </div>
              <div class="close" @click="closeDialogSell">
                <div class="close-icon"></div>
              </div>
            </div>
            <div class="input-item">
              <input type="text" :placeholder="$t('market.text16')" class="input" v-model="sellInPrice"
                     :disabled="isDisable" @input="changeBuyNum('sellInPrice')">
              <span>USD</span>
            </div>
            <div class="input-item">
              <input type="text" :placeholder="$t('market.text17')" class="input" v-model="sellInNum"
                     @input="changeBuyNum('sellInNum')">
              <span>{{secondCurrency}}</span>
            </div>
            <!--              卖出为 当前币种余额-->
            <p class="my-money" style="color: #999; margin: -.2rem 0;">
              {{secondBalance.currency}}{{$t('market.text15')}}：{{secondBalance.balance | fourNumber}}
              {{secondBalance.currency}}</p>
            <div class="order-total-w" style="height: .8rem;">
              <div class="flex-w">
                <span>{{$t('market.text18')}}</span>
                <span class="total">{{sellTotalMoney}} USD</span>
              </div>
            </div>
            <div class="comfirm red-btn" @click="okCallbackSell">{{$t('market.text11')}}</div>
          </div>
        </div>
      </div>
    </transition>
    <!--    toast弹窗-->
    <div class="toast" v-show="toastShow">{{toastMsg}}</div>
    <!--    -->
    <pay-dialog @succeed="okPay" v-show="verifyCodeShow" @cancelDialog="cancelDialog"></pay-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import Dialog from '@/components/dialog'
import payDialog from '@/components/payDialog'
import 'zrender/lib/svg/svg'

const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/candlestick')
require('echarts/lib/chart/bar')

export default {
  data() {
    return {
      secondBalance: '',
      verifyCodeShow: false,
      toastMsg: '',
      toastShow: false,
      isDisable: false,
      buyInPrice: '',
      buyInNum: '',
      sellInPrice: '',
      sellInNum: '',
      buyMethod: [this.$t('market.text19'), this.$t('market.text20')],
      buyOutIndex: 0,
      buyVisible: false,
      sellVisible: false,
      titleName: this.$t('market.text21'),
      currentIndex: 3,
      exchangeData: '',
      buyData: [],
      sellData: [],
      timeArr: this.$t('market.text22'),
      kLineData: [],
      myBalance: '',
      isBuyInOut: 1,
      firstCurrency: this.$route.query.firstCurrency,
      secondCurrency: this.$route.query.secondCurrency
    }
  },
  created() {
    this.newCoin()
    this.getNewPrice()
  },
  mounted() {
    this.getKline(5)
    this.getBalance()
  },
  computed: {
    buyTotalMoney() {
      return Number(this.buyInPrice * this.buyInNum).toFixed(4)
    },
    sellTotalMoney() {
      return Number(this.sellInPrice * this.sellInNum).toFixed(4)
    },
    ...mapGetters([
      'userData',
      'account'
    ])
  },
  methods: {
    f4(num) {
      if (!num) {
        return '0.0000'
      }
      let splitNum = String(num).split(".")
      if (splitNum.length > 1) {
        let decimals = String(num).split(".")[1].length
        if (decimals > 4) {
          return String(num).replace(/^(.*\..{4}).*$/, "$1")
        } else {
          return Number(num).toFixed(4)
        }
      } else {
        return Number(num).toFixed(4)
      }
    },
    // 获取余额
    getBalance() {
      this.$fetch.post('/coinaccount/queryCoinUserAccount').then(res => {
        if (res.success) {
          let mData = res.data
          mData.forEach(item => {
            if (item.currency === this.secondCurrency) {
              this.secondBalance = item
            }
          })
        }
      })
    },
    cancelDialog() {
      this.verifyCodeShow = false
    },
    buyPic(price) {
      this.isBuyInOut = 2
      this.isDisable = false
      this.sellVisible = true
      this.buyOutIndex = 0
      this.sellInPrice = price
    },
    sellPic(price) {
      this.isBuyInOut = 1
      this.buyVisible = true
      this.buyOutIndex = 0
      this.buyInPrice = price
    },
    okPay() {
      let data = {
        eType: this.isBuyInOut, // short	(必填)委托类型 1: 买入 2:卖出
        firstCurrency: this.firstCurrency, // string	(必填)货币对第一币种
        secondCurrency: this.secondCurrency // string	(必填)货币对第二币种
      }
      if (this.isBuyInOut === 1) {
        data.amount = this.buyInNum // (必填)数量
      } else {
        data.amount = this.sellInNum // (必填)数量
      }
      if (this.buyOutIndex === 0) { //	(必填)委托价格(市价不传，限价传)
        data.priceType = 2 // short	(必填)1市价 2限价
        if (this.isBuyInOut === 1) {
          data.price = this.buyInPrice
        } else {
          data.price = this.sellInPrice
        }
      } else {
        data.priceType = 1 // short	(必填)1市价 2限价
      }
      this.$fetch.post('/coinentrust/coinEntrust', data).then(res => {
        this.verifyCodeShow = false
        if (res.success) {
          let msgT = ''
          if (this.isBuyInOut === 1) {
            msgT = this.$t('market.text23')
          } else {
            msgT = this.$t('market.text24')
          }
          Dialog({
            title: msgT
          })
        } else if (res.resultCode === 'ACCOUNT_LOCK') {
          this.verifyCodeShow = true
        } else {
          Dialog({
            title: res.msg
          })
        }
      })
    },
    // 确定卖出
    okCallbackSell() {
      this.isBuyInOut = 2
      if (this.sellInPrice === '') {
        this.toastShow = true
        this.toastMsg = this.$t('market.text25')
        setTimeout(() => {
          this.toastShow = false
        }, 2000)
        return
      }
      if (this.sellInNum === '') {
        this.toastShow = true
        this.toastMsg = this.$t('market.text26')
        setTimeout(() => {
          this.toastShow = false
        }, 2000)
        return
      }
      if (this.sellTotalMoney > 0) {
        this.sellVisible = false
        if (this.userData.openTradePassword !== 2) {
          Dialog({
            title: this.$t('safe.text1'),
            type: 'confirm'
          })
          return
        }
        if (this.userData.openGoogleCode !== 2) {
          Dialog({
            title: this.$t('safe.text2'),
            type: 'confirm'
          })
          return
        }
        this.okPay()
        // this.verifyCodeShow = true
      }
    },
    // 确定买入
    okCallbackBuy() {
      this.isBuyInOut = 1
      if (this.buyInPrice === '') {
        this.toastShow = true
        this.toastMsg = this.$t('market.text27')
        setTimeout(() => {
          this.toastShow = false
        }, 2000)
        return
      }
      if (this.buyInNum === '') {
        this.toastShow = true
        this.toastMsg = this.$t('market.text28')
        setTimeout(() => {
          this.toastShow = false
        }, 2000)
        return
      }
      if (this.buyTotalMoney > 0) {
        this.buyVisible = false
        if (this.userData.openTradePassword !== 2) {
          Dialog({
            title: this.$t('safe.text1'),
            type: 'confirm'
          })
          return
        }
        if (this.userData.openGoogleCode !== 2) {
          Dialog({
            title: this.$t('safe.text2'),
            type: 'confirm'
          })
          return
        }
        this.okPay()
        // this.verifyCodeShow = true
      }
    },
    // 只能输入数字
    changeBuyNum(field) {
      let val = this[field]
      if (!/^\d*\.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
    },
    // k线图
    getKline(index) {
      this.$fetch.post('/coinvolume/queryCoinTradeKLine', {
        firstCurrency: this.firstCurrency,
        secondCurrency: this.secondCurrency,
        dateType: index
      }).then(res => {
        if (res.success === true) {
          let lineArr = []
          let ret = res.data
          ret.forEach((item) => {
            let obj = []
            obj.push(this.$changeDate(item.createAt, '-', 9))
            obj.push(this.fourNumber(item.openPrice))
            obj.push(this.fourNumber(item.closePrice))
            obj.push(this.fourNumber(item.lowPrice))
            obj.push(this.fourNumber(item.highPrice))
            obj.push(this.fourNumber(item.volume))
            lineArr.push(obj)
          })
          lineArr = lineArr.reverse()
          this.kLineData = this.splitData(lineArr)
          this.drawLine()
        }
      })
    },
    fourNumber(value) { // 保留4位小数点,不四舍五入
      if (!isNaN(value) && value !== null) {
        let f = Math.floor(value * 10000) / 10000
        let s = f.toString()
        let rs = s.indexOf('.')
        if (rs < 0) {
          rs = s.length
          s += '.'
        }
        while (s.length <= rs + 4) {
          s += '0'
        }
        return s
      }
    },
    splitData(rawData) {
      var categoryData = []
      var values = []
      for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0])
        values.push(rawData[i])
      }
      return {
        categoryData: categoryData,
        values: values
      }
    },
    // 绘制k线图
    drawLine() {
      var upColor = '#f32954'
      var upBorderColor = '#f32954'
      var downColor = '#3bad6b'
      var downBorderColor = '#3bad6b'
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'), 'light', {renderer: 'svg'})
      // 绘制图表
      myChart.setOption({
        grid: {
          top: '8%',
          left: '17%',
          right: '6%',
          bottom: '20%'
        },
        xAxis: {
          data: this.kLineData.categoryData,
          axisLine: {
            lineStyle: {
              color: '#646466',
              width: 1
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        yAxis: {
          // min: 0,
          // max: 80,
          splitNumber: 5,
          scale: true, // Y轴起始值为数据的最小值
          splitLine: {
            lineStyle: {
              color: '#646466',
              width: 1
            }
          },
          axisLine: {
            lineStyle: {
              color: '#646466',
              width: 1
            }
          },
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 90,
            end: 100
          }
        ],
        series: [
          {
            type: 'candlestick',
            data: this.kLineData.values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            }
          }
        ]
      })
      window.onresize = function () {
        myChart.resize()
      }
    },
    // 获取价格
    newCoin() {
      this.$fetch.post('/coinvolume/queryNewCoinTradeVolume', {
        firstCurrency: this.firstCurrency,
        secondCurrency: this.secondCurrency
      }).then(res => {
        if (res.success === true) {
          this.exchangeData = res.data
        }
      })
    },
    getNewPrice() {
      this.$fetch.post('/coinentrust/queryCoinBookOffer', {
        count: '40',
        firstCurrency: this.firstCurrency,
        secondCurrency: this.secondCurrency
      }).then(res => {
        if (res.success === true) {
          this.buyData = res.data.buy
          this.sellData = res.data.sell.reverse()
        }
      })
    },
    // 限价市价切换
    methodOne(index) {
      this.buyOutIndex = index
      this.sellInNum = ''
      this.buyInNum = ''
      this.buyInPrice = ''
      this.sellInPrice = ''
      if (index === 1) {
        this.isDisable = true
        if (this.isBuyInOut === 1) {
          this.buyInPrice = this.sellData[0].price
        } else {
          this.sellInPrice = this.buyData[0].price
        }
      } else {
        this.isDisable = false
        this.buyInPrice = ''
        this.sellInPrice = ''
      }
    },
    changeOne(index) {
      this.currentIndex = index
      this.getKline(index + 2)
    },
    okCallback() {
      this.buyVisible = false
    },
    closeDialog() {
      this.buyVisible = false
    },
    closeDialogSell() {
      this.sellVisible = false
      this.emptyInputSell()
    },
    emptyInputSell() {
      this.sellInPrice = ''
      this.sellInNum = ''
    },
    // 清空输入框
    emptyInput() {
      this.sellInNum = ''
      this.buyInNum = ''
      this.buyInPrice = ''
      this.sellInPrice = ''
    },
    buyIn() {
      this.buyVisible = true
      this.buyOutIndex = 0
      this.isBuyInOut = 1
      this.emptyInput()
    },
    buyOut() {
      this.isBuyInOut = 2
      this.sellVisible = true
      this.isDisable = false
      this.buyOutIndex = 0
      this.emptyInput()
    }
  },
  components: {
    mFixedTop: () => import('@/components/mFixedTop'),
    payDialog
  }
}
</script>

<style scoped lang="stylus">
  .exchange
    .content
      margin-top: 1.76rem
      padding: 0 .4rem
      .main-box
        width: 100%
        height: 1.2rem
        background-color: #f4f7f9
        border-radius 4px
        padding: 0 .3rem
        display: flex
        flex-direction column
        justify-content center
        margin: .4rem 0
        .div-box
          font-size: .24rem
          display: flex
          line-height: 1.5
          align-items center
          justify-content space-between
          color #36c46f
        .red
          color #ff717d
        .green
          color #36c46f
      .charts-w
        margin-bottom: .3rem
        .time-uls
          display: flex
          align-items center
          margin-bottom: .1rem
          .time-list
            font-size: 12px
            color #000
            flex 1
            padding: 0.1rem 0 .1rem .1rem
            &.active-list
              font-weight: bold
        .charts
          background-color: #f7f7f7
          width: 100%
          height: 3.6rem
      .order-w
        margin-bottom: 1.8rem
        .order-top
          display: flex
          align-items center
          justify-content space-between
          font-size: .24rem
          color #000
          margin: .4rem 0 .2rem
        .order-content
          display: flex
          .order-flex
            flex 1
            .order-item
              height: .4rem
              display: flex
              align-items center
              justify-content space-between
              font-size: .24rem
              color #000
              margin-bottom: .1rem
              .green
                color #36c46f
              .red
                color #ff717d
            .left-item
              padding-right: .2rem
            .right-item
              padding-left: .2rem
      .bottom
        position: fixed
        bottom: 0
        left: 0
        width: 100%
        background-color: #fff
        z-index: 100
        display: flex
        align-items center
        justify-content center
        padding-bottom: .6rem
        .order
          width: 1rem
          height: 1rem
          display: flex
          align-items center
          justify-content center
          flex-direction column
          border: 2px solid #000
          border-radius 4px
          font-size: 12px
          color #000
          img
            width: .29rem
            height: .35rem
            margin-bottom: 4px
        .btn
          width: 2.7rem
          height: 1rem
          display: flex
          align-items center
          justify-content center
          color #fff
          font-size: .28rem
          border-radius 2px
        .buy-in
          margin: 0 .2rem
          background-color: #36c46f
        .buy-out
          background-color: #ff717d
    .toast
      position: fixed
      bottom: 2rem
      left: 50%
      transform translateX(-50%)
      background-color: rgba(0, 0, 0, .6)
      color #fff
      padding: .2rem .4rem
      z-index: 1000
      font-size: .28rem
    .dialog-safe-w
      display: flex
      align-items center
      justify-content center
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      z-index: 200
      color #000
      &.safeDialog-enter, &.safeDialog-leave-to
        opacity: 0;
        .dialog-safe
          transform: translate(0, 50%)
      &.safeDialog-enter-active
        transition: .3s;
        .dialog-safe
          transition: .3s
      &.safeDialog-leave-active
        transition: .1s;
        .dialog-safe
          transition: .1s
      .dialog-m
        position: absolute
        width: 100%
        bottom: .3rem
        padding: .3rem
      .dialog-safe
        width: 100%
        background-color: #fff
        border-radius 4px
        color #17161f
        font-size: .28rem;
        transform: translate(0, 0)
        padding: .3rem
        border: 1px solid #000
        position: relative
        .close
          width: .8rem
          height: .88rem
          display: flex
          align-items center
          justify-content center
          margin-left: .1rem
          .close-icon
            width: .26rem
            height: .26rem
            background: url("../assets/img/order/close.svg") no-repeat center / cover
        .dialog-top
          display: flex
          align-items center
          margin-bottom: .4rem
          .method-item
            width: 2.6rem
            height: .88rem
            color #999
            background-color: #f0f0f0
            border-radius 4px
            display: flex
            align-items center
            justify-content center
            &:first-child
              margin-right: .2rem
            &.active-item
              background-color: #ffe941
              color #000
        .input-item
          width: 100%
          height: 1rem
          display: flex
          align-items center
          color #000
          border-bottom: 1px solid #000
          font-size: .3rem
          margin-bottom: .4rem
          .input
            flex 1
            height: 100%
        .order-total-w
          width: 100%
          height: 1.2rem
          border-radius 4px
          display: flex
          justify-content center
          flex-direction column
          padding: 0 .3rem
          border: 1px dashed #b79961
          margin: .5rem 0
          .flex-w
            font-size: .28rem
            color #000
            display: flex
            align-items center
            justify-content space-between
            .total
              color #b79961
          .my-money
            font-size: .24rem
            color #999
            margin-top: .1rem
        .comfirm
          width: 100%
          height: 1rem
          display: flex
          align-items center
          justify-content center
          border-radius 4px
          color #fff
          background-color: #4cd282
        .red-btn
          background-color: #ff717d
</style>
