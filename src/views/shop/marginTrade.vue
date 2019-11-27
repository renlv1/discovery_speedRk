<template>
  <div class="paymentCurrency-w main-container">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <cube-scroll
      ref="scroll"
      :options="options"
      :data="bailRecordList"
      class="uls-item"
      @pulling-up="onPullingDown">
      <div class="wrap">
        <div class="text1">{{$t('hiddenSetting.text38')}}</div>
        <div class="text2">{{restBail}}π</div>
        <div class="btn-w">
          <!--          您已支付足够保证金-->
          <div class="btn-c" v-show="bailFlag === 2">
            <img src="../../assets/img/shop/icon_ok.png" alt="">
            <span>{{$t('hiddenSetting.text39')}}</span>
          </div>
          <!--          需缴纳-->
          <div v-show="bailFlag === 1" class="btn-nopay" @click="payMoney">
            <div class="left-btn">
              <div class="warning"><img src="@img/shop/warning.png" alt=""></div>
              <div>{{$t('hiddenSetting.text40')}}：{{canPayBail}}π</div>
            </div>
            <div class="gopay">{{$t('hiddenSetting.text41')}}</div>
          </div>
          <!--          支付中-->
          <div class="btn-c" v-show="bailFlag === 3">
            <img src="@img/shop/warning.png" alt="">
            <span>{{$t('hiddenSetting.text62')}}</span>
          </div>
        </div>
        <div class="d-top">{{$t('hiddenSetting.text42')}}</div>
        <ul class="uls-a">
          <li class="list-a" v-for="(item, index) in bailRecordList" :key="index">
            <div class="flex-i">
              <span>{{payFlag(item.payFlag)}}</span>
              <span :class="{'add-num': item.payFlag === 3}">{{isAdd(item.payFlag)}}{{item.amount}} π</span>
            </div>
            <div class="flex-i two-flex">
              <span class="time">{{$changeDate(item.createAt, '.')}}</span>
            </div>
          </li>
          <div v-show="dataShow" class="empty">
            <img src="@/assets/img/common/empty.png" alt="">
            <p>{{$t('common.empty')}}</p>
          </div>
          <p class="no-more" v-show="moreShow">{{$t('hiddenSetting.text43')}}</p>
        </ul>
      </div>
    </cube-scroll>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <div v-if="!bailRecordList.length" class="empty">
      <img src="@/assets/img/common/empty.png" alt="">
      <p>{{$t('common.empty')}}</p>
    </div>
    <pay-dialog :title="$t('commonBountyHunter.text11')" ref="payDialog" @paySubmit="paySubmit"></pay-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/index'
import mFixedTop from '@/components/mFixedTop'
import {mapGetters} from 'vuex'
import payDialog from '@/components/pay/payPopup'

