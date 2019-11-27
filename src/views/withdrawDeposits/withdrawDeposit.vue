<template>
  <div class="withdrawDeposit-wrap">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
    <div class="main-c">
      <div class="title">{{$t('withdrawDeposit.text1')}}</div>
      <div class="sum-input">
        <input class="input" v-model.trim="money" @input="vialteInput" type="number" autocomplete="off" :placeholder="$t('withdrawDeposit.text2')">
        <div class="currency">{{currentUnit}}</div>
      </div>
      <div class="title gathering">{{$t('withdrawDeposit.text3')}}</div>
      <div class="account-box">
        <div @click="selectCurrency" class="but">
          <div class="currency">{{currentCoin || 'USD'}}</div>
          <div class="icon"></div>
        </div>
        <div @click="accountNumberUnitFn()" class="account-bank">
          <div class="bank-num">{{accountNumber || $t('withdrawDeposit.text4')}}</div>
          <div class="icon"><img src="../../assets/img/common/arrows.svg" alt=""></div>
        </div>
      </div>
      <div class="remark">
        <input style="color: #000" class="remark_input" v-model="remarks" type="text" maxlength="120" :placeholder="$t('withdrawDeposit.text5')"/>
      </div>
      <div class="next-step" @click="nextStepFn" v-waves>{{$t('withdrawDeposit.text6')}}</div>
    </div>
    <!--支付验证-->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="payDialogShow">
        <div class="dialog-safe">
          <div class="close">
            <div class="close-icon"></div>
          </div>
          <div class="pay-title">{{$t('withdrawDeposit.text7')}}</div>
          <div class="form-item">
            <input type="password" :placeholder="$t('withdrawDeposit.text8')" class="input" v-model.trim="safeCode">
          </div>
          <div class="form-item">
            <input type="number" :placeholder="$t('withdrawDeposit.text9')" class="input" v-model.trim="payCode">
          </div>
          <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('withdrawDeposit.text10')}}</div>
            <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('withdrawDeposit.text11')}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import waves from '@/dircetive/waves/waves' // 水波纹指令
  import Dialog from '@/components/dialog/index'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        isGoBack: true,
        titleName: this.$t('withdrawDeposit.title'),
        currency: '',
        remarks: '',
        errInputMsg: '',
        safeCode:'',
        payCode:'',
        money: this.$store.state.topUpAmount || '',
        payDialogShow: false,
        sharerId: '',
        payId: '',
        paId: '',
        bossOrderId: '',
        accountType: this.$store.state.accountType, // 账户类型
        bankAccountId: this.$store.state.accountBankId  // item银行卡的id
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    },
    directives: {waves},
    computed: {
      currentUnit() {
        if (this.currentCoin === 'CNY' || this.currentCoin === 'HKD' || this.currentCoin === 'CAD' || this.currentCoin === 'KRW' || this.currentCoin === '') {
          return 'USD'
        } else {
          return this.currentCoin
        }
      },
      ...mapGetters ([
        'currentCoin',
        'piBalance',
        'userData',
        'account',
        'accountNumber'
      ])
    },
    created() {
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
      goPath () { // 返回到我的
        this.$router.push('/menu')
      },
      // 选择币种类型
      selectCurrency () {
        this.$store.commit('TOP_UP_AMOUNT', this.money)
        this.$store.commit('SET_ACCOUNT_NUMBER', '')
        this.$router.push({path:'/topUp/payType', query:{tx: '2'}})
      },
      accountNumberUnitFn () {
        this.$store.commit('TOP_UP_AMOUNT', this.money)
        this.$router.push({path:'/withdrawDeposits/payAccount', query: {currentCoin: this.currentCoin}})
      },
      // 验证
      vialteInput () {
        let fix
        if (!/^[0-9]+\.?[0-9]{0,4}$/.test(this.money) || this.money - 0 < 0 || this.money - 0 < 0) {
          this.money = ''
        } else {
          fix = this.money
        }
        this.money = fix
      },
      nextStepFn () {
        if (this.money === '') {
          Dialog ({
            title: this.$t('withdrawDeposit.text12'),
            type: 'confirm'
          })
        }
        // add
        if (this.accountNumber === '') {
          Dialog ({
            title: this.$t('withdrawDeposit.text13'),
            type: 'confirm'
          })
        }
        /*提现
        3.1 创建提现订单
        接口URL: http://boss.pigamegroup.com/draw/createOrder*/
        if (this.money !== '' && this.currentUnit !=='' && this.accountNumber !== '' && this.userData.openGoogleCode === 2) {
          this.$fetch.post(`${this.$api}draw/createOrder`,{
            amount: this.money,
            currency: this.$store.state.currentCoin,
            bankAccountId: this.bankAccountId,  // 收款帐户ID
            remark: this.remarks,
            type: this.accountType
          }).then((res)=> {
            if (res.status === 'success') {
              this.sharerId = res.data.id //提现订单记录ID
              this.payId = res.data.cashPaymentOrder.payId
              this.bossOrderId = res.data.cashPaymentOrder.bossOrderId
              this.payDialogShow = true
            } else {
              Dialog ({
                title: res.msg
              })
            }
          })
        } else if (this.userData.openGoogleCode !== 2) {
          Dialog({
            title: this.$t('withdrawDeposit.text14'),
            okText: this.$t('withdrawDeposit.text15'),
            type: 'confirm',
            okFn: () => {
              this.$router.push('/notGoogle')
            }
          })
        }
      },
      closePayDialog () {
        this.payDialogShow = false
      },
      /*2.4 支付(充值提现用)
      接口URL: http://boss.pigamegroup.com/pay/payOrder*/
      okCallback () {
        if (this.safeCode === '') {
          this.errInputMsg =  this.$t('withdrawDeposit.text16')
        }
        if (this.payCode === '') {
          this.errInputMsg = this.$t('withdrawDeposit.text17')
        }
        if (this.safeCode !== '' && this.payCode !== '') {
          this.$fetch.post(`${this.$api2}pay/payOrder`,{
            id: this.payId,
            tradePwd: this.safeCode,  // 支付密码（选填）
            mobileCode: this.payCode  // 手机验证码 （选填） 邮箱
          }).then((re) => {
            if (re.status === 'success') {
              this.paId = re.data.orderId
              this.$router.push({path: '/topUp/chooseShare',query: {paId: this.paId,orderId:this.sharerId,fal:1}})
            } else {
              this.errInputMsg = re.msg
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @titFont: .28rem;
  @textFont: .3rem;
  @textColor: #000;
  .withdrawDeposit-wrap{
    width: @width;
    height: @width;
    padding: 1.76rem .4rem 0;
    .main-c{
      width: @width;
      .title{
        font-size: @titFont;
        color: @textColor;
        padding: 0 0 .2rem;
      }
      .gathering {
        padding-top: .6rem;
      }
      .sum-input{
        width: @width;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 1px solid @textColor;
        .input{
          display: inline-block;
          flex: 1;
          height: @width;
          font-size: .3rem;
          color: @textColor;
          &::-webkit-input-placeholder{
            color: #bfbfbf;
          }
          &:-moz-placeholder{
            color: #bfbfbf;
          }
          &::-moz-placeholder{
            color: #bfbfbf;
          }
          &:-ms-input-placeholder{
            color: #bfbfbf;
          }
        }
        .currency{
          width: 50px;
          margin-left: 6px;
          font-size: @textFont;
          color: @textColor;
        }
      }
      .account-box {
        width: @width;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: .3rem;
        .but {
          width: 1.6rem;
          height: 1rem;
          border-radius: .08rem;
          background-color: #a2f2ed;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .currency{
            font-size: .3rem;
          }
          .icon{
            width: 12px;
            height: 12px;
            background-size: 10px 10px;
            background-image: url("../../assets/img/common/arrows.svg");
            background-repeat: no-repeat;
          }
        }
        .account-bank{
          flex: 1;
          height: @width;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: .4rem;
          border-bottom: 1px solid #000;
          font-size: .3rem;
          .bank-num{
            width: 80%;
            color: #bfbfbf;
            text-align: left;
          }
          .icon{
            width: 12px;
            height: 1rem;
            line-height: 1rem;
            margin-left: .05rem;
            img{
              width: 12px;
              height: 12px;
              line-height: 1rem;
            }
          }
        }
      }
      .remark{
        width: @width;
        height: 1rem;
        margin-top: .8rem;
        .remark_input{
          width: @width;
          height: 1rem;
          border: none;
          border-bottom: 1px solid #000;
          font-size: .3rem;
          color: #bfbfbf;
          line-height: 1rem;
          &::-webkit-input-placeholder{
            color: #bfbfbf;
          }
          &:-moz-placeholder{
            color: #bfbfbf;
          }
          &::-moz-placeholder{
            color: #bfbfbf;
          }
          &:-ms-input-placeholder{
            color: #bfbfbf;
          }
        }
      }
      .next-step{
        width: @width;
        height: 1rem;
        line-height: 1rem;
        font-size: .32rem;
        color: #b79961;
        margin-top: 1.60rem;
        text-align: center;
        border: 1px solid #b79961;
        transition: all .2s;
        border-radius: .04rem;
        a{
          &:active {
            opacity: 0.6;
          }
        }
      }
    }
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
        .g-dialog-cancel{
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
  }
</style>
