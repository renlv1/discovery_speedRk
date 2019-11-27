<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="wrapper-title">{{Number($route.query.type) === 2 ? $t('yuBao.text10') : $t('yuBao.text11')}}</div>
      <div class="input-wrapper">
        <input class="most-value" v-model="value" :placeholder="placeHolderText" @input="checkInput('value')" />
        <label class="util">π</label>
      </div>
      <div class="already-num">{{this.tipText}}：{{Number($route.query.type) === 2 ? yueBaoBalance :
        userAccountBalance}} π
      </div>
      <div class="btn" @click="sure">{{$t('yuBao.text12')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {yueBaoBalance, yueBaoPutOut} from '@/api/fund'

export default {
  components: {mFixedTop},
  name: "fundDetail",
  data() {
    return {
      isGoBack: true,
      titleName: '',
      yueBaoBalance: '',
      userAccountBalance: '',
      value: '',
      placeHolderText: Number(this.$route.query.type) === 2 ? this.$t('yuBao.text13') : this.$t('yuBao.text14'),
      tipText: Number(this.$route.query.type) === 2 ? this.$t('yuBao.text15') : this.$t('yuBao.text16'),
      alreadyNum: ''
    }
  },
  mounted() {
    this.getBalance()
  },
  methods: {
    checkInput(field) {
      let val = this[field]
      if (!/^\d*\.{0,1}\d{0,4}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
    },
    getBalance() {
      yueBaoBalance().then((res) => {
        var i = 0
        this.yueBaoBalance = res.data.data.yueBaoBalance
        this.userAccountBalance = res.data.data.userAccountBalance
        console.log(this.yueBaoBalance, i++)
      })
    },
    sure() {
      let type = Number(this.$route.query.type)
      let successText = Number(this.$route.query.type) === 2 ? this.$t('yuBao.text19') : this.$t('yuBao.text20')
      if (Number(this.$route.query.type) === 2 && Number(this.value) > this.yueBaoBalance) {
        this.toastD(this.$t('yuBao.text17'))
      } else if (Number(this.$route.query.type) === 1 && Number(this.value) > this.$store.state.piBalance) {
        this.toastD(this.$t('yuBao.text18'))
      } else {
        if (this.value === '') {
          this.toastD(this.$t('yuBao.text21'))
        } else {
          yueBaoPutOut(this.value, type).then(res => {
            if (res.data.status === 'success') {
              this.toastD(successText)
              this.getBalance()
              this.value = ''
            } else {
              this.toastD(res.data.msg)
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    .wrapper-title
      font-size .24rem
      color #000
      margin-bottom .24rem
    .value
      color .3rem
      font-size .5rem
      margin-bottom .6rem
    .input-wrapper
      position relative
      width 100%
      height 1rem
      display flex
      flex-direction row
      align-items center
      .most-value
        width 100%
        margin-top .5rem
        font-size .3rem
        color #000
        padding-bottom .3rem
        border-bottom 1px solid #ccc
      .util
        position: absolute
        font-size 14px
        right 0
    .already-num
      font-size .24rem
      color #b79961
      padding-top .3rem
    .btn
      margin-top 2rem
      height 1rem
      text-align center
      line-height 1rem
      width 100%
      border 1px solid #b79961
      background-color #fff
      color #b79961
      font-size .32rem
</style>
