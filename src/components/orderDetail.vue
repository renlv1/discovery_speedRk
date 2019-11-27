<template>
  <div class="paiPayDetail">
    <div class="m-c">
      {{orderId}}
      <div class="banner">
        <div class="all-box">
          <div class="all-top">待提交</div>
          <div class="money">等待您确认订单并进行提交</div>
        </div>
      </div>
      <!--<div class="tab-ul">-->
        <!--<div @click="chooseAddress()">-->
          <!--<div class="li-tab">-->
            <!--<img src="./img/shipping-address.png">-->
            <!--<div class="address-t">收货地址</div>-->
          <!--</div>-->
          <!--<div class="name-box">-->
            <!--<div class="name-t">{{receiptInfo[0].realName}}</div>-->
            <!--<div class="mobile" v-show="receiptInfo[0].phone">+{{receiptInfo[0].phoneCode}} {{receiptInfo[0].phone}}</div>-->
          <!--</div>-->
          <!--<div class="shipping-address">-->
            <!--<div class="choose-address">{{receiptInfo[0].realAddress}}</div>-->
            <!--<img v-show="isMore" src="./img/right-grey.png">-->
          <!--</div>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class="line-two"></div>&ndash;&gt;-->
        <!--&lt;!&ndash;<div class="goods-box">&ndash;&gt;-->
          <!--&lt;!&ndash;<div class="goods-count">&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="product-name">&ndash;&gt;-->
              <!--&lt;!&ndash;{{JSON.parse(this.$route.query.careList).merchantUserAddress}}&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;<ul class="product-m">&ndash;&gt;-->
            <!--&lt;!&ndash;<li class="name-m" v-for="(item,index) in careList" :key="index">&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="product-box">&ndash;&gt;-->
                <!--&lt;!&ndash;<div class="product-img">&ndash;&gt;-->
                  <!--&lt;!&ndash;<img v-if="item.productImg" :src="item.productImg" alt="">&ndash;&gt;-->
                  <!--&lt;!&ndash;<img v-else :src="item.image" alt="">&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--&lt;!&ndash;<div class="name-b">&ndash;&gt;-->
                  <!--&lt;!&ndash;<div class="t-b">&ndash;&gt;-->
                    <!--&lt;!&ndash;<div class="name">{{item.title}}</div>&ndash;&gt;-->
                    <!--&lt;!&ndash;<div class="count">x{{item.num}}</div>&ndash;&gt;-->
                  <!--&lt;!&ndash;</div>&ndash;&gt;-->
                  <!--&lt;!&ndash;<div class="amount-box">&ndash;&gt;-->
                    <!--&lt;!&ndash;<div class="price">单价 {{item.price}}{{item.currency === 'PAI' ? 'π' : item.currency}} <span&ndash;&gt;-->
                      <!--&lt;!&ndash;v-if="item.priceTwo !== 0"> + {{item.priceTwo}} π</span></div>&ndash;&gt;-->
                    <!--&lt;!&ndash;<div class="total">小计 {{item.num * item.price}} {{item.currency === 'PAI' ? 'π' : item.currency}}&ndash;&gt;-->
                      <!--&lt;!&ndash;<span v-if="item.priceTwo !== 0">+ {{item.num * item.priceTwo}} π</span></div>&ndash;&gt;-->
                  <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;</li>&ndash;&gt;-->
          <!--&lt;!&ndash;</ul>&ndash;&gt;-->
          <!--&lt;!&ndash;<div class="actually-paid ">&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="title">合计</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div class="cost">&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="allPricePi !== 0">{{allPricePi}} π</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="allPriceUSD !== 0">+</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="allPriceUSD !== 0">{{allPriceUSD}} USD</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="allPriceCNY !== 0">+</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="allPriceCNY !== 0">{{allPriceCNY}} CNY</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="totalTwo !== 0">+</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<span v-if="totalTwo !== 0">{{totalTwo}} π</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--</div>-->
      <div class="line-two line-bg">
        <div class="tip">合计金额仅供参考,请以提交订单后的实际金额为准</div>
      </div>
      <div class="btn-add">
        <div class="btn-del" @click="submit()">提交订单</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "confirmOrder",
  props: {
    orderId: {
      type: Number,
    },
    // 收货地址是否显示更多的icon
    isMore: {
      type: Boolean
    }
  },
  data() {
    return {
      titleName: '确认订单',
      payTitle: '安全验证',
      totalTwo: 0,
      allPricePi: 0,
      allPriceUSD: 0,
      allPriceCNY: 0,
    }
  },
  mounted() {
  },
  methods: {
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .paiPayDetail {
    position absolute
    top 60px
    z-index 999
    width 100%
    min-height 100vh
    background-color #f5f5f7
  }

  .banner {
    padding .5rem 0 1.5rem 0
    display flex
    width 100%
    background-color #ffb64b
    .all-box {
      padding-left .3rem
      .all-top {
        font-size .4rem
        color #fff
        margin-bottom .28rem
      }
      .money {
        font-size .28rem
        color #fff
      }
    }
  }

  .tab-ul {
    background-color: #fff;
    width: 100%;
    border-radius: 22px;
    margin-top -.5rem
    .li-tab {
      padding .5rem 0 .28rem .3rem
      display flex
      align-items center
      img {
        width .28rem
        height .34rem
      }
      .address-t {
        margin-left .2rem
        font-size .28rem
        color #ffb64b
      }
    }
    .wuliu-box {
      border-bottom 1px solid #edeef0
      .wuliu-top {
        padding 0 .3rem
        display flex
        justify-content space-between
        .wuliu-address {
          font-size .24rem
          color #060f26
        }
      }
      .date {
        margin .2rem 0
        padding 0 .3rem
        font-size .22rem
        color #999
      }
    }
    .name-box {
      padding 0 0 .3rem .3rem
      display flex
      align-items center
      .name-t {
        font-size .24rem
        color #ffb64b
        margin-right .4rem
      }
      .mobile {
        font-size .24rem
        color #999
      }
    }
    .shipping-address {
      padding 0 .3rem .3rem
      display flex
      justify-content space-between
      align-items center
      .choose-address {
        font-size .26rem
        color #999
      }
      img {
        width .14rem
        height .26rem
      }
      .address-c {
        line-height 1.5
        word-break break-all
        font-size .24rem
        color #ffb64b
      }
    }
    .goods-box {
      .goods-count {
        display flex
        align-items center
        margin .3rem
        font-size .28rem
        color #ffb64b
        .product-img {
          width .44rem
          height .44rem
          border-radius 4px
          background-color #bcbcbc
          img {
            width 100%
            height 100%
          }
        }
        .product-name {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          margin 0 .1rem
          font-size .28rem
          color #ffb64b
        }
      }
      .product-m {
        margin .3rem 0
        .name-m {
          display flex
          padding 0 0 0 .3rem
          &:last-child {
            .name-b {
              /*border-bottom none*/
            }
          }
          .img-box {
            /*margin .4rem 0*/
            width 1.6rem
            height 1.6rem
            .ul-img {
              display flex
              align-items center
              .li-img {
                /*width 25%*/
                display flex
                align-items center
                justify-content center
                border-radius 4px
                width 1.6rem
                height 1.6rem
                margin-right .16rem;
                position relative
                img {
                  max-width 1.6rem
                  max-height 1.6rem
                  /*border-radius 4px*/
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
                background-color #ffb64b
                font-size .28rem
                color #ffb64b
              }
            }
          }
          .product-box {
            width 100%
            display flex
            .product-img {
              border-radius 4px
              display flex
              align-items center
              justify-content center
              width 1.6rem
              height 1.6rem
              background-color #e6e7e7
              img {
                max-width 100%
                max-height 100%
                /*border-radius 4px*/
              }
            }
          }
          .name-b {
            width 75%
            margin-left .2rem
            border-bottom 1px solid #edeef0
            display flex
            flex-direction column
            justify-content center
          }
          .t-b {
            justify-content space-between
            display flex
            line-height 1.5
            padding-right .3rem
            .name {
              width 70%
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
            .count {
              font-size .28rem
              color #ffb64b
            }
            .price {
              margin-top .36rem
              font-size .24rem
              color #999
            }
          }
          .amount-box {
            padding-right .3rem
            display flex
            justify-content space-between
            margin-top .3rem
            .price {
              font-size .24rem
              color #999
            }
            .total {
              font-size .24rem
              color #ffb64b
            }
          }
        }
      }
      .postage-box {
        padding .3rem
        border-bottom 1px solid #ededed
        color #999
        font-size .28rem
        .postage-t {
          display flex
          justify-content space-between
          &.user-pay {
            margin .3rem 0
          }
        }
      }
      .actually-paid {
        display flex
        justify-content space-between
        padding .3rem
        .title {
          font-size .3rem
          color #060f26
        }
        .cost {
          font-size .3rem
          color #ffb64b
        }
      }
      .order-box {
        padding .3rem .3rem 4rem
        .t-box {
          display flex
          align-items center
          margin-bottom .3rem
          .order-t {
            margin-left .2rem
            font-size .28rem
            color #060f26
          }
        }
        .postage-t {
          display flex
          justify-content space-between
          font-size .28rem
          color #999
          &.user-pay {
            margin .3rem 0
          }
          .cost {
            display flex
            .order-number {
              margin-right .5rem
            }
            .copy-btn {
              font-size .28rem
              color #3495f1
            }
          }
        }
      }
    }
    .btn-box {
      text-align center
      background-color #fff
      border-top 1px solid #dcdde1
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      cursor: pointer;
      user-select: none;
      height: 1rem;
      font-size: .28rem;
      align-items center
      .btn-save {
        color #f14f34
        width 50%
        padding .1rem 0
        text-align center
        border-right 2px solid #eeeff1
      }
      .btn-del {
        background-color #3495f1
        color #fff
        width 50%
        text-align center
        line-height 1rem
      }
      .btn-cancel {
        position absolute
        left 50%
        transform translate(-50%)
        color #f14f34
        line-height 1rem
      }
    }
  }

  .line-bg {
    height .8rem
    .tip {
      padding .3rem
      font-size 12px
      color #060f26
    }
  }
</style>
