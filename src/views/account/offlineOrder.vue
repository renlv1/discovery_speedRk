<template>
  <div class="wrap-shopping">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="main-c">
      <div class="list">
        <ul :class="{'active': nullData}">
          <cube-scroll
            :options="options"
            ref="cubeList"
            :data="list"
            @pulling-up="onPullingUp">
            <li class="item-li" @click="getDetail(item.id)" v-for="(item,index) in list"
                :key="index">
              <div class="top">
                <div class="left">
                  <div class="shop-logo">
                    <img :src="splitLogo(item.merchantLogo)" />
                  </div>
                  <div class="shop-box">
                    <div class="shop-name">{{item.merchantName}}</div>
                    <span style="color: #999">{{$changeDate(item.createAt, '/', 5)}}</span>
                  </div>
                </div>
                <div style="color: #666" class="status-t">{{orderStatus(item.status)}}</div>
              </div>
              <div class="middle">
                <div class="left">
                  <span class="mar-right">{{$t('myPiOrder.text21')}}</span>
                  <span>{{getUserBackValue(item)}} π</span>
                </div>
<!--                订单金额-->
                <div class="right" v-if="item.userPayTotalTwo <= 0">
                  <span class="mar-right">订单金额</span>
                  <span
                    style="color: #ffb64b">{{item.orderAmount}}  {{item.currency === 'PAI' ? 'π' : item.currency}}</span>
                  <!--                  <span style="color: #ffb64b">{{item.paitotal}} {{item.acceptCurrency === 'PAI' ? 'π' : item.acceptCurrency}}</span>-->
                </div>
                <div class="right" v-else>
                  <span class="mar-right">订单金额</span>
                  <span style="color: #ffb64b">{{item.orderAmount}}  {{item.currency === 'PAI' ? 'π' : item.currency}} + {{item.userPayTotalTwo}} π</span>
                  <!--                  <span style="color: #ffb64b">{{item.paitotal}} {{item.acceptCurrency === 'PAI' ? 'π' : item.acceptCurrency}}</span>-->
                </div>
              </div>
