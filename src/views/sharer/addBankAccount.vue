<template>
  <!--// 判断数字货币显示数字货币添加，法币显示法币页面-->
  <!--法币/addBankAccount-->
  <div class="addBankAccount-wrap">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="mian">
      <router-link :to="{path: '/addBank', query: {currency: this.currency} }" tag="div" class="addBank">
        <div class="icon"></div>
        <div class="text">{{$t('sharer.addBankAccount.text1')}}</div>
      </router-link>
      <v-loading v-show="loadingShow"></v-loading>
      <div class="emptyData" v-show="emptyData">{{noCurrency}}</div>
      <!--法币-->
      <div class="list-bank" :class="{'active': !loadingShow}" v-if="currency === 'USD' || currency === 'CNY' || currency === 'KRW' || currency === 'HKD' || currency === 'CAD'">
        <div class="item-li" @click="addBankFn(item)" v-for="(item, index) in bankList" :key="index">
          <div class="info-box">
            <div class="bank"><span class="card-bank">{{item.bankName}}</span> <span class="sub-branch">{{item.subBankName}}</span></div>
            <div class="bank-number">{{formatBankNumber(item.accountNumber)}}</div>
          </div>
        </div>
      </div>
      <!--数字货币-->
      <div class="list-bank" :class="{'active': !loadingShow}" v-if="currency !== 'USD' && currency !== 'CNY' && currency !== 'KRW' && currency !== 'HKD' && currency !== 'CAD'">
        <div class="digiccy-item-li" @click="addBankFn(item)" v-for="(item,index) in bankList" :key="index">
          <div class="info-box">
            <div class="bank-number">{{item.accountNumber}}</div>
            <div class="address">{{item.accountTag}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog'
  export default {
    data() {
      return {
        noCurrency: window.localStorage.getItem('discoveryLang') === 'CN'? '没有'+ ' ' + this.$route.query.addCurrency + ' ' + '账号信息' : 'NO' + ' ' + this.$route.query.addCurrency+ ' ' + 'account information',
        titleName: this.$route.query.addCurrency+ ' ' +this.$t('sharer.sharerSettings.text13'),
        currency: this.$route.query.addCurrency, //币种,
        accountType: '', // 银行账户类型 法币，数字货币,
        pageSize: 20,
        bankList: [], // 银行列表
        theBankAccountList: [], //共享者账户接单充值银行卡列表
        bankIdsArr: [], // 已有账户信息列表的ID,数组
        bankIds: [], // 选择添加账户信息的ID
        bankIds2: [], // 传给后台的参数
        NewbankIdsArr: [], // 已有的账户信息和添加的账户信息拼成一个数组
        newCurrencyList: [],
        loadingShow: true,
        emptyData: false,
        timer: null
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      vLoading: () => import('@/components/loading')
    },
    computed: {},
    created() {
      this.currencylassification()
      this.getAccountInformation()
    },
    mounted() {
      this.$nextTick(() => {})
    },
    methods: {
      // 提示
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      formatBankNumber (bankNumber) {
        if (bankNumber.length < 4) return '**** ****' + bankNumber
        return "**** **** "+bankNumber.substr(-4);
      },
      formatBankNumber2 (bankNumber) {
        if (bankNumber.length < 4) return '' + bankNumber
        return ""+bankNumber.substr(-4);
      },
      // 币种分类，法币，数字货币
      currencylassification() {
        //accountType	string	类型 1:银行卡 2:支付宝帐号 3:微信 6:btc 7ltc 8eth 9xrp 10 bch 11 SIE
        let currency = this.currency
        if (currency === 'USD' || currency === 'CNY' || currency === 'HKD' || currency === 'CAD' || currency === 'KRW') {
          this.accountType = 1
        } else if (currency === 'BTC') {
          this.accountType = 6
        }
        this.getBankList(1)
      },
      /*1.5 查询共享者币种设置列表
接口URL: http://boss.pigamegroup.com/pigame/queryBossSupportCurrencyList*/
      getAccountInformation () {
        this.$fetch.post(`${this.$api2}pigame/queryBossSupportCurrencyList`).then((res) => {
          if (res.status === 'success') {
            let sharerList = res.data
            this.loadingShow = false
            // "payMethod":,//1,//支付方式 1:银行卡 6:btc 7ltc 8eth 9xrp 10 bch 11 SIE
            this.newCurrencyList = sharerList  // 获取货币种类列表
            for (let i = 0; i < this.newCurrencyList.length; i++){
              if (this.newCurrencyList[i].currency === this.currency) {
                if (this.newCurrencyList[i].bossCurrency.bankAccountList) {
                  this.theBankAccountList = this.newCurrencyList[i].bossCurrency.bankAccountList // 某货币下，已有的账户银行卡信息列表
                  for (let i = 0; i < this.theBankAccountList.length; i++) {
                    if (this.theBankAccountList.length) {
                      this.bankIdsArr.push(this.theBankAccountList[i].id) //  把币种已有的的账户信息ID添加到数组里，当前货币已存在的银行账户列表
                    }
                  }
                }
              }
            }
          }
        })
      },
      // 4.2 查询银行帐户列表
      // 接口URL: http://boss.pigamegroup.com/account/list
      getBankList(page) {
        this.$fetch.post(`${this.$api2}account/list`,{
          currency: this.currency,
          country: '',
          accountType: this.accountType,
          pageIndex: page,
          pageSize: this.pageSize
        }).then((res) => {
          if (res.status === 'success') {
            clearTimeout(this.timer)
            this.timer = setTimeout(() =>{
              this.loadingShow = false
              this.bankList = res.data.list
              if (this.bankList.length <= 0 ) {
                this.emptyData = true
              }
            },850)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 选择添加账户
      addBankFn (item) {
        this.bankIds = []
        if (item){
          this.bankIds.push(item.id)
          for (let i = 0; i < this.bankIds.length; i++) {
            if (this.theBankAccountList.length > 0) {
              for (let j = 0; j < this.theBankAccountList.length; j++) {
                if (this.bankIds[i] === this.theBankAccountList[j].id) { // 如果收款账户的ID和共享设置已有的账户信息列表的ID相同
                  Dialog ({
                    title: this.$t('sharer.addBankAccount.text2')
                  })
                  return false
                } else if (this.bankIds[i] !== this.theBankAccountList[j].id) { // 添加账户列表的id不等于共享充值账户列表的id
                  this.NewbankIdsArr = Array.from(new Set(this.bankIdsArr.concat(this.bankIds))) // 已有的账户信息和添加的账户信息拼成一个数组
                  this.bankIds2 = this.NewbankIdsArr.join(',') // 将数组转换成字符串
                  if (window.localStorage.getItem('discoveryLang') === 'CN') {
                    Dialog ({
                      title: '确认添加'+ '（' + this.formatBankNumber2(item.accountNumber) + '）+' +'此账户？',
                      type: 'confirm',
                      // 确认选择此账户
                      okFn: () => {
                        this.confirmToAddBankFn(item)
                      }
                    })
                  } else {
                    Dialog ({
                      title: 'Are you sure to add '+ '（' + this.formatBankNumber2(item.accountNumber) + '）+' +'?',
                      type: 'confirm',
                      // 确认选择此账户
                      okFn: () => {
                        this.confirmToAddBankFn(item)
                      }
                    })
                  }
                }
              }
            } else {
              this.NewbankIdsArr = Array.from(new Set(this.bankIdsArr.concat(this.bankIds)))
              this.bankIds2 = this.NewbankIdsArr.join(',') // 将数组转换成字符串
              if (window.localStorage.getItem('discoveryLang') === 'CN') {
                Dialog ({
                  title: '确认添加'+ '（' + this.formatBankNumber2(item.accountNumber) + '）+' +'此账户？',
                  type: 'confirm',
                  // 确认选择此账户
                  okFn: () => {
                    this.confirmToAddBankFn(item)
                  }
                })
              } else {
                Dialog ({
                  title: 'Are you sure to add '+ '（' + this.formatBankNumber2(item.accountNumber) + '）+' +'?',       //
                  type: 'confirm',
                  // 确认选择此账户
                  okFn: () => {
                    this.confirmToAddBankFn(item)
                  }
                })
              }
            }
          }
        }
      },
      /*1.7 共享者币种币种支持充值支持的银行或虚拟币信息
      接口URL: http://boss.pigamegroup.com/pigame/bossSupprtCurrencyBank*/
      // 确认添加新账户
      confirmToAddBankFn (item) {
        this.$fetch.post(`${this.$api2}pigame/bossSupprtCurrencyBank`,{
          currency: this.currency,
          bankIds: this.bankIds2
        }).then((res) => {
          if (res.status === 'success') {
            for (let i = 0; i < this.bankList.length; i++) {
                this.theBankAccountList.push(this.bankList[i]) // 把选择的账户加到共享设置已有的账户信息列表
                //this.bankIdsArr = [] // 把已有的共享设置账户信息ID数组清空
            }
            this.getAccountInformation()
            this.getBankList()
            if (window.localStorage.getItem('discoveryLang') === 'CN') {
              Dialog ({
                title: '你已成功添加'+ '（' + this.formatBankNumber2(item.accountNumber)+ '）' +'新账户',
                type: 'alert',
                // 确认选择此账户
                okFn: () => {
                  setTimeout(() => {
                    this.$router.go(-1)
                  },600)
                }
              })
            } else {
              Dialog ({
                title: 'You\'ve already added '+ '（' + this.formatBankNumber2(item.accountNumber)+ '）' +'.',
                type: 'alert',
                // 确认选择此账户
                okFn: () => {
                  setTimeout(() => {
                    this.$router.go(-1)
                  },600)
                }
              })
            }
          } else {
            Dialog ({
              title: res.msg,
              type: 'alert',
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @titFont: .3rem;
  @butFont: .28rem;
  @textFont: .24rem;
  @textColor: #000;
  @stateColor: #b79961;
  .addBankAccount-wrap{
    width: @width;
    padding: 0 .4rem;
    margin-top: 1.76rem;
    .mian{
      width: @width;
      .addBank{
        width: @width;
        height: 1rem;
        border: 1px dashed @stateColor;
        border-radius: .04rem;
        color: @stateColor;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: .32rem;
        margin-top: .4rem;
        .icon{
          width: .24rem;
          height: .24rem;
          background: url("../../assets/img/common/add.svg") no-repeat center;
          background-size: 100% 100%;
          margin-right: .2rem;
        }
        .text{
          text-align: center;
        }
      }
      .emptyData{
        color: #e93a3a;
        font-size: 14px;
        padding-top: .8rem;
        text-align: center;
      }
      .list-bank{
        width: @width;
        margin-top: .6rem;
        opacity: 0;
        transition: all .4s cubic-bezier(0,.45,.99,.22);
        &.active{
          opacity: 1;
        }
        .item-li{
          width: @width;
          height: auto;
          border-radius: .08rem;
          margin-bottom: .3rem;
          &:nth-child(3n+1){
            background-color: #faf0f1;
          }
          &:nth-child(3n+2){
            background-color: #e6faf8;
          }
          &:nth-child(3n+3){
            background-color: #eaf2f9;
          }
          .info-box{
            width: @width;
            padding: .4rem .3rem;
            .bank{
              padding-bottom: .2rem;
              font-size: .3rem;
              display: flex;
              justify-content: space-between;
              .card-bank{
                color: @textColor;
                text-align: left;
                font-size: .3rem;
              }
              .sub-branch{
                color: @textColor;
                text-align: right;
                font-size: .24rem;
              }
            }
            .bank-number{
              color: @textColor;
              font-size: .34rem;
              font-weight: bold;
              text-align: right;
              padding-top: .6rem;
            }
          }
        }
        .digiccy-item-li{
          width: @width;
          height: 1.6rem;
          background-color: #f7f7f7;
          border-radius: .08rem;
          margin-bottom: .3rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          -webkit-user-select: none;
          user-select: none;
          .info-box{
            padding: .5rem .3rem;
            .bank-number{
              font-size: .28rem;
              color: #000;
              padding-bottom: .2rem;
            }
            .address{
              font-size: .24rem;
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
