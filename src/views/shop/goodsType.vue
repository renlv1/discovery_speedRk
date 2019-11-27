<template>
  <div class="paymentCurrency-w main-container">
    <div class="app-header">
      <div class="back" @click="goBack">
        <div class="goback-icon"></div>
      </div>
      <div class="title">{{$t('addAddress.text26')}}</div>
    </div>
    <div class="wrap">
      <ul class="uls">
        <li class="item-currency"
            v-for="(item, index) in currencyData" :key="index"
            @click="switchOne(index, item)"
            :class="{'active': activeIndex === index}">
          <div>{{item.name}}</div>
        </li>
      </ul>
    </div>
    <div v-if="!currencyData.length" class="empty">
      <img src="@/assets/img/common/empty.png" alt="">
      <p>{{$t('common.empty')}}</p>
    </div>
    <div class="add-btn ">
      <div class="btn-save common-btn" @click="AddCategory">{{$t('categories.text64')}}</div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <!-- 下拉input容器 -->
    <rate-dialog
      v-if="rateShow"
      :rateShow="rateShow"
      :placeholderTip="placeholderTip"
      @hideDialog="hideDialog"
      @selectOne="okFun">
    </rate-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import Dialog from '@/components/dialog/index'
  import rateDialog from './rateDialog'

  export default {
    components: {rateDialog},
    data() {
      return {
        loadShow: true,
        activeIndex: 0,
        selectItem: '',
        currencyData: [],
        merchantData: JSON.parse(this.$store.state.merchantInfo),
        pageIndex: 1,
        rateShow: false,
        objData:  JSON.parse(this.$route.query.objData),
        placeholderTip: this.$t('addAddress.text29')
      }
    },
    props: {
      currency: String,
    },
    mounted() {
      this.getProductCatList()
    },
    created() {
      // if(this.$route.query.activeIndex) {
      //   this.activeIndex = this.$route.query.activeIndex
      // } else {
      //   this.activeIndex = 0
      // }
      if (Number(this.objData.activeIndex) === 0 || this.objData.activeIndex) {
          this.activeIndex = Number(this.objData.activeIndex)
          this.selectItem = this.objData.selectItem
        } else {
          this.activeIndex = 0
        }
    },
    methods: {
      switchOne(index, item) {
        this.activeIndex = index
        this.selectItem = item.name
        this.$router.push({
          path: '/addGoods',
          query: {
            objData: JSON.stringify(this.objData),
            activeIndex: index,
            selectItem: item.name
          }
        })
      },
      // 下拉的input容器触发取消
      hideDialog() {
        this.rateShow = false
      },
      // 下拉的input容器触发确认
      okFun(name) {
        this.$fetch.post(`${this.$api}shopMine/addMerchantProductCat`, {
          name: name
        }).then((res) => {
          if (res.status === 'success') {
            this.toastD(this.$t('addAddress.text30'))
            this.getProductCatList()
            this.rateShow = false
          } else {
            this.rateShow = false
            this.toastD(res.msg)
          }
        })
      },
      goBack() {
        console.log(this.selectItem)
        this.$router.push({
          path: '/addGoods',
          query: {
            objData: JSON.stringify(this.objData),
            activeIndex: this.activeIndex,
            selectItem:  this.selectItem
          }
        })
      },
      // 管理类目
      delCategory() {
        this.$router.push({
          path: '/categories',
          query: {
            id: this.$route.query.id
          }
        })
      },
      // 新增类目
      AddCategory() {
        this.rateShow = true
      },
      getProductCatList() {
        this.$http.post(`${this.$api}shopMine/getMerchantProductCatList?merchantId=${this.merchantData.id}&page=${this.pageIndex}&pageSize=20`).then((res) => {
          if(res.data.status === "success") {
            this.loadShow = false
            this.currencyData = res.data.data
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus">
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3) {
    .iosx.main-container{
      height: 100vh!important;
      overflow: hidden!important;
      padding  90px 0 0 !important
    }
    .wrap{
      height: 100%;
    }
  }
  .paymentCurrency-w
    font-size 14px
    background-color: #fff
    width 100%
    height 100%
    /*position: fixed*/
    /*z-index 100*/
    /*top: 0*/
    /*left: 0*/
    /*bottom 0*/
    /*width: 100%*/
    /*overflow hidden*/
    .wrap
      width 100%
      .uls
        .item-currency
          padding: 0 .3rem
          height: 1rem
          display: flex
          align-items center
          justify-content space-between
          color #060f26
          border-bottom: 1px solid #edeef0
          text-align: justify;
          text-justify: newspaper;
          word-break: break-all;
          &.active
            color rgb(255, 182, 75)
            .right
              border: .02rem solid #3495f1
              &::before
                content ''
                display: block
                width: .16rem
                height: .16rem
                border-radius 50%
                background-color: #3495f1
    .add-btn {
      width 100%
      text-align center
      background-color #ffb64b
      position fixed
      bottom 0
      left 0
      display: flex;
      cursor: pointer;
      user-select: none;
      height: 1.2rem;
      font-size: 16px;
      align-items center
      .btn-del {
        flex 1
        color #f14f34
        width 50%
        text-align center
        padding .1rem 0
      }
      .btn-save {
        flex 1
        color #fff
        background-color rgb(255, 182, 75)
        line-height 1rem
        text-align center
        /*border-right 2px solid #eeeff1*/
      }
    }
</style>
