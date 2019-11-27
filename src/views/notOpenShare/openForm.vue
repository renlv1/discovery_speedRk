<template>
  <div class="v-content-wrapper">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="form-list">
      <div class="part-one">
        <div class="v-title">{{$t('sharePeople.ApplicationForm.text1')}}</div>
        <div class="flex-row"><span>{{$t('sharePeople.ApplicationForm.text2')}}</span><input :placeholder="$t('sharePeople.ApplicationForm.tips.text1')" class="v-placeholder-text" v-model="name"/></div>
        <div class="flex-row"><span>{{$t('sharePeople.ApplicationForm.text3')}}</span><input :placeholder="$t('sharePeople.ApplicationForm.tips.text2')" class="v-placeholder-text" v-model="addressDetail"/></div>
        <div class="flex-row" @click="chooseArea">
          <span>{{$t('sharePeople.ApplicationForm.text4')}}</span>
          <span class="area-code">
          <span>{{areaCode}}</span>
          <img src="./images/row.svg" />
        </span>
        </div>
        <div class="flex-row"><span>{{$t('sharePeople.ApplicationForm.text5')}}</span><input :placeholder="$t('sharePeople.ApplicationForm.tips.text3')" class="v-placeholder-text" v-model="phoneNumber"/></div>
        <div class="flex-row"><span>{{$t('sharePeople.ApplicationForm.text6')}}</span><input :placeholder="$t('sharePeople.ApplicationForm.tips.text4')" class="v-placeholder-text" v-model="guarantor"/></div>
      </div>
      <div class="part-two">
        <div class="v-title">{{$t('sharePeople.ApplicationForm.text7')}}</div>
        <div class="flex-row">
          <span>{{$t('sharePeople.ApplicationForm.text8')}}</span>
          <span class="ipt-box">
            <input :placeholder="$t('sharePeople.ApplicationForm.text10')" class="v-placeholder-text" v-model="topUpFee"/>
            <span class="util">%</span>
          </span>
        </div>
        <div class="flex-row">
          <span>{{$t('sharePeople.ApplicationForm.text9')}}</span>
          <span class="ipt-box">
            <input :placeholder="$t('sharePeople.ApplicationForm.text10')" class="v-placeholder-text" v-model="withdrawalFee"/>
            <span class="util">%</span>
          </span>
        </div>
      </div>
      <div class="part-three">
        <div class="v-title">{{$t('sharePeople.ApplicationForm.text11')}}</div>
        <div class="flex-row" @click="chooseContact">
          <span>{{$t('sharePeople.ApplicationForm.text12')}}</span>
          <span class="area-code">
          <span>{{accountType}}</span>
          <img src="./images/row.svg" />
        </span>
        </div>
        <div class="flex-row"><span>{{$t('sharePeople.ApplicationForm.text13')}}</span><input v-model="account" :placeholder="$t('sharePeople.ApplicationForm.tips.text5')" class="v-placeholder-text" /></div>
      </div>
    </div>
    <div class="btn" v-waves @click="register">{{$t('sharePeople.ApplicationForm.text14')}}</div>
    <commonPopup class="popup-ref" ref="CustomPopupRef">
      <div slot="PoperContent" class="PoperContentView">
        <ul class="contact-list">
          <li class="item" v-for="item in contactList" :key="item.index" @click="chooseType(item)">
            {{item}}
          </li>
        </ul>
        <div class="cancel" @click="cancel">{{$t('sharePeople.ApplicationForm.text15')}}</div>
      </div>
    </commonPopup>
    <!--支付验证-->
    <transition name="safeDialog">
      <div class="dialog-w dialog-safe-w" v-show="payDialogShow">
        <div class="dialog-safe">
          <div class="close">
            <div class="close-icon"></div>
          </div>
          <div class="pay-title">{{$t('sharePeople.ApplicationForm.text16')}} <span style="color: red">{{amount}}π</span></div>
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

    <!-- 弹窗 -->
    <confirm :confirmModalOptions="confirmCancelOptions" ref="toBindDia"></confirm>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import waves from '@/dircetive/waves/waves' // 水波纹指令
