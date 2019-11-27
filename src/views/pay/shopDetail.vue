<template>
  <div class="shop-detail">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="all-product-wrapper">
      <div class="empty-box" v-show="!isNull">
        <div class="shop-info" @click="goShopDetail(shopInfo)">
          <div class="shop-avatar">
            <img :src="shopInfo.arLogoImg" />
          </div>
          <div class="shop-right">
            <div class="right-left-box">
              <span class="shop-name">{{shopInfo.merchantName}}</span>
              <span class="shop-more">商户信息...</span>
            </div>
            <img src="../../assets/img/common/goTo-path.svg" />
          </div>
        </div>
        <div class="all-product-title">
          <div class="type">{{typeName}}</div>
          <div class="all-product-right" @click="isShowProductType">
            <span>选择分类</span>
            <img src="../../assets/img/common/goTo-path.svg" />
          </div>
        </div>
      </div>
      <div class="all-product">
        <cube-scroll v-show="productList && productList.length > 0"
                     :options="options"
                     ref="cubeList"
                     :data="productList"
                     class="product-list"
                     @pulling-up="onPullingUp">
          <div class="shop-info" @click="goShopDetail(shopInfo)">
            <div class="shop-avatar">
              <img :src="shopInfo.arLogoImg" />
            </div>
            <div class="shop-right">
              <div class="right-left-box">
                <span class="shop-name">{{shopInfo.merchantName}}</span>
                <span class="shop-more">商户信息...</span>
              </div>
              <img src="../../assets/img/common/goTo-path.svg" />
            </div>
          </div>
          <div class="all-product-title">
            <div class="type">{{typeName}}</div>
            <div class="all-product-right" @click="isShowProductType">
              <span>选择分类</span>
              <img src="../../assets/img/common/goTo-path.svg" />
            </div>
          </div>
          <ul class="product-ul" v-if="isNull">
            <li class="item-li" v-for="(item,index) in productList"
                :key="index" @click="toDetail(item)">
              <div class="img-wrapper">
                <img :src="splitImg(item.imageList)" />
              </div>
              <div class="text-wrapper">
                <div class="product-name">{{item.productName}}</div>
                <div class="product-price">{{item.productPrice}} {{item.currency === 'PAI' ? 'π' : item.currency}} <span
                  v-if="item.productPriceTwo !== 0"> + {{item.productPriceTwo}} π
                  </span></div>
                <div class="product-stock">
                  <span>库存 </span>
                  <span>{{item.stock}}</span>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll>
      </div>
    </div>
    <div class="null" v-show="!isNull">
      <div class="noData"><img src="../../assets/img/common/empty.png"></div>
      <div class="noText">{{emptyText}}</div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <product-type @choose="choose" ref="productType" :merChantId="merChantId" class="productType"
                  v-if="showProductType"></product-type>
  </div>
</template>

