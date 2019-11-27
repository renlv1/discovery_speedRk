<template>
  <div class="paiPay">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="m-c">
      <div class="title-m">{{noAssignAmount}}π</div>
      <div class="btn" @click="toGet()">{{$t('paiPay.text3')}}</div>
      <div class="c-d">{{$t('paiPay.text4')}}</div>
    </div>
    <ul class="tab-ul">
      <li class="li-tab" v-for="(item,index) in tabArr" @click="switchFn(index)" :key="index">
        <div class="li-t" :class="{tabLi: tabShow === index}">{{item}}</div>
        <div :class="{tabActive: tabShow === index}"></div>
      </li>
    </ul>
    <div class="list-box">
      <ul class="parent" :class="{ipadActive: ipadShow}">
        <cube-scroll
          ref="scroll"
          :options="options"
          :data="list"
          @pulling-up="onPullingDown">
          <li class="li-items" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
            <div class="left-box">
              <div class="left-t">{{$t('paiPay.text6')}}{{item.id}}</div>
              <div class="left-b">{{$t('paiPay.text7')}}{{item.presentCount - item.alreadyPresentCount}}</div>
            </div>
            <div class="right-box">
<!--              <div class="right-t">{{assignType(item.assignType)}}</div>-->
              <div class="wait-t">
                {{$t('myPiOrder.text33')}}:
              </div>
              <div class="right-b">{{item.paitotal}} π</div>
            </div>
          </li>
          <div v-if="!list.length" class="empty">
            <img src="@/assets/img/common/empty.png" alt="">
            <p>{{$t('common.empty')}}</p>
          </div>
        </cube-scroll>
      </ul>
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
    </div>
    <slideDialog
      :merchantShow="merchantShow"
      :merchantsType="appliType"
      @selectOne="selectOne"
      @hideDialog="hideDialog">
    </slideDialog>
<!--    <m-map  v-if="mapShow"-->
<!--            :titleName="titleName"-->
<!--            :btnName="btnName"-->
<!--            @hideMap="hideMap"-->
<!--            @getPosition="getPosition"></m-map>-->
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import slideDialog from '@/components/slideDialog'
// import  mMap from '../shop/hiddenSetting/myMap'

