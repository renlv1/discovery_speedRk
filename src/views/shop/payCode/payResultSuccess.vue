<template>
  <div class="success-container">
    <div class="app-header">
      <div class="back"></div>
      <div class="title">{{$t('categories.text61')}}</div>
    </div>
    <div class="icon-success">
      <img src="./img/success.png" />
      <p>{{$t('categories.text62')}}</p>
    </div>
    <div class="info">
      <div class="merchant-name">{{merchant.merchantName}}</div>
      <div class="value">
        <span>{{merchant.userPayTotal}}</span><span>{{merchant.acceptCurrency === 'PAI' ? 'π' : merchant.acceptCurrency}}</span>
        <span v-if="Number(merchant.userPayTotalTwo) > 0">+ {{merchant.userPayTotalTwo}}π</span>
      </div>
      <div class="time">{{$changeDate(merchant.createAt)}}</div>
    </div>
    <div class="btn" @click="finished">{{$t('categories.text63')}}</div>
  </div>
</template>

<script>
export default {
  name: "payResultSuccess",
  data() {
    return {
      merchant: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    finished() {
      // this.$router.push('/openShop')
      window.webkit.messageHandlers.finish.postMessage(null)
    },
    getDetail() {
      let orderId = this.$route.query.orderId
      this.$http.post(`${this.$api}/shopMine/queryOrderDetailNew?orderId=${orderId}`).then(res => {
        if (res.data.status === 'success') {
          this.merchant = res.data.data.orderRecord
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .success-container
    display flex
    flex-direction column
    align-items center
    font-size .32rem
    .icon-success
      margin-top 60px
      display flex
      flex-direction column
      align-items center
      img
        width 1rem
        height 1rem
      p
        margin-top 10px
        color #666

    .info
      display flex
      flex-direction column
      align-items center
      margin-top 30px
      font-size .4rem
      .merchant-name
        font-size 14px
        color #666
      .value
        font-size 20px
        margin .3rem 0
      .time
        font-size 14px
        color #666
    .btn
      margin-top 100px
      width: 80%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      background: rgb(255, 182, 75);
      font-size: .32rem;
</style>