<script>
  import mFixedTop from '@/components/mFixedTop'
  import productType from '@/components/productType'

  export default {
    components: {mFixedTop, productType},
    name: "shopDetail",
    data() {
      return {
        loadShow: true,
        isNull: Boolean,
        isGoBack: true,
        emptyShow: false,
        showProductType: false,
        titleName: '商户信息',
        pageIndex: 1,
        shopInfo: {},
        productList: [],
        emptyText: '暂无数据',
        merChantId: '',
        dataFlag: false,
        typeId: '',
        options: {
          pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
            threshold: 0,
            txt: {
              more: '',
              noMore: ''
            }
          }
        },
        typeName: '全部'
      }
    },
    mounted() {
      this.getShopDetail()
    },
    methods: {
      goPath() {
        if (this.showProductType) {
          this.showProductType = false
          this.titleName = '商户信息'
        } else {
            this.$router.push('/pay')
          }
      },

      splitImg(str) {
        if (str.indexOf(',') > -1) {
          return str.split(',')[0]
        } else {
          return str
        }
      },
      choose(item) {
        this.showProductType = false
        this.typeName = item.name
        this.pageIndex = 1
        this.typeId = item.id
        this.productList = []
        this.isNull = true
        this.search(item.name, item.id)
      },
      search(productName, id) {
        this.loadShow = true
        this.$fetch.post(`${this.$api}shopMine/queryProductListByMerchant`, {
          merchantUserAddress: this.$route.query.merchantUserAddress,
          catId: id,
          page: this.pageIndex,
          pageSize: 10
        }).then((res) => {
          if(res.status === 'success') {
            this.loadShow = false
            const _list = res.data.productList
            if (_list &&_list.length ) {
              this.productList.push(..._list)
              this.pageIndex++
            } else {
              if(this.pageIndex === 1) {
                if (this.productList && this.productList.length !== 0) {
                  this.isNull = true
                } else {
                  this.isNull = false
                }
              }
              this.$refs.cubeList.forceUpdate()
            }
          } else {
            this.loadShow = false
          }
        })
      },
      onPullingUp() {
        if(this.dataFlag) {
          this.search(this.typeName, this.typeId)
        } else {
          this.getShopDetail()
        }
      },
      isShowProductType() {
        this.dataFlag = true
        this.showProductType = true
        this.titleName = '选择分类'
      },
      toDetail(item) {
        this.dataFlag = false
        this.$store.commit('SET_DETAIL_FLAG', 1)
        this.$router.push({
          path: '/productDetail',
          query: {
            merchantUserAddress:this.$route.query.merchantUserAddress,
            productId: item.id
          }
        })
      },
      goShopDetail(obj) {
        let objArr = []
        objArr.push(obj)
        this.$router.push({
          path: '/shopInformation',
          query: {shopInfo: JSON.stringify(objArr)}
        })
      },
      getShopDetail() {
        let catId = this.$route.query.catId || ''
        this.$http.post(`${this.$api}shopMine/queryProductListByMerchant?catId=${catId}&pageIndex=${this.pageIndex}&pageSize=10&&merchantUserAddress=${this.$route.query.merchantUserAddress}`).then((res) => {
          if(res.data.status === 'success') {
            this.loadShow = false
            this.shopInfo = res.data.data.merChantRecord
            this.merChantId = this.shopInfo.id
            // this.productList = res.data.data.productList
            const _list = res.data.data.productList
            if (_list &&_list.length ) {
              this.productList.push(..._list)
              this.pageIndex++
            } else {
              this.$refs.cubeList.forceUpdate()
              if(this.pageIndex === 1) {
                if (this.productList && this.productList.length !== 0) {
                  this.isNull = true
                } else {
                  this.isNull = false
                }
              }
            }
          } else {
            this.loadShow = false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .shop-detail
    position relative
    font-size 12px
    background-color #f5f6fa
    height 100vh !important
    overflow hidden
    .shop-info
      padding 15px
      display flex
      flex-direction row
      background-color #fff
      .shop-avatar
        display flex
        align-items center
        justify-content center
        width 50px
        height 50px
        background-color #ccc
        overflow hidden
        margin-right 8px
        border-radius 5px
        img
          max-width 100%
          max-height 100%
      .shop-right
        flex 1
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        .right-left-box
          display flex
          flex-direction column
          justify-content space-around
          .shop-name
            margin-bottom 10px
            font-size 14px
        img
          width .5rem
          height .5rem
          font-weight bold
    .all-product-title {
      display flex
      flex-direction row
      justify-content space-between
      height 1rem
      align-items center
      font-size .3rem
      padding 0 .3rem
      .all-product-right {
        display flex
        flex-direction row
        align-items center
        img {
          width .4rem
          height .4rem
        }
      }
    }
    .all-product-wrapper
      .empty-box
        padding-bottom 1rem
      .all-product
        width: 100%;
        bottom: .3rem;
        overflow: hidden;
        padding 0 .3rem 1rem
        .product-list {
          height 15rem
          .product-ul {
            width 100%
            display flex
            flex-direction row
            justify-content space-between
            flex-wrap wrap
            padding-bottom 3rem
            .item-li {
              width 48%
              display flex
              flex-direction column
              justify-content center
              font-size .3rem
              margin-bottom 15px
              border-radius 10px
              background-color #fff
              overflow hidden
              .img-wrapper {
                display flex
                justify-content center
                align-items center
                width 100%
                height 2.5rem
                img {
                  max-height 100%
                  max-width 100%
                }
              }
              .text-wrapper {
                padding 0 10px 0 10px
                .product-price {
                  color #ffb64b
                  margin 10px 0 5px
                  font-size 16px
                }
                .product-name {
                  line-height: 1.5;
                  margin: 10px 0 10px 0;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
                .product-name, .product-stock {
                  margin 10px 0
                }
              }
            }
          }
        }
      .productType {
        width 100%
        position absolute
        top 0
      }
    .null {
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
        margin: 3rem auto 0;
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
    .productType {
      width 100%
      position absolute
      min-height 100vh
      height 100vh
      top 0
    }
</style>
