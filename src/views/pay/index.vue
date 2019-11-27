<template>
  <div class="wrap-shopping">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="shoppingSearch-box">
      <div class="shoppingSearch">
        <div class="icon"></div>
        <input class="search" placeholder="请输入商品、商户、名称" @input="search(Keyword)" v-model="Keyword"/>
        <div class="close" @click="close"></div>
      </div>
      <div class="filtrate-box" @click="shopFiltrateNav">
        <div class="icon-bg" :class="{'active': $route.query.merType && $route.query.merType !== 0}"></div>
        <div class="text" :class="{'activeText': $route.query.merType && $route.query.merType !== 0}">筛选</div>
      </div>
    </div>
    <div>
      <ul class="nav-tab">
        <li class="item-li"
            :class="{'active': tabIndex === indexNav}"
            v-for="(item,indexNav) in navList"
            :key="indexNav"
            @click="tabChange(indexNav)">
          <div class="text">{{item.text}}</div>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="list">
        <ul :class="{'active': nullData}">
          <cube-scroll
            :options="options"
            ref="cubeList"
            :data="bountyProductList"
            @pulling-up="onPullingUp">
            <li @click="goToCommodityDetails(item)" v-show="((tabIndex === 0 && item.stock > 0) || tabIndex !== 0) && item.sourceUserAddress !== $store.state.merIdAddress"  class="item-li" v-for="(item, index) in bountyProductList"
                :key="index">
              <div class="shop-bg">
                <img class="logo-img" v-if="tabIndex === 0" :src="imgSplit(item.imageList)" alt="">
                <img class="logo-img" v-else :src="item.arLogoImg"
                     alt="">
                <div class="img-load" v-show="logoShow">
                  <cube-loading></cube-loading>
                </div>
              </div>
              <div class="explain-box">
                <!-- 商品显示商品内容商铺则不显示 -->
                <p class="explain" v-if="tabIndex === 0">{{item.productName}}</p>

                <!-- 商品显示价格 -->
                <div class="price" v-if="tabIndex === 0">
                  <div>{{item.productPrice}} {{item.currency === 'PAI' ? 'π' : item.currency}} <span
                    v-if="item.productPriceTwo !== 0"> + {{item.productPriceTwo}} π
                  </span>
                  </div>
                </div>

                <!-- 商铺显示商铺名字和商铺类型 -->
                <div class="price" v-if="tabIndex !== 0">
                  <span class="shop-name">{{item.merchantName}}</span>
                  <span class="shop-type">{{$productType(item.merType)}}</span>
                </div>
                <div class="sell-and-store">
                  <!-- 商品显示库存 -->
                  <div v-if="tabIndex === 0">
                    <span class="sell" v-if="item.stock > 0">库存 {{item.stock}}</span>
                    <span class="sell" v-else>库存不足</span>
                    <span class="store" @click.stop="goToCommercialTenant(item)"><span class="merchant-name">{{item.merchantName}}</span> <span
                      class="more-store"></span></span>
                  </div>
                  <!-- 商铺显示商铺地址 -->
                  <div v-if="tabIndex === 1">
                    <span class="sell address" v-if="item.applyType === 2">{{item.merchantAddress}}</span>
                    <span v-else><span
                      style="color: #2283e6; z-index: 999"
                      @click.stop="newAddress(item.shopUrl)">{{item.shopUrl}}</span></span>
                  </div>
                  <div v-if="tabIndex === 2" >
<!--                    <span class="sell address">{{item.merDesc}}</span>-->
                    <span class="sell address" v-if="item.applyType === 2">{{item.merchantAddress}}</span>
                    <span v-else><span
                      style="color: #2283e6; z-index: 999"
                      @click.stop="newAddress(item.shopUrl)">{{item.shopUrl}}</span></span>
                  </div>
                </div>
              </div>
            </li>
          </cube-scroll>
        </ul>
        <div class="v-loading" v-show="loadShow">
          <cube-loading></cube-loading>
        </div>
        <div class="empty" v-show="!bountyProductList || !bountyProductList.length ">
          <div class="noData"><img src="../../assets/img/common/empty.png"></div>
          <div class="noText">{{emptyText}}</div>
        </div>
      </div>
    </div>
    <VFooter />
    <!--去我的购物车-->
    <app-shopping @myShoppingFn="myShoppingFn"></app-shopping>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import VFooter from '@/components/footer'
import appShopping from '@/components/appShopping'

