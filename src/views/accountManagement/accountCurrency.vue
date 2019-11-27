<template>
  <div class="v-page account-w">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="v-content">
      <div class="add-bank" @click="addFn">
        <img src="../../assets/img/common/add.svg" alt="">
        <span>{{$t('bank.text1')}}</span>
      </div>
      <!--    法币账户-->
      <ul class="bank-uls" v-if="currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW'">
        <li class="list" @click="showSlide(item)" v-for="(item, index) in currencyData" :key="index">
          <div class="top">
            <div class="left-t">{{item.bankName}}</div>
            <div class="right">{{item.subBankName}}</div>
          </div>
          <p class="bank-number">{{formatBankNumber(item.accountNumber)}}</p>
        </li>
      </ul>
      <!-- 数字货币 -->
      <ul class="bank-uls" v-else>
        <li class="list" @click="showSlide(item)" v-for="(item, index) in currencyData" :key="index">
          <p class="address-p">{{item.accountNumber}}</p>
          <p class="address-info">{{item.accountTag}}</p>
        </li>
      </ul>
      <div v-show="isNoBank" class="no-text">{{$t('bank.text2')}}</div>
    </div>
    <!--  弹窗选择 是否删除该银行卡 -->
    <slideDialog
      :merchantShow="merchantShow"
      :merchantsType="currencyType"
      @selectOne="selectOne"
      class="m-dialog"
      @hideDialog="hideDialog">
    </slideDialog>
    <!-- 验证谷歌   -->
    <google-verify
      v-show="googleShow"
      @cancelDialog="cancelDialog"
      @succeed="succeed"></google-verify>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Dialog from '@/components/dialog'
  export default {
    data() {
      return {
        isNoBank: false,
        bankId: '',
        googleShow: false,
        merchantShow: false,
        currencyType: [this.$t('bank.text3'), this.$t('bank.text4')],
        currencyData: [],
        currency: this.$route.query.currency,
        titleName: `${this.$route.query.currency}${this.$t('bank.text5')}`
      }
    },
    created () {
      this.getCurrencyData()
    },
    methods: {
      // 返回上一页
      goPath () {
        this.$router.push('/accountManagement')
      },
      // 银行卡脱敏后4位
      formatBankNumber (bankNumber) {
        if (bankNumber.length < 4) return '**** **** ' + bankNumber
        return "**** **** "+bankNumber.substr(-4);
      },
      // 点击显示操作按钮
      showSlide (item) {
        this.bankId = item.id
        this.merchantShow = true
      },
      // 确定删除银行卡
      selectOne (item, index) {
        if (index === 1) {
          this.merchantShow = false
        } else {
          this.$fetch.post(`${this.$api2}/account/delete`, {
            id: this.bankId
          }).then(res => {
            this.merchantShow = false
            if (res.status === 'success') {
              this.getCurrencyData()
              let toast = this.$createToast({
                txt: this.$t('bank.text6'),
                time: 1500,
                type: 'txt'
              })
              toast.show()
            } else {
              let toast = this.$createToast({
                txt: res.msg,
                time: 1500,
                type: 'txt'
              })
              toast.show()
            }
          })
        }
      },
      // 取消验证谷歌
      cancelDialog () {
        this.googleShow = false
      },
      // 成功输入谷歌  跳转到添加银行卡
      succeed () {
        this.$router.push({
          path: '/addBank',
          query: {currency: this.currency}
        })
      },
      // 隐藏操作弹窗
      hideDialog () {
        this.merchantShow = false
      },
      // 银行卡列表
      getCurrencyData () {
        this.$fetch.post(`${this.$api}account/list`, {
          currency: this.currency
        }).then(res => {
          if (res.status === 'success') {
            this.currencyData = res.data.list
            if (res.data.list.length === 0) {
              this.isNoBank = true
            } else {
              this.isNoBank = false
            }
          }
        })
      },
      // 点击添加
      addFn () {
        if (this.userData.openGoogleCode !== 2) {
          Dialog({
            title: this.$t('transfer.text33'),
            type: 'confirm',
            okText: this.$t('transfer.text32')
          })
          return
        }
        this.googleShow = true
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      googleVerify: () => import('@/components/googleVerify'),
      slideDialog: () => import('@/components/slideDialog')
    }
  }
</script>

<style scoped lang="stylus">
  .account-w
    .no-text
      text-align: center
      margin-top: 1rem
      color #999
      font-size: .3rem
    .add-bank
      width: 100%
      height: 1rem
      display: flex
      align-items center
      justify-content center
      border: 1px dashed #b79961
      border-radius 4px
      color #b79961
      font-size: .32rem
      margin-bottom: .6rem
      img
        width: .22rem
        height: .22rem
        display: block
        margin-right: .1rem
    .list
      width: 100%
      height: 1.6rem
      background-color: #fafafa
      padding: .3rem .4rem
      color #000
      font-size: .34rem
      margin-bottom: .3rem
      border-radius 4px
      display: flex
      flex-direction column
      justify-content space-between
      .address-p
        font-size: .28rem
      .address-info
        font-size: .24rem
        color #999
        margin-top: .2rem
      .top
        display: flex
        align-items center
        justify-content space-between
        width: 100%
        .left-t
          display: flex
          align-items center
          .icon
            width: .64rem
            height: .64rem
            border-radius 50%
            background-color: #000
            margin-right: .2rem
        .right
          img
            width: .3rem
            height: .3rem
            display: block
      .bank-number
        text-align: right
        font-size: .34rem
        font-weight: bold
    .m-dialog
      >>> .dialog
        background-color: rgba(255,255,255, .8)
      >>> .uls
        padding: 0
        background-color: transparent
        border none
        .list
          border: 1px solid #000
          background-color: #fff
          border-radius 4px
          color #000
          &:first-child
            color #ff717d
            margin-bottom: .2rem
          &:last-child
            border-bottom: 1px solid #000
</style>
