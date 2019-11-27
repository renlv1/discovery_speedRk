<template>
  <div class="theOrderDetails-wrap">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="main">
      <div class="list-item">
        <div class="info-box">
          <div class="lrs">
            <div class="order-number"><span>{{$t('withdrawalOrder.text5')}} {{orderData.id}}</span> <span class="audit-status">{{orderData.tipMsg}}</span></div>
            <div class="sum">{{$t('withdrawalOrder.text6')}} {{orderData.amount | fourNumber}} {{orderData.currency}}</div>
            <div class="account-name"><span>{{orderData.userNick}}</span><span class="audit-time">{{$changeDate(orderData.createAt)}}</span></div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="receivable-box" style="display: none" v-if="orderData.bossNick === '未选择共享者'">
          <div class="receivable"></div>
          <div class="sum">{{$t('theOrderDetails.text1')}}</div>
        </div>
        <div class="receivable-box" v-else>
          <!--<div class="receivable">{{orderData.whoGiveMoneyStr}}</div>-->
          <!--共享者的提现--应付，用户的提现--应收-->
          <div class="receivable" v-if="isChongzhi">{{$t('topUp.topUpList.item.text3')}}</div>
          <div class="receivable" v-if="!isChongzhi">{{$t('withdrawDeposit.text18')}}</div>
          <div class="sum"><span class="count">{{orderData.rule || 0}}</span> <span class="unit"> {{orderData.unlineCurrency}}</span></div>
        </div>
      </div>
      <div class="review-progress">
        <div class="schedule">{{$t('theOrderDetails.text2')}}</div>
        <!--订单进度-->
        <order-Process :step-data="stepData" :lastStatus="lastStatus" :orderData="orderData" ref="showOrderProcess"></order-Process>

        <!--&lt;!&ndash;&lt;!&ndash; 申诉进度 &ndash;&gt;&ndash;&gt;-->
        <!--<step-complaint :stepData="stepList" :reqImgList="reqImgList" :desImgList="desImgList" :title="title"></step-complaint>-->
      </div>

      <!-- 申诉进度按钮 -->
      <div class="btn-wrapper">
        <div class="btn cancel back-color" @click="openCancel" v-if="cancelBtn">{{$t('theOrderDetails.text3')}}</div>
        <div class="btn cancel back-color" @click="openComplaint" v-if="proofBtn">{{$t('theOrderDetails.text4')}}</div>
      </div>

      <!--用户的提现详情进度-->
      <div class="footer" v-if="!isChongzhi">
        <div class="but" v-show="orderData.orderState === 1 || orderData.payState === 2" @click="cancelOrder"><a href="javascript:;">{{$t('withdrawDeposit.text10')}}</a></div>
        <div class="but" v-show="orderData.orderState === 1 && orderData.payState === 1" @click="payMoney"><a href="javascript:;">{{$t('theOrderDetails.text5')}}</a></div>
        <div class="but" v-show="orderData.orderState === 1 && orderData.payState === 2" @click="gotoShare"><a href="javascript:;">{{$t('theOrderDetails.text6')}}</a></div>
        <div class="but" v-show="orderData.orderState === 3 && orderData.payState === 4" @click="comfimShouKuan"><a href="javascript:;">{{$t('theOrderDetails.text7')}}</a></div>
        <!--<div class="but" v-show="orderData.canHelp === 1" @click="$router.push({path: '/complaint', query: {id: detailsdId, isBoss: orderData.bossNick, type: 2}})">申诉</div>-->
        <div class="but shengshu" v-show="orderData.canHelp === 1" @click="appeal">{{$t('theOrderDetails.text8')}}</div>
        <!--<div class="but appealDetails" v-show="orderData.canHelp === 3"  @click="appealDetails">申诉详情</div>-->
      </div>
      <!--共享者的提现详情进度-->
      <div class="footer" v-if="isChongzhi">
        <div class="but" v-show="orderData.orderState === 1 || orderData.payState === 2" @click="cancelOrderSharer"><a href="javascript:;">{{$t('theOrderDetails.text9')}}</a></div>
        <div class="but" v-show="orderData.orderState === 1 && orderData.payState === 1" @click="payMoney"><a href="javascript:;">{{$t('theOrderDetails.text5')}}</a></div>
        <div class="but" v-show="orderData.orderState === 1 && orderData.payState === 2" @click="gotoShare"><a href="javascript:;">{{$t('theOrderDetails.text10')}}</a></div>
        <div class="but" v-show="orderData.orderState === 2 && orderData.payState === 2" @click="confirmTheOrder"><a href="javascript:;">{{$t('theOrderDetails.text11')}}</a></div>
        <div class="but" v-show="orderData.orderState === 3 && orderData.payState === 3" @click="haveMoney"><a href="javascript:;">{{$t('theOrderDetails.text12')}}</a></div>
        <!--<div class="but" v-show="orderData.orderState === 3 && orderData.payState === 4" @click="comfimShouKuan"><a href="javascript:;">确认收款</a></div>-->
        <!--<div class="but" v-show="orderData.canHelp === 1" @click="$router.push({path: '/complaint', query: {id: detailsdId, isBoss: orderData.bossNick, type: 2}})">申诉</div>-->
        <!--<div class="but shengshu" v-show="orderData.canHelp === 1" @click="$router.push({path: '/complaint', query: {id: detailsdId, isBoss: orderData.bossNick, type: 2}})">申诉</div>-->
        <!--<div class="but" v-show="orderData.canHelp === 3" @click="$router.push({path: '/account/sharerOrder/withdrawAppealDetail', query: {id: detailsdId, isBoss: '0'}})">申诉详情</div>-->
      </div>
      <!-- 验证谷歌   -->
      <google-verify
              v-show="googleShow"
              @cancelDialog="cancelDialog"
              @succeed="succeed"></google-verify>
      <!--支付保证金-->
      <transition name="safeDialog" >
        <div class="dialog-w dialog-safe-w" v-show="payDialogShow">
          <div class="dialog-safe" >
            <div class="close">
              <div class="close-icon"></div>
            </div>
            <div class="dialog-title">{{$t('theOrderDetails.text13')}}</div>
            <div class="money">{{orderData.amount | fourNumber}} USD</div>
            <div class="forms-item">
              <input type="password" :placeholder="$t('theOrderDetails.text14')" class="input" v-model.trim="safeCode">
            </div>
            <div class="forms-item">
              <input type="number" :placeholder="$t('theOrderDetails.text15')" class="input" v-model.trim="payCode">
            </div>
            <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
            <div class="g-dialog-btn-wrap">
              <div class="g-dialog-btn g-dialog-cancel" @click="closePayDialog">{{$t('withdrawDeposit.text10')}}</div>
              <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('withdrawDeposit.text11')}}</div>
            </div>
          </div>
        </div>
      </transition>
      <confirm :confirmModalOptions="confirmCancelOptions" ref="cancel"></confirm>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/index'
  import stepComplaint from '@/components/step/stepComplaint'
  import confirm from '@/components/VDialog/VDialog'
  import {mapGetters} from 'vuex'
  import {cancel} from '../../api/complaint'
  export default {
    data() {
      return {
        appealContent: false,
        stepList: {},
        title: this.$t('theOrderDetails.text16'),
        reqImgList: [], // 申述图片
        desImgList: [], // 举证图片
        titleName: this.$t('theOrderDetails.title'),
        detailsdId: this.$route.query.detailsdId,
        appealId: '',
        orderData: '',
        cancelBtn: false, // 判断是否存在取消申诉按钮
        proofBtn: false, // 判断是否存在提交举证按钮
        achieve: 1,
        unfinished: 0,
        tacitly: 0,
        googleShow: false,
        payDialogShow: false,
        payCode: '', // 支付密码
        safeCode: '', // 谷歌验证码
        errInputMsg: '', // 错误提示
        isChongzhi: Number(this.$route.query.isChongzhi),
        stepData: [],
        lastStatus: 0,
        confirmCancelOptions: {
          title: "",
          message: this.$t('theOrderDetails.text17'), //提示
          confirmCancel: () => {
            this.$refs.cancel.closeModel();
          },
          confirmSubmit: () => { // 确定操作
            this._cancelOrder()
            this.$refs.cancel.closeModel()
          },
        },
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      orderProcess: () => import('@/components/orderProcess'),
      googleVerify: () => import('@/components/googleVerify'),
      // stepComplaint,
      confirm
    },
    created() {
      this.lineItemFn()
    },
    mounted() {
    },
    methods: {
      openComplaint() {
        this.$router.push({
          path: '/complaint',
          query: {id: this.orderData.id, boss:this.orderData.bossNick, type: 2, isArbitration: 1, canHelp: this.orderData.canHelp}
        })
      },
      _cancelOrder() { // 取消仲裁
        const id = this.orderData.id
        cancel(id).then((res) => {
          if (res.data.status === 'success') {
            this.toastD(this.$t('theOrderDetails.text19'))
            this.$router.push('/complaint')
          } else {
            this.toastD(res.data.msg)
          }
        })
      },
      openCancel() { // 确认取消弹窗
        this.$refs.cancel.showModel()
      },
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      /*3.3 提现订单详情
      接口URL: http://boss.pigamegroup.com/draw/queryOrderDetail*/
      lineItemFn () {
        this.$fetch.post(`${this.$api2}draw/queryOrderDetail`,{orderId:this.detailsdId}).then((res) => {
          if (res.status === 'success') {
            this.orderData = res.data
            this.appealId = res.data.id // 提现订单id
            this.lastStatus = res.data.stepList[res.data.stepList.length - 1].status
            this.stepData = []
            this.stepData = this.stepData.concat(res.data.stepList)
            this.stepData.splice(this.stepData.length - 1, 1)
          }
        })
      },
      /*3.5 提现取消订单
      接口URL: http://boss.pigamegroup.com/draw/cancelOrder*/
      cancelOrder () {
        Dialog({
          title: this.$t('theOrderDetails.text20'),
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`${this.$api2}draw/cancelOrder`, {
              id: this.detailsdId,
            }).then(res => {
              if (res.status === 'success') {
                this.lineItemFn()
                this.toastD(this.$t('theOrderDetails.text21') + this.orderData.id)
              } else {
                Dialog({
                  title: res.msg,
                  content: res.msg
                })
              }
            })
          }
        })
      },
      /*共享者拒绝接单*/
      cancelOrderSharer () {
        Dialog({
          title: this.$t('theOrderDetails.text20'),
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`${this.$api2}draw/confirmByStep`, {
              orderId: this.detailsdId,
              confirmState: '4',
            }).then(res => {
              if (res.status === 'success') {
                this.lineItemFn()
                this.toastD(this.$t('theOrderDetails.text21') + this.orderData.id)
              } else {
                Dialog({
                  title: res.msg,
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
            title: this.$t('digitalTradeOrder.text11'),
            type: 'confirm',
            okText: this.$t('digitalTradeOrder.text10'),
            okFn: () => {
              this.$router.push('/notGoogle')  // 去开启谷歌验证
            }
          })
        } else if (this.userData.openGoogleCode === 2) {
          // this.googleShow = false  // 进行谷歌验证
          this.payDialogShow = true
        }
      },
      // 谷歌验证成功后，去支付保证金弹窗
      succeed () {
        if (this.userData.openGoogleCode === 2) {
          this.payDialogShow = true // 支付保证金弹窗
        }
      },
      // 取消谷歌验证
      cancelDialog () {
        this.googleShow = false
      },
      // 取消支付保证金弹窗
      closePayDialog () {
        this.payDialogShow = false
      },
      // 支付保证金--确认
      okCallback () {
        this.errInputMsg = ''
        if (this.safeCode === '') {
          this.errInputMsg = this.$t('withdrawDeposit.text16')
        }
        if (this.payCode === '') {
          this.errInputMsg = this.$t('withdrawDeposit.text17')
        }
        if (this.safeCode !== '' && this.payCode !== '') {
          this.$fetch.post(`${this.$api2}pay/payOrder`,{
            id: this.orderData.cashPaymentOrder.payId,
            tradePwd: this.safeCode,
            mobileCode: this.payCode
          }).then((res) => {
            if (res.status === 'success'){
              this.lineItemFn()
              this.payDialogShow = false
              this.toastD(this.$t('theOrderDetails.text22'))
              this.$router.go(0)
              this.gotoShare()
            } else {
              this.errInputMsg = res.msg
            }
          })
        }
      },
      // 跳转到 提现 选择共享者
      gotoShare () {
        this.$router.push({
          path: '/topUp/chooseShare',
          query: {
            orderId: this.$route.query.detailsdId,
            isChongzhi: 1,
            fal: '1'
          }
        })
      },
      // 提现老板确认接单
      confirmTheOrder () {
        Dialog({
          //title: '确认接单',
          title: this.orderData.confirmTip,
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`${this.$api2}draw/confirmByStep`, {
              orderId: this.detailsdId,
              confirmState: '1' //  3(老板)确认接单
            }).then(res => {
              if (res.status === 'success') {
                this.lineItemFn()
                this.$router.go(0)
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
      // 我已打款确认
      haveMoney() {
        Dialog({
          //title: '确认接单',
          title: this.orderData.confirmTip,
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`${this.$api2}draw/confirmByStep`, {
              orderId: this.detailsdId,
              confirmState: '2' //  2:(老板)确认打款
            }).then(res => {
              if (res.status === 'success') {
                this.lineItemFn()
                //this.$router.go(0)
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
      // 提现用户确认收款
      comfimShouKuan () {
        Dialog({
          //title: '确定收款',
          title: this.orderData.confirmTip,
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`${this.$api2}draw/confirmByStep`, {
              orderId: this.detailsdId,
              confirmState: '3' //  3(用户)确认收款
            }).then(res => {
              if (res.status === 'success') {
                this.lineItemFn()
                this.$router.go(0)
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
      /*申述*/
      appeal () {
        this.$router.push({path: '/complaint', query: {id: this.appealId, isBoss: this.orderData.bossNick, type: 8}})
      },
      /*申述详情*/
      appealDetails () {
        let id = this.appealId
        this.$router.push(`/complaintOrder/${id}`)
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @activeColor: #a2f2ed;
  @butBgColor: #f0f0f0;
  @butFont: .28rem;
  @textFont: .24rem;
  @hintColor: #999;
  @textColor: #000;
  @stateColor: #b79961;
  .btn-wrapper {
    position: fixed;
    bottom: .5rem;
    z-index: 9999;
    right: .4rem;
    float: right;
    .btn {
      font-size: .28rem;
      float: left;
      width: 2rem;
      height: .8rem;
      line-height: .8rem;
      text-align: center;
      border-radius: .1rem;
    }
    .back-color {
      border: 1px solid #999;
    }
    .orange-color {
      margin-left: .4rem;
      background-color: #ffe600;
    }
  }
  .theOrderDetails-wrap {
    width: @width;
    height: @width;
    margin-top: 1.76rem;
    padding: 0 .4rem;
    .main {
      width: @width;
      .list-item{
        width: @width;
        background-color: @butBgColor;
        margin-bottom: .2rem;
        padding: .38rem .3rem .3rem;
        font-size: @textFont;
        color: @textColor;
        .info-box{
          width: @width;
          .lrs{
            div{
              display: flex;
              justify-content: space-between;
              padding-bottom: .3rem;
            }
            .order-number{
              .audit-status{
                color: @stateColor;
                text-align: right;
              }
            }
            .account-name{
              color: @hintColor;
              .audit-time{
                text-align: right;
              }
            }
          }
        }
        .hr{
          width: @width;
          height: 1px;
          border-top: 1px dashed @textColor;
        }
        .receivable-box{
          width: @width;
          display: flex;
          justify-content: space-between;
          padding-top: .3rem;
          .receivable{
            color: @textColor;
          }
          .sum{
            color: @stateColor;
          }
        }
      }
      .review-progress{
        width: @width;
        height: @width;
        font-size: @butFont;
        .schedule{
          color: @textColor;
          text-align: left;
          padding-bottom: .4rem;
          padding-top: .6rem;
        }
        .ul{
          width: @width;
          .li{
            width: @width;
            margin-bottom: .5rem;
            .icon{
              display: inline-block;
              width: .4rem;
              height: .4rem;
              border-radius: 100%;
              border: 1px dashed #bfbfbf;
              margin: 0 .3rem;
              vertical-align: middle;
            }
            .text{
              display: inline-block;
              line-height: .4rem;
              color: #999;
            }
            .icon1{
              background: url("../../assets/img/order/ok.svg") no-repeat center;
              background-size: 100% 100%;
              border: none;
            }
            .icon2{
              background: url("../../assets/img/order/underway.svg") no-repeat center;
              background-size: 100% 100%;
              border: none;
            }
          }
        }
      }
      .footer{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: @width;
        padding: 0 .4rem;
        height: 1.6rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .but{
          width: 1.8rem;
          height: .8rem;
          line-height: .8rem;
          font-size: @butFont;
          text-align: center;
          &:nth-child(3) {
             margin-left: .4rem;
          }
          &:nth-child(2){
            margin-left: .4rem;
            a{
              background-color: @activeColor;
              border: none;
            }
          }
          &:nth-child(4){
            margin-left: .4rem;
            a{
              background-color: @activeColor;
              border: none;
            }
          }
          /*&:nth-child(5){
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-left: .4rem;
          }*/
          a{
            display: block;
            width: @width;
            height: @width;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: @textColor;
            opacity: 1;
            transition: all .6s cubic-bezier(0,.67,.98,.42);
            &:active{
              opacity: .4;
            }
          }
        }
        .shengshu{
          border-radius: 4px;
          border: 1px solid @textColor;
          margin-left: 5px;
        }
        .appealDetails{
          border-radius: 4px;
          border: 1px solid @textColor;
          margin-left: 5px;
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
            transforms: translate(0, -5%)
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
          transforms: translate(0, 0);
          padding: 0 .4rem;
          .dialog-title{
            font-size: .32rem;
            font-weight: bold;
            color: #17161f;
            padding: .5rem 0 .6rem;
            text-align: center;
          }
          .money{
            font-size: .32rem;
            text-align: center;
            color: #e93a3a;
            padding-bottom: .30rem;
          }
          .g-dialog-btn-wrap{
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top: 1px dashed #000;
          }
          .forms-item{
            margin-bottom: .4rem;
            .label {
              margin-bottom: .2rem
            }
            .input{
              border-bottom: 1px solid #000;
              width: 100%;
              height: 1rem;
              color: #000;
            }
          }
          .err-ms{
            color: #ff717d;
            font-size: .24rem;
            margin-top: .3rem;
          }
          .shortMsg{
            position: relative;
            .payMsg-box{
              .payMsg {
                width: 100%;
                height: .8rem;
                background-color: #f5f6fa;
                border-radius: .4rem;
                font-size: .28rem;
                padding: 0 .3rem;
              }
              .sendMsg{
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
