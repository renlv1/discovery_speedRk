<template>
  <div class="orderList">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <ul class="ul-tab">
      <li class="li-tab" v-for="(item,index) in $t('paiOrder.tabArr')" :key="index" @click="changeFn(index)">
        <div class="li-t" :class="{active: tabActive === index}">
          {{item}}
          <div :class="{activeLine: tabActive === index}"></div>
        </div>
      </li>
    </ul>
    <div class="search-m">
      <div class="search-box">
        <div class="search-img"><img src="./img/search.png"></div>
        <div class="input-box">
          <input :placeholder="$t('paiOrder.text37')" type="text" v-model.trim="orderNum"
                 @input="searchInput(orderNum)" class="input">
        </div>
        <div class="clear-img" @click="closeSearch()"><img src="./img/close_2.png"></div>
      </div>
    </div>
    <div class="m-c">
      <cube-scroll
        v-show="list.length"
        ref="scroll"
        :options="options"
        :data="list"
        @pulling-up="onPullingDown">
        <ul class="ul-list ">
          <li class="li-items" @click="toOrderDetail(item)" v-for="(item,index) in list" :key="index">
            <div class="product-box">
              <div class="name-box">
                <div class="product-img"><img :src="splitLogo(item.merchantLogo)" class="shop-logo"></div>
                <div class="product-name">{{item.merchantName}}</div>
                <img src="./img/more_2.png" class="shop-more">
              </div>
              <div class="status">{{orderStatus(item.status)}}</div>
            </div>
            <div class="order-box">
              <div class="order-List"  v-if="item.orderRecordDetailList.length > 1 && item.orderRecordDetailList.length <= 4">
                <div class="product-m">
                  <div class="name-m">
                    <div class="img-product" v-for="(itemImg, i) in (item.orderRecordDetailList)" :key="i" v-show="i < 4">
                      <img :src="itemImg.imageList.split(',')[0]">
                      <div class="count" v-if="itemImg.num > 99">x99+</div>
                      <div class="count" v-else>x{{itemImg.num}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="four-img" v-else-if="item.orderRecordDetailList.length > 4">
                <div class="order-List"  >
                  <div class="product-m">
                    <div class="name-m">
                      <div class="img-product" v-for="(itemImg, i) in (item.orderRecordDetailList)" :key="itemImg.index" v-show="i < 3">
                        <img :src="itemImg.imageList.split(',')[0]">
                        <div class="count" v-if="itemImg.num > 99">x99+</div>
                        <div class="count" v-else>x{{itemImg.num}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="go-more" v-if="item.orderRecordDetailList.length > 3">{{$t('my.text79')}}></div>
              </div>
              <div class="order-List" v-else>
                <div class="product-m" v-for="(itemImg, i) in (item.orderRecordDetailList)" :key="i">
                  <div class="name-m">
                    <div class="img-product">
                      <img :src="itemImg.imageList.split(',')[0]">
                    </div>
                    <div class="t-b">
                      <div class="name">{{itemImg.productName}}</div>
                      <div class="price">{{$t('my.text80')}} {{itemImg.price}} {{itemImg.currency === 'PAI' ? 'π' : itemImg.currency}}<span v-show="itemImg.priceTwo > 0">+ {{itemImg.priceTwo}}π</span></div>
                    </div>
                  </div>
                  <div class="amount">x{{itemImg.num}}</div>
                </div>
              </div>
              <div class="money-box">
                <div class="money" style="font-weight: bold">实付金额：
                  <span style="font-weight: bold">{{getTotalActualStr(item)}}</span>
                </div>
              </div>
            </div>
            <div class="btn-b">
              <div class="btn-cancel" @click.stop="cancel(item.id)" v-if="item.status === 1">{{$t('myPiOrder.text2')}}</div>
              <div class="btn-pay" v-if="item.status === 1" @click.stop="pay(item.payId)">{{$t('myPiOrder.text3')}}</div>
              <div class="btn-cancel" v-if="item.status === 4 || item.status === 6"
                   @click.stop="checkLogistics(item.id)">{{$t('my.text84')}}
              </div>
              <div class="btn-pay" v-if="item.status === 4" @click.stop="confirmReceipt(item.id,1)">
                {{$t('my.text85')}}
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <div v-if="!list.length" class="empty">
      <img src="@/assets/img/common/empty.png" alt="">
      <p>{{$t('common.empty')}}</p>
    </div>
    <pay-dialog :title="payTitle" ref="payDialog" @paySubmit="paySubmit"></pay-dialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import payDialog from '@/components/pay/payPopup'
import Dialog from '@/components/dialog/index'

export default {
  components: {mFixedTop, payDialog},
  data() {
    return {
      isGoBack: true,
      isDetail: false, // 是否开启默认页面
      loadShow: true,
      titleName: this.$t('paiOrder.text44'),
      tabArr: ['全部', '待接单', '待发货', '待确认', '已完成'],
      tabActive: Number(this.$route.query.activeIndex) || 0,
      pageIndex: 1,
      orderNum: '',
      list: [],
      imgArr: [],
      payId: '',
      payTitle: this.$t('myPiOrder.text4'),
      totalActualStr: '',
      cnyRate: 0,
      paiRate: 0,
      paitocnyRate: 0,
    }
  },
  mounted() {
    this.transRateInfo()
    this.getList(this.tabActive)
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          txt: {
            noMore: this.$t('common.noMore')
          }
        }
      }
    }
  },
  methods: {
    closeSearch() {
      this.orderNum = ''
      this.pageIndex = 1
      this.getList(this.tabActive)
    },
    searchInput(num) {
      this.$http.post(`${this.$api}shopMine/querySellOrder?orderId=${num}`).then((res) => {
        this.list = res.data.data.list
      })
    },
    transRateInfo() { // 汇率转换
      this.$http.post(`${this.$api}shopMine/getRateInfo`).then((res) => {
        this.cnyRate = res.data.data.cnyRate //美金对人民币汇率
        this.paiRate = res.data.data.paiRate // 派对美金 汇率
        this.paitocnyRate = res.data.data.paitocnyRate // 派对人民币汇率
      })
    },
    getTotalActualStr(item) {
      // 双币种
      if (item.userRealPayAmount > 0 && item.userPayTotalTwo) {
        if (item.acceptCurrency === 'USD') {
          // 接收币种为USD
          return (item.userRealPayAmount).toFixed(4) + 'USD' + '+' + item.userPayTotalTwo + 'π'
        } else if (item.acceptCurrency === 'CNY') {
          // 接收币种为CNY
          return (item.userRealPayAmount).toFixed(4) + 'CNY' + '+' + this.receiptInfo.userPayTotalTwo + 'π'
          // return (item.userPayTotal + this.paitocnyRate * item.courierFee).toFixed(4) + 'CNY' + '+' + this.receiptInfo.userPayTotalTwo + 'π'
        } else {
          // 接收币种为π
          return (item.userRealPayAmount).toFixed(4) + 'π' + '+' + item.userPayTotalTwo + 'π'
          // return (item.userPayTotal + item.courierFee).toFixed(4) + 'π' + '+' + item.userPayTotalTwo + 'π'
        }
      } else {
        // 单币种
        if (item.acceptCurrency === 'USD') {
          return (item.userRealPayAmount).toFixed(4)+ 'USD'
          // return (item.userPayTotal * 10000 / 10000 + this.paiRate * item.courierFee) + 'USD'
        } else if (item.acceptCurrency === 'CNY') {
          return (item.userRealPayAmount).toFixed(4) + 'CNY'
          // return (item.userPayTotal * 10000 / 10000 + this.paitocnyRate * item.courierFee) + 'CNY'
        } else {
          return (item.userRealPayAmount).toFixed(4) + 'π'
          // return (item.userPayTotal * 10000 / 10000 + item.courierFee) + 'π'
        }
      }
    },
    splitLogo(img) {
      if(img) {
        if (img.indexOf('http://ofydu65mj.bkt.clouddn.com/bossstorege') > -1) {
          let aimg = img.substr(32)
          return 'https://discoverypi.blob.core.windows.net' + aimg
        } else {
          return  img
        }
      }
    },
    goPath() {
      this.$router.push('/myShop')
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
    },
    imgSplit(imgStr) {
      if (imgStr) {
        if (imgStr.indexOf(',') > -1) {
          this.imgArr = imgStr.split(',')
        } else {
          this.imgArr.push(imgStr)
        }
      }
    },
    changeFn(index) {
      this.list = []
      this.pageIndex = 1
      this.loadShow = true
      this.tabActive = index
      this.getList(index)
    },
    // 订单详情
    toOrderDetail(item) {

      this.$store.commit('SET_ORDER_FLAG', 2)

      // 设置头部
      this.titleName = this.$t('myPiOrder.text15')
      this.$router.push({
        path: '/myOrderDetail',
        query: {
          orderId: item.id,
          activeIndex: this.tabActive
        }
      })
    },

    // 取消订单
    cancel(id) {
      // 1 确认收货 2删除订单 3取消订单
      let flagType = 3
      this.operating(id, flagType)
    },

    // 确认收货
    confirmReceipt(id) {
      let flagType = 1
      this.operating(id, flagType)
    },

    operating(orderId, flagType) {
      let tip = ''  // 操作前的文案
      let okTip = this.$t('myPiOrder.text16') // 操作成功后的文案
      if (flagType === 1) {
        tip = this.$t('myPiOrder.text17')
      } else if (flagType === 2) {
        tip = this.$t('myPiOrder.text18')
      } else if (flagType === 3) {
        tip = this.$t('myPiOrder.text19')
      }
      Dialog({
        title: '',
        content: tip,
        okFn: () => {
          this.$http.post(`${this.$api}shopMine/confirmOrderReceive?orderId=${orderId}&flagType=${flagType}`).then((res) => {
            if (res.data.status === 'success') {
              this.toastD(okTip)
              setTimeout(() => {
                this.$router.push({
                  path: '/myOrderDetail',
                  query: {
                    orderId: orderId
                  }
                })
              }, 500)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },

    // 查看物流
    checkLogistics(orderId) {
      this.$router.push({
        path: '/Logistics',
        query: {
          orderId: orderId
        }
      })
    },
    pay(id) {
      // 支付订单
      this.$refs.payDialog.showModel()
      this.payId = id
    },
    paySubmit() {
      // 提交支付按钮
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.$refs.payDialog.closeModel()
          this.toastD(this.$t('myPiOrder.text20'))
          setTimeout(() => {
            this.pageIndex = 1
            this.tabActive = 2
            this.getList(2)
          }, 500)
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    },
    getList(index) {
      // 8 待商家接单, 9 商家已接单待发货, 4 已发货, 5 完成
      let status
      if (index === 0) status = ''
      if (index === 1) status = 1
      if (index === 2) status = 8
      if (index === 3) status = 9
      if (index === 4) status = 4
      if (index === 5) status = 5
      // 订单类型 1:线上订单 2:线下订单 3第三方订单 4派世界订单
      this.$http.post(`${this.$api}shopMine/queryBuyOrder?status=${status}&orderType=1&pageIndex=${this.pageIndex}&pageSize=20&querySource=1`).then((res) => {
        this.loadShow = false
        const _list = res.data.data.list
        if (_list.length) {
          this.list.push(..._list)
          this.pageIndex++
        } else {
          this.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingDown() {
      this.getList(this.tabActive)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .orderList
      padding-top: 64px

  .iosx
    .orderList
      padding-top: 89px

  .orderList {
    font-size 14px
    background-color #fff
  }

  .ul-tab {
    background-color #fff
    display flex
    border-bottom 1px solid #dcdde1
    overflow auto
    .li-tab {
      width 5rem
      text-align center
      font-size .26rem
      color #060f26
      padding 0 .3rem
      .li-t {
        padding .4rem 0
        position relative
        white-space: nowrap
        &.active {
          color #ffb64b
          border-bottom 1px solid #ffb64b
        }
      }
    }
  }

  .m-c {
    width: 100%;
    overflow: hidden;
    position: fixed;
    top: 3rem;
    left: 0;
    bottom 0
    .ios & {
      top: 3.4rem;
    }
    .iosx & {
      top: 4rem;
    }
    .scroll-content {
      width: 100%;
      overflow: hidden;
      position: fixed;
      top: 3.6;
      left: 0;
      bottom 0
    }
    .ul-list {
      .li-items {
        background-color #fff
        padding .3rem
        margin-bottom .2rem
        border-top 10px solid #f5f5f7
        &:first-child {
          border-top none
        }
        .product-box {
          display flex
          justify-content space-between
          align-items center
          .name-box {
            z-index 99
            display flex
            align-items center
            .product-img {
              display flex
              align-items center
              justify-content center
              background-color #ccc
              border-radius 4px
              width 30px
              height 30px
              .shop-logo {
                max-width 100%
                max-height 100%
              }
            }
            .product-name {
              margin 0 .1rem
              font-size .28rem
              color #060f26
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow hidden
              max-width 2.5rem
            }
            .shop-more {
              width .11rem
            }
          }
          .status {
            text-align right
            width 3rem;
            font-size .28rem
            color #666
            &.warn {
              color #f14f34
            }
          }
        }
        .product-m {
          display flex
          justify-content space-between
          margin .3rem 0
          width 100%
          .name-m {
            display flex
            .img-product {
              min-width 1.6rem;
              min-height 1.6rem;
              margin-right .16rem;
              border-radius 8px;
              position relative
              background-color #e6e7e7
              display flex
              justify-content center
              align-items center
              .count{
                text-align center
                line-height .5rem
                background-color rgba(26,26,26,.8)
                width .54rem
                height .5rem
                position absolute
                right 0
                bottom 0
                font-size .28rem
                color #fff
              }
            }
            img {
              max-width 1.6rem
              max-height 1.6rem
            }
            .t-b {
              margin-left .2rem
              /*width 50%*/
              line-height 1.5
              flex 1
              margin-right 10px
              .name {
                padding-top .2rem
                font-size .28rem
                color #060f26
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .price {
                margin-top .1rem
                font-size .24rem
                color #999
              }
            }
          }
          .amount {
            padding-top .2rem
            font-size .28rem
            color #ccc
          }
        }
        .order-box {
          display flex
          flex-direction column
          .four-img{
            display flex
          }
          .order-List {
            width 100%
          }
        }
        .go-more {
          margin .4rem 0
          text-align center
          line-height 1.6rem
          width 25%
          height 1.6rem
          border-radius 8px
          background-color rgba(52, 149, 241, .2)
          font-size .28rem
          color #3495f1
        }
        .img-box {
          margin .4rem 0
          .ul-img {
            display flex
            align-items center
            .li-img {
              /*width 25%*/
              width 1.6rem;
              height 1.6rem;
              margin-right .16rem;
              border-radius 8px;
              position relative
              background-color #e6e7e7
              display flex
              justify-content center
              align-items center
              .img-product {
                display flex
                justify-content center
                align-items center
              }
              img {
                max-width 1.6rem
                max-height 1.6rem
              }
              .count {
                text-align center
                line-height .5rem
                background-color rgba(26, 26, 26, .8)
                width .54rem
                height .5rem
                position absolute
                right 0
                bottom 0
                font-size .28rem
                color #fff
              }
            }
            .go-more {
              text-align center
              line-height 1.6rem
              width 25%
              height 1.6rem
              border-radius 8px
              background-color rgba(52, 149, 241, .2)
              font-size .28rem
              color #3495f1
            }
          }
        }
        .money-box {
          display flex
          justify-content flex-end
          .money {
            font-size .28rem
            color #060f26
          }
        }
        .btn-b {
          display flex
          justify-content flex-end
          margin-top .3rem
          .btn-cancel {
            text-align center
            line-height .52rem
            font-size .24rem
            color #333
            border-radius .26rem
            height .52rem
            width 1.5rem
            border 1px solid #999
            background-color #fff
          }
          .btn-pay {
            margin-left .2rem
            text-align center
            line-height .52rem
            font-size .26rem
            color #ffb64b
            border-radius .26rem
            height .52rem
            width 1.5rem
            border 1px solid #ffb64b
            background-color #fff
          }
        }
      }
    }
  }

  .search-m {
    padding 0 .3rem
    .search-box {
      margin .2rem 0
      display flex
      align-items center
      height .6rem
      background #f7f7f7
      border-radius 30px
      width 100%
      .search-img {
        margin 0 .3rem
        width .24rem
        img {
          width 100%
        }
      }
      .input-box {
        display flex
        align-items center
        width 80%
        .input {
          width 80%
        }
      }
      .clear-img {
        width .24rem
        img {
          width 100%
        }
      }
    }
  }

</style>
