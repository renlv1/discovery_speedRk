<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item.index" @click="choose(item)">{{item.name}}</li>
    </ul>
    <div class="null" v-show="isNull">
      <div class="noData"><img src="../assets/img/common/empty.png"></div>
      <div class="noText">{{emptyText}}</div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: "productType",
  props: ['merChantId'],
  data() {
    return {
      loadShow: true,
      list: [],
      pageIndex: 1,
      isNull: false,
      emptyText: '暂无数据',
    }
  },
  mounted() {
    setTimeout(() => {
      this.getProductList(this.merChantId)
    }, 500)
  },
  methods: {
    // 查询商户产品类目列表
    getProductList(merchantId) {
      this.$http.post(`${this.$api}shopMine/getMerchantProductCatList?merchantId=${merchantId}&pageIndex=${this.pageIndex}&pageSize=10`).then((res) => {
        if(res.data.status === 'success') {
          this.loadShow = false
          this.list = res.data.data
          if (this.list && this.list.length === 0) {
            this.isNull = true
          }
        } else {
          this.loadShow = true
        }
      })
    },
    choose(item) {
      this.$emit('choose', item)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-loading{
    z-index 100
  }
  .null {
    z-index 999
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    font-size: .28rem;
    color: #999;
    text-align: center;
    padding: .6rem 0;
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
  .iosx{
    ul{
      top 84px
      height calc(100vh - 84px)
    }
  }
  ul
    background-color #f5f6fa
    width 100%
    position absolute
    top 60px
    height calc(100vh - 60px)
    z-index 99
    li
      padding 0 .3rem
      height 1rem
      line-height 1rem
      border-bottom 1px solid #ccc
</style>
