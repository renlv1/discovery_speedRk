<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="top-wrapper">
        <div class="current-wrapper">
          <p class="top-title">{{$t('fund.text2')}}</p>
          <p class="top">
            <span class="top-value"> {{numberShares}} </span>
            <span class="top-unit">{{$t('fund.text3')}}</span>
          </p>
        </div>
        <p class="fund-wrapper">
          <span class="top-title">{{$t('fund.text4')}}</span>
          <span class="top-unit">{{fundNum}} {{$t('fund.text5')}}</span>
        </p>
      </div>
      <div class="bg-fund"></div>
      <div class="line-chart">
        <div class="text-wrapper">
          <p>{{$t('fund.text6')}}(π)</p>
          <p>{{$t('fund.text7')}}</p>
        </div>
        <div class="charts">
          <div class="chart-cont" id="myChart" ref="myChart" style="width: 100%; height: 3.6rem;"></div>
        </div>
      </div>
      <div class="bg-fund"></div>
      <!--支付验证-->
      <transition name="safeDialog">
        <div class="dialog-w dialog-safe-w" v-show="payDialogShow">
          <div class="dialog-safe">
            <div class="close">
              <div class="close-icon"></div>
            </div>
            <div class="pay-title">{{$t('common.payDialog.title')}}</div>
            <div class="form-item">
              <input type="password" :placeholder="$t('common.payDialog.inputTip.text1')" class="input"
                     v-model.trim="safeCode">
            </div>
            <div class="form-item">
              <input type="number" :placeholder="$t('common.payDialog.inputTip.text2')" class="input"
                     v-model.trim="payCode">
            </div>
            <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
            <div class="g-dialog-btn-wrap">
              <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('common.dialog.text1')}}</div>
              <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('common.dialog.text2')}}</div>
            </div>
          </div>
        </div>
      </transition>
      <div class="trans-wrapper">
        <div class="trans-top">
          <div class="trans-left">
            <span class="trans-title" :class="{'highLight': activeIndex === 0}" @click="chooseType(0)">{{$t('fund.text8')}}</span>
            <span class="trans-title" :class="{'highLight': activeIndex === 1}" @click="chooseType(1)">{{$t('fund.text9')}}</span>
          </div>
        </div>
        <div class="trans-content">
          <div class="div-wrapper">
            <label>{{$t('fund.text10')}}：</label>
            <div>{{value}} π</div>
          </div>
          <div class="input-wrapper">
            <label>{{$t('fund.text11')}}：</label>
            <input onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :placeholder="placeHolderText" v-model="numValue" />
          </div>
          <div class="canBuy">{{canTip}}{{$t('fund.text12')}}：{{canNum}}</div>
          <div class="bottom-wrapper">
            <div class="order-wrapper" @click="order">
              <img class="order-img" src="./images/order.png" />
              <div class="trans-right">{{$t('fund.text13')}}</div>
            </div>
            <div class="btn" :class="[activeIndex === 0 ? 'isBuy' : 'isSell' ]" @click="pay">{{transType}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {HOST} from '../../assets/js/config'
import {transInfo, getLine, getCurrentPrice, canBuy, canSell, submitEntrust} from '@/api/fund'

export default {
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('fund.text1'),
      numberShares: '',
      fundNum: '',
      activeIndex: 0,
      value: '',
      numValue: '',
      placeHolderText: this.$t('fund.text14'),
      canTip: this.$t('fund.text15'),
      canNum: '',
      transType: this.$t('fund.text16'),
      transInfo: '',
      payDialogShow: false,
      safeCode: '',
      payCode: '',
      errInputMsg: '',
      flag: false
    }
  },
  name: "paiFund",
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.searchTransInfo()
    this.isCanBuy()
    this.getTranLine()
    this.getPrice()
  },
  methods: {
    changeFlag() {
      this.flag = false
    },
    pay() {
      if (this.numValue !== '') {
        if (!this.flag) {
          this.flag = true
          this.errInputMsg = ''
          submitEntrust(this.numValue, this.activeIndex + 1).then((res) => {
            this.flag = false
            if (res.data.success) {
              this.toastD(this.$t('fund.text17'))
              this.searchTransInfo()
              this.numValue = ''
              if (this.activeIndex === 0) {
                this.isCanBuy()
              } else {
                this.isCanSell()
              }
            } else {
             if (res.data.resultCode === 'ACCOUNT_LOCK') {
                this.payDialogShow = true
              } else {
               this.toastD(res.data.msg)
             }
            }
          })
        }
      } else {
        this.toastD(this.$t('fund.text18'))
      }
    },
    order() {
      this.$router.push('/order')
    },
    getPrice() {
      getCurrentPrice().then((res) => {
        this.value = res.data.data
      })
    },
    closePayDialog() {
      this.payDialogShow = false
    },
    okCallback() {
      if (this.safeCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text4')
      }
      if (this.payCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text5')
      }
      if (this.safeCode !== '' && this.payCode !== '') {
        this.$fetch.post(`${HOST}tx/unlock`, {
          tradePwd: this.safeCode,  // 支付密码（选填）
          mobileCode: this.payCode,  // 手机验证码 （选填） 邮箱
          codeType: 1
        }).then((re) => {
          if (re.status === 'success') {
            this.payDialogShow = false
            this.flag = false
            this.pay()
          } else {
            this.errInputMsg = re.msg
          }
        })
      }
    },
    isCanBuy() {
      canBuy().then((res) => {
        if (res.data.success) {
          this.canNum = res.data.data
        } else {
          this.canNum = 0
        }
      })
    },
    isCanSell() {
      canSell().then((res) => {
        if (res.data.success) {
          this.canNum = res.data.data
        } else {
          this.canNum = 0
        }
      })
    },
    getTranLine() {
      getLine(3).then((res) => {
        let data = res.data.data
        let dataX = []
        let dataY = []
        data.forEach((item) => {
          dataX.push(this.$changeDate(item.createAt, '', 8))
          dataY.push(item.newPrice.toString().substring(0, item.newPrice.toString().lastIndexOf('.') + 5))
        })
        this.drawLine(dataX, dataY)
      })
    },
    searchTransInfo() {
      transInfo().then((res) => {
        let transInfo = res.data.data
        this.numberShares = transInfo.price
        this.fundNum = transInfo.fundBalance
      })
    },
    chooseType(type) {
      if (type !== this.activeIndex) {
        this.numValue = ''
      }
      this.activeIndex = type
      if (type === 0) {
        this.placeHolderText = this.$t('fund.text14')
        this.canTip = this.$t('fund.text15')
        this.isCanBuy()
        this.transType = this.$t('fund.text16')
      } else {
        this.placeHolderText = this.$t('fund.text19')
        this.canTip = this.$t('fund.text21')
        this.isCanSell()
        this.transType = this.$t('fund.text9')
      }
    },
    // 绘制k线图
    drawLine(dataX, dataY) {
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
          type: 'category',
          data: dataX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: dataY,
          type: 'line',
          symbol: 'circle',//折线点设置为实心点

          symbolSize: 5,   //折线点的大小
          itemStyle: {
            normal: {
              color: '#000',
              lineStyle: {
                color: '#000'
              }
            }
          },
        }]
      })
      window.onresize = function () {
        myChart.resize()
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .top-unit
    font-size .3rem
  .dialog-safe-w {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    color: #000;
    background-color: rgba(0, 0, 0, .4);
    &.safeDialog-enter, &.safeDialog-leave-to {
      opacity: 0;
      .dialog-safe {
        transform: translate(0, -5%)
      }
    }
    &.safeDialog-enter-active {
      transition: .3s;
      .dialog-safe {
        transition: .3s
      }
    }
    &.safeDialog-leave-active {
      transition: .1s;
      .dialog-safe {
        transition: .1s
      }
    }
    .dialog-safe {
      width: 6.9rem;
      background-color: #fff;
      position: relative;
      border-radius: 4px;
      color: #17161f;
      font-size: .28rem;
      transform: translate(0, 0);
      padding: 0 .4rem;
      .g-dialog-btn-wrap {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px dashed #000;
      }
      .pay-title {
        font-size: .28rem;
        text-align: center;
        padding: 20px 0;
      }
      .form-item {
        margin-bottom: .4rem;
        .label {
          margin-bottom: .2rem
        }
        .input {
          border-bottom: 1px solid #000;
          width: 100%;
          height: 1rem;
          color: #000;
        }
      }
      .err-ms {
        color: #ff717d;
        font-size: .24rem;
        margin-top: .3rem;
      }
      .shortMsg {
        position: relative;
        .payMsg-box {
          .payMsg {
            width: 100%;
            height: .8rem;
            background-color: #f5f6fa;
            border-radius: .4rem;
            font-size: .28rem;
            padding: 0 .3rem;
          }
          .sendMsg {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            padding: 0 .2rem;
            background-color: transparent;
            border: none;
            outline: none;
            font-size: .28rem;
            color: #00a6f1;
          }
        }
      }
      .g-dialog-btn {
        text-align: center;
        flex: 1;
        height: 100%;
      }
      .g-dialog-cancel {
        height: 50px;
        line-height: 50px;
        display: block;
      }
      .comfirm {
        width: 100%;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b79961;
      }
    }
  }


  .bg-fund
    width 100%
    height 5px
    position absolute
    left 0
    background-color #eee

  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .top-wrapper
      padding-bottom 20px
      .current-wrapper
        height .8rem
        align-items center
        display flex
        flex-direction row
        justify-content space-between
        margin-bottom .3rem
        .top-title
          color #ccc
          font-size .3rem
        .top
          .top-value
            font-size .5rem
            color #b79961
      .fund-wrapper
        font-size .3rem
        display flex
        flex-direction row
        justify-content space-between
        .top-title
          color #ccc
    .line-chart
      padding 20px 0 10px
      .text-wrapper
        font-size .28rem
        display flex
        flex-direction row
        justify-content space-between
      .charts
        margin-top 20px
    .trans-wrapper
      padding-top 22px
      .trans-top
        display flex
        flex-direction row
        align-items center
        justify-content space-between
        .trans-left
          display flex
          flex-direction row
          align-items center
          .trans-title
            width 1.2rem
            height .5rem
            line-height .5rem
            text-align center
            font-size .3rem
            display block
            cursor pointer
            user-select none
            background-color #f0f0f0
            color #999
            margin-right .2rem
            border-radius 4px
            &.highLight
              background-color #ffe941
              color #000
      .trans-content
        display flex
        flex-direction column
        margin-top .3rem
        padding-bottom .3rem
        .div-wrapper
          display flex
          flex-direction row
          height .8rem
          line-height .8rem
          font-size .28rem
          margin-bottom .2rem
          border-bottom 1px solid #ccc
        .input-wrapper
          height .8rem
          line-height .8rem
          margin-bottom .3rem
          font-size .28rem
          border-bottom 1px solid #ccc
        .canBuy
          color #b79961
          font-size .3rem
        .bottom-wrapper
          display flex
          flex-direction row
          margin-top .4rem
          align-items center
          .order-wrapper
            display flex
            border 1px solid #000
            width 1rem
            height 1rem
            flex-direction column
            align-items center
            font-size .14rem
            border-radius 4px
            margin-right .2rem
            img
              width .3rem
              height .4rem
              margin .1rem .05rem
          .btn
            flex 1
            font-size .32rem
            color #fff
            height 1rem
            line-height 1rem
            text-align center
            border-radius 5px
            &.isBuy
              background-color #4cd282
            &.isSell
              background-color #ff717d
</style>
