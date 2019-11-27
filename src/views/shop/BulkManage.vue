<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="all-box">
      <div class="circle-one" :class="{'isChecked': checkAllFlag === true}" @click="checkAllList"></div>
      <div class="all-t">{{$t('goodmanage.text80')}}</div>
    </div>
    <div class="m-c">
      <ul class="ul-list ">
        <cube-scroll
          v-show="list.length"
          ref="scroll"
          :options="options"
          :data="list"
          @pulling-up="onPullingDown">
          <li class="li-items" v-for="(item,index) in list" :key="index"  @click="checkOne(item)">
            <div class="li-child">
              <div class="circle-one" ref="circleRef" :class="{'isChecked': item.checkFlag === true}"></div>
              <div class="img-box" v-if="item.imageList.indexOf(',') > -1">
                <img :src="item.imageList.split(',')[0]" class="product-img">
              </div>
              <div class="img-box" v-else>
                <img :src="item.imageList" class="product-img">
              </div>
              <div class="product-box">
                <div class="product-name">{{item.productName}}</div>
                <div class="price">{{item.productPrice}}{{item.currency}}</div>
                <div class="sale-box">
                  <span class="kucun">{{$t('goodmanage.text61')}} {{item.stock}}</span><span class="sale">{{$t('goodmanage.text62')}} {{item.saleCount || 0}}</span>
                </div>
              </div>
            </div>
          </li>
        </cube-scroll>
      </ul>
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
      <div v-if="emptyData" class="empty">
        <img src="@/assets/img/common/empty.png" alt="">
        <p>{{$t('common.empty')}}</p>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn-del" @click="allDel()">{{$t('addAddress.text12')}}</div>
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
      emptyData: false,
      isGoBack: true,
      loadShow: true,
      titleName: this.$t('addAddress.text13'),
      tabIndex: this.$store.state.headTab, //  1出售中 2未上架
      checkAllFlag: false,
      tabArr: [this.$t('goodmanage.text69'), this.$t('goodmanage.text70')],
      pageIndex: 1,
      list: [],
      totalCount: 0,
      checkObj: {},
      checkData: [],
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    goPath() { // 返回到我的
      this.$router.push('/goodsmanage')
    },
    // 单选
    checkOne(item) {
      item.checkFlag = !item.checkFlag
      let idIndex = this.checkData.indexOf(item.id)
      if (idIndex >= 0 || item.checkFlag === false) { // 如果已经包含就去除
        this.checkData.splice(idIndex, 1)
      } else { // 如果没有包含就添加
        this.checkData.push(item.id)
      }
      this.checkObj = this.checkData.join(',')
      if (this.checkData.length === this.list.length) {
        this.checkAllFlag = true
      } else {
        this.checkAllFlag = false
      }
    },
    // 全选
    checkAllList() {
      this.checkData = []
      this.checkAllFlag = !this.checkAllFlag
      this.list.forEach(item => {
        if (this.checkAllFlag === true) {
          item.checkFlag = true
          this.checkData.push(item.id)
          this.checkObj = this.checkData.join(',')
        } else {
          item.checkFlag = false
          this.checkData = []
        }
      })
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
              console.log(item)
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
    //  批量删除
    allDel() {
      let checkObj = this.checkObj
      if(this.checkData && this.checkData.length > 0) {
        this.$http.post(`${this.$api}shopMine/deleteProductRecord?productIds=${checkObj}`).then((res) => {
          if (res.data.status === 'success') {
            this.toastD(this.$t('addAddress.text14'))
            this.pageIndex = 1
            this.list = []
            this.checkAllFlag = false
            setTimeout(() => {
              this.getData()
            }, 500)
          } else {
            this.toastD(res.data.msg)
          }
        })
      } else {
        this.toastD(this.$t('categories.text2'))
      }
    },
    getData() {
      // 只有已下架的先删除
      this.$http.post(`${this.$api}/shopMine/merchantGetProductRecordList?status=2&page=${this.pageIndex}&pageSize=10`).then((res) => {
        this.loadShow = false
        this.totalCount = res.data.data.length
        let _list = res.data.data
        _list.forEach(item => {
          item.checkFlag = false
        })
        if (_list.length > 0) {
          this.list.push(..._list)
          this.pageIndex++
        } else {
          if(this.pageIndex === 1) {
            this.emptyData = true
            console.log(this.emptyData)
          }
          this.$refs.scroll.forceUpdate()
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
  .circle-one {
    width .36rem
    height .36rem
    border 1px solid #e5e5e5
    border-radius 50%
    position: relative;
    &::before {
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 6px;
      position: absolute;
      top: 2px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      -webkit-transition: -webkit-transform .15s ease-in .05s;
      transition: -webkit-transform .15s ease-in .05s;
      transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
      -webkit-transform-origin: center;
      transform-origin: center;
    }
    &.isChecked {
      background-color: #f14f34;
      &::before {
        transform: rotate(45deg) scaleY(1);
      }
    }
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
    height: calc(100vh - 150px);
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
.iosx{
  .btn-box{
    height: 1.4rem;
    .btn-del{
      line-height 1.4rem
    }
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
    font-size: .28rem;
    align-items center
    .btn-del {
      background-color rgb(255, 182, 75)
      color #fff
      width 100%
      text-align center
      line-height 1rem
    }
  }
  .empty {
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    background none
  }
</style>
