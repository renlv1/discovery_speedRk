<template>
  <div class="orderList">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <ul class="ul-tab">
      <li class="li-tab" v-for="(item,index) in $t('paiOrder.tabStore')" :key="index" @click="changeFn(index)">
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
        <div class="clear-img" @click="closeSearch()"><img src="./img/Close_2.png"></div>
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
          <li class="li-items" @click="toOrderDetail(item.id)" v-for="(item,index) in list" :key="index">
            <div class="product-box">
              <div class="name-box">
                <div class="product-img"><img src="./img/order.png"></div>
                <div class="product-name">{{$t('paiOrder.text38')}}</div>
                <div class="product-name">{{item.id}}</div>
                <img src="./img/more_2.png">
              </div>
              <div class="status">{{orderStatus(item.status)}}</div>
            </div>
            <div class="order-box" v-if="item.orderRecordDetailList.length > 1 && item.orderRecordDetailList.length <= 4">
              <div class="order-List">
                <div class="product-m">
                  <div class="name-m">
                    <div class="img-product" v-for="(itemImg, i) in (item.orderRecordDetailList)"   :key="i" v-show="i < 4">
                      <img :src="itemImg.imageList.split(',')[0]">
                      <div class="count" v-if="itemImg.num > 99">x99+</div>
                      <div class="count" v-else>x{{itemImg.num}}</div>
                    </div>
                  </div>
                </div>
              </div>
<!--              <div class="money-box">-->
<!--                <div class="money">{{$t('addAddress.text61')}}：<span style="font-weight: bold">{{item.userPayTotal}}{{item.currency === 'PAI' ? 'π' : item.currency}} <span-->
<!--                  v-if="item.userPayTotalTwo !== 0">+ {{item.userPayTotalTwo}}π</span></span></div>-->
<!--              </div>-->
            </div>
            <div class="four-img" v-else-if="item.orderRecordDetailList.length > 4">
              <div class="order-List"  >
                <div class="product-m">
                  <div class="name-m">
                    <div class="img-product" v-for="itemImg in (item.orderRecordDetailList)" :key="itemImg.index">
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
                  <div class="img-product" >
                    <img :src="itemImg.imageList.split(',')[0]">
                  </div>
                  <div class="t-b">
                    <div class="name">{{itemImg.productName}}</div>
                    <div class="price">{{$t('my.text80')}} {{itemImg.price}} {{itemImg.currency === 'PAI' ? 'π' : itemImg.currency}} <span v-if="itemImg.priceTwo !== 0">+{{itemImg.priceTwo}}π</span></div>
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
            <div class="btn-b" v-if="item.status === 8">
              <div class="btn-cancel" @click.stop="refuse(item.id)">{{$t('addAddress.text62')}}</div>
              <div class="btn-pay" @click.stop="orders(item.id)">{{$t('addAddress.text63')}}</div>
            </div>
            <div class="btn-b" v-if="item.status === 9">
              <div class="btn-pay" @click.stop="checkLogistics(item.id)">{{$t('addAddress.text64')}}</div>
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

