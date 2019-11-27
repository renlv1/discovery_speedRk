<template>
  <div class="sharerSettings-wrap">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="main">
      <div class="order-management-box">
        <div class="catalogue">
          <div class="li-box">
            <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text2')}}</div>
            <div class="switch">
              <input class="mui-switch mui-switch-anim" type="checkbox" :class="{'active1': depositFlag === 1}" @click="changeBox(1)">
            </div>
          </div>
          <div class="li-box">
            <div class="info-tit recharge-order">{{$t('sharer.sharerSettings.text3')}}</div>
            <div class="switch">
              <input class="mui-switch mui-switch-anim" type="checkbox" :class="{'active1': drawFlag === 1}" @click="changeBox(2)">
            </div>
          </div>
          <div class="order-management"><h4>{{$t('sharer.sharerSettings.text14')}}</h4></div>
        </div>
        <v-loading v-show="loadingShow" style="margin-top: 260px;"></v-loading>
        <div class="list-bank" :class="{'active': !loadingShow}">
          <cube-scroll
            ref="cubeList"
            :options="options"
            :data="theBankAccountList"
            @pulling-up="onPullingUp">
            <div class="emptyData" v-show="emptyData">{{noCurrency}}</div>
            <div class="item-li" v-for="(item,index) in theBankAccountList" :key="index">
              <div class="info-box">
                <div class="bank"><span class="card-namber">{{item.bankName}}( {{formatBankNumber(item.accountNumber)}} )</span> <span class="remove" @click="delIndexBankFn(item,index)">{{$t('sharer.sharerSettings.text22')}}</span></div>
                <div class="bank-type">{{$t('sharer.sharerSettings.text16')}}</div>
              </div>
            </div>
          </cube-scroll>
        </div>
      </div>
    </div>
    <div @click="addBank()" class="add-bank">{{$t('sharer.sharerSettings.text17')}}</div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Dialog from '@/components/dialog'
  export default {
    data() {
      return {
        noCurrency: window.localStorage.getItem('discoveryLang') === 'CN'? '没有'+ ' ' + this.$route.query.indexCurrency + ' ' + '账号信息' : 'NO' + ' ' + this.$route.query.indexCurrency+ ' ' + 'account information',
        titleName: this.$route.query.indexCurrency + ' ' + this.$t('sharer.sharerSettings.text13'), // 币种接单
        currency: this.$route.query.indexCurrency, //币种
        depositFlag: this.$route.query.depositFlag, //充值开关 0不支持 1支持
        drawFlag: this.$route.query.drawFlag,  // 提现开关 0不支持 1支持
        takeOrderDeposit: '', // 充值开关
        takeOrderDraw: '', // 提现开关
        sharerId: '',
        emptyData: false, //没有账户银行数据
        loadingShow: true,
        theBankAccountList: [], // 获取某币种下，已有的账户银行卡信息列表
        newCurrencyList:[], // 货币种类列表，币种类型
        bankIdsArr: [], // 当前货币下已有的银行账户信息列表
        flag:'',
        delBankId: '',
        currencyIndex: '',
        accountName: '',
        bankName: '',
        accountNumber: '',
        NewbankIdsArr: [], // 已有的账户信息和添加的账户信息拼成一个数组
        bankIds: [], // // 选择添加账户信息的ID
        confirmdelMsg: '',
        confirmdelMsgdia: '',
        options: {
          pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
            threshold: 0,
            txt: {
              more: '',
              noMore: ''
            }
          }
        },
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      vLoading: () => import('@/components/loading')
    },
    computed: {
      ...mapGetters([
        'address',
        'userData'
      ])
    },
    created() {
      this.getAccountInformation() // 银行账户信息
    },
    mounted() {
      //this.$nextTick(()=> {})
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
        if (bankNumber.length < 4) return '' + bankNumber
        return ""+bankNumber.substr(-4);
      },
      // 跳新增账户页面
      addBank() {
        this.$router.push({
          path: '/addBankAccount',
          query: {
            addCurrency: this.currency,
            theBankAccountList: this.theBankAccountList,
            bankIdsArr: this.bankIdsArr // // 当前币种已有银行账户信息列表的ID
          }
        })
      },
      /*1.4 共享者打开或关闭接单开关
      接口URL: http://boss.pigamegroup.com/pigame/bossTakeOrderOpen*/
      // 充值提现接单设置switch开关
      changeBox (index) {
        if (index === 1) {
          this.depositFlag === 0 ? this.depositFlag = 1 : this.depositFlag = 0
        } else {
          this.drawFlag === 0 ? this.drawFlag = 1 : this.drawFlag = 0
        }
          let url = `${this.$api}pigame/bossSupprtCurrencyOpen?currency=${this.currency}&depositFlag=${this.depositFlag}&drawFlag=${this.drawFlag}`
          this.$http.post(url).then(res => {
            if (res.status === 'success') {
              this.getAccountInformation()
             }
          }).catch(err => {
            console.log(err)
          })
       },
      // 触发上拉加载 数据
      onPullingUp () {
        this.getAccountInformation()
      },
      /*1.5 查询共享者币种设置列表
接口URL: http://boss.pigamegroup.com/pigame/queryBossSupportCurrencyList*/
      getAccountInformation () {
        this.$fetch.post(`${this.$api}pigame/queryBossSupportCurrencyList`).then((res) => {
          if (res.status === 'success') {
            let sharerList = res.data
            this.loadingShow = false
            // "payMethod":,//1,//支付方式 1:银行卡 6:btc 7ltc 8eth 9xrp 10 bch 11 SIE
            this.newCurrencyList = sharerList  // 获取货币种类列表
            for (let i = 0; i < this.newCurrencyList.length; i++){
              if (this.newCurrencyList[i].currency === this.currency) {
                if (this.newCurrencyList[i].bossCurrency.bankAccountList === null){ // 没有数据时显示的提示
                  this.emptyData = true
                } else {
                  this.theBankAccountList = this.newCurrencyList[i].bossCurrency.bankAccountList // 某货币下，已有的账户银行卡信息列表
                  for (let i = 0; i < this.theBankAccountList.length; i++) {
                    if (this.theBankAccountList.length) {
                      this.bankIdsArr.push(this.theBankAccountList[i].id) // 把币种已有的的账户信息ID添加到数组里，当前货币已存在的银行账户列表
                    }
                  }
                }
              }
            }
          }
        })
      },
      // 选择删除index账户
      // 1.9 删除共享者支持的银行卡
      // 接口URL: http://boss.pigamegroup.com/pigame/delSupprtCurrencyBank
      delIndexBankFn (item,index) {
        this.delBankId = item.id // 删除的ID
        this.bankIds.push(item.id)
        this.currencyIndex = index
        this.bankName = item.bankName
        this.accountName = item.realName
        this.accountNumber = item.accountNumber
        this.NewbankIdsArr = Array.from(new Set(this.bankIdsArr.concat(this.bankIds))) // 已有的账户信息和添加的账户信息拼成一个数组
        this.bankIds2 = this.NewbankIdsArr.join(',') // 将数组转换成字符串
        if (window.localStorage.getItem('discoveryLang') === 'CN') {
          this.confirmdelMsg = '你确定要删除' + '（' + this.formatBankNumber(item.accountNumber) + '）' + '账户吗?'
          this.confirmdelMsgdia = '你已成功删除' + '（' + this.formatBankNumber(item.accountNumber) + '）' + '账户'
        } else {
          this.confirmdelMsg = 'Are you sure to delete' + '（' + this.formatBankNumber(item.accountNumber) + '）' + '?'
          this.confirmdelMsgdia = 'You\'ve already deleted' + '（' + this.formatBankNumber(item.accountNumber) + '）'
        }
        Dialog({
          title: this.confirmdelMsg,
          type: 'confirm',
          okFn: () => {
            this.$fetch.post(`${this.$api}pigame/delSupprtCurrencyBank`,{
              currency: this.currency,
              bankId: this.delBankId
            }).then((res) => {
              if (res.status === 'success') {
                Dialog({
                  title: this.confirmdelMsgdia,
                  type: 'alert'
                })
                this.theBankAccountList.splice(this.currencyIndex, 1)
                for (let i = 0; i < this.bankIdsArr.length; i++) { // 循环已有的账户id
                  if (this.bankIdsArr[i] === Number(this.delBankId)) {  // 删除的账户id等于已有的账户数组里，则删除当前id的账户
                    this.bankIdsArr.splice(this.currencyIndex, 1)
                  }
                }
                for (let i = 0; i < this.NewbankIdsArr.length; i++) {  // 已有的账户信息和添加的账户信息拼成的新数组，当前删除的id账户===新数组的账户id
                  if (this.NewbankIdsArr[i] === Number(this.delBankId)) {
                    this.NewbankIdsArr.splice(this.currencyIndex, 1)
                  }
                }
                if (this.theBankAccountList.length === 0) {
                  this.emptyData = true
                }
              }
            })
          }
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
  .sharerSettings-wrap{
    width: @width;
    padding: 0 .4rem;
    //margin-top: 237px;
    background-color: #fff;
    .main{
      width: @width;
      .order-management-box{
        width: @width;
        .catalogue{
          width: 100%;
          z-index: 99;
          position: fixed;
          top: 74px;
          left: 0;
          right: 0;
          padding: 0 20px;
          .li-box{
            width: @width;
            height: 50px;
            border-bottom: 1px solid #e6e6e6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            .info-tit{
              font-size: @titFont;
              color: @textColor;
            }
            .switch{
              .mui-switch{
                width: 62px;
                height: 32px;
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
                  width: 30px;
                  height: 30px;
                  position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  border-radius: .4rem;
                  border-top-left-radius: .4rem;
                  border-top-right-radius: .4rem;
                  border-bottom-left-radius: .4rem;
                  border-bottom-right-radius: .4rem;
                  background-color: #fff;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                }
                &.active1 {
                  border-color: #6fbfee;
                  box-shadow: #6fbfee 0 0 0 16px inset;
                  background-color: #6fbfee;
                }
                &.active1:before {
                  left: 32px;
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
          .order-management{
            padding-top: 30px;
            padding-bottom: 20px;
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
              width: 1.8rem;
              height: .1rem;
              background-color: #ffe941;
              border-radius: .1rem;
              z-index: 1;
            }
          }
        }
        .emptyData{
          color: #e93a3a;
          font-size: 14px;
          padding-top: .8rem;
          text-align: center;
        }
        .list-bank{
          height: calc(100vh - 260px);
          margin-top: 260px;
          width: @width;
          opacity: 0;
          transition: all .3s cubic-bezier(0,.45,.99,.22);
          &.active{
            opacity: 1;
          }
          & /deep/ .cube-scroll-wrapper{
            height: 100%;
            .cube-scroll-list-wrapper{
              min-height: calc(100vh - 260px) !important;
            }
            .cube-pulldown {
              .cube-pulldown-loaded{
                font-size: 14px;
                color: #999;
              }
            }
            .cube-pullup-wrapper{
              .before-trigger{
                font-size: 14px !important;
                color: #999 !important;
              }
            }
          }
          .item-li{
            width: @width;
            height: 1.6rem;
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
                .card-namber{
                  color: @textColor;
                  text-align: left;
                }
                .remove{
                  color: #ff717d;
                  text-align: right;
                }
              }
              .bank-type{
                color: @textColor;
                font-size: .24rem;
              }
            }
          }
        }
      }
    }
    .add-bank{
      width: @width;
      height: 1.2rem;
      background-color: #fff;
      line-height: 1.2rem;
      position: fixed;
      z-index: 99;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      border-top: 1px solid @stateColor;
      font-size: .32rem;
      color: @stateColor;
    }
  }
</style>
