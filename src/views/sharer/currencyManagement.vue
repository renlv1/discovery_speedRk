<template>
  <div class="sharerSettings-wrap">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="mian">
      <div class="order-management-box">
        <div class="order-management"><h4>{{$t('sharer.currencyManagement.text7')}}</h4></div>
        <v-loading v-show="loadingShow1"></v-loading>
        <div class="emptyData" v-show="emptyData">{{errMsg}}</div>
        <div class="ul-box" :class="{'active': !loadingShow1}">
          <div class="li-box" @click="currencyReceivingFn(item)" v-for="(item,index) in legalTenderDatas" :key="index"><div class="info-tit currency-management">{{item.currency}}</div>
            <div class="inoc">
              <!--"supportDepositAndDrawFlag":1,//支持充值或提现标识 1未支持 2支付充值 3支付提现 4支付充值与提现-->
              <span class="text" v-if="item.bossCurrency.supportDeposit === 0 && item.bossCurrency.supportDraw === 0 || item.bossCurrency.supportDeposit === null && item.bossCurrency.supportDraw === null">{{$t('sharer.currencyManagement.text2')}}</span>
              <span class="text" v-else-if="item.bossCurrency.supportDeposit === 1 && item.bossCurrency.supportDraw === 0">{{$t('sharer.currencyManagement.text3')}}</span>
              <span class="text" v-else-if="item.bossCurrency.supportDeposit === 0 && item.bossCurrency.supportDraw === 1">{{$t('sharer.currencyManagement.text4')}}</span>
              <span class="text" v-else-if="item.bossCurrency.supportDeposit === 1 && item.bossCurrency.supportDraw === 1">{{$t('sharer.currencyManagement.text5')}}</span>
              <img src="../../assets/img/common/goTo-path.svg" alt="">
            </div>
          </div>
        </div>
        <div class="order-management"><h4>{{$t('sharer.currencyManagement.text6')}}</h4></div>
        <v-loading v-show="loadingShow2"></v-loading>
        <div class="ul-box" :class="{'active': !loadingShow2}">
          <div @click="currencyReceivingFn(item)" class="li-box" v-for="(item,i) in digiccyDatas" :key="i.index">
            <div class="info-tit currency-management">{{item.currency}}</div>
            <div class="inoc">
              <span class="text" v-if="item.bossCurrency.supportDeposit === 0 && item.bossCurrency.supportDraw === 0 || item.bossCurrency.supportDeposit === null && item.bossCurrency.supportDraw === null">{{$t('sharer.currencyManagement.text2')}}</span>
              <span class="text" v-else-if="item.bossCurrency.supportDeposit === 1 && item.bossCurrency.supportDraw === 0">{{$t('sharer.currencyManagement.text3')}}</span>
              <span class="text" v-else-if="item.bossCurrency.supportDeposit === 0 && item.bossCurrency.supportDraw === 1">{{$t('sharer.currencyManagement.text4')}}</span>
              <span class="text" v-else-if="item.bossCurrency.supportDeposit === 1 && item.bossCurrency.supportDraw === 1">{{$t('sharer.currencyManagement.text5')}}</span>
              <img src="../../assets/img/common/goTo-path.svg" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        titleName: this.$t('sharer.currencyManagement.title'),
        currencyList: [],
        legalTenderList: [], // 法币列表
        supportType: '',
        itemType: '',
        depositFlag: this.$store.state.takeOrderDeposit, // 充值开关 0不支持 1支持
        drawFlag: this.$store.state.drawFlag, // 体现开关 0不支持 1支持
        currency: '', // 币种
        legalTenderDatas : [],
        digiccyDatas: [],
        loadingShow1: true,
        loadingShow2: true,
        emptyData: false,
        errMsg: ''
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      vLoading: () => import('@/components/loading'),
    },
    computed: {
    },
    created() {
      this.getCurrencyList()
    },
    mounted() {},
    methods: {
      // 1.5 查询共享者币种设置列表
      // 接口URL: http://boss.pigamegroup.com/pigame/queryBossSupportCurrencyList
      getCurrencyList() {
        let url = `${this.$api}pigame/queryBossSupportCurrencyList`
        this.$fetch.post(url).then((res) => {
          if (res.status === 'success') {
            this.currencyList = res.data
            let newList = []
            let newList2 = []
            if (this.currencyList.length > 0) {
              newList = this.currencyList.filter(function(item) {
                if (item.currency === 'USD' || item.currency === 'CNY' ||item.currency === 'HKD' || item.currency === 'CAD' || item.currency === 'KRW'){
                  return String(item.currency).indexOf(item.currency) > -1;
                }
              })
              newList2 = this.currencyList.filter(function(item) {
                if (item.currency !== 'USD' && item.currency !== 'CNY' && item.currency !== 'HKD' && item.currency !== 'CAD' && item.currency !== 'KRW'){
                  return String(item.currency).indexOf(item.currency) > -1;
                }
              })
            }
            this.legalTenderDatas = newList
            this.digiccyDatas = newList2

            if (this.legalTenderDatas) {
              this.loadingShow1 = false
            }
            if (this.digiccyDatas) {
              this.loadingShow2 = false
            }
          } else {
            this.loadingShow1 = false
            this.loadingShow2 = false
            this.emptyData = true
            this.errMsg = res.msg
          }
        })
      },
      currencyReceivingFn (item) {
        this.$router.push({path: '/orderReceiving',query:{indexCurrency:item.currency, depositFlag: item.bossCurrency.supportDeposit, drawFlag: item.bossCurrency.supportDraw}})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @activeColor: #a2f2ed;
  @butBgColor: #f0f0f0;
  @titFont: .3rem;
  @butFont: .28rem;
  @textFont: .24rem;
  @hintColor: #999;
  @textColor: #000;
  @stateColor: #b79961;
  .sharerSettings-wrap{
    width: @width;
    padding: 0 .4rem;
    margin-top: 1.76rem;
    .mian{
      width: @width;
      padding-bottom: 20px;
      .order-management-box{
        width: @width;
        .order-management{
          padding-top: .6rem;
          padding-bottom: .4rem;
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
            width: 1.34rem;
            height: .1rem;
            background-color: #ffe941;
            border-radius: .1rem;
            z-index: 1;
          }
        }
        .emptyData{
          color: #e93a3a;
          font-size: 14px;
          padding-top: .8rem;
          text-align: center;
        }
        .ul-box{
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: all .4s cubic-bezier(0,.45,.99,.22);
          &.active{
            opacity: 1;
          }
          .li-box{
            width: @width;
            height: 1rem;
            border-bottom: 1px solid #e6e6e6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: .2rem;
            .info-tit{
              font-size: @titFont;
              color: @textColor;
            }
            .inoc{
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: @titFont;
              .text{
                padding-right: .1rem
              }
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
        }
        /deep/ .load-more-box{
          margin-top: 0;
          padding: 50px 0;
          .loading-img{
            width: .6rem;
            height: .6rem;
          }
        }
      }
    }
  }
</style>
