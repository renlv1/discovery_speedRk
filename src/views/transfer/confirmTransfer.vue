<template>
    <div class="transfer">
      <app-header :titleName="titleName"></app-header>
      <div class="main-b">
        <div class="user-info" v-if="dataInfo.type !== 1">
          <div class="user-img">
            <img :src="avatar + dataInfo.address" :onerror="defaultImg">
          </div>
          <div class="user-box">
            <div class="user-nick">{{dataInfo.nick}}</div>
            <div class="user-name">{{username}}</div>
          </div>
        </div>
        <div class="user-address" v-else>
          <div class="opposite">{{$t('transfer.text51')}}：</div>
          <div class="address">{{dataInfo.address}}</div>
        </div>
        <div class="input-email" v-show="dataInfo.flag !== 3">
          <input type="text" :placeholder="$t('transfer.text18')"  @blur="checkEmail" v-model.trim="email">
          <div class="errorMsg" v-show="errMsg2" >{{errMsg2}}</div>
        </div>
        <div class="transfer-box">
          <div class="input-email">
            <input type="text" :placeholder="$t('transfer.text19')" v-model="amount" @input="changeBuyNum('amount')">
            <div class="errorMsg" v-if="errMsg3" >{{errMsg3}}</div>
          </div>
          <div class="choose-currency" @click="changeCurrenecy()"  v-if="dataInfo.type !== 1">
            <div class="currency-box">
              <div class="change-currency">{{currency}}</div>
              <div class="sel-img"><i class="arrow-img" :class="{activeImg: activeShow}"></i></div>
            </div>
          </div>
          <div class="choose-currency" v-else>
            <div class="currency-box">
              <div class="change-currency">π</div>
            </div>
          </div>
        </div>
        <div class="type-box" v-if="dataInfo.type !== 1">
          <div class="user-balance" v-if="currencyIndex === 0">{{$t('transfer.text20')}}：{{usdBalance | fourNumber}} USD</div>
          <div class="user-balance" v-if="currencyIndex === 1">{{$t('transfer.text20')}}：{{piBalance | fourNumber}} π</div>
        </div>
        <div class="type-box" v-else>
          <div class="user-balance" >{{$t('transfer.text20')}}：{{piBalance | fourNumber}} π</div>
        </div>
        <div class="btn" @click="sureTransfer()">{{$t('transfer.text21')}}</div>
      </div>
      <slideDialog
        :merchantShow="merchantShow"
        :merchantsType="currencyType"
        @selectOne="selectOne"
        @hideDialog="hideDialog">
      </slideDialog>
