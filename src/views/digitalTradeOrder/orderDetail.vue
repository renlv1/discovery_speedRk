<template>
    <div class="order-detail">
      <app-header :titleName="titleName"></app-header>
      <div class="content-b">
        <ul class="ul-list">
          <li class="li-item">
            <div class="buy-box">
              <div class="buy-c"><div class="buy-t" :class="{sale:detailsData.etype === 2}">{{orderEtype(detailsData.etype)}}</div><div class="order-no">{{$t('digitalTradeOrder.text2')}} {{detailsData.id}}</div></div>
              <div class="status">{{finishState(detailsData.state)}}</div>
            </div>
<!--            <div class="money"><span>{{detailsData.tradeAmount}} </span>/<span> {{detailsData.amount}}</span><span> {{detailsData.sellCurrency}}</span></div>-->
            <div class="price-box">
              <div class="price tradeAmount">{{$t('digitalTradeOrder.text23')}}： {{detailsData.tradeAmount}} {{detailsData.sellCurrency}}</div>
              <div class="date tradeAmount">{{$t('digitalTradeOrder.text24')}}： {{detailsData.amount}} {{detailsData.sellCurrency}}</div>
            </div>
            <div class="price-box">
              <div class="price">{{$t('digitalTradeOrder.text1')}}：{{price}} {{detailsData.buyCurrency}}</div>
              <div class="date" v-show="detailsData.createAt">{{$changeDate(detailsData.createAt,'.', 5)}}</div>
            </div>
            <div class="dotted"></div>
            <div class="sum-box">
              <div></div>
              <div class="sum"><span>{{$t('digitalTradeOrder.text3')}} </span> {{parseFloat(total).toFixed(8)}} {{detailsData.buyCurrency}}</div>
            </div>
          </li>
        </ul>
        <div class="data-box" :class="{fixedBottom: detailsData.finishState === 1}">
<!--          <cube-scroll-->
<!--            ref="scroll"-->
<!--            :options="options"-->
<!--            :data="walletList"-->
<!--            @pulling-up="onPullingDown" v-show="!emptyDatas">-->
            <ul class="ul-data" v-show="!emptyDatas">
              <li class="li-data" v-for="(item,index) in walletList" :key="index">
                <div class="sum">{{$t('digitalTradeOrder.text23')}}: {{item.tradeAmount}} {{item.sellCurrency}}</div>
                <div class="total">{{$t('digitalTradeOrder.text1')}}：{{parseFloat(item.tradePrice).toFixed(8)}} {{detailsData.buyCurrency}}</div>
              </li>
<!--              <v-loading v-show="loadingShow"></v-loading>-->
            </ul>
