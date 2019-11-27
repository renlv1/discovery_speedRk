<template>
  <div class="paymentCurrency-w main-container">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="wrap">
      <div class="f-c">
        <div class="f-item">
          <span>{{$t('hiddenSetting.text50')}}</span>
          <cube-switch v-model="switchFlag"></cube-switch>
        </div>
        <div class="f-item" v-show="!switchFlag">
          <span>{{$t('hiddenSetting.text51')}}</span>
          <div class="right">
            <input type="text" :placeholder="$t('hiddenSetting.text52')" class="input" v-model.trim="money"
                   @input="inputNum('money')">
            <span>π</span>
          </div>
        </div>
        <div class="f-item" v-show="!switchFlag">
          <span>{{$t('addAddress.text75')}}</span>
          <div class="right" @click="showCompanyList()">
            <span>{{company}}</span>
          </div>
        </div>
      </div>
      <div class="btn-w" @click="saveFn">
        <div class="btn">{{$t('hiddenSetting.text53')}}</div>
      </div>
    </div>
    <ul class="list" v-show="showList">
      <li @click="chooseCompany(item)" v-for="item in list" :key="item.index">{{item.expressName}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import mFixedTop from '@/components/mFixedTop'

export default {
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('hiddenSetting.text49'),
      pageIndex: 1,
      money: '',
      switchFlag: true,
      currencyData: ['л', 'USD', 'TIP'],
      showList: false,
      list: [],
      company: '顺丰',
      companyId: 1
    }
  },
  mounted() {
    this.getCompanyList()
    this.getDetials()
  },
  methods: {
    showCompanyList() {
      this.showList = true
    },
    getCompanyList() {
      this.$http.post(`${this.$api}shopMine/queryExpressList?pageIndex=${this.pageIndex}&pageSize=20`).then((res) => {
        this.list = res.data.data
      })
    },
    chooseCompany(item) {
      // 选择公司
      this.company = item.expressName
      this.companyId = item.id
      this.showList = false
    },
    inputNum(field) {
      let val = this[field]
      if (!/^\d*\.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
    },
    getDetials() {
      this.$http.post(`${this.$api}shopMine/getMerchantInfo`).then((res) => {
        if (res.data.status === 'success') {
          let bountyMerchantRecord = res.data.data.merchantInfo
          if (bountyMerchantRecord.freeMailFlag === 1) {
            this.switchFlag = true
          } else {
            this.switchFlag = false
            this.company = bountyMerchantRecord.expressName
            this.money = bountyMerchantRecord.courierFee
            this.companyId = bountyMerchantRecord.expressId
          }
        }
      })
    },
    saveFn() {
      let freeMailFlag
      if (this.switchFlag === true) {
        freeMailFlag = 1
      } else {
        if (this.money === '') {
          this.toastD(this.$t('hiddenSetting.text54'))
          return
        }
        freeMailFlag = 0
      }
      this.$http.post(`${this.$api}shopMine/setMerchantCourierFee?courierFee=${this.money}&freeMailFlag=${freeMailFlag}&expressId=${this.companyId}`).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('hiddenSetting.text55'))
          setTimeout(() => {
            this.$router.push('/openShop')
          }, 500)
        } else {
          this.toastD(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .paymentCurrency-w
    background-color: #fff
    .wrap
      .f-c
        height: 2rem
        margin-bottom: 2.8rem
      .f-item
        padding: 0 .3rem
        border-bottom: 1px solid #dcdde1
        height: 1rem
        display: flex
        align-items center
        justify-content space-between
        span
          font-size: .28rem
          color #060f26
        .right
          display: flex
          align-items center
          .input
            height: 1rem
            text-align: right
            padding-right: .2rem
            font-size .2rem
      .btn-w
        padding: 0 .3rem
        .btn
          width: 100%
          height: 1rem
          display: flex
          align-items center
          justify-content center
          border-radius 4px
          font-size: .28rem
          color #fff
          background-color: #ffb64b
    .list {
      margin-top 90px
      padding 0 .3rem
      font-size .32rem
      width 100%
      position absolute
      top 0
      background-color #fff
      li {
        width 100%
        margin-top 10px
        height .8 rem
        line-height .8rem
      }
    }
</style>
