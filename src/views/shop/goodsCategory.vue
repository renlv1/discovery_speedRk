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
    <div class="btn-box common-btn">
      <div class="btn-save common-btn" @click="AddCategory">{{$t('categories.text64')}}</div>
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
      activeIndex: 0,
      selectItem: {},
      currencyData: [],
      merchantData: JSON.parse(this.$store.state.merchantInfo),
      pageIndex: 1,
      rateShow: false,
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
    if (this.currency === this.$t('addAddress.text10')) {
      this.activeIndex = 0
    } else if (this.currency === this.$t('addAddress.text25')) {
      this.activeIndex = 1
    }
  },
  methods: {
    switchOne(index, item) {
      this.activeIndex = index
      this.selectItem = item
      this.$emit('select', item)
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
      this.$emit('hide')
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
        this.currencyData = res.data.data
      })
    },
  }
}
</script>

<style scoped lang="stylus">
  .main-container
    overflow hidden!important
  .paymentCurrency-w
    height 100vh
    font-size 14px
    background-color: #fff
    position: fixed
    z-index 100
    top: 0
    left: 0
    bottom 0
    width: 100%
    overflow hidden
    .wrap
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
    .btn-box {
      text-align center
      background-color #fff
      border-top 1px solid #dcdde1
      position: fixed;
      bottom: 0;
      left 0
      width: 100%;
      display: flex;
      cursor: pointer;
      user-select: none;
      height: 1rem;
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
        width 50%
        line-height 1rem
        text-align center
        z-index 999
        /*border-right 2px solid #eeeff1*/
      }
    }
</style>