import {getPigameInfo, registerBoss} from '../../api/complaint'
import commonPopup from '../../components/Popup'
import confirm from '@/components/VDialog/VDialog'
import {mapGetters} from 'vuex'

export default {
  components: {mFixedTop, commonPopup, confirm},
  directives: {waves},
  computed: {
    ...mapGetters([
      'address'
    ])
  },
  data() {
    return {
      amount: '',
      safeCode: '',
      payCode: '',
      errInputMsg: '',
      canPayBoolean: Boolean,
      canPay: Boolean,
      payDialogShow: false,
      titleName: this.$t('sharePeople.ApplicationForm.title'),
      areaCode: this.$route.query.areaCode || '+86',
      accountType: '',
      contactList: [],
      contactWay: [],
      tradePwd: '',
      name: '', // 姓名
      addressDetail: '', // 详细地址
      phoneNumber: '', // 电话号码
      guarantor: '', // 担保人
      topUpFee: '', // 充值费率
      withdrawalFee: '', // 提现费率
      account: '',
      detailObj: '',
      reapplyStatus: this.$route.query.reapplyStatus, // 重新编辑申请共享者状态
      confirmCancelOptions: {
        title: "",
        message: this.$t('sharePeople.ApplicationForm.text17'),//提示
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
  created() {
    let status = this.$store.state.shareStatus
    if (status === -1) { // 判断是否是共享者
      this.contactList = ['qq', 'wechat', 'facebook', 'skype', 'twitter', 'whatsapp', 'line']
      this.contactWay = this.contactList
      this.accountType = 'qq'
    } else {
      this._getPigameInfo()
    }
    this.name = this.$store.state.shareName
    this.addressDetail = this.$store.state.shareAdderss
    this.phoneNumber = this.$store.state.sharePhoneNumber
    this.guarantor = this.$store.state.shareGuarantor
    this.topUpFee = this.$store.state.shareRechargeFree
    this.withdrawalFee = this.$store.state.shareWithdrawFree
    this.accountType = this.$store.state.shareAccountType
    this.account = this.$store.state.shareAccount
  },
  mounted () {
    this.$nextTick(() => {
      // console.log(this.address)
      // 根据审核失败状态,获取共享者信息,重新渲染数据，编辑，审核失败，二次申请共享者
      if (this.reapplyStatus) {
        this.$fetch.post(`${this.$api}pigame/queryByAddress?address=${this.address}`).then((res) => {
          if (res.status === 'success') {
            this.detailObj = res.data
            this.amount = res.data.cashPaymentOrder.amount
            this.name = res.data.realname
            this.areaCode = res.data.phoneCode
            this.phoneNumber = res.data.phoneNumber
            this.addressDetail = res.data.contactAddress
            this.topUpFee = res.data.depositRate  // 充值费率
            this.withdrawalFee = res.data.drawRate // 提现费率
            this.guarantor = res.data.referenceUsername || ''
            this.contactWay = res.data.contactWay
            let obj = JSON.parse(this.contactWay)
            for (let key in obj) {
              // console.log(key, obj[key])
              this.accountType = key
              this.account = obj[key]
            }
          }
        })
      }
    })
  },
  methods: {
    toBind() { // 去绑定邮箱
      this.$router.push('/safeSetting')
    },
    goPath() {
      if (this.$store.state.shareStatus !== -1) {
        this.$router.push('/auditSharer')
      } else {
        this.$router.push('/notOpenShare/notOpenShare')
      }
    },
    closePayDialog () {
      this.payDialogShow = false
      this.$router.push('/menu')
    },
    cancel() {
      this.$refs.CustomPopupRef.maskClick()
    },
    chooseContact() {
      this.$refs.CustomPopupRef.showCustom()
    },
    chooseType(value) {
      this.accountType = value
      this.cancel()
    },
    chooseArea() {
      this.$store.commit('SET_SHARE_NAME', this.name)
      this.$store.commit('SET_SHARE_ADDRESS', this.addressDetail)
      this.$store.commit('SET_SHARE_PHONE_NUMBER', this.phoneNumber)
      this.$store.commit('SET_SHARE_GUARANTOR', this.guarantor)
      this.$store.commit('SET_SHARE_RECHARGE_FREE', this.topUpFee)
      this.$store.commit('SET_SHARE_WITHDRAW_FREE', this.withdrawalFee)
      this.$store.commit('SET_SHARE_ACCOUNT_TYPE', this.accountType)
      this.$store.commit('SET_SHARE_ACCOUNT', this.account)
      this.$router.push('/notOpenShare/selectArea')
    },
    register() {
      let source
      let status = this.$store.state.shareStatus
      if (status === -1) {
        source = 1
      } else {
        source = 2
      }
      if (this.areaCode !== '' && this.accountType !== '' &&
          this.name !== '' && this.addressDetail !== '' &&
          this.phoneNumber !== '' && this.guarantor !== '' &&
          this.topUpFee !== '' && this.withdrawalFee !== '' && this.account !== '')
      {
        registerBoss(this.name, this.areaCode, this.phoneNumber, this.addressDetail, this.topUpFee, this.withdrawalFee, this.accountType, this.account , this.guarantor, source).then((res) => {
          if (res.data.status === 'success') {
            if (this.canPayBoolean) {
              this.$router.push('/auditSharer') // 支付成功后跳转到共享者审核页面
            } else {
              if (this.$store.state.googleCode === 2) {
                this._getPigameInfo(1)
              } else {
                this.$refs.toBindDia.showModel()
              }
            }
           } else {
             this.toastD(res.data.msg)
           }
        })
      } else {
        this.toastD(this.$t('sharePeople.ApplicationForm.tips.text6'))
      }
    },

    toPay() {
      this.errInputMsg = ''
      this.payDialogShow = true
    },

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
            this.$router.push('/auditSharer') // 支付成功后跳转到共享者审核页面
          } else {
            this.errInputMsg = re.msg
          }
        })
      }
    },

    _getPigameInfo(num) {
      const address = this.address
      getPigameInfo(address).then((res) => {
        if (res.data.status === 'success') {
          this.amount = res.data.data.cashPaymentOrder.amount
          this.canPayBoolean = res.data.data.cashPaymentOrder.orderState === 2
          this.canPay = res.data.data.cashPaymentOrder.orderState === 1 && res.data.data.status === 0 && this.$store.state.googleCode === 2
          this.contactList = ['qq', 'wechat', 'facebook', 'skype', 'twitter', 'whatsapp', 'line']
          this.contactWay = this.contactList
          if (num && this.canPay) {
            this.toPay()
          }
        } else {
          this.toastD(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
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
  .form-list
    .part-one, .part-two, .part-three
      .v-title
        margin-bottom .2rem
      .flex-row
        padding-top .2rem
        height 1rem
        line-height .8rem
        display flex
        justify-content space-between
        white-space nowrap
        font-size .3rem
        border-1px-bottom(#e6e6e6)
        .ipt-box
          flex 1
          text-align right
          .util
            margin-left .2rem
        input
          flex 1
          text-align right
        .area-code
          font-size 0
          display flex
          flex-direction row
          align-items center
          justify-content flex-end
          span
            color #b79961
            font-size .3rem
          img
            width .3rem
            height .3rem
    .part-two, .part-three
      margin .6rem 0 .4rem

  .btn
    margin-top .8rem
    font-size .3rem
    height .8rem
    line-height .8rem
    text-align center
    border 1px solid #b79961
    color #b79961

  .popup-ref
    .PoperContentView
      padding-bottom 10px
      font-size .3rem
      .contact-list
        background-color #fff
        margin-bottom .2rem
        border 1px solid #000
        border-radius 4px
        box-shadow 0 0 2px #fff
        .item
          margin 0 .35rem
          height 1rem
          line-height 1rem
          border-bottom 1px dotted #000
          &:last-child
            border-bottom none
      .cancel
        height 1rem
        line-height 1rem
        background-color #fff
        border 1px solid #000
        border-radius 4px
</style>