export default {
  name: "index",
  components: {mFixedTop, VFooter, appShopping},
  data() {
    return {
      isGoBack: true,
      loadShow: true,
      titleName: '派付',
      nullData: false,
      emptyShow: false,
      emptyText: '暂无数据',
      tabIndex: this.$store.state.headTab,
      logoShow: false,
      bountyProductList: [],
      navList: [
        {
          text: '商品'
        },
        {
          text: '商家'
        },
        {
          text: '连锁商家'
        }
      ],
      pageIndex: 1,
      merType: 1,
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: {
            // more: this.$t('mergeMap.text1'),
            noMore: this.$t('mergeMap.text2')
          }
        }
      },
      Keyword: '' // 搜索的关键字
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
    this.getList()
  },
  methods: {
    // 搜索用于模糊查询
    search(Keyword) {
      let queryType
      if (this.tabIndex === 0) {
        queryType = 2
      } else if (this.tabIndex === 1) {
        queryType = 1
      } else {
        queryType = 3
      }
      let keyword = encodeURI(Keyword)
      this.$http.post(`${this.$api}seller/all?merchantName=${keyword}&queryType=${queryType}&pageIndex=${this.pageIndex}&pageSize=10`).then((res) => {
        this.loadShow = false
        this.bountyProductList = res.data.data.pageData.list
      })
    },
    // 清除input框里面内容
    close() {
      this.Keyword = ''
    },
    myShoppingFn() {
      this.$router.push('/myShopping')
    },
    newAddress(address) { // 跳转连锁商家的在线地址
      if (address.indexOf('http') > 0) {
        window.open(address)
      } else {
        window.open(`http://${address}`)
      }
    },
    tabChange(index) {
      if (index !== this.tabIndex) { // 防止重复点击
        this.pageIndex = 1
        this.loadShow = true
        this.bountyProductList = []
        this.$store.commit('SET_HEAD_TAB', index)
        this.tabIndex = index
        // this.$route.query.merType = 0
        if(this.Keyword){
          this.search(this.Keyword)
        } else {
          this.getList()
        }
      }
    },
    shopFiltrateNav() {
      let merType = this.$route.query.merType || 0
      this.$router.push({
        path: '/filter',
        query: {
          merType: merType
        }
      })
    },
    goToCommodityDetails(item) {
      this.$store.commit('SET_DETAIL_FLAG', 0)
      if (this.tabIndex === 0) {
        this.$router.push({
          path: '/productDetail',
          query: {
            productId: item.id,
            merchantUserAddress: item.sourceUserAddress
          }
        }) // 跳转到商品详情页面
      } else {
        this.$router.push({
          path: '/shopDetail',
          query: {merchantUserAddress: item.sourceUserAddress}
        }) // 跳转到商家详情页面
      }
    },
    onPullingUp() {
      this.getList()
    },
    goPath() { // 返回到我的
      this.$store.commit('SET_HEAD_TAB', 0)
      this.$router.push('/menu')
    },
    imgSplit(img) { // 分割数组
      if (img) {
        if (img.indexOf(',') > -1) {
          let data = img.split(',')[0]
          return this.addPrefix(data)
        } else {
          return this.addPrefix(img)
        }
      }
    },
    addPrefix(img) { // 添加前缀
      if (img.indexOf('http') > -1) {
        return img
      } else {
        return 'https://discoverypi.blob.core.windows.net/' + img
      }
    },
    setImg(w, h) {
      let imgList = document.getElementsByClassName("logo-img");
      for (let i = 0; i < imgList.length; i++) {
        if (imgList[i].width > w || imgList[i].heigth > h) {
          imgList[i].style.width = w;
          imgList[i].style.heigth = h;
        } else {
          w = imgList[i].width
          h = imgList[i].heigth
        }
      }
    },
    goToCommercialTenant(item) {
      // 跳转商户详情
      this.$router.push({
        path: '/shopDetail',
        query: {
          merchantUserAddress: item.sourceUserAddress
        }
      })
    },
    getList(merchantName) {
      let merType = this.$route.query.merType || ''
      let chantName = merchantName ? merchantName : ''
      let queryType
      if (this.tabIndex === 0) {
        queryType = 2
      } else if (this.tabIndex === 1) {
        queryType = 1
      } else {
        queryType = 3
      }
      this.$http.post(`${this.$api}seller/all?queryType=${queryType}&pageIndex=${this.pageIndex}&pageSize=10&merType=${merType}&merchantName=${chantName}`).then((res) => {
        let _list = res.data.data.pageData.list
        if (_list.length) {
          this.bountyProductList.push(...res.data.data.pageData.list)
          this.pageIndex++
        } else {
          this.$refs.cubeList.forceUpdate()
        }
        setTimeout(() => {
          this.loadShow = false
          this.logoShow = false
        }, 800)
      })
    },
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .main-container{
    overflow: hidden!important;
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .wrap-shopping {
    width: 100vw;
    font-size: 14px;
    position: relative;
    .shoppingSearch-box {
      width: 100vw;
      font-size: 14px;
      padding: 0 15px;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      .shoppingSearch {
        flex: 1;
        height: 30px;
        line-height: 30px;
        background-color: #f5f5f5;
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          width: 16px;
          height: 16px;
          background: url("./img/search.png") no-repeat center;
          background-size: 100% 100%;
          margin: 0 10px 0 8px;
        }
        .search {
          flex: 1;
          color: #060f26;
          height: 100%;
        }
        .close {
          width: 16px;
          height: 16px;
          background: url("./img/close.png") no-repeat center;
          background-size: 100% 100%;
          margin-right: 8px;
          margin-left: 6px;
        }
      }
      .filtrate-box {
        text-align: center;
        width: 30px;
        height: 100%;
        font-size: 12px;
        margin-left: 10px;
        .icon-bg {
          width: 15px;
          height: 15px;
          background: url("./img/screen.png") no-repeat center;
          background-size: 100% 100%;
          margin: 0 auto;
          margin-bottom: 5px;
          &.active{
            width: 20px;
            height: 20px;
            background: url("./img/active.png") no-repeat center;
            background-size: 100% 100%;
          }
        }
        .text {
          &.activeText {
            color: #ffb64b;
          }
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
          color: #ffb64b;
          transition: color .2s cubic-bezier(.01, .63, .99, .48);
          .text {
            &::before {
              transform: translate(-50%, 0) scaleX(1);
            }
          }
        }
        .text {
          width: 60%;
          height: 100%;
          margin: auto;
          //border-bottom: 1px solid rgba(53, 157, 242, 0);
          position: relative;
          &::before {
            display: inline-block;
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: #ffb64b;
            transform-origin: center;
            transform: translate(-50%, 0) scaleX(0);
            transition: transform .2s ease-in-out;
          }
        }
      }
    }
    .main {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      top: 3rem;
      /*height: calc(100vh - 150px);*/
      overflow: hidden;
      background-color: #fff;
      padding: 0 15px 1rem;
      .iosx & {
        top: 3.5rem;
        /*padding-bottom: 130px;*/
      }
      .list {
        width: 100%;
        height: 100%;
        ul {
          height: 100%;
          &.active {
            height: 0;
          }
        }
        & /deep/ .cube-scroll-wrapper {
          /*min-height: calc(100vh - 117px) !important;*/
          .cube-scroll-list-wrapper {
            /*position: relative;*/
            /*height: 100%;*/
            /*min-height: calc(100vh - 117px) !important;*/
          }
          .cube-pulldown {
            .cube-pulldown-loaded {
              font-size: 14px;
              color: #999;
            }
          }
          .cube-pullup-wrapper {
            .before-trigger {
              font-size: 14px !important;
              color: #999 !important;
            }
          }
        }
        .item-li {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin: 8px 0;
          &:after {
            display: block;
            position: absolute;
            right: -20px;
            bottom: 0;
            content: '';
            width: calc(100% - 94px);
            height: 1px;
            background-color: #edeef0;
          }
          .shop-bg {
            width: 90px;
            height: 90px;
            margin-right: 10px;
            background-color: #e6e7e7;
            border-radius: 4px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .logo-img {
              max-width: 100%;
              max-height: 100%;
              border-radius: 4px;
            }
            .img-load {
              width: 18px;
              height: 18px;
              background-color: rgba(255, 255, 255, .4);
              border-radius: 100%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              .cube-loading {
                font-size: 18px !important;
              }
            }
          }
          .explain-box {
            flex: 1;
            .explain {
              width: 100%;
              color: #060f26;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              line-height: 1.2;
              padding-bottom: 5px;
            }
            .price {
              display: flex;
              justify-content: space-between;
              font-size: .34rem;
              color: #ffb64b;
              .shop-name {
                width: 150px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                @media screen and (min-width: 375px) {
                  width: 200px;
                }
                @media screen and (min-width: 414px) {
                  width: 220px;
                }
              }
              .shop-type {
                color: #000;
                font-size: 12px;
              }
            }
            .sell-and-store {
              width: 100%;
              color: #b2b2b2;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 14px;
              padding-top: 5px;
              position: relative;
              .sell {
              }
              .address {
                line-height: 1.2;
                overflow: hidden;
                display: -webkit-box; //将对象作为弹性伸缩盒子模型显示;
                text-overflow: ellipsis; //溢出部分用省略号代替
                -webkit-line-clamp: 2; //设置文本显示两行
                margin-bottom: 5px;
                -webkit-box-orient: vertical;
                white-space: normal;
              }
              .store {
                position: absolute;
                right: 0;
                bottom: -10px;
                z-index: 2;
                height: 32px;
                display: flex;
                align-items: center;
                color: #666;
                .merchant-name {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  max-width: 2.5rem;
                }
                .more-store {
                  display: inline-block;
                  width: 6px;
                  height: 11px;
                  background: url("./img/More.png") no-repeat center;
                  background-size: 100% 100%;
                  margin-left: 5px;
                }
              }
            }
          }
        }
      }
      .v-loading {
        margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
        /deep/ .cube-loading-spinners {
          top: 40px !important;
          left: 48% !important;
          transform: translateX(-40%) !important;
        }
      }
      .null {
        font-size: .28rem;
        color: #999;
        text-align: center;
        padding: .6rem 0;
        padding-top: 100px;
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
    }
  }
</style>