export default {
  components: {mFixedTop, payDialog},
  data() {
    return {
      isGoBack: true,
      loadShow: true,
      titleName: this.$t('addAddress.text65'),
      tabArr: ['全部', '待接单', '待发货', '待确认', '已完成'],
      tabActive: Number(this.$route.query.activeIndex) || 0,
      pageIndex: 1,
      orderNum: '',
      list: [],
      imgArr: [],
      payId: '',
      payTitle: this.$t('addAddress.text66'),
    }
  },
  mounted() {
    this.transRateInfo()
  },
  created() {
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
    },
  },
  methods: {
    closeSearch() {
      this.orderNum = ''
      this.pageIndex = 1
      this.getList(this.tabActive)
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
          // return (item.userPayTotal + this.paiRate * item.courierFee).toFixed(4) + 'USD' + '+' + item.userPayTotalTwo + 'π'
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
          // return (item.userPayTotal + this.paiRate * item.courierFee).toFixed(4)+ 'USD'
        } else if (item.acceptCurrency === 'CNY') {
          return (item.userRealPayAmount).toFixed(4) + 'CNY'
          // return (item.userPayTotal + this.paitocnyRate * item.courierFee).toFixed(4) + 'CNY'
        } else {
          return (item.userRealPayAmount).toFixed(4) + 'π'
          // return (item.userPayTotal + item.courierFee).toFixed(4) + 'π'
        }
      }
    },
    // 订单状态 1 待付款 2已付款 3已撤单 4 已发货 5完成 6退货中 7退货完成 8 待商家接单 9 商家已接单待发货 11 商家拒绝接单
    orderStatus(i) { //1待付款 2撤单 3已完成 4待商家接单 5商家已接单待发货 6商家拒绝接单 7运输中
      if (i === 1) return this.$t('payReturn.text51')
      if (i === 2) return this.$t('payReturn.text52')
      if (i === 3) return this.$t('addAddress.text67')
      if (i === 4) return this.$t('addAddress.text68')
      if (i === 5) return this.$t('payReturn.text73')
      if (i === 6) return this.$t('payReturn.text74')
      if (i === 7) return this.$t('payReturn.text75')
      if (i === 8) return this.$t('addAddress.text69')
      if (i === 9) return this.$t('paiOrder.text8')
      if (i === 11) return this.$t('addAddress.text71')
    },
    searchInput(num) {
      this.$http.post(`${this.$api}shopMine/querySellOrder?orderId=${num}`).then((res) => {
         this.list = res.data.data.list
      })
    },
    goPath() {
      this.$router.push('/openShop')
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
    toOrderDetail(id) {

      this.$store.commit('SET_ORDER_FLAG', 3)

      this.$router.push({
        path: '/myOrderDetail',
        query: {
          orderId: id,
          activeIndex: this.tabActive,
          flag: 1
        }
      })
    },
    refuse(id) {
      // 拒绝接单
      this.$http.post(`${this.$api}shopMine/receiveOrder?orderId=${id}&flagType=2`).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('addAddress.text72'))
          this.$store.commit('SET_ORDER_FLAG', 3)
          setTimeout(() => {
            this.$router.push({
              path: '/myOrderDetail',
              query: {
                orderId: id,
                activeIndex: this.tabActive,
                flag: 1
              }
            })
          }, 500)
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    orders(id) {
      // 接单
      this.$http.post(`${this.$api}shopMine/receiveOrder?orderId=${id}&flagType=1`).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('addAddress.text73'))
          this.$store.commit('SET_ORDER_FLAG', 3)
          setTimeout(() => {
            this.$router.push({
              path: '/myOrderDetail',
              query: {
                orderId: id,
                activeIndex: this.tabActive,
                flag: 1
              }
            })
          }, 500)
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    checkLogistics(id) {
      // 待发货
      this.$router.push({
        path: '/sellShip',
        query: {
          orderId: id
        }
      })
    },
    paySubmit() {
      // 提交支付按钮
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.$refs.payDialog.closeModel()
          this.tabActive = 1
          this.getList(this.tabActive)
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    },
    getList(index) {
      // 8 待商家接单, 9 商家已接单待发货, 4 已发货, 5 完成
      let status
      if (index === 0) status = 8
      if (index === 1) status = 9
      if (index === 2) status = 4
      if (index === 3) status = 5

      this.$http.post(`${this.$api}shopMine/querySellOrder?orderType=1&status=${status}&pageIndex=${this.pageIndex}&pageSize=20&querySource=1`).then((res) => {
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
        &:last-child {
          /*border-top none*/
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
              width .3rem
              img {
                width 100%
              }
            }
            .product-name {
              margin 0 .1rem
              font-size .28rem
              color #060f26
            }
            img {
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
              width 1.6rem;
              height 1.6rem;
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
              /*width 60%*/
              line-height 1.5
              flex 1
              .name {
                margin-right 10px
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
                margin-top .36rem
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
