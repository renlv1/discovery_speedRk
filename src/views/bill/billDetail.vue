<template>
  <div class="bill-detail">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="detail-top"
           :class="{isOrange: billType(detailObj.paymentType, 3) === '+', isRed: billType(detailObj.paymentType, 3) === '-'}">
        <p class="amount">{{billType(detailObj.paymentType, 3)}} {{detailObj.amount}} <span class="util">{{detailObj.currency === 'PAI' ? 'π' : detailObj.currency}}</span>
        </p>
        <p class="description">{{tranStatus(detailObj.state)}}</p>
      </div>
      <div class="detail-list">
        <p><span class="list-key">{{$t('bill.billDetail.text1')}}</span><span class="list-value">{{billType(detailObj.paymentType, 1)}}<span v-if="detailObj.otherNick">({{detailObj.otherNick}})</span></span></p>
        <p><span class="list-key">{{$t('bill.billDetail.text2')}}</span><span class="list-value">{{detailObj.id}}</span></p>
        <p v-if="this.detailObj.paymentType === 2"><span class="list-key">{{$t('bill.billDetail.text3')}}</span><span
          class="list-value">{{detailObj.sendAddress}}</span></p>
        <p v-if="this.detailObj.paymentType === 1"><span class="list-key">{{$t('bill.billDetail.text4')}}</span><span class="list-value">{{detailObj.receiveAddress}}</span>
        </p>
        <p v-if="this.detailObj.paymentType === 178 ||
                 this.detailObj.paymentType === 179 ||
                 this.detailObj.paymentType === 180 ||
                 this.detailObj.paymentType === 181 ||
                 this.detailObj.paymentType === 182 ||
                 this.detailObj.paymentType === 183 ||
                 this.detailObj.paymentType === 185">
          <span class="list-key">{{$t('bill.billDetail.text5')}}</span><span class="list-value">{{detailObj.orderId}}</span>
        </p>
        <p><span class="list-key">{{$t('bill.billDetail.text6')}}</span><span class="list-value">{{$changeDate(detailObj.createAt, '.')}}</span>
        </p>
        <p><span class="list-key">{{$t('bill.billDetail.text7')}}</span><span class="list-value">{{$changeDate(detailObj.updateAt, '.')}}</span>
        </p>
      </div>
    </div>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {billRecordDetail} from '../../api/bill'
import {mapGetters} from 'vuex'

export default {
  components: {mFixedTop},
  data() {
    return {
      isShow: true,
      titleName: this.$t('bill.billDetail.title'),
      detailObj: {} // 订单详情对象
    }
  },
  created() {
    this._getDetail()
  },
  computed: {
    ...mapGetters([
      'address'
    ])
  },
  methods: {
    _getDetail() {
      let id = this.$route.params.id
      billRecordDetail(id).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          this.detailObj = res.data.data
        } else {
          this.toastD(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .v-content-wrapper
    .detail-top
      display flex
      flex-direction column
      justify-content center
      height 1.8rem
      width 100%
      border-radius .08rem
      text-align center
      &.isOrange {
        background-color #faf0f1
      }
      &.isRed
        background-color #fbf5e7
      .amount
        font-size .34rem
        .util
          color #b79961
      .description
        margin-top .2rem
        font-size .28rem
    .detail-list
      margin-top .5rem
      font-size .28rem
      p
        width 100%
        display flex
        justify-content space-between
        flex-direction row
        align-items center
        height 1.1rem
        border-1px-bottom(#e6e6e6)
        font-size 12px
        .list-key
          color #999
        .list-value
          text-align right
          word-wrap break-word
          width 80%
          color 000
</style>
