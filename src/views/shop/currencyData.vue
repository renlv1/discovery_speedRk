<template>
  <div class="paymentCurrency-w main-container" v-show="isShow">
    <div class="app-header">
      <div class="goback" @click="goBack">
        <div class="goback-icon"></div>
      </div>
      <div class="title">{{$t('addAddress.text23')}}</div>
    </div>
    <div class="wrap">
      <ul class="uls">
        <li class="item-currency"
            v-for="(item, index) in currencyData" :key="index"
            @click="switchOne(index, item)"
            :class="{'active': currencyIndex === index}">
          <div>{{item}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      currencyData: ['π', 'USD', 'CNY'],
      isShow: false
    }
  },
  props: {
    currency: String,
    currencyIndex: {
      type: Number,
    }
  },
  created() {
    if (this.currency === 'π') {
      this.activeIndex = 0
    } else if (this.currency === 'USD') {
      this.activeIndex = 1
    } else if (this.currency === 'CNY') {
      this.activeIndex = 2
    }
  },
  methods: {
    switchOne(index, item) {
      this.activeIndex = index
      this.$emit('goback', item)
    },
    goBack() {
      this.$emit('goback', this.currencyData[this.currencyIndex])
      this.isShow = false
    }
  }
}
</script>

<style scoped lang="stylus">
  .paymentCurrency-w
    height 100vh
    font-size 14px
    background-color: #fff
    position: fixed
    z-index 1090
    top: 0
    left: 0
    width: 100%
    overflow hidden
    .app-header
      .goback
        box-sizing border-box
        padding: .3rem
        position: absolute;
        left: 0;
        bottom: 0
        height: .88rem
        .goback-icon
          height: .28rem;
          width: .36rem;
          background: url("../../assets/img/order/back.svg") no-repeat center / cover
    .wrap
      .uls
        .item-currency
          padding: 0 .3rem
          height: 1rem
          display: flex
          align-items center
          justify-content space-between
          color #060f26
          border-bottom: 1px solid #edeef0
          &.active
            color: rgb(255, 182, 75)
            .right
              border: .02rem solid #3495f1
              &::before
                content ''
                display: block
                width: .16rem
                height: .16rem
                border-radius 50%
                background-color: #3495f1
</style>
