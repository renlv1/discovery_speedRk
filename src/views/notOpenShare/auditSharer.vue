<template>
  <div class="auditSharer-wrap">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
    <div class="main">
      <div class="content-box">
        <!--审核中-->
        <div class="in-review" v-show="informationShow">
          <div class="img"><img src="../../views/notOpenShare/images/underway.svg" alt=""></div>
          <div class="audit">{{username}} {{$t('auditSharer.text6')}}</div>
          <div class="explain">{{$t('auditSharer.text7')}}</div>
        </div>
        <!--审核失败-->
        <div class="audit-failure" v-show="noSharerShow">
          <div class="img"><img src="../../views/notOpenShare/images/audit-failure.svg" alt=""></div>
          <div class="audit failure">{{username}} {{$t('auditSharer.text8')}}</div>
          <div class="explain">{{causeOfFailure}}</div>
          <div class="but" v-waves @click="reapply">{{$t('auditSharer.text9')}}</div>
        </div>
      </div>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <!--支付验证-->
      <transition name="safeDialog">
        <div class="dialog-w dialog-safe-w" v-show="payDialogShow">

          <div class="dialog-safe">
            <div class="close">
              <div class="close-icon"></div>
            </div>
            <div class="pay-title">{{$t('auditSharer.text1')}} <span style="color: red">{{amount}}π</span></div>
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

      <!-- 弹窗 -->
      <confirm :confirmModalOptions="confirmCancelOptions" ref="toBindDia"></confirm>
    </div>
  </div>
</template>

<script>
  import waves from '@/dircetive/waves/waves' // 水波纹指令
  import confirm from '@/components/VDialog/VDialog'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        isGoBack: true,
        amount: '',
        safeCode: '',
        payCode: '',
        username: '',
        errInputMsg: '',
        payDialogShow: false,
        titleName: this.$t('sharer.sharerFooter.text2'),
        status: '',   // "status":0,// 状态 0--待审核 1--审核通过  2--暂停服务  3--审核被拒绝  4--被封禁(终止服务),
        isShow: true,
        causeOfFailure: '', // 审核失败提示
        noSharerShow: false, // 审核失败
        informationShow: false, // 审核个人信息中
        detailObj: '',
        confirmCancelOptions: {
          title: "",
          message: this.$t('auditSharer.text2'), //提示
          confirmCancel: () => {
            this.$refs.toBindDia.closeModel();
            this.$router.push('/menu')
          },
          confirmSubmit: () => { // 确定操作
            this.toBind()
            this.$refs.toBindDia.closeModel()
          },
        },
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      confirm
    },
    directives: {waves},
    created() {
      this.$store.dispatch('getUserBalance')
      this.reviewDetails()
    },
    mounted() {
      if (this.$route.query.formApp) { // 隐藏从iOS客户端进入H5后首页的返回icon
        this.isGoBack = false
      }
    },
    methods: {
      reviewDetails () {
        // 得到共享者信息
        this.$fetch.post(`${this.$api}pigame/queryByAddress?address=${this.userData.address}`).then((res) => {
          if (res.status === 'success') {
            this.detailObj = res.data
            this.username = res.data.username
            this.amount = res.data.cashPaymentOrder.amount
            this.status = res.data.status
            if (this.detailObj.cashPaymentOrder.orderState === 1 && this.detailObj.status === 0 && this.$store.state.googleCode === 2) {
              this.payDialogShow = true
            }
            if (this.$store.state.googleCode !== 2 && this.status === 0) {
              this.$refs.toBindDia.showModel()
            }
            setTimeout(() => {
              this.isShow = false
              if (this.status === 0) { // 审核中
                this.informationShow = true
              } else if (this.status === 1) { // 审核通过
                this.$router.push('/sharer')
              } else {
                this.noSharerShow = true
                if (this.status === 2) { //暂停服务
                  this.causeOfFailure = this.$t('auditSharer.text3')
                } else if (this.status === 3) { // 审核被拒绝
                  this.causeOfFailure = this.$t('auditSharer.text4')
                } else if (this.status === 4) { // 被封禁(终止服务)
                  this.causeOfFailure = this.$t('auditSharer.text5')
                }
              }
            }, 400)
          }
        })
      },
      toBind() { // 去绑定邮箱
        this.$router.push('/safeSetting')
      },
      goPath() {
        this.$router.push('/menu')
      },
      closePayDialog () {
        this.payDialogShow = false
        this.$router.push('/menu')
      },
      okCallback () {
        if (this.safeCode === '') {
          this.errInputMsg =  this.$t('withdrawDeposit.text16')
        }
        if (this.payCode === '') {
          this.errInputMsg = this.$t('withdrawDeposit.text17')
        }
        if (this.safeCode !== '' && this.payCode !== '') {
          this.$fetch.post(`${this.$api}pay/payOrder`,{
            id: this.detailObj.cashPaymentOrder.payId,
            tradePwd: this.safeCode,  // 支付密码（选填）
            mobileCode: this.payCode  // 手机验证码 （选填） 邮箱
          }).then((re) => {
            if (re.status === 'success') {
              this.payDialogShow = false
              this.$router.push('/auditSharer') // 支付成功后跳转到共享者审核页面
            } else {
              this.errInputMsg = re.msg
            }
          })
        }
      },
      // 审核失败，重新申请共享者
      reapply () {
        setTimeout (() => {
          this.$store.commit('SET_SHARE_NAME', '')
          this.$store.commit('SET_SHARE_ADDRESS', '')
          this.$router.push({path: '/notOpenShare/apply', query: {reapplyStatus: this.status}})
        },600)
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
      width: 6.3rem;
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
        text-align: left;
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
  .auditSharer-wrap{
    width: 100%;
    padding: 0 20px;
    margin-top: 1.76rem;
    .main{
      width: 100%;
      height: calc(100vh - 1.76rem);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      .content-box{
        width: 100%;
        .img{
          width: 1.7rem;
          height: 1.8rem;
          margin: 0 auto;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .audit{
          padding: 1rem 0 .3rem;
          font-size: .32rem;
          font-weight: bold;
        }
        .failure{
          color: #ff717d;
          font-weight: bold;
        }
        .explain{
          font-size: .28rem;
          line-height: 1.5;
        }
        .but{
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          background-color: #d9f1ff;
          font-size: .3rem;
          color: #000;
          margin-top: 1.2rem;
        }
      }
    }
  }
</style>
