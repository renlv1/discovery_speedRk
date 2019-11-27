<template>
  <div class="detail">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
    <div class="v-content-wrapper">
      <div class="item">
        <div class="li-top">
          <p>{{$t('topUp.topUpDetail.itemContent.text1')}} {{detailObj.id}} <span class="status">{{detailObj.tipMsg}}</span></p>
          <p v-if="!this.$route.query.falg">{{$t('topUp.topUpDetail.itemContent.text2')}} {{detailObj.amount}} {{detailObj.currency}}</p>
          <p v-if="this.$route.query.falg">{{$t('topUp.topUpDetail.itemContent.text3')}} {{detailObj.amount}} {{detailObj.currency}}</p>
          <p>
            <!-- 判断当是共享者的时候显示用户， 用户的时候显示共享者 -->
            <span v-if="detailObj.bossNick === this.$store.state.userName">{{detailObj.userNick}}</span>
            <span v-if="detailObj.bossNick !== this.$store.state.userName">{{detailObj.bossNick}}</span>
            <span>{{$changeDate(detailObj.createAt, '.')}}</span>
          </p>
        </div>
        <div class="li-bottom">
          <!--用户的提现--应付 -->
          <span v-if="!sharerTopUp">{{$t('topUp.topUpDetail.itemContent.text4')}}</span>
          <!--共享者的充值--应收-->
          <span v-if="sharerTopUp">{{$t('withdrawDeposit.text18')}}</span>
          <span class="calculate">{{detailObj.rule || 0}} {{detailObj.unlineCurrency}}</span>
        </div>
      </div>
      <div v-if="detailObj.remark !== ''" class="remark">{{$t('topUp.topUpDetail.itemContent.text5')}}{{detailObj.remark}}</div>
      <step v-if="!this.$route.query.falg" :stepData="stepList" :title="title"></step>
      <div class="btn-wrapper" v-if="!this.$route.query.falg && detailObj.tipMsg !== '订单已取消'">
        <div class="btn cancel back-color" @click="openCancel" v-if="cancelBtn">{{$t('topUp.topUpDetail.buttonText.text1')}}</div>
        <div class="btn choose-share orange-color" v-if="hasShare" @click="chooseShare">{{$t('topUp.topUpDetail.buttonText.text2')}}</div>
        <div class="btn choose-share orange-color" v-if="Welding" @click="sureWelding()">{{$t('topUp.topUpDetail.buttonText.text3')}}</div>
        <div class="btn choose-share orange-color" v-if="toPayShow" @click="toPay">{{$t('topUp.topUpDetail.buttonText.text4')}}</div>
        <div class="btn orange-color" v-if="sureIng" @click="openSure(2)">{{$t('topUp.topUpDetail.buttonText.text5')}}</div>
        <div class="btn back-color" v-if="complaint" @click="toComplaintOrder">{{complaintText}}</div>
        <div class="btn orange-color" v-if="sure" @click="openSure(3)">{{$t('topUp.topUpDetail.buttonText.text6')}}</div>
      </div>
      <!--订单进度-->
      <div class="schedule" v-if="this.$route.query.falg">{{$t('topUp.topUpDetail.subTitle')}}</div>
      <order-Process v-if="this.$route.query.falg" :step-data="stepData" :lastStatus="lastStatus" :orderData="orderData" ref="showOrderProcess"></order-Process>
      <div class="btn-wrapper" v-if="this.$route.query.falg">
        <div class="but" v-show="orderData.orderState === 1 || orderData.payState === 2" @click="cancelOrder"><a href="javascript:;">{{$t('topUp.topUpDetail.buttonText.text1')}}</a></div>
        <div class="but" v-show="orderData.orderState === 1 && orderData.payState === 1" @click="payMoney"><a href="javascript:;">{{$t('topUp.topUpDetail.buttonText.text4')}}</a></div>
        <div class="but" v-show="orderData.orderState === 1 && orderData.payState === 2" @click="gotoShare"><a href="javascript:;">{{$t('topUp.topUpDetail.buttonText.text2')}}</a></div>
        <div class="but" v-show="orderData.orderState === 3 && orderData.payState === 4" @click="comfimShouKuan"><a href="javascript:;">{{$t('topUp.topUpDetail.buttonText.text6')}}</a></div>
        <div class="but" v-show="orderData.canHelp === 1">
          <a @click="$router.push({path: '/complaint', query: {id: orderData.id, boss: orderData.bossNick, type: 2}})">{{$t('topUp.topUpDetail.buttonText.text7')}}</a>
        </div>
      </div>
    </div>
    <confirm :confirmModalOptions="confirmCancelOptions" ref="cancel"></confirm>
    <confirm :confirmModalOptions="confirmSureOptions" ref="sure"></confirm>
    <confirm :confirmModalOptions="shareConfirmSureOptions" ref="shareSure"></confirm>
    <!--支付验证-->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="payDialogShow">
        <div class="dialog-safe">
          <div class="close">
            <div class="close-icon"></div>
          </div>
          <div class="pay-title">{{$t('common.payDialog.title')}}</div>
          <div class="form-item">
            <input type="password" :placeholder="$t('common.payDialog.inputTip.text1')" class="input" v-model.trim="safeCode">
          </div>
          <div class="form-item">
            <input type="number" :placeholder="$t('common.payDialog.inputTip.text2')" class="input" v-model.trim="payCode">
          </div>
          <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('common.dialog.text1')}}</div>
            <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('common.dialog.text2')}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import step from '@/components/step/step'
