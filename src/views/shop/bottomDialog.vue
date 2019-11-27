<template>
  <div>
    <transition name="dialog">
      <div class="dialog" @click="hide" v-if="merchantShow">
      </div>
    </transition>
    <transition name="fade-up">
      <div class="dialog-w" v-if="merchantShow">
        <div @click.stop>
          <div class="title">{{title}}</div>
          <div class="close" @click="hide">{{$t('goodmanage.text39')}}</div>
          <div class="input-box"><input type="text" :placeholder="placeholderText" v-model="number"
                                        @input="inputNum('number')"></div>
          <p class="tips" v-show="isTips">{{$t('goodmanage.text40')}}：{{newNumber}}</p>
          <div class="ok-btn" @click="switchOne">{{$t('goodmanage.text41')}}</div>
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
      placeholderText: ''
    }
  },
  props: {
    stock: Number,
    merchantShow: Boolean,
    inputNumber: String,
    fIndex: Number, // 1增加库存 2减少库存 3修改库存
  },
  created() {
    this.number = ''
    if (this.fIndex === 0) {
      this.isTips = true
      this.isADD = true
      this.title = this.$t('goodmanage.text42')
      this.placeholderText = this.$t('goodmanage.text43')
    } else if (this.fIndex === 1) {
      this.isTips = true
      this.isADD = false
      this.title = this.$t('goodmanage.text44')
      this.placeholderText = this.$t('goodmanage.text45')
    } else if (this.fIndex === 2) {
      this.title = this.$t('goodmanage.text46')
      this.placeholderText = this.$t('goodmanage.text47')
      this.number = this.stock
      this.isTips = false
    }
  },
  computed: {
    newNumber() {
      if (this.isADD === true) {
        return Number(this.inputNumber) + Number(this.number)
      } else {
        if (Number(this.inputNumber) - Number(this.number) < 1) {
          return 0
        } else {
          return Number(this.inputNumber) - Number(this.number)
        }
        // return Number(this.inputNumber) - Number(this.number)
      }
    }
  },
  methods: {
    inputNum(field) {
      let val = this[field]
      if (!/^\d/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
        this[field] = val.substring(0, val.length - 1)
      }
      if (/^\./.test(this[field])) { // 如果是"."
        this[field] = ''
      }
      this[field] = this[field].replace(/[^0-9]/g, '') // 只能是数字或者.
      // if (this.fIndex !== 2) {
      //   if (this.newNumber === 1) {
      //     this[field] = Number(this.inputNumber) - 1
      //   }
      // }
    },
    hide() {
      this.$emit('hideDialog')
      this.number = ''
    },
    switchOne() {
      this.$emit('selectOne', this.number)
      this.number = ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dialog
    position: fixed
    top: 0
    left: 0
    width: 100%
    padding: 0 .2rem .2rem
    z-index: 200
    height 100%
    background-color: rgba(2, 5, 13, .6)
    &.dialog-enter-active, &.dialog-leave-active
      transition: all .2s linear;
    &.dialog-enter, &.dialog-leave-to
      opacity: 0
    &.dialog-enter-to, &.dialog-leave
      opacity: 1

  .dialog-w
    position: fixed
    top: 50%
    left: 50%
    width: 90%
    padding: 0 .2rem .2rem
    z-index: 200
    transform translate(-50%, -50%)
    border-radius 5px
    background-color: #fff
    &.fade-up-enter-active, &.fade-up-leave-active
      transition: all .3s linear;
    &.fade-up-enter, &.fade-up-leave-to
      transform translate3d(0, 100%, 0)
    &.fade-up-enter-to, &.fade-up-leave
      transform translate3d(0, 0, 0)
    .title
      text-align: center
      font-size: .3rem
      color #0f0f26
      height: 1.2rem
      line-height: 1.2rem
      margin-bottom: .3rem
    .close
      position: absolute
      right: 0
      top: 0
      padding: .3rem
      font-size .3rem
      color rgb(255, 182, 75)
    .input-box
      height: 1rem
      font-size .28rem
      input
        border-bottom: 1px solid #b2b2b2
        height: 1rem
        width: 100%
    .tips
      padding: .2rem 0 .5rem
      font-size: .24rem
      color #666
    .ok-btn
      cursor pointer
      border-radius 6px
      margin-top: .2rem
      width: 100%
      height: 1rem
      background-color: rgb(255, 182, 75)
      color #fff
      font-size: .28rem
      text-align center
      line-height 1rem
</style>
