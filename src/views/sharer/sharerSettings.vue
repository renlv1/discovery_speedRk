<template>
  <div class="sharerSettings-wrap">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
    <div class="mian">
      <div class="order-management-box">
        <div class="order-management"><h4>{{$t('sharer.sharerSettings.text1')}}</h4></div>
        <div class="li-box">
          <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text2')}}</div>
          <div class="switch">
            <div class="mui-switch mui-switch-anim" :class="{'active1': takeOrderDeposit === 1}" @click="changeBox(1)"></div>
          </div>
        </div>
        <div class="li-box">
          <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text3')}}</div>
          <div class="switch">
            <div class="mui-switch mui-switch-anim" :class="{'active1': takeOrderDraw === 1}" @click="changeBox(2)"></div>
          </div>
        </div>
        <router-link to="/currencyManagement" tag="div" class="li-box">
          <div class="info-tit currency-management">{{$t('sharer.sharerSettings.text4')}}</div>
          <div class="inoc"><img src="../../assets/img/common/goTo-path.svg" alt=""></div>
        </router-link>
        <div class="order-management"><h4>{{$t('sharer.sharerSettings.text5')}}</h4></div>
          <div class="li-box" @click="topUpFeesFn">
            <div class="info-tit recharge-order">{{topUpfees}}</div>
            <div class="inoc"><span class="top-up-fees">{{depositRate}}%</span><img src="../../assets/img/common/goTo-path.svg" alt=""></div>
          </div>
        <div class="li-box" @click="withdrawalRateFn">
          <div class="info-tit recharge-order">{{withdrawalRate}}</div>
          <div class="inoc"><span class="withdrawal-rate">{{drawRate}}%</span><img src="../../assets/img/common/goTo-path.svg" alt=""></div>
        </div>
        <div class="order-management"><h4>{{$t('sharer.sharerSettings.text6')}}</h4></div>
        <router-link to="/contactWay" tag="div" class="li-box">
          <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text7')}}</div>
          <div class="inoc"><img src="../../assets/img/common/goTo-path.svg" alt=""></div>
        </router-link>
        <div class="li-box">
          <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text8')}}</div>
          <div class="inoc">{{realname}}</div>
        </div>
        <div class="li-box">
          <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text9')}}</div>
          <div class="inoc">{{contactAddress}}</div>
        </div>
      </div>
    </div>
    <!--设置充值费率-->
    <procedure-Rates v-show="rateShow1" :rateTitle="rateTitle1" @succeed="succeed1" @cancelDialog="closeDialog1"></procedure-Rates>
    <!--设置提现费率-->
    <procedure-Rates v-show="rateShow2" :rateTitle="rateTitle2" @succeed="succeed2" @cancelDialog="closeDialog2"></procedure-Rates>
    <sharer-footer @changeIndex="changeIndex"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        isGoBack: true,
        titleName: this.$t('sharer.sharerSettings.title'),
        rateTitle1: this.$t('sharer.sharerSettings.text18'),
        rateTitle2: this.$t('sharer.sharerSettings.text21'),
        rateShow1: false,
        rateShow2: false,
        topUpfees: this.$t('sharer.sharerSettings.text18'),
        withdrawalRate: this.$t('sharer.sharerSettings.text21'),
        depositRate: '',  // 充值费率
        drawRate: '', // 提现费率
        realname: '',
        phoneCode: '',
        phoneNumber: '',
        contactAddress: '',
        takeOrderDeposit: '', //充值接单 1 是 2 否
        takeOrderDraw: '', //提现接单
        sharerId: ''
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      sharerFooter: () => import('@/components/sharerFooter'),
      procedureRates: () => import('@/components/procedureRates')
    },
    computed: {
    ...mapGetters([
        'isboss',
        'userData',
        'address',
        'account'
      ])
    },
    created() {
      this.sharerInformation()
    },
    mounted() {
      if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
        this.isGoBack = false
        this.$store.commit('IS_IOS', true)
      } else {
        this.isGoBack = true
      }
      this.$nextTick(() => {
        this.sharerInformation() // 得到共享者
      })
    },
    methods: {
      goPath() {
        this.$router.push('/menu')
      },
      changeIndex(index) {
        if (index !== 2) {
          this.$router.push('/sharer')
        } else {
          this.$router.push('/sharerSettings')
        }
      },
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      // 得到共享者信息
      sharerInformation () {
        this.$fetch.post(`${this.$api}pigame/queryByAddress`, {address: this.userData.address}).then((res) => {
          if (res.status === 'success') {
            let getSharer = res.data
            this.takeOrderDeposit = getSharer.isTakeOrderDeposit // 充值接单状态 1：是 2：否
            this.takeOrderDraw = getSharer.isTakeOrderDraw // 提现接单状态\
            this.sharerId = getSharer.id  // 共享者id
            this.realname = getSharer.realname  // 姓名
            this.contactAddress = getSharer.contactAddress  // 姓名
            this.sharerOff()
          }
        })
      },
      /*共享者打开或接单开关*/
      sharerOff () {
        this.$fetch.post(`${this.$api}pigame/bossTakeOrderOpen`,{
          bossinfoid: this.sharerId,
          takeOrderDeposit: this.takeOrderDeposit,
          takeOrderDraw: this.takeOrderDraw,
        }).then((offRes) => {
          if (offRes.status === 'success') { // 获取充值费率和提现费率
            this.depositRate = offRes.data.depositRate
            this.drawRate = offRes.data.drawRate
          }
        })
      },
      // 充值提现接单设置switch开关
      changeBox (val) {
        if (val === 1) {
          if (this.takeOrderDeposit === 0 || this.takeOrderDeposit === 2) {
            this.takeOrderDeposit = 1
          } else {
            this.takeOrderDeposit = 2
          }
        } else {
          if (this.takeOrderDraw === 0 || this.takeOrderDraw === 2) {
            this.takeOrderDraw = 1
          } else {
            this.takeOrderDraw = 2
          }
        }
        this.sharerOff()
      },
      // 显示费率弹窗---设置充值费率
      topUpFeesFn () {
        this.rateShow1 = true
      },
      // 显示费率弹窗---设置提现费率
      withdrawalRateFn() {
        this.rateShow2 = true
      },
      // 关闭费率弹窗---关闭充值费率
      closeDialog1 () {
        this.rateShow1 = false
      },
      // 关闭费率弹窗---关闭提现费率
      closeDialog2 () {
        this.rateShow2 = false
      },
      // 设置充值费率确认
      succeed1 (payCode,errInputMsg) {
        let sharerObj = {
          realname: this.realname, //真实姓名
          phoneCode: this.phoneCode, //手机区号
          phoneNumber: this.phoneNumber, //手机号码
          contactAddress: this.contactAddress, //联系地址
          depositRate: payCode, // 法币充值费率
          drawRate: this.drawRate, //法币提现费率
        }
        this.$fetch.post(`${this.$api}pigame/modifyBossinfo`,sharerObj).then((res) => {
          if (res.status === 'success') {
            this.sharerOff()
            this.rateShow1 = false
            errInputMsg = ''
          }
        })
      },
      // 设置提现费率确认
      succeed2 (payCode,errInputMsg) {
        let sharerObj = {
          realname: this.realname, //真实姓名
          phoneCode: this.phoneCode, //手机区号
          phoneNumber: this.phoneNumber, //手机号码
          contactAddress: this.contactAddress, //联系地址
          depositRate: this.depositRate, // 法币充值费率
          drawRate: payCode, //法币提现费率
        }
        this.$fetch.post(`${this.$api}pigame/modifyBossinfo`,sharerObj).then((res) => {
          if (res.status === 'success') {
            this.sharerOff()
            this.rateShow2 = false
            errInputMsg = ''
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @activeColor: #a2f2ed;
  @butBgColor: #f0f0f0;
  @titFont: .3rem;
  @butFont: .28rem;
  @textFont: .24rem;
  @hintColor: #999;
  @textColor: #000;
  @stateColor: #b79961;
  .sharerSettings-wrap{
    width: @width;
    padding: 0 .4rem;
    margin-top: 1.76rem;
    .mian{
      width: @width;
      padding-bottom: 1.38rem;
      .order-management-box{
        width: @width;
        .order-management{
          padding-top: .6rem;
          padding-bottom: .4rem;
          position: relative;
          h4{
            font-size: @titFont;
            color: @textColor;
            font-weight: bold;
            display: block;
            position: absolute;
            z-index: 2;
            top: 50%;
            left: 0;
            transform: translate(0%, -50%);
          }
          &:after{
            content: '';
            display: block;
            position: absolute;
            bottom: .3rem;
            left: 0;
            right: 0;
            width: 1.34rem;
            height: .1rem;
            background-color: #ffe941;
            border-radius: .1rem;
            z-index: 1;
          }
        }
        .li-box{
          width: @width;
          height: 1rem;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: .2rem;
          .info-tit{
            font-size: @titFont;
            color: @textColor;
          }
          .switch{
            .mui-switch{
              width: 60px;
              height: 28px;
              line-height: 28px;
              position: relative;
              border: 1px solid #e6e6e6;
              background-color: #e6e6e6;
              box-shadow: #e6e6e6 0 0 0 0 inset;
              border-radius: .4rem;
              border-top-left-radius: .4rem;
              border-top-right-radius: .4rem;
              border-bottom-left-radius: .4rem;
              border-bottom-right-radius: .4rem;
              background-clip: content-box;
              display: inline-block;
              -webkit-appearance: none;
              user-select: none;
              outline: none;
              &:before {
                content: "";
                width: 26px;
                height: 26px;
                position: absolute;
                display: block;
                top: 0;
                left: 0;
                bottom: 0;
                border-radius: 100%;
                /*border-top-left-radius: .4rem;
                border-top-right-radius: .4rem;
                border-bottom-left-radius: .4rem;
                border-bottom-right-radius: .4rem;*/
                background-color: #fff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                transition: left 0.3s;
              }
              &.active1 {
                border-color: #6fbfee;
                box-shadow: #6fbfee 0 0 0 16px inset;
                background-color: #6fbfee;
              }
              &.active1:before{
                left: 33px;
              }
            }
            .mui-switch-anim {
              transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
              &.active1 {
                transition: left 0.3s;
              }
              &.active1 {
                box-shadow: #6fbfee 0 0 0 .38rem inset;
                background-color: #6fbfee;
                transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
              }
              &.active1:before {
                transition: left 0.3s;
              }
            }
          }
          .inoc{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: @titFont;
            img{
              display: block;
              width: .3rem;
              height: .3rem;
            }
            .withdrawal-rate{
              color: @stateColor;
            }
            .top-up-fees{
              color: @stateColor;
            }
          }
        }
      }
    }
    .dialog-safe-w{
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom:0;
      width: 100%;
      height: 100%;
      z-index: 200;
      color: #000;
      background-color: rgba(0,0,0,.4);
      &.safeDialog-enter, &.safeDialog-leave-to{
        opacity: 0;
        .dialog-safe{
          transform: translate(0, -5%)
        }
      }
      &.safeDialog-enter-active{
        transition: .3s;
        .dialog-safe{
          transition: .3s
        }
      }
      &.safeDialog-leave-active{
        transition: .1s;
        .dialog-safe{
          transition: .1s
        }
      }
      .dialog-safe{
        width: 6.9rem;
        background-color: #fff;
        position: relative;
        border-radius: 4px;
        color: #17161f;
        font-size: .28rem;
        transform: translate(0, 0);
        padding: 0 .4rem;
        .close{
          width: 100%;
          height: .88rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .close-icon{
          width: .26rem;
          height: .26rem;
          background: url("../../assets/img/order/close.svg") no-repeat center / cover ;
        }
        .dialog-title{
          font-size: .32rem;
          font-weight: bold;
          color: #17161f;
          padding: .5rem 0 .6rem;
          text-align: center;
        }
        .form-item{
          width: 100%;
          height: .88rem;
          position: relative;
          .inupt-box{
            width: 100%;
            height: 100%;
            &:after{
              display: block;
              content: '%';
              width: auto;
              font-size: .3rem;
              color: #000;
              position: absolute;
              top: 36%;
              right: 0;
              transform: translate(-50%, 0);
            }
            input{
              width: 100%;
              height: 100%;
              line-height: .88rem;
              border-bottom: 1px solid #000;
            }
          }
          .label{
            margin-bottom: .2rem
          }
          .input{
            border-bottom: 1px solid #000;
            width: 100%;
            height: 1rem;
            padding-right: .6rem;
            color: #000;
          }
        }
        .err-ms{
          color: #ff717d;
          font-size: .24rem;
          margin-top: .3rem;
        }
        .g-dialog-btn-wrap{
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px dashed #000;
          .g-dialog-btn{
            text-align: center;
            flex: 1;
          }
          .comfirm{
            width: 100%;
            height: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #b79961;
          }
        }
      }
    }
  }
</style>