<!--              实付金额-->
              <div class="bottom">
                <div class="left">
                  <span class="mar-right">{{$t('myPiOrder.text23')}}</span>
                  <span>{{item.id}}</span>
                </div>
                <span>实付金额 {{getTotalActualStr(item)}}</span>
              </div>
            </li>
          </cube-scroll>
        </ul>
        <div class="v-loading" v-show="loadShow">
          <cube-loading></cube-loading>
        </div>
        <div class="null" v-show="emptyShow">
          <div class="noData"><img src="../../assets/img/common/empty.png"></div>
          <div class="noText">{{emptyText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  name: "offlineOrder",
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('myPiOrder.text24'),
      list: [],
      nullData: false,
      emptyShow: false,
      emptyText: this.$t('myPiOrder.text25'),
      loadShow: true,
      pageIndex: 1,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: {
            more: '',
            noMore: ''
          }
        }
      },
      cnyRate: 0,
      paiRate: 0,
      paitocnyRate: 0,
    }
  },
  mounted() {
    this.transRateInfo()
    this.getList()
  },
  methods: {
    transRateInfo() { // 汇率转换
      this.$http.post(`${this.$api}shopMine/getRateInfo`).then((res) => {
        this.cnyRate = res.data.data.cnyRate //美金对人民币汇率
        this.paiRate = res.data.data.paiRate // 派对美金 汇率
        this.paitocnyRate = res.data.data.paitocnyRate // 派对人民币汇率
      })
    },
    getTotalActualStr(item) {
      // 双币种
      if (item.userPayTotalTwo > 0 && item.userPayTotalTwo) {
        if (item.acceptCurrency === 'USD') {
          // 接收币种为USD
          return item.userPayTotal + 'USD' + '+' + item.userPayTotalTwo + 'π'
        } else if (item.acceptCurrency === 'CNY') {
          // 接收币种为CNY
          return (item.userPayTotal * (1 / this.paitocnyRate)) + 'CNY' + '+' + item.userPayTotalTwo + 'π'
        } else {
          // 接收币种为π
          return item.userPayTotal + 'π' + '+' + item.userPayTotalTwo + 'π'
        }
      } else {
        // 单币种
        if (item.acceptCurrency) {
          if (item.acceptCurrency === 'USD') {
            return item.userPayTotal + 'USD'
          } else if (item.acceptCurrency === 'CNY') {
            return (item.userPayTotal * (1 / this.paitocnyRate)) + 'CNY'
          } else {
            return item.userPayTotal + 'π'
          }
        } else {
          if (item.currency === 'USD') {
            return item.orderAmount + 'USD'
          } else if (item.currency === 'CNY') {
            return item.orderAmount + 'CNY'
          } else {
            return item.orderAmount + 'π'
          }
        }
      }
    },
    getUserBackValue(item) {
      if (item.userPayTotalTwo && item.productProfitRate) {
        return (item.paitotal + item.userPayTotalTwo).toFixed(4)
      } else {
        return item.paitotal
      }
    },
    splitLogo(img) {
      if (img) {
        if (img.indexOf('http://ofydu65mj.bkt.clouddn.com/bossstorege') > -1) {
          let aimg = img.substr(32)
          return 'https://discoverypi.blob.core.windows.net' + aimg
        } else {
          return img
        }
      }
    },
    // 订单状态 1 待付款 2已付款 3已撤单 4 已发货 5完成 6退货中 7退货完成 8 待商家接单 9 商家已接单待发货 11 商家拒绝接单
    orderStatus(i) { //1待付款 2撤单 3已完成 4待商家接单 5商家已接单待发货 6商家拒绝接单 7运输中
      if (i === 1) return this.$t('myPiOrder.text5')
      if (i === 2) return this.$t('myPiOrder.text6')
      if (i === 3) return this.$t('myPiOrder.text7')
      if (i === 4) return this.$t('myPiOrder.text8')
      if (i === 5) return this.$t('myPiOrder.text9')
      if (i === 6) return this.$t('myPiOrder.text10')
      if (i === 7) return this.$t('myPiOrder.text11')
      if (i === 8) return this.$t('myPiOrder.text12')
      if (i === 9) return this.$t('myPiOrder.text13')
      if (i === 11) return this.$t('myPiOrder.text14')
      if (i === 21) return this.$t('myPiOrder.text46')
    },
    // 查询买家的线下订单
    getList() {
      // 订单类型 1:线上订单 2:线下订单 3第三方订单 4派世界订单
      let orderType = 2
      this.$http.post(`${this.$api}shopMine/queryBuyOrder?orderType=${orderType}&pageIndex=${this.pageIndex}&pageSize=10`).then((res) => {
        let _list = res.data.data.list
        if (_list.length) {
          this.list.push(...res.data.data.list)
          this.pageIndex++
        } else {
          this.$refs.cubeList.forceUpdate()
        }
        setTimeout(() => {
          this.loadShow = false
        }, 800)
      })
    },
    getDetail(orderId) {
      this.$router.push({
        path: '/offlineOrderDetail',
        query: {
          orderId: orderId
        }
      })
    },
    onPullingUp() {
      this.getList()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .main-container {
    overflow hidden !important
  }

  .wrap-shopping {
    width: 100vw;
    font-size: 14px;
    background-color: #f5f5f7;
    .main-c {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: #fff;
      padding: 0 15px 1rem;
      .iosx & {
        padding-bottom: 130px;
      }
      .list {
        width: 100%;
        height: 100%;
        ul {
          height: 100%;
          &.active {
            height: 0;
          }
        }
        & /deep/ .cube-scroll-wrapper {
          min-height: calc(100vh - 117px) !important;
          .cube-scroll-list-wrapper {
            position: relative;
            height: 100%;
            min-height: calc(100vh - 117px) !important;
          }
          .cube-pulldown {
            .cube-pulldown-loaded {
              font-size: 14px;
              color: #999;
            }
          }
          .cube-pullup-wrapper {
            .before-trigger {
              font-size: 14px !important;
              color: #999 !important;
            }
          }
        }
        .item-li {
          width: 100%;
          display: flex;
          flex-direction column
          position: relative;
          margin: 8px 0;
          font-size 14px
          background-color rgb(247, 247, 247)
          border-radius 4px
          padding 15px
          .top {
            width 100%
            display flex
            flex-direction row
            align-items center
            justify-content space-between
            padding-bottom 15px
            border-bottom 1px dotted #000
            .left {
              width 80%
              display flex
              flex-direction row
              align-items center
              .shop-logo{
                width 30px
                height 30px
                display flex
                justify-content center
                align-items center
                margin-right 5px
                border-radius 5px
                background-color #ccc
                img {
                  max-width 100%
                  max-height 100%
                }
              }
              .shop-name {
                max-width: 4rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom .1rem
              }
            }
            .status-t {
              /*width 25%*/
            }
          }
          .middle {
            margin-top 15px
            display flex
            flex-direction row
            justify-content space-between
            .left, .right {
              .mar-right {
                margin-right 5px
              }
            }
          }
          .bottom {
            margin-top 15px
            display flex
            flex-direction row
            font-size 12px
            justify-content space-between
            color rgb(153, 153, 153)
            .left {
              .mar-right {
                margin-right 5px
              }
            }

          }
        }
      }
      .v-loading {
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
        /deep/ .cube-loading-spinners {
          top: 40px !important;
          left: 48% !important;
          transform: translateX(-40%) !important;
        }
      }
      .null {
        font-size: .28rem;
        color: #999;
        text-align: center;
        padding: .6rem 0;
        padding-top: 100px;
        .noData {
          width: 1.8rem;
          height: 1.75rem;
          margin: 0 auto;
          margin-bottom: 0.2rem;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .noText {
          width: 1.8rem;
          margin: auto;
          text-align: left;
          padding-left: 6px;
        }
      }
    }
  }
</style>