<!--          </cube-scroll>-->
          <div class="empty-data" v-show="emptyDatas">
            <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
            <p class="text">{{$t('digitalTradeOrder.text4')}}</p>
          </div>
        </div>
      </div>
      <div class="btn-cancel" @click="btnCancel()" v-show="detailsData.finishState === 1">{{$t('digitalTradeOrder.text5')}}</div>
      <vpay-dialog v-show="payShow" @succeed="succeed" @cancelDialog="cancelDialog"></vpay-dialog>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Dialog from '../../components/dialog/index'
  import appHeader from '../../components/mFixedTop'
  export default {
    data() {
      return{
        payShow: false,
        walletList: [],
        titleName: this.$t('theOrderDetails.title'),
        loadingShow: true,
        pageIndex: 1, // 页码
        pageSize: 20, // 页面数量,
        detailsData: '',
        moneyFixed: '',
        price: '',
        total: '',
        emptyDatas: false
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      onPullingDown () {
        this.getDetail()
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      // 充值详情
      getDetail () {
        this.$fetch.post('/coinentrust/queryCoinEntrustDetail', {
          coinEntrustId: this.$route.query.id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          if (res.success) {
            this.loadingShow = false
            this.detailsData = res.data.coinEntrust
            this.price = this.detailsData.price
            this.total = (this.detailsData.amount*this.detailsData.price)
            this.moneyFixed = res.data.coinEntrust.cashAmount.toFixed(4).split('.')
            let dataList = res.data.coinTradeList
            if(dataList.length > 0) {
              this.emptyDatas = false
              if(this.pageIndex === 1) {
                this.walletList = dataList
              } else {
                this.walletList.push(...dataList)
              }
              this.pageIndex++
            } else {
              if(this.pageIndex === 1) {
                this.walletList = []
                this.emptyDatas = true
              }
            }
          } else {
            this.loadingShow = false
            this.emptyDatas = true
            this.pageIndex = 1
            this.walletList = []
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 取消弹窗
      cancelDialog() {
        this.payShow = false
      },
      // 解锁成功返回
      succeed() {
        this.payShow = false
        this.$fetch.post('/coinentrust/coinEntrustCancel', {
          coinEntrustId:  this.$route.query.id
        }).then(res => {
          if (res.success === true) {
            this.getDetail()
            this.pageIndex = 1
            Dialog({
              title: this.$t('digitalTradeOrder.text7'),
              type: 'confirm',
            })
          } else {
            this.toastD(res.msg)
          }
        })
      },
      btnCancel() {
        Dialog({
          title: this.$t('digitalTradeOrder.text8'),
          type: 'confirm',
          okFn: () => {
            if (this.userData.openTradePassword !== 2) {
              Dialog({
                title: this.$t('digitalTradeOrder.text9'),
                okText: this.$t('digitalTradeOrder.text10'),
                type: 'confirm',
                okFn: () => {
                  this.$router.push('/safeSetting')
                }
              })
              return
            }
            if (this.userData.openGoogleCode !== 2) {
              Dialog({
                title: this.$t('digitalTradeOrder.text11'),
                okText: this.$t('digitalTradeOrder.text10'),
                type: 'confirm',
                okFn: () => {
                  this.$router.push('/notGoogle')
                }
              })
              return
            }
            this.payShow = true
          }
        })
      },
      // 1:创建订单 2: 完全成交 3:部分成交 4:部分成交,撤单完成 5:撤单 6:系统异常
      finishState(state) {
        if(state === 1) return this.$t('digitalTradeOrder.text12') // 交易中
        if(state === 2) return this.$t('digitalTradeOrder.text13') // 已成交
        if(state === 3) return this.$t('digitalTradeOrder.text14') // 部分成交
        if(state === 4) return this.$t('digitalTradeOrder.text14') // 部分成交
        if(state === 5) return this.$t('digitalTradeOrder.text15') // 已取消
        if(state === 6) return this.$t('digitalTradeOrder.text16') // 系统异常
      },
      orderEtype (status) { // 1: 买入  2:卖出
        if (status === 1) return this.$t('digitalTradeOrder.text17') // 买入
        if (status === 2) return this.$t('digitalTradeOrder.text18') // 卖出
      },
    },
    computed: {
      ...mapGetters([
        'userData',
        'account'
      ]),
      options () {
        return {
          pullUpLoad: {
            txt: {
              more: this.$t('digitalTradeOrder.text19'),
              noMore: this.$t('digitalTradeOrder.text20')
            }
          }
        }
      }
    },
    components: {
      vpayDialog: resolve => require(['@/components/payDialog'], resolve),
      appHeader
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.data-box{
  width: 100%;
  overflow: hidden;
  position: fixed;
  padding 0 .4rem
  top: 5rem;
  left: 0;
  bottom: 0;
  &.fixedBottom{
    bottom: 1rem;
  }
  .ul-data{
    .li-data{
      display flex
      justify-content space-between
      align-items center
      height 1rem
      color #000
      font-size .28rem
      border-bottom  1px solid #e6e6e6
    }
  }
}
.content-b{
  margin-top 2rem
}
.btn-cancel{
  border-top 1px solid #b79961
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  height: 1rem;
  font-size: .32rem;
  color: #b79961;
}
</style>
