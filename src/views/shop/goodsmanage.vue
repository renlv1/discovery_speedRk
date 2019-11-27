<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="mar-top">
      <ul class="nav-tab">
        <li class="item-li"
            :class="{'active': tabIndex === indexNav}"
            v-for="(item,indexNav) in tabArr"
            :key="indexNav"
            @click="tabChange(indexNav)">
          <div class="text">{{item}}</div>
        </li>
      </ul>
    </div>
    <!--<div class="all-box">-->
    <!--<div class="all-t">{{$t('goodmanage.text59')}}</div>-->
    <!--<div class="amount"> ( {{totalCount}} {{$t('goodmanage.text60')}} )</div>-->
    <!--</div>-->
    <div class="m-c">
      <ul class="ul-list ">
        <cube-scroll
          ref="scroll"
          :options="options"
          :data="list"
          @pulling-up="onPullingDown">
          <li class="li-items" v-for="(item,index) in list" :key="index">
            <div class="li-child">
              <div class="img-box">
                <img :src="imgSplit(item.imageList)" class="product-img">
              </div>
              <!--              <div class="img-box" v-else>-->
              <!--                <img :src="item.imageList" class="product-img">-->
              <!--              </div>-->
              <div class="product-box">
                <div class="product-name">{{item.productName}}</div>
                <div class="price">{{item.productPrice}}{{item.currency === 'PAI' ? 'π' : item.currency}} <span
                  v-if="item.productPriceTwo !== 0">+ {{item.productPriceTwo}}π</span></div>
                <div class="sale-box">
                  <span class="kucun">{{$t('goodmanage.text61')}} {{item.stock}}</span><span class="sale">{{$t('goodmanage.text62')}} {{item.saleCount || 0}}</span>
                </div>
              </div>
            </div>
            <div class="li-down">
              <!-- 删除 -->
              <div class="common-btn" @click.stop="btnFn(3, item, index)">{{$t('goodmanage.text63')}}</div>
              <!-- 下架 -->
              <div class="common-btn soldOut" @click.stop="btnFn(2, item,index)" v-if="tabIndex === 0">
                {{$t('goodmanage.text64')}}
              </div>
              <!-- 上架 -->
              <div class="common-btn soldOut" @click.stop="btnFn(1, item,index)" v-if="tabIndex === 1">
                {{$t('goodmanage.text65')}}
              </div>
              <!-- 编辑 -->
              <div class="common-btn edit" @click.stop="gotoDetail(item.id)">{{$t('goodmanage.text66')}}</div>
            </div>
          </li>
        </cube-scroll>
      </ul>
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
    </div>
    <div class="btn-box ">
      <div v-show="tabIndex === 1" class="btn-save common-btn" @click="btnBatch()">{{$t('goodmanage.text67')}}</div>
      <div class="btn-del common-btn" @click="addGoods()">{{$t('goodmanage.text68')}}</div>
    </div>
    <div class="empty" v-if="list.length === 0">
      <img src="@/assets/img/common/empty.png" alt="">
      <p>{{$t('common.empty')}}</p>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import Dialog from '@/components/dialog/index'
import {auditProduct} from '@/api/auditProduct'

