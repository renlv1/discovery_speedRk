<template>
  <div class="shippingAddress">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <ul class="parent-ul">
      <cube-scroll
        ref="scroll"
        :options="options"
        :data="list"
        @pulling-up="onPullingDown">
        <li v-for="(item,index) in list" :key="index" class="li-item" @click="chooseAddress(item)">
          <div class="li-top">
            <div class="number">{{item.realName}}</div>
            <div class="money">+{{item.phone}}</div>
          </div>
          <div class="li-d">
            <div class="address-box">
              <span class="default" v-if="item.defaultFlag === 2">{{$t('shippingAddress.text27')}}</span>
              <span class="address-c">{{item.district}}{{item.realAddress}}</span>
            </div>
            <div class="edit-main">
              <span class="default" v-if="item.defaultFlag !== 2" @click.stop="defaultFn(item.id)">设为默认</span>
              <div class="edit-box" @click.stop="addAddress(2, item)">
                <div class="go-edit">{{$t('shippingAddress.text24')}}</div>
              </div>
            </div>
          </div>
        </li>
      </cube-scroll>
    </ul>
    <div class="btn-add common-btn" @click="addAddress(1, '')">{{$t('shippingAddress.text25')}}</div>
    <div v-if="!list.length" class="empty">
      <img src="@/assets/img/common/empty.png" alt="">
      <p>{{$t('common.empty')}}</p>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('sellShip.text8'),
      list: [], // 收货地址数组
      pageIndex: 1
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          txt: {
            // more: this.$t('common.loading'),
            // noMore: this.$t('common.noMore')
          }
        }
      }
    }
  },
  methods: {
    defaultFn(id) {
      this.$http.post(`${this.$api}shopMine/setOrderReceiptOfDefault?receiptId=${id}`).then(res => {
        if(res.data.status === 'success') {
          this.toastD(this.$t('addAddress.text5'))
          this.list = []
          this.pageIndex = 1
          this.getData()
        }
      })
    },
    setDefaultAddress() {
      this.$http.post(`${this.$api}shopMine/setOrderReceiptOfDefault?receiptId=${this.$route.query.id}`).then(res => {
        if(res.data.status === 'success') {
          this.toastD(this.$t('addAddress.text5'))
        }
      })
    },
    chooseAddress(item) {
      if (Number(this.$store.state.enterFlag) === 1) {
        this.$router.push({
          path: '/confirmOrder',
          query: {
            merchant: this.$route.query.merchant,
            item: item
          }
        })
      } else if (Number(this.$store.state.enterFlag) === 0) {
        this.$router.push({
          path: '/confirmOrder',
          query: {
            flag: 2,
            productId: this.$route.query.productId,
            id: item.id
          }
        })
      } else {
        return false
      }
    },
    goPath() {
      if (Number(this.$store.state.enterFlag) === 1) {
        this.$router.push({
          path: '/confirmOrder',
          query: {
            merchant: this.$route.query.merchant,
          }
        })
      } else if (Number(this.$store.state.enterFlag) === 0) {
        this.$router.push({
          path: '/confirmOrder',
          query: {
            productId: this.$route.query.productId,
          }
        })
      } else if (Number(this.$store.state.enterFlag) === 2) {
        this.$router.push('/myShop')
      }
    },
    addAddress(flag, item) {
      // flag  标识是编辑还是新增(1为新增， 2为编辑)
      if (this.$route.query.merchant) {
        this.$router.push({
          path: '/addAddress',
          query: {
            flag: flag,
            merchant: this.$route.query.merchant,
            id: item.id
          }
        })
      } else if (this.$route.query.productId) {
        this.$router.push({
          path: '/addAddress',
          query: {
            flag: flag,
            productId: this.$route.query.productId,
            id: item.id
          }
        })
      } else {
        this.$router.push({
          path: '/addAddress',
          query: {
            flag: flag,
            id: item.id
          }
        })
      }
    },
    getData() { // 查询收货地址列表
      this.$http.post(`${this.$api}shopMine/queryOrderReceiptList?pageIndex=${this.pageIndex}&pageSize=10`).then((res) => {
        if (res.status) {
          let _list = res.data.data
          if (_list.length) {
            this.list.push(..._list)
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .shippingAddress
      padding-top: 65px

  .iosx
    .shippingAddress
      padding-top: 90px

  .shippingAddress {
    background-color #fff
  }

  .parent-ul {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100vh - 60px);
    overflow: hidden;
    padding-top: 44px;
    background: #fff;
    .iosx & {
      padding-top: 80px;
    }
    .ios & {
      padding-top: 70px;
    }
    .li-item {
      padding .5rem .3rem .3rem
      border-bottom 10px solid #eeeff1
      .li-top {
        margin-bottom .2rem
        display flex
        font-size .28rem
        color #060f26
        .number {
          font-weight bold
          margin-right .4rem
        }
      }
      .li-d {
        font-size .28rem
        color #060f26
        /*display flex*/
        /*justify-content space-between*/
        /*align-items center*/
        .edit-main{
          width 100%
          display flex
          justify-content flex-end
          align-items center
          .default {
            display inline-block
            color #ffb64b
            border-radius .2rem
            text-align center
            font-size .28rem
            margin-right 1rem
            width .8rem
            height .4rem
            line-height .4rem
            white-space nowrap
            /*background-color #ffb64b*/
          }
        }
        .address-box {
          /*display flex*/
          padding-right .2rem
          /*border-right 1px solid #e3e4e6*/
          .address-c{
            line-height 1.45
          }
          .default {
            display inline-block
            color #fff
            border-radius .2rem
            text-align center
            font-size .14rem
            margin-right .16rem
            width .8rem
            height .4rem
            line-height .4rem
            background-color #ffb64b
            &.set-default{
              width .8rem
              height .5rem
            }
          }
        }
        .edit-box {
          white-space nowrap
          width 1rem
          color #ffb64b
        }
      }
    }
  }

  .btn-add {
    background-color #ffb64b
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    height: 1rem;
    line-height 1rem
    font-size: .32rem;
    color: #fff;
    z-index 999
  }
</style>
