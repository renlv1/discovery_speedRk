<template>
  <div class="wrap-appShopping">
    <div class="appShopping-button" :class="{'active': exist}" @click="myAppShopping">
      <div class="num" v-if="exist && totalExistence >=  100">99+</div>
      <div class="num active" v-else-if="exist && totalExistence <=  99 && totalExistence >= 1">{{totalExistence}}</div>
      <div class="num active2" v-else>{{totalExistence}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cartStatus: this.$store.state.cartStatus,
        exist: false,
        totalExistence: 0,
        arrItem: []
      }
    },
    props: {},
    components: {},
    computed: {},
    created() {
      this.defaultState()
      this.shoppingCartList()
    },
    mounted() {},
    methods: {
      myAppShopping() {
        this.$emit('myShoppingFn')
      },
      defaultState () {
        if (this.cartStatus === true) { // 购物车有商品
          this.exist = true
        } else {
          this.exist = false
        }
        /*6.2 查询购物车列表
       接口URL: web.dis20190000test.com/bountyorder/queryCartProductList*/
      },
      shoppingCartList () {
        this.$http.post(`${this.$api}shopMine/queryCartProductList`).then((res) => {
          if (res.status) {
            let merchantList = res.data.data.merchantList
            if (merchantList.length > 0) {
              this.$store.commit('CART_TOTAL_NUM', true) // 购物车图标，有商品状态
              this.exist = true
            } else {
              this.$store.commit('CART_TOTAL_NUM', false) // 购物车图标，无商品状态
              this.exist = false
            }
            this.totalExistence = 0
            let arr = []
            if (merchantList) {
              for (let i = 0; i < merchantList.length; i++) {
                for (let j = 0; j < merchantList[i].cartProductList.length; j++) {
                  arr.push(merchantList[i].cartProductList[j])
                }
              }
            }
            this.arrItem = arr
            arr.forEach((item) => {
              this.totalExistence+=item.num
            });
          }
        })
      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .wrap-appShopping{
    width: 40px;
    height: 40px;
    position: fixed;
    z-index: 100;
    right: 20px;
    bottom: 82px;
    .iosx &{
      bottom: 110px;
    }
    .appShopping-button{
      width: 100%;
      height: 100%;
      background: url("../assets/img/shop/notGoodsCar.png") no-repeat center;
      background-size: 50% 50%;
      border-radius: 100%;
      background-color: rgba(255,255,255, 1);
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      -moz-box-shadow: 0 1px 2px rgba(204, 204, 204, .9);
      -webkit-box-shadow: 0 1px 2px rgba(204, 204, 204, .9);
      text-shadow: 0 1px 2px rgba(204, 204, 204, .9);
      border-bottom: 1px solid rgba(204, 204, 204, 1);
      position: relative;
      &.active{
        background: url("../assets/img/shop/car.png") no-repeat center;
        background-size: 150% 150%;
        border-radius: 100%;
      }
      .num{
        position: absolute;
        top: -4px;
        right: 2px;
        width: 22px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        background-color: rgba(255, 89, 89, 1);
        font-size: .24rem;
        padding-left: 1px;
        color: #fff;
        box-shadow: 0 1px 2px rgba(255, 89, 89, .8);
      }
      .active{
        top: -3px;
        right: 3px;
        width: 18px;
        height: 15px;
        border-radius: 50%;
        padding-right: 1px;
      }
      .active2{
        top: -4px;
        right: 4px;
        width: 18px;
        height: 15px;
        border-radius: 50%;
        padding-right: 1px;
        background-color: rgba(204, 204, 204, 1);
        box-shadow: 0 1px 2px rgba(204, 204, 204, 0.6);
      }
    }
  }
</style>