export default {
  name: "goodsmanage",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      loadShow: true,
      titleName: this.$t('addAddress.text31'),
      tabIndex: this.$store.state.headTab, //  1出售中 2未上架
      checkAllFlag: false,
      tabArr: [this.$t('goodmanage.text69'), this.$t('goodmanage.text70')],
      pageIndex: 1,
      list: [],
      totalCount: 0,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    imgSplit(img) {
      if (img) {
        let imgProduct = img.split(',')[0]
        if (imgProduct.indexOf('http') > -1) {
          return imgProduct
        } else {
          return 'https://discoverypi.blob.core.windows.net/' + imgProduct
        }
      }
    },
    // 去往商品详情用于商品编辑
    gotoDetail(id) {
      this.$router.push({
        path: '/editGoods',
        query: {
          id: id
        }
      })
    },
    goPath() { // 返回到我的
      this.$store.commit('SET_HEAD_TAB', 0)
      this.$router.push('/openShop')
    },
    //删除或下架产品
    btnFn(index, item, splitIndex) {
      let tip
      if (index === 1) {
        tip = this.$t('goodmanage.text71')
      } else if (index === 2) {
        tip = this.$t('goodmanage.text72')
      } else if (index === 3) {
        tip = this.$t('goodmanage.text73')
      }
      Dialog({
        title: '',
        content: tip,
        okFn: () => {
          if (index === 3) {
            this.$http.post(`${this.$api}shopMine/deleteProductRecord?productIds=${item.id}`).then(res => {
              if (res.status) {
                this.toastD(this.$t('goodmanage.text76'))
                this.list.splice(splitIndex, 1)
                this.totalCount--
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.$http.post(`${this.$api}shopMine/noSaleProduct?productId=${item.id}&status=${index}`).then(res => {
              if (res.data.status === 'success') {
                if (index === 1) {
                  this.toastD(this.$t('goodmanage.text74'))
                } else if (index === 2) {
                  this.toastD(this.$t('goodmanage.text75'))
                }
                this.list.splice(splitIndex, 1)
                this.totalCount--
              } else {
                this.toastD(res.data.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },

    tabChange(index) {
      if (index !== this.tabIndex) { // 防止重复点击
        this.pageIndex = 1
        this.loadShow = true
        this.list = []
        this.$store.commit('SET_HEAD_TAB', index)
        this.tabIndex = index
        this.getData()
      }
    },
    // 批量管理
    btnBatch() {
      if (this.list && this.list.length === 0) {
        this.toastD(this.$t('categories.text4'))
      } else {
        this.$router.push('/BulkManage')
      }
    },
    //  新增商品
    addGoods() {
      this.$router.push('/addGoods')
    },
    getData() {
      let status = this.tabIndex === 0 ? 1 : 2
      this.$http.post(`${this.$api}shopMine/merchantGetProductRecordList?status=${status}&page=${this.pageIndex}&pageSize=10`).then((res) => {
        if (res.data.status === 'success') {
          this.loadShow = false
          this.totalCount = res.data.data.length
          let _list = res.data.data
          if (_list.length) {
            this.list.push(...res.data.data)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        }
      })
    },
    onPullingDown() {
      this.getData()
    },
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          txt: {
            more: this.$t('common.loading'),
            noMore: this.$t('common.noMore')
          }
        }
      }
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .empty {
    top 20%
  }

  .nav-tab {
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 50px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dcdde1;
    position fixed
    top 65px
    &.iosx-app {
      top 85px
    }
    .item-li {
      flex: 1;
      height: 100%;
      text-align: center;
      &.active {
        color: rgb(255, 182, 75);
        transition: color .2s cubic-bezier(.01, .63, .99, .48);
        .text {
          &::before {
            transform: translate(-50%, 0) scaleX(1);
          }
        }
      }
      .text {
        width: 50px;
        height: 100%;
        margin: auto;
        position: relative;
        &::before {
          display: inline-block;
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 100%;
          height: 2px;
          background-color: rgba(255, 182, 75, 1);
          transform-origin: center;
          transform: translate(-50%, 0) scaleX(0);
          transition: transform .2s ease-in-out;
        }
      }
    }
  }

  .all-box {
    font-size .28rem
    padding .4rem .3rem 0
    display flex
    align-items center
    .all-t {
      margin 0 .2rem
      color #060f26
    }
  }

  .m-c {
    width: 100vw;
    position fixed
    top 110px
    bottom 1rem
    overflow: hidden;
    .ul-list {
      height 100%
      .li-items {
        padding .3rem
        border-bottom 1px solid #f5f5f5
        .li-child {
          display flex
          align-items center
        }
        .li-down {
          margin-top .36rem
          display flex
          justify-content flex-end
          .common-btn {
            height .52rem !important
            width 1.4rem
            border-radius 26px
            border 1px solid #999
            text-align center
            line-height .52rem !important
            font-size .24rem
            color #333
            &.soldOut {
              margin 0 .2rem
            }
            &.edit {
              border 1px solid rgb(255, 182, 75)
              color rgb(255, 182, 75)
            }
          }
        }
        .product-img {
          width 1.6rem
          height 1.6rem
          border-radius 6px
          margin 0 .2rem
        }
        .product-box {
          width 65%
          .product-name {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size .28rem
            color #060f26
            line-height 1.2
          }
          .price {
            font-size .28rem
            color rgb(255, 182, 75)
            margin .2rem 0
          }
          .sale-box {
            font-size .22rem
            color #999
            .kucun {
              margin-right .5rem
            }
          }
        }
      }
    }
  }

  .iosx {
    .btn-box {
      height: 1.2rem;
    }
  }

  .btn-box {
    z-index 9
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
    align-items center
    overflow hidden
    font-size 16px
    .btn-save {
      line-height: 1rem;
      color #f14f34
      flex 1
      text-align center
      /*border-right 2px solid #eeeff1*/
    }
    .btn-men {
      flex 1
    }
    .btn-del {
      flex 1
      background-color rgb(255, 182, 75)
      color #fff
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
</style>