<!--      支付弹窗-->
      <transition name="safeDialog">
        <div class="dialog-w dialog-safe-w" v-show="payShow">
          <div class="dialog-safe" >
            <div class="close">
              <div class="close-icon"></div>
            </div>
            <div class="dialog-title">{{$t('transfer.text22')}}</div>
            <div class="form-item">
              <input type="password" :placeholder="$t('transfer.text24')" class="input" v-model.trim="safeCode">
            </div>
            <div class="form-item">
              <input type="text" :placeholder="$t('transfer.text23')" class="input" v-model.trim="payCode">
            </div>
            <div class="err-ms" v-show="errInputMsg">{{errInputMsg}}</div>
            <div class="g-dialog-btn-wrap">
              <div class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{$t('transfer.text25')}}</div>
              <div class="comfirm g-dialog-btn" @click="okCallback">{{$t('transfer.text26')}}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  /* eslint-disable */
  import Dialog from '../../components/dialog/index'
  import appHeader from '../../components/mFixedTop'
  import slideDialog from '@/components/slideDialog'
  import {mapGetters} from 'vuex'
    export default {
        data(){
          return {
            activeShow: false,
            username: '',
            merchantShow: false,
            dataInfo: '',
            avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
            defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
            titleName: this.$t('transfer.text21'),
            email: '',
            amount: '', // 转账金额
            errMsg2: '', // 邮箱错误提示
            errMsg3: '', // 转账金额错误提示
            errMsg1: '',
            currency: 'USD',
            currencyType: [ 'USD', 'π'],
            currencyIndex: 0  ,
            serverEmail: '',
            safeCode: '',
            payCode: '',
            errInputMsg: '',
            payShow: false,
            currencyKind: '',
            pai: 'PAI',
            chooseIcon: false,
            flag: false
          }
        },
      created() {
        if(this.$route.query.dataInfo) {
          this.dataInfo = JSON.parse(this.$route.query.dataInfo)
        }
        if(this.dataInfo.flag === 1) {
          this.checkAccount(this.dataInfo.address)
        } else if (this.dataInfo.flag === 2) {
          this.checkAccount(this.dataInfo.otherAddress)
        }
      },
      methods:{
        toastD (text) {
          this.toast = this.$createToast({
            txt: text,
            time: 2000,
            type: 'txt'
          })
          this.toast.show()
        },
        cancelCallback() {
          this.safeCode = ''
          this.payCode = ''
          this.errMsg2 = ''
          this.errMsg3 = ''
          this.payShow = false
        },
        // 确定支付
        okCallback() {
          if (!this.flag) {
            this.flag = true
            this.errInputMsg = ''
            if (this.safeCode === '') {
              this.errInputMsg =  this.$t('transfer.text27')
              return
            }
            if (this.payCode === '') {
              this.errInputMsg = this.$t('transfer.text28')
              return
            }
            if(this.currencyIndex === 0) {
              this.currencyKind = 'USD'
            } else if (this.currencyIndex === 1) {
              this.currencyKind = 'PAI'
            }
            let formData = {}
            let _desAccount
            if(this.dataInfo.flag === 1) {
              _desAccount = this.dataInfo.address
            } else if (this.dataInfo.flag === 2) {
              _desAccount = this.dataInfo.otherAddress
            } else if (this.dataInfo.flag === 3) {
              _desAccount = this.dataInfo.address
            }
            formData.currency = this.currencyKind
            formData.amount = this.amount
            formData.desAccount = _desAccount
            formData.tradePwd =  this.safeCode
            formData.mobileCode =  this.payCode
            formData.codeType =  '1'
            let ajaxLang1 = ''
            if (localStorage.getItem('discoveryLang') === 'EN') {
              ajaxLang1 = 'en'
            }
            // {headers: {'pwallet-language': ajaxLang1}}
            if(_desAccount.indexOf('PIC') > -1) { // 包括
              if (this.safeCode !== '' && this.payCode !== '') {
                this.$fetch.post('/psysopen/discoveryToPaiPayMent', {
                  currency: this.pai,
                  amount: this.amount,
                  recipient_addr: _desAccount,
                  tradePwd: this.safeCode,
                  mobileCode: this.payCode,
                  codeType: '1'
                }).then(res => {
                  if (res.success === true) {
                    this.amount = ''
                    this.safeCode = ''
                    this.payCode = ''
                    this.email = ''
                    this.address = ''
                    this.payShow = false
                    Dialog({
                      title: this.$t('transfer.text29'),
                      type: 'confirm',
                    })
                  } else {
                    this.payShow = false
                    if(localStorage.getItem('discoveryLang') === 'EN') {
                      this.toastD(this.$t('transfer.text50'))
                    } else {
                      this.toastD(res.msg)
                    }
                  }
                }).catch(err => {
                  Dialog({
                    title: '',
                    content: this.$t('transfer.text30') // 网络错误
                  })
                  this.payShow = false
                  console.log(err)
                })
              }
            } else {
              if (this.safeCode !== '' && this.payCode !== '') {
                this.$fetch.post('/tx/payment', {
                  currency: this.currencyKind,
                  amount: this.amount,
                  desAccount: _desAccount,
                  tradePwd: this.safeCode,
                  mobileCode: this.payCode,
                  codeType: '1'
                }).then(res => {
                  if (res.success === true) {
                    this.amount = ''
                    this.safeCode = ''
                    this.payCode = ''
                    this.email = ''
                    this.address = ''
                    this.payShow = false
                    Dialog({
                      title: this.$t('transfer.text29'),
                      type: 'confirm',
                    })
                  } else {
                    this.payShow = false
                    if(localStorage.getItem('discoveryLang') === 'EN') {
                      this.toastD(this.$t('transfer.text50'))
                    } else {
                      this.toastD(res.msg)
                    }
                  }
                }).catch(err => {
                  Dialog({
                    title: '',
                    content: this.$t('transfer.text30') // 网络错误
                  })
                  this.payShow = false
                  console.log(err)
                })
              }
            }
          }
        },
        // 点击转账
        sureTransfer() {
          this.flag = false
          this.safeCode = ''
          this.payCode = ''
          if (this.validata()) {
            if (this.userData.openTradePassword !== 2) {
              Dialog({
                title: this.$t('transfer.text31'),
                okText: this.$t('transfer.text32'),
                type: 'confirm',
                okFn: () => {
                  this.$router.push('/safeSetting')
                }
              })
              return
            }
            if (this.userData.openGoogleCode !== 2) {
              Dialog({
                title: this.$t('transfer.text33'),
                okText: this.$t('transfer.text32'),
                type: 'confirm',
                okFn: () => {
                  this.$router.push('/notGoogle')
                }
              })
              return
            }
            this.payShow = true
          }
        },
        hideDialog() {
          this.merchantShow = false
          this.activeShow = false
        },
        selectOne(item, index) {
          this.merchantShow = !this.merchantShow
          this.activeShow = false
          this.currency = item
          this.currencyIndex = index
          this.errMsg2 = ''
          this.errMsg3 = ''
          this.email = ''
          this.amount= ''
        },
        changeCurrenecy() {
          this.merchantShow = !this.merchantShow
          this.activeShow = true
        },
        // 检查账户是否存在 http://wallet.pigamegroup.com/user/checkaccount
        checkAccount (account) {
          // let  url = `${this.$api}user/checkaccount?account=${account}&showFlag=10000`
            this.$fetch.post('/user/checkaccount',{
              account: account,
              showFlag: 10000
            }).then(res => {
              if (res.success) {
                let _res = res.data
                this.username = res.data.username
                if (_res.email) {
                  this.serverEmail = _res.email
                }
              } else {
                this.toastD(res.msg)
              }
            }).catch(err => {
              console.log(err)
            })
        },
        // 检查邮箱
        checkEmail() {
          if (this.email.trim() === '') {
            this.toastD(this.$t('transfer.text34'))
            return
          } else {
            this.errMsg2 = ''
            if(this.serverEmail === '') {
              this.toastD(this.$t('transfer.text35'))
              return
            } else if (this.email.trim() !== this.serverEmail.substring(0, 4)) {
              this.toastD(this.$t('transfer.text36'))
              return
            } else {
              this.errMsg2 = ''
            }
          }
        },
        // 控制金额
        changeBuyNum (field) {
          let val = this[field]
          if (!/^\d*\.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
            this[field] = val.substring(0, val.length - 1)
          }
          if (/^\./.test(this[field])) { // 如果是"."
            this[field] = ''
          }
          this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
        },
        validata () { // 好友转账
          if(this.dataInfo.flag !== 3) {
            if (this.email.trim() === '') {
              this.toastD(this.$t('transfer.text34'))
              return
            } else {
              this.errMsg2 = ''
              if(this.serverEmail === '') {
                this.toastD(this.$t('transfer.text35'))
                return
              } else if (this.email.trim() !== this.serverEmail.substring(0, 4)) {
                this.toastD(this.$t('transfer.text36'))
                return
              } else {
                this.errMsg2 = ''
              }
            }
          }
          if (this.amount === '' || this.amount <= 0) {
            this.toastD(this.$t('transfer.text37'))
            return false
          }
          if(this.currencyIndex === 0) {
            if(false) {
              this.toastD(this.$t('transfer.text38'))
              return false
            }
          } else if(this.currencyIndex === 1) {
            if(false) {
              this.toastD(this.$t('transfer.text38'))
              return false
            }
          }
          return true
        }
      },
      computed: {
        ...mapGetters([
          'userData',
          'account',
          'usdBalance',
          'piBalance'
        ])
      },
      components: {
        // vLoading: resolve => require(['@/components/loading.vue'], resolve),
        slideDialog,
        appHeader
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.user-info{
  height 1.6rem
  display flex
  align-items center
  .user-img{
    border-radius 4px
    width 1rem
    height 1rem
    margin-right .3rem
    img{
      display block
      width 100%
    }
  }
}
.user-address{
  color #000
  .opposite{
    font-size .34rem
  }
  .address{
    font-size .32rem
    margin .3rem 0
    word-break break-all
  }
}
.user-box{
  .user-nick{
    font-size .32rem
    color #000
    margin-bottom .16rem
  }
  .user-name{
    font-size .28rem
    color #bfbfbf
  }
}
.input-email{
  margin .8rem 0
  height 1rem
  border-bottom 1px solid #000
  position relative
  input{
    line-height 1rem
    color #000
    font-size .34rem
    width 100%
    padding-right .5rem
    &::-webkit-input-placeholder {
      color: #bfbfbf;
    }
    &:-moz-placeholder {
      color: #bfbfbf;
    }
    &::-moz-placeholder {
      color: #bfbfbf;
    }
    &:-ms-input-placeholder {
      color: #bfbfbf;
    }
  }
  .errorMsg{
    position absolute
    top 1.2rem
    color: #F75050;
    font-size .28rem
  }
}
.transfer-box{
  display flex
  height 1rem
  align-items center
  margin-bottom 1rem
  .choose-currency{
    display flex
    justify-content center
    align-items center
    margin-left .4rem
    height 100%
    width 1.6rem
    border-radius 8px
    background: #d9f1ff
    .currency-box{
      display flex
      align-items center
      justify-content center
      height 100%
      width 100%
      .change-currency{
        color #000
        font-size .3rem
      }
      .sel-img{
        display flex
        align-items center
        margin-left .1rem
        .arrow-img{
          display: inline-block;
          width: .2rem;
          height: .2rem;
          background: url("../../assets/img/transfer/down-arrow.svg") no-repeat;
          background-position: center ;
          background-size: cover!important;
          &.activeImg{
            transform: rotate(-180deg);
            margin-top .1rem
          }
        }
      }
    }
  }
}
.user-balance{
  color #b79961
  font-size .3rem
  margin-bottom 1.2rem
}
.btn{
  height 1rem
  width 100%
  border-radius 4px
  border 1px solid #b79961
  color #b79961
  font-size .32rem
  line-height 1rem
  text-align center
}
.dialog-safe-w
  display: flex
  align-items center
  justify-content center
  position: fixed
  left: 0
  top: 0
  right: 0
  bottom:0
  width: 100%
  height: 100%
  z-index: 200
  color #000
  background-color: rgba(0,0,0,.4)
  &.safeDialog-enter, &.safeDialog-leave-to
    opacity: 0;
    .dialog-safe
      transform: translate(0, -5%)
  &.safeDialog-enter-active
    transition: .3s;
    .dialog-safe
      transition: .3s
  &.safeDialog-leave-active
    transition: .1s;
    .dialog-safe
      transition: .1s
  .dialog-safe
    width: 6.9rem
    background-color: #fff
    position: relative
    border-radius 4px
    color #17161f
    font-size: .28rem;
    transform: translate(0, 0)
    padding: 0 .4rem
    .dialog-title
      font-size: .32rem
      font-weight: bold
      color #17161f
      padding: .5rem 0 .6rem
      text-align: center
    .g-dialog-btn-wrap
      margin-top 1rem
      display: flex
      align-items center
      justify-content center
      border-top: 1px dashed #000
    .form-item
      margin-bottom: .4rem
      .label
        margin-bottom: .2rem
      .input
        border-bottom 1px solid #000
        width: 100%
        height: 1rem
        /*border-radius .4rem*/
        /*background-color: #f5f6fa*/
        /*padding: 0 .3rem*/
        color #000
    .err-ms
      color: #ff717d;
      font-size .24rem
      margin-top: .3rem;
    .shortMsg
      position relative
      .payMsg-box
        .payMsg
          width 100%
          height .8rem
          background-color #f5f6fa
          border-radius .4rem
          font-size .28rem
          padding 0 .3rem
        .sendMsg
          position absolute
          top 0
          right 0
          height: 100%
          padding: 0 .2rem
          background-color transparent
          border none
          outline none
          font-size: .28rem
          color #00a6f1
    .g-dialog-btn
      text-align center
      flex 1
    .comfirm
      width: 100%
      height: 1rem
      display: flex
      align-items center
      justify-content center
      color #b79961
</style>