import confirm from '@/components/VDialog/VDialog'
import orderProcess from '@/components/orderProcess'
import {getListDetail, cancel, twiceConfirm} from '../../api/topUp'
import Dialog from '@/components/dialog/index'
import {mapGetters} from 'vuex'

export default {
  components: {mFixedTop, step, confirm,orderProcess},
  data() {
    return {
      sharerTopUp: Number(this.$route.query.SharerTopUp),
      titleName: this.$t('topUp.topUpDetail.title'),
      title: this.$t('topUp.topUpDetail.subTitle'),
      detailObj: {},
      orderData: {},
      stepList: [],
      stepData: [],
      lastStatus: 0,
      isShow: true,
      complaintText: '',
      payDialogShow: false,
      safeCode: '',
      payCode: '',
      errInputMsg: '',
      toPayShow: false, // 去支付按钮
      cancelBtn: false, // 判断是否存在取消按钮
      hasShare: false, // 判断是否存在选择共享者按钮
      Welding: false, // 判断是否确认接单按钮
      sureIng: false, // 判断是否存在我已打款按钮
      complaint: false, // 判断是否存在申诉按钮
      sure: false, // 确认收款
      confirmCancelOptions: {
        title: "",
        message: this.$t('topUp.topUpDetail.orderTwice.text1'), //提示
        confirmCancel: () => {
          this.$refs.cancel.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this._cancelOrder()
          this.$refs.cancel.closeModel()
        },
      },
      confirmSureOptions: {
        title: "",
        message: this.$t('topUp.topUpDetail.orderTwice.text2'), //提示
        confirmCancel: () => {
          this.$refs.sure.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this._sureOrder(2)
          this.$refs.sure.closeModel()
        },
      },
      shareConfirmSureOptions: {
        title: "",
        message: this.$t('topUp.topUpDetail.orderTwice.text3'), //提示
        confirmCancel: () => {
          this.$refs.shareSure.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this._sureOrder(3)
          this.$refs.shareSure.closeModel()
        },
      },
    }
  },
  created() {
    this._getListDetail()
  },
  computed: {
    ...mapGetters([
      'label'
    ]),
  },
  methods: {
    // 充值共享者确认接单
    sureWelding () {
      this._sureOrder(1)
    },
    toPay() {
      this.payDialogShow = true
    },
    comfimShouKuan () {
      Dialog({
        title: this.orderData.confirmTip,
        okFn: () => {
          console.log(this.$route.params.id)
          this.$fetch.post(`${this.$api2}draw/confirmByStep`, {
            orderId: this.$route.params.id,
            confirmState: '3' //  3(用户)确认收款
          }).then(res => {
            if (res.status === 'success') {
              this._getListDetail()
            } else {
              Dialog({
                //title: '',
                title: res.msg
              })
            }
          })
        }
      })
    },
    /*2.4 支付(充值提现用)
      接口URL: http://boss.pigamegroup.com/pay/payOrder*/
    okCallback () {
      if (this.safeCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text4')
      }
      if (this.payCode === '') {
        this.errInputMsg = this.$t('topUp.inputTip.text5')
      }
      if (this.safeCode !== '' && this.payCode !== '') {
        this.$fetch.post(`${this.$api2}pay/payOrder`,{
          id: this.detailObj.cashPaymentOrder.payId,
          tradePwd: this.safeCode,  // 支付密码（选填）
          mobileCode: this.payCode  // 手机验证码 （选填） 邮箱
        }).then((re) => {
          if (re.status === 'success') {
            this.payDialogShow = false
            this._getListDetail()
            location.reload()
          } else {
            this.errInputMsg = re.msg
          }
        })
      }
    },
    cancelDialog () {
      this.verifyCodeShow = false
    },
    closePayDialog () {
      this.payDialogShow = false
    },
    goPath() {
      if (this.$route.query.backPre) {
         this.$router.push('/topUp/topUpOrder')
      } else if(this.$route.query.backTx) {
         this.$router.push('/withdrawalOrder')
      }else {
        this.$router.go(-1)
      }
    },
    openCancel() { // 确认取消弹窗
      this.$refs.cancel.showModel()
    },
    openSure(num) { // 确认已打款弹窗
      if (num === 2) {
        this.$refs.sure.showModel()
      } else {
        this.$refs.shareSure.showModel()
      }
    },
    toComplaintOrder() {
      if (this.detailObj.canHelp === 3) { // 申请详情
        this.$router.push(`/complaintOrder/${this.detailObj.id}`)
      } else if (this.detailObj.canHelp === 2) { // 提交举证
        this.$router.push({
          path: '/complaint',
          query: {id: this.detailObj.id, boss: this.detailObj.bossNick, type: 1, canHelp: 2}
        })
      } else if (this.detailObj.canHelp === 1) { // 申请仲裁
        this.$router.push({
          path: '/complaint',
          query: {id: this.detailObj.id, boss: this.detailObj.bossNick, type: 1, canHelp: 1}
        })
      }
    },
    chooseShare() { // 去选择共享者
      this.$router.push({
        path: '/topUp/chooseShare',
        query: {orderId: this.detailObj.id}
      })
    },
    txList() { // 提现详情
      this.$fetch.post(`${this.$api2}draw/queryOrderDetail`,{
        orderId: this.$route.params.id
      }).then(res => {
        this.isShow = false
        if (res.status === 'success') {
          this.orderData = res.data
          this.detailObj = res.data
          //console.log('orderData',this.orderData.stepList)
          this.lastStatus = res.data.stepList[res.data.stepList.length - 1].status
          this.stepData = []
          this.stepData = this.stepData.concat(res.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        } else {
          this.toastD(res.msg)
          this.$router.back()
        }
      })
    },
    _getListDetail() { // 充值详情
      let id = this.$route.params.id
      if (this.$route.query.falg) {
        this.txList()
      } else {
        getListDetail(id).then((res) => {
          this.isShow = false
          this.hasShare = false
          this.cancelBtn = false
          this.complaint = false
          if (res.data.status === 'success') {
            this.detailObj = res.data.data
            this.stepList = res.data.data.stepList
            if (this.detailObj.canHelp === 0) {
              this.complaint = false
            } else if (this.detailObj.canHelp === 1) {
              this.complaint = true
              this.complaintText = this.$t('topUp.topUpDetail.buttonStatus.text1')
            } else if (this.detailObj.canHelp === 2) {
              this.complaint = true
              this.complaintText = this.$t('topUp.topUpDetail.buttonStatus.text2')
            } else if (this.detailObj.canHelp === 3) {
              this.complaint = true
              this.complaintText = this.$t('topUp.topUpDetail.buttonStatus.text3')
            }
            if (true) { // 以前的判断有问题  不应该判断订单状态(已完成未完成)
              if (this.stepList[1].title === '未选择共享者' && this.detailObj.bossNick !== this.$store.state.userName) {
                this.hasShare = true
              }
              if (this.stepList[1].status === 2 && this.detailObj.bossNick === this.$store.state.userName) {
                this.Welding = true
              }
              if (this.stepList[2].status === 2 && this.detailObj.bossNick === this.$store.state.userName) {
                this.toPayShow = true
              }
              if (this.stepList[3].status === 2 && this.detailObj.bossNick !== this.$store.state.userName) {
                console.log(this.stepList[3].status === 2)
                this.sureIng = true
              }
              if (this.detailObj.isRefuse === 1) {
                this.cancelBtn = true
              }
              if (this.detailObj.buttomText && this.detailObj.buttomText === '确认收款' && this.detailObj.orderState !== 5 && this.detailObj.bossNick === this.$store.state.userName) {
                this.sure = true
              }
            }
          } else {
            this.toastD(res.data.msg)
            this.$router.back()
          }
        })
      }
    },
    _cancelOrder() {
      const id = this.detailObj.id
      cancel(id).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('common.cancelSuccessTip'))
          location.reload()
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    _sureOrder(num) {
      const orderId = this.detailObj.id
      const confirmState = num
      twiceConfirm(orderId, confirmState).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('common.okSuccessTip'))
          location.reload()
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    /*3.5 提现取消订单
      接口URL: http://boss.pigamegroup.com/draw/cancelOrder*/
    cancelOrder () {
      Dialog({
        title: this.$t('topUp.twice.text1'),
        type: 'confirm',
        okFn: () => {
          this.$fetch.post(`${this.$api2}draw/cancelOrder`, {
            id: this.detailsdId,
          }).then(res => {
            if (res.status === 'success') {
              location.reload()
              this.toastD(this.$t('topUp.twice.text2') + this.orderData.id)
            } else {
              Dialog({
                title: 'res.msg',
                content: res.msg
              })
            }
          })
        }
      })
    },
    // 支付 "openGoogleCode": 3, // 1：未设置  2:开启  3:关闭
    payMoney () {
      // console.log('谷歌',this.userData)
      if (this.userData.openGoogleCode !== 2) {  // 未开起谷歌
        Dialog({
          title: this.$t('common.setGoogle.title'),
          type: 'confirm',
          okText: this.$t('common.setGoogle.text1'),
          okFn: () => {
            this.$router.push('/notGoogle')  // 去开启谷歌验证
          }
        })
      } else if (this.userData.openGoogleCode === 2) {
        this.googleShow = true  // 进行谷歌验证
      }
    },
    // 跳转到 提现 选择共享者
    gotoShare () {
      this.$router.push({
        path: '/topUp/chooseShare',
        query: {
          id: this.$route.query.detailsdId,
          isChongzhi: 1
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .remark {
    font-size 0.3rem
    margin-top .6rem
    color #999
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
  .detail
    .v-content-wrapper
      position relative
      .item
        padding .4rem .3rem 0
        background-color #f7f7f7
        margin-bottom 10px
        .li-top
          height 1.6rem
          border-bottom 1px dotted #000
          p
            display flex
            flex-direction row
            justify-content space-between
            font-size .28rem
            .status
              color #999
              font-size .24rem
            &:nth-child(2)
              margin .2rem 0
            &:nth-child(3)
              font-size .24rem
              color #999
        .li-bottom
          display flex
          justify-content space-between
          height .8rem
          line-height .8rem
          font-size .24rem
          .calculate
            color #b79961
      .btn-wrapper
        position fixed
        bottom .5rem
        right .4rem
        float right
        .but
          display inline-block
          width: 1.8rem;
          height: .8rem;
          line-height: .8rem;
          text-align: center;
          &:nth-child(2)
            margin-left: .4rem;
            a
              background-color: #a2f2ed;
              border: none;
          &:nth-child(4)
            margin-left: .4rem;
            a
              background-color: #a2f2ed;
              border: none;
          &:nth-child(5)
            // border: 1px solid #ccc;
            border-radius: 4px;
            margin-left: .4rem;
          a
            display: block;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: #000;
            opacity: 1;
            font-size .28rem
            transition: all .6s cubic-bezier(0,.67,.98,.42);
            &:active
              opacity: .4;
        .btn
          font-size .28rem
          float left
          width 2rem
          height .8rem
          line-height .8rem
          text-align center
          border-radius .1rem
        .back-color
          background-color #fff
          border 1px solid #999
        .orange-color
          margin-left .4rem
          background-color #ffe600
      .schedule
        color: #000;
        text-align: left;
        padding-bottom: .4rem;
        padding-top: .6rem;
        font-size: 0.28rem;
</style>
