<template>
  <div>
    <transition name="dialog">
      <div class="dialog"  @click="hide" v-if="rateShow">
      </div>
    </transition>
    <transition name="fade-up">
      <div class="dialog-w" v-if="rateShow" :class="{'fixed': fixedShow,'ended': endedShow}">
        <div @click.stop>
          <div class="title">{{title}}</div>
          <div class="close" @click.prevent="hide">{{$t('goodmanage.text91')}}</div>
          <div class="input-box">
            <input type="number" :placeholder="placeholderTip" v-model="number" @input="inputNum('number')" @focus="checkInput">
            <div v-show="fIndex === 0" class="currency">{{currency}}</div>
          </div>
          <div class="ok-btn" @click.prevent="switchOne" >{{$t('goodmanage.text92')}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      number: '',
      isADD: false,
      isTips: true,
      title: '',
      fixedShow: false,
      endedShow:false,
      placeholderTip: ''
    }
  },
  props: {
    rateShow: Boolean,
    inputNumber: String,
    fIndex: Number, // 0 出售价格  1 返还比例
    currency: String,
    productPrice: {
      type: Number
    },
    productProfitRate:{
      type: Number
    },
  },
  created () {
    this.number = ''
    if (this.fIndex === 0) {
      this.isTips = true
      this.isADD = true
      this.title = this.$t('goodmanage.text93')
      if(this.productPrice) {
        this.number = this.productPrice
      } else {
        this.placeholderTip = this.$t('goodmanage.text94')
      }
    } else if (this.fIndex === 1) {
      this.isTips = true
      this.isADD = false
      this.title = this.$t('goodmanage.text95')
      if(this.productProfitRate) {
        this.number = this.productProfitRate
      } else {
        this.placeholderTip = this.$t('goodmanage.text96')
      }
    }
  },
  computed: {
    newNumber () {
      if (this.isADD === true) {
        return Number(this.inputNumber) + Number(this.number)
      } else {
        if (Number(this.inputNumber) - Number(this.number) < 1) {
          return 1
        } else {
          return Number(this.inputNumber) - Number(this.number)
        }
      }
    }
  },
  methods: {
    // mousebtn2() {
    //   event.preventDefault()
    // },
    // mousebtn(event) {
    //   event.preventDefault()
    // },
    checkInput() {
      this.endedShow = false
      this.fixedShow = true

    },
    inputNum (field) {
      if(this.fIndex === 0) {
        let val = this[field]
        if (!/^\d*\.{0,1}\d{0,2}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过2位小数 出售价格：最多两位小数，不能为0
          this[field] = val.substring(0, val.length - 1)
        }
        if (/^\./.test(this[field])) { // 如果是"."
          this[field] = ''
        }
        this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
        // if (val.indexOf(".") < 0 && val != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        //   this[field] = parseFloat(val);
        // }
        if(this[field] < 0) {
          this[field] = ''
        }
      } else if(this.fIndex === 1) {
        let val = this[field]
        if (!/^\d*\.{0,0}\d{0,0}$/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过2位小数 返还比例：0~100的整数
          this[field] = val.substring(0, val.length - 1)
        }
        if (/^\./.test(this[field])) { // 如果是"."
          this[field] = ''
        }
        this[field] = this[field].replace(/[^0-9/.]/g, '') // 只能是数字或者.
        if(this[field] === 0) {
          this[field] = 0
        }  else if(this[field] >= 100){
          this[field] = 100
        }
      }
    },
    hide () {
      this.$emit('hideDialog')
      this.number = ''
      this.fixedShow = false
      this.endedShow = true
    },
    switchOne () {
      if(this.number) {
        this.$emit('selectOne', this.number, 1)
        this.number = ''
        this.fixedShow = false
        this.endedShow = true
      }else {
        if(this.fIndex === 0) {
          this.toastD(this.$t('goodmanage.text8'))
        } else{
          this.toastD(this.$t('goodmanage.text17'))
        }
      }
      // this.$emit('selectOne', this.number)
      // let tNum
      // if (this.fIndex === 2) {
      //   tNum = this.number
      // } else {
      //   tNum = this.newNumber
      // }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 100
    background-color: rgba(2,5,13, .6)
    &.dialog-enter-active, &.dialog-leave-active
      transition: all .2s linear;
    &.dialog-enter, &.dialog-leave-to
      opacity: 0
    &.dialog-enter-to, &.dialog-leave
      opacity: 1
  .dialog-w
    position: fixed
    height 4.3rem
    top: 4rem
    width: 90%
    left 50%
    transform translateX(-50%)
    padding: 0 .5rem .2rem
    z-index: 200
    background-color: #fff
    font-size .32rem
    border-radius 5px
    &.fade-up-enter-active, &.fade-up-leave-active
      transition: all .3s linear;
    &.fade-up-enter, &.fade-up-leave-to
      transform translate3d(0,100%,0)
    &.fade-up-enter-to, &.fade-up-leave
      transform translate3d(0,0,0)
    &.fixed{
      height 4.3rem
      top: 4rem
    }
    &.ended{
      bottom 0
    }
    .title
      text-align: center
      font-size: .3rem
      color #0f0f26
      height: 1rem
      line-height: 1.2rem
    /*margin-bottom: .3rem*/
    .close
      position: absolute
      right: 0
      top: 0
      padding: .3rem
      color rgb(255, 182, 75);
    .input-box
      display flex
      align-items center
      height: 1rem
      border-bottom: 1px solid #b2b2b2
      width: 100%
      margin .4rem 0 .5rem
      input
        height: 1rem
        width: 90%
    .tips
      padding: .2rem 0 1rem
      font-size: .24rem
      color #666
    .ok-btn
      cursor pointer
      border-radius 6px
      width: 100%
      height: 1rem
      background-color: rgb(255, 182, 75);
      color #fff
      font-size: .28rem
      line-height 1rem
      text-align center
</style>
