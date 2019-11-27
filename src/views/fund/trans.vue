<template>
  <div>
    <m-fixed-top :titleName="titleName" :isGoBack="isGoBack"></m-fixed-top>
    <div class="v-content-wrapper">
      <div class="top-title">{{tip}}</div>
      <div class="input-wrapper">
        <input class="v-placeholder-text" v-model.trim="value" :placeholder="$t('fund.text78')" @input="checkInput('value')" />
        <label class="unit">π</label>
      </div>
      <div class="value-tip">{{this.$t('fund.text75') + titleName}}{{Number($route.query.type) === 0 ? inputQuota : outputQuota}} π</div>
      <div class="tip" v-if="Number($route.query.type) === 0">{{this.$t('fund.text76')}}</div>
      <div class="btn" @click="trans">{{this.$t('fund.text77')}}</div>
    </div>
  </div>
</template>

<script>

import mFixedTop from '@/components/mFixedTop'
import {getPurseQuota, inputPaiPurse, outputPaiPurse} from '@/api/fund'

export default {
  name: "trans",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: Number(this.$route.query.type) === 0 ? this.$t('fund.text79') : this.$t('fund.text80'),
      tip: Number(this.$route.query.type) === 0 ? this.$t('fund.text81') : this.$t('fund.text82'),
      inputQuota: '',
      outputQuota: '',
      value: ''
    }
  },
  mounted() {
    this.getQuota()
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
    getQuota() {
      getPurseQuota().then((res) => {
        this.inputQuota = res.data.data.inputQuota
        this.outputQuota = res.data.data.outputQuota
      })
    },
    trans() {
      if (Number(this.$route.query.type) === 0 && Number(this.value) > Number(this.inputQuota)) {
        this.toastD(this.$t('fund.text83'))
      } else if (Number(this.$route.query.type) === 1 && Number(this.value) > Number(this.outputQuota)) {
        this.toastD(this.$t('fund.text84'))
      } else {
        if (this.value === '') {
          this.toastD(`${this.$t('fund.text85')}${this.titleName}${this.$t('fund.text86')}`)
        } else {
          if (Number(this.$route.query.type) === 0) {
            inputPaiPurse(this.value).then((res) => {
              if (res.data.status === 'success') {
                this.toastD(this.$t('fund.text87'))
                this.value = ''
              } else {
                this.toastD(res.msg)
              }
            })
          } else if (Number(this.$route.query.type) === 1) {
            outputPaiPurse(this.value).then((res) => {
              if (res.data.status === 'success') {
                this.toastD(this.$t('fund.text88'))
                this.value = ''
              } else {
                this.toastD(res.msg)
              }
            })
          }
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
    .top-title
      font-size .28rem
      margin-bottom .2rem
    .input-wrapper
      height 1rem
      align-items center
      display flex
      flex-direction row
      justify-content space-between
      border-bottom 1px solid #000
      margin-bottom .4rem
      .v-placeholder-text
        font-size .34rem
      .unit
        font-size .3rem
    .value-tip
      font-size .24rem
      color #b79961
    .tip
      margin-top .17rem
      font-size .24rem
      color #999
    .btn
      width 100%
      border-radius 5px
      margin-top 1.6rem
      font-size .32rem
      border 1px solid #b79961
      color #b79961
      height 1rem
      line-height 1rem
      text-align center
</style>
