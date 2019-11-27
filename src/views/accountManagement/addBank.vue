<template>
  <div class="v-page addbank-w">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
      <!--    法币账户-->
    <div class="v-content" v-if="currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW'">
      <div class="v-title require-tiitle">{{$t('bank.text7')}}</div>
      <div class="v-input-item" :class="{'focus': isFocus0 === true, 'no-text': isEmpty0 === true}" @click="focusA(0)">
        <label class="label">{{$t('bank.text8')}}</label>
        <input type="text" class="input" @focus="focusInput(0)" @blur="blurInput(0)" v-model.trim="bankName" ref="input0">
      </div>
      <div class="v-input-item" :class="{'focus': isFocus1 === true, 'no-text': isEmpty1 === true}" @click="focusA(1)">
        <label class="label">{{$t('bank.text9')}}</label>
        <input type="text" class="input" @focus="focusInput(1)" @blur="blurInput(1)" v-model.trim="accountNumber" ref="input1">
      </div>
      <div class="v-input-item" :class="{'focus': isFocus2 === true, 'no-text': isEmpty2 === true}" @click="focusA(2)">
        <label class="label">{{$t('bank.text10')}}</label>
        <input type="text" class="input" @focus="focusInput(2)" @blur="blurInput(2)" v-model.trim="realName" ref="input2">
      </div>
      <div class="v-title require-tiitle">{{$t('bank.text11')}}</div>
      <div class="v-input-item" :class="{'focus': isFocus3 === true, 'no-text': isEmpty3 === true}" @click="focusA(3)">
        <label class="label">{{$t('bank.text12')}}</label>
        <input type="text" class="input" @focus="focusInput(3)" @blur="blurInput(3)" v-model.trim="country" ref="input3">
      </div>
      <div class="v-input-item" :class="{'focus': isFocus4 === true, 'no-text': isEmpty4 === true}" @click="focusA(4)">
        <label class="label">{{$t('bank.text13')}}</label>
        <input type="text" class="input" @focus="focusInput(4)" @blur="blurInput(4)" v-model.trim="subBankName" ref="input4">
      </div>
      <div class="v-input-item" :class="{'focus': isFocus5 === true, 'no-text': isEmpty5 === true}" @click="focusA(5)">
        <label class="label">SWIFT</label>
        <input type="text" class="input" @focus="focusInput(5)" @blur="blurInput(5)" v-model.trim="swift" ref="input5">
      </div>
      <div class="v-input-item" :class="{'focus': isFocus6 === true, 'no-text': isEmpty6 === true}" @click="focusA(6)">
        <label class="label">IBAN</label>
        <input type="text" class="input" @focus="focusInput(6)" @blur="blurInput(6)" v-model.trim="iban" ref="input6">
      </div>
      <div class="btn-safe" @click="safeBank" :class="{'disable-btn': loadingBt}">{{$t('bank.text14')}}</div>
    </div>
    <!--    数字货币-->
    <div v-else>
      <div class="v-input-item" :class="{'focus': isFocus7 === true, 'no-text': isEmpty7 === true}" @click="focusA(7)">
        <label class="label">{{$t('bank.text15')}}</label>
        <input type="text" class="input" @focus="focusInput(7)" @blur="blurInput(7)" v-model.trim="vAccountNumber" ref="input7">
      </div>
      <div class="v-input-item" :class="{'focus': isFocus8 === true, 'no-text': isEmpty8 === true}" @click="focusA(8)">
        <label class="label">{{$t('bank.text16')}}</label>
        <input type="text" class="input" @focus="focusInput(8)" @blur="blurInput(8)" v-model.trim="accountTag" ref="input8">
      </div>
      <p class="tips">{{$t('bank.text17')}}</p>
      <div class="btn-safe" @click="safeBank2" :class="{'disable-btn': loadingBt}">{{$t('bank.text14')}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        loadingBt: false,
        titleName: this.$t('bank.text1'),
        isFocus: [false, false, false, false, false ,false, false],
        isEmpty: [false, false, false, false, false ,false, false],
        bankName: '',
        accountNumber: '',
        realName: '',
        country: '',
        subBankName: '',
        swift: '',
        iban: '',
        isFocus0: false,
        isFocus1: false,
        isFocus2: false,
        isFocus3: false,
        isFocus4: false,
        isFocus5: false,
        isFocus6: false,
        isFocus7: false,
        isFocus8: false,
        isEmpty0: false,
        isEmpty1: false,
        isEmpty2: false,
        isEmpty3: false,
        isEmpty4: false,
        isEmpty5: false,
        isEmpty6: false,
        isEmpty7: false,
        isEmpty8: false,
        vAccountNumber: '',
        accountTag: '',
        currency: this.$route.query.currency
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    methods: {
      // 聚焦input
      focusA (index) {
        this.$refs['input' + index].focus()
      },
      toastShow (txt) {
        let toast = this.$createToast({
          txt: txt,
          time: 1500,
          type: 'txt'
        })
        toast.show()
      },
      formValidator () {
        if (this.bankName === '') {
          this.toastShow(this.$t('bank.text18'))
          return false
        }
        if (this.accountNumber === '') {
          this.toastShow(this.$t('bank.text19'))
          return false
        }
        if (this.realName === '') {
          this.toastShow(this.$t('bank.text20'))
          return false
        }
        return true
      },
      safeBank2 () {
        if (this.vAccountNumber === '') {
          this.toastShow(this.$t('bank.text21'))
          return
        }
        this.loadingBt = true
        this.$fetch.post(`${this.$api}account/add`, {
          currency: this.currency,
          accountTag: this.accountTag,
          accountNumber: this.vAccountNumber,
          realName: this.userData.username
        }).then(res => {
          this.loadingBt = false
          if (res.status === 'success') {
            let toast = this.$createToast({
              txt: this.$t('bank.text22'),
              time: 1500,
              type: 'txt',
              onTimeout: () => {
                this.$router.go(-1)
                // this.$router.push({
                //   path: '/accountCurrency',
                //   query: {currency: this.currency}
                // })
              }
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
        }).catch(() => {
          this.loadingBt = false
        })
      },
      // 保存按钮
      safeBank () {
        if (this.formValidator()) {
          let dataObj = {
            currency: this.currency,
            accountNumber: this.accountNumber,
            bankName: this.bankName,
            realName: this.realName
          }
          if (this.country !== '') {
            dataObj.country = this.country
          }
          if (this.subBankName !== '') {
            dataObj.subBankName = this.subBankName
          }
          if (this.swift !== '') {
            dataObj.swift = this.swift
          }
          if (this.iban !== '') {
            dataObj.iban = this.iban
          }
          this.loadingBt = true
          this.$fetch.post(`${this.$api}account/add`, dataObj).then(res => {
            this.loadingBt = false
            if (res.status === 'success') {
              let toast = this.$createToast({
                txt: this.$t('bank.text22'),
                time: 1500,
                type: 'txt',
                onTimeout: () => {
                  this.$router.go(-1)
                  // this.$router.push({
                  //   path: '/accountCurrency',
                  //   query: {currency: this.currency}
                  // })
                }
              })
              toast.show()
            }
          }).catch(() => {
            this.loadingBt = false
          })
        }
      },
      // 聚焦
      focusInput (index) {
        if (index === 0) this.isFocus0 = true
        if (index === 1) this.isFocus1 = true
        if (index === 2) this.isFocus2 = true
        if (index === 3) this.isFocus3 = true
        if (index === 4) this.isFocus4 = true
        if (index === 5) this.isFocus5 = true
        if (index === 6) this.isFocus6 = true
        if (index === 7) this.isFocus7 = true
        if (index === 8) this.isFocus8 = true
      },
      // 失去焦点
      blurInput (index) {
        if (index === 0) {
          if (this.bankName === '') {
            this.isFocus0 = false
          } else {
            this.isEmpty0 = true
          }
        } else if (index === 1) {
          if (this.accountNumber === '') {
            this.isFocus1 = false
          } else {
            this.isEmpty1 = true
          }
        } else if (index === 2) {
          if (this.realName === '') {
            this.isFocus2 = false
          } else {
            this.isEmpty2 = true
          }
        } else if (index === 3) {
          if (this.country === '') {
            this.isFocus3 = false
          } else {
            this.isEmpty3 = true
          }
        } else if (index === 4) {
          if (this.subBankName === '') {
            this.isFocus4 = false
          } else {
            this.isEmpty4 = true
          }
        } else if (index ===5) {
          if (this.swift === '') {
            this.isFocus5 = false
          } else {
            this.isEmpty5 = true
          }
        } else if (index === 6) {
          if (this.iban === '') {
            this.isFocus6 = false
          } else {
            this.isEmpty6 = true
          }
        } else if (index === 7) {
          if (this.vAccountNumber === '') {
            this.isFocus7 = false
          } else {
            this.isEmpty7 = true
          }
        } else if (index === 8) {
          if (this.accountTag === '') {
            this.isFocus8 = false
          } else {
            this.isEmpty8 = true
          }
        }
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    }
  }
</script>

<style scoped lang="stylus">
  .addbank-w
    .v-title
      margin: .6rem 0 .4rem
    .require-tiitle
      margin-top: .4rem
    .v-input-item
      height: 1rem
      width: 100%
      display: flex
      align-items center
      margin-bottom: .2rem
      position: relative
      border-bottom: 1px solid #e6e6e6
      .label
        color #bfbfbf
        display: block
        word-break:keep-all;
        white-space:nowrap;
        min-width 1.6rem
        font-size: .3rem
      .input
        font-size: .3rem
        height: 100%
        display: block
        flex 1
        padding-left: .2rem
    .btn-safe
      width: 100%
      height: 1rem
      display: flex
      align-items center
      justify-content center
      border: 1px solid #b79961
      color #b79961
      font-size: .32rem
      border-radius 4px
      margin: 1.2rem 0 .4rem
      &.disable-btn
        pointer-events none
    .tips
      margin: .3rem 0 1.8rem
      line-height: 1.5
      font-size: .24rem
      color #999
</style>