export default {
  data() {
    return {
      titleName: this.$t('hiddenSetting.text37'),
      dataShow: false,
      payShow: false,
      switchFlag: true,
      loadMore: true,
      activeIndex: 0,
      bailRecordList: [],
      moreShow: false,
      bailFlag: '', // 1保证金不足 2保证金足够
      restBail: '', //剩余保证金
      pageIndex: 1,
      pageSize: 20,
      payAmount: '',
      payWhere: '',
      canPayBail: '', // 需支付的保证金
      loadShow: true,
      options: {
        pullUpLoad: true
      },
      payId: '' // 支付id
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  components: {
    payDialog, mFixedTop
  },
  created() {
  },
  mounted() {
    this.getQueryMerchantBail()
    this.getmerchantPayBail()
  },
  methods: {
    payMoney() {
      this.$refs.payDialog.showModel()
    },
    paySubmit() {
      let tradePwd = this.$refs.payDialog.getPasswordVal
      let mobileCode = this.$refs.payDialog.getCodeVal
      this.$http.post(`${this.$api}pay/payOrder?id=${this.payId}&tradePwd=${tradePwd}&mobileCode=${mobileCode}`).then((res) => {
        if (res.data.status === 'success') {
          this.$refs.payDialog.closeModel()
          setTimeout(() => {
            this.pageIndex = 1
            this.bailRecordList = []
            this.getQueryMerchantBail()
            // this.bailFlag = 3
          }, 500)
        } else {
          this.$refs.payDialog.errMsg = res.data.msg
        }
      })
    },
    payFlag(flag) {//标识 1:交保证金 2:赔付 3:退保证金
      if (flag === 1) return this.$t('hiddenSetting.text46')
      if (flag === 2) return this.$t('hiddenSetting.text47')
      if (flag === 3) return this.$t('hiddenSetting.text48')
    },
    isAdd(flag) {
      if (flag === 3) return '+'
      return '-'
    },
    inputSwitch(index) {
      this.activeIndex = index
    },
    getmerchantPayBail() {
      this.$http.post(`${this.$api}shopMine/merchantPayBail`).then(res => {
        if (res.data.status === 'success') {
          // 用户没有支付保证金
          // this.bailFlag = 1
          this.canPayBail = res.data.data.amount
          this.payId = res.data.data.payId
        }
      })
    },
    onPullingDown() {
      this.getQueryMerchantBail()
    },
    getQueryMerchantBail () {
      this.$http.post(`${this.$api}shopMine/merchantBailList?pageIndex=${this.pageIndex}&pageSize=20`).then((res) => {
       if(res.data.status === 'success') {
           this.loadShow = false
           this.restBail = res.data.mapData.restBail
           this.bailFlag = res.data.mapData.bailFlag
           const _list = res.data.data.list
           if (_list.length) {
             this.bailRecordList.push(..._list)
             this.pageIndex++
           } else {
             this.$refs.scroll.forceUpdate()
           }
        }
      })
    },
  }
}
</script>

<style scoped lang="stylus">
  .main-container
    padding 60px 0 0!important
  .iosx
    .main-container
      padding 90px 0 0!important
  .paymentCurrency-w
    background-color: #fff
    height 100vh
    overflow hidden
    .btn-nopay
      display: flex
      align-items center
      justify-content space-between
      background-color: #ffeed4
      border-radius .5rem
      padding: 0 .4rem
      height: 1rem
      .left-btn
        font-size: .28rem
        color #060f26
        display: flex
        align-items center
        .warning
          width: .34rem
          margin-right: .2rem
          img
            width: 100%
      .gopay
        width: 1.4rem
        height: .52rem
        display: flex
        align-items center
        justify-content center
        font-size: .24rem
        color #fff
        background-color: #ffa727
        border-radius .26rem
    .text1
      text-align: center
      font-size: .3rem
      color #b2b2b2
      padding-top: .78rem
      margin: 0 0 .3rem
    .text2
      font-size: .48rem
      color #060f26
      text-align: center
    .btn-w
      padding: 0 .3rem
      margin: .8rem 0 .38rem
      .btn-c
        width: 100%
        height: 1rem
        border-radius 1rem
        background-color: #ffedd4
        display: flex
        align-items center
        justify-content center
        span
          font-size: .28rem
          color #060f26
        img
          width: .44rem
          margin-right: .14rem
    .d-top
      font-size: .28rem
      background-color: #f5f5f7
      color #999
      line-height: .88rem
      padding-left: .3rem
    .uls-item
      position relative
      /*height 6.7rem*/
      overflow hidden
      .wrap
        .uls-a
          padding: 0 .3rem
          height 100%
          .no-more
            text-align: center
            font-size: .28rem
            color #b2b2b2
            padding-top: .5rem
          .list-a
            border-bottom: 1px solid #eeeff1
            padding: .3rem 0
            .two-flex
              margin-top: .22rem
            .flex-i
              display: flex
              align-items center
              justify-content space-between
              span
                font-size: .28rem
              .light
                color #3495f1
              .time
                color #999
              .add-num
                color #3495f1
    .v-loading
      top: 65%;
    .empty
      position fixed
      top: 65%;
      left: 50%;
      text-align: center;
      padding: 1rem 0;
      font-size: .28rem;
      color: #b2b2b2;
      z-index: 2;
      transform translate(-40%, -50%)
      background none
      img
        width: 2.2rem;
        margin: 0 0 .3rem .56rem;
</style>