export default {
  data() {
    return {
      loadShow: false,
      tabShow: 0,
      tabArr: [this.$t('myPiOrder.text34'), this.$t('myPiOrder.text35')],
      ipadShow: false,
      titleName: this.$t('paiPay.text8'),
      btnName: this.$t('paiPay.text9'),
      noAssignAmount: '', // 待返还金额
      mapShow: false,
      title: this.$t('paiPay.text10'),
      merchantShow: false,
      appliType: [this.$t('paiPay.text11'), this.$t('paiPay.text18'), this.$t('paiPay.text19')],
      currentType: this.$t('paiPay.text11'),
      longitude: 0, // 经度
      latitude: 0, // 纬度
      list: [],
      pageIndex: 1,
      pageSize: 10,
      variable: 'https://discoverypi.blob.core.windows.net/',
      profitUserType: 1, //1全部 2仅买家 3仅卖家
      status: 1, // 1未返还 2已返还
      page: 1
    }
  },
  components: {
    // vLoading: resolve => require(['@/components/loading.vue'], resolve),
    slideDialog,
    mFixedTop,
    // mMap
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
    assignType(type) {
      if (type === 1) {
        return '累计'
      } else if (type === 2) {
        return '分发'
      }
    },
    switchFn(index) {
      this.tabShow = index
      this.profitUserType = index + 1
      this.pageIndex = 1
      this.list = []
      this.loadShow = true
      this.getData()
    },
    getData() {
      this.$fetch.post(`${this.$api}shopMine/getOrderPresentMapListOfMe`,{
        // orderId: this.$route.query.orderId,
        // status: this.status,
        page: this.pageIndex,
        pageSize: this.pageSize,
        profitUserType: this.profitUserType
      }).then((res) => {
        if (res.status === 'success') {
          this.loadShow = false
          const _list = res.data
          // this.noAssignAmount = res.data.noAssignAmount
          if (_list.length) {
            this.list.push(..._list)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.loadShow = false
          this.toastD(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getPosition(pos, address) {
      if (address !== '') {
        this.$fetch.post('/bountyorder/userAssignOrderPresent', {
          longitude: pos.lng,
          latitude: pos.lat,
        }).then(res => {
          if (res.status === 'success') {
            this.toastD(this.$t('paiPay.text12'))
            this.pageIndex = 1
            this.getData()
            setTimeout(() => {
              this.mapShow = false
            }, 1000)
          } else {
            this.toastD(res.msg)
          }
        })
      } else {
        this.toastD(this.$t('paiPay.text13'))
      }
    },
    getAmount() {
      this.$fetch.post(`${this.$api}shopMine/queryOrderPresentTotal`).then((res) => {
        if (res.status === 'success') {
          this.noAssignAmount = res.data.presentOrderNoAssignAmount
        }
      })
    },
    // 立即领取
    toGet() {
      if (this.noAssignAmount >= 0.1) {
        this.$fetch.post(`${this.$api}shopMine/assignOrderPresent?assignAmount=${this.noAssignAmount}`).then((res) => {
          if (res.status === 'success') {
            this.pageIndex = 1
            this.list = []
            this.getAmount()
            this.getData()
            this.toastD(this.$t('myPiOrder.text36'))
          } else {
            this.toastD(this.$t('myPiOrder.text37'))
          }
        })
      } else {
        this.mapShow = true
        this.$createDialog({
          content: this.$t('paiPay.text14'),
          confirm: {
            text: this.$t('paiPay.text15')
          }
        }).show()
      }
    },
    positon2(pos) {
      this.latitude = pos.lat
      this.longitude = pos.lng
      this.mapShow = false
    },
    hideMap() {
      this.mapShow = false
    },
    changeFn() {
      this.merchantShow = true
    },
    hideDialog() {
      this.merchantShow = false
    },
    selectOne(item, index) {
      this.pageIndex = 1
      this.currentType = item
      this.merchantShow = false
      this.profitUserType = index + 1
      this.list = []
      this.getData()
    },
    buyStatus(type) {
      if (type === 1) return this.$t('paiPay.text16')
      if (type === 2) return this.$t('paiPay.text17')
    },
    toDetail(item) {
      // let obj = {
      //   orderId: item.id,
      //   paitotal: item.paitotal
      // }
      this.$router.push({
          path: '/paiPayDetail',
          query: {
            mapData: JSON.stringify(item),
            profitUserType: this.profitUserType
          }
        },
      )
    },
    onPullingDown() {
      this.getData()
    }
  },
  mounted() {
    this.getData()
    this.getAmount()
    if (/iphone/gi.test(navigator.userAgent)) {
      if (screen.height >= 812 && screen.height < 1024) {
        document.documentElement.classList.add('iosx')
      } else if (screen.height >= 1024) {
        document.documentElement.classList.add('ipad')
      } else {
        document.documentElement.classList.add('ios')
      }
    } else if (/iPad/gi.test(navigator.userAgent)) {
      document.documentElement.classList.add('ipad')
      this.ipadShow = true
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .paiPay
      padding-top: 65px

  .iosx
    .paiPay
      padding-top: 90px

  .paiPay
    background-color #fff
    height 100vh
    overflow hidden
  .m-c {
    text-align center
    background-color #fff
    padding .5rem 0 1rem
    .title-m {
      font-size .48rem
      color #060f26
    }
    .btn {
      margin .6rem auto .2rem
      background-color #ffb64b
      height .78rem
      width 2.6rem
      border-radius .39rem
      color #fff
      font-size .28rem
      line-height .78rem
      text-align center
    }
    .c-d {
      font-size .24rem
      color #b2b2b2
    }
  }

  .back-box {
    background-color #f5f5f7
    display flex
    justify-content space-between
    padding .3rem
    font-size .28rem
    color #060f26
    .choose {
      display flex
      align-items center
      .current {
        margin-right .2rem
      }
      img {
        width .11rem
        height .21rem
      }
    }
  }

  /*.iosx*/
  /*  top: 7.5rem;*/
  .ios {
    .parent {
      top: 1rem;
    }
  }

  .iosx {
    .list-box {
      .parent {
        width: 100%;
        overflow: hidden;
        /*position: fixed;*/
        /*top: 7rem;*/
        /*left: 0;*/
        /*bottom: 0;*/
        /*padding 0 .3rem*/
        .li-items {
          border-bottom 1px solid #eeeff1
          padding .2rem 0
          .left-box {
            display flex
            justify-content space-between
            align-items center
            font-size .28rem
            color #b2b2b2
            margin-bottom .2rem
          }
          .right-box {
            display flex
            /*justify-content space-between*/
            align-items center
            font-size .28rem
            .right-t {
              color #060f26
            }
            .right-b {
              color #ffb64b
            }
          }
        }
      }
    }
  }

  .list-box {
    .parent {
      width: 100%;
      overflow: hidden;
      height calc(100vh - 6rem)
      padding 0 .3rem
      &.ipadActive {
        top: 5.7rem !important
      }
      .li-items {
        border-bottom 1px solid #eeeff1
        padding .2rem 0
        .left-box {
          display flex
          justify-content space-between
          align-items center
          font-size .28rem
          color #b2b2b2
          margin-bottom .2rem
        }
        .right-box {
          display flex
          /*justify-content space-between*/
          align-items center
          font-size .28rem
          .right-t {
            color #060f26
          }
          .right-b {
            color #ffb64b
          }
        }
      }
    }
  }
.tab-ul{
    display flex
    background-color: #fff;
    width: 100%;
    height 1.3rem
    border-radius: 22px;
    margin-top -.5rem
    .li-tab{
      padding-top .5rem
      flex 1
      text-align center
      display flex
      flex-direction column
      align-items center
      .li-t{
        font-size .28rem
        color #060f26
        &.tabLi {
          color #ffb64b
        }
      }
      .tabActive{
        margin-top .3rem
        width 1rem
        border-radius 2px
        height .04rem
        background #ffb64b
      }
    }
  }
</style>
