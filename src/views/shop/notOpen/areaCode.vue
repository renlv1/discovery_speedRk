<template>
  <transition name="slide">
    <div class="area-code-w slide-w">
     <mFixedTop :titleName="titleName"></mFixedTop>
      <div class="cont-t">
<!--        <div class="search-w">-->
<!--          <div class="icon">-->
<!--            <img src="./img/search.png" alt="">-->
<!--          </div>-->
<!--          <input type="text" :placeholder="$t('notMerchant.text2')" class="input" v-model="address" @input="inputCode">-->
<!--        </div>-->
        <ul class="area-uls">
          <li class="area-item" @click="selectCode(item, index)" v-for="(item, index) in codeArr" :key="index">
            <span> + {{item.code}}</span>
            <span>{{getLocal(item)}}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
import mFixedTop from '@/components/mFixedTop'
export default {
  data() {
    return {
      titleName: this.$t('myPiOrder.text39'),
      address: '',
      codeArr: []
    }
  },
  components: {
    mFixedTop
  },
  created () {
    this.codeArr = require('../../../assets/js/telcode.json')
  },
  methods: {
	  getLocal (lang) {
	  	if (window.localStorage.getItem('discoveryLang') === 'CN') {
	  		return lang.ch
      } else {
	  		return lang.en
      }
    },
	  inputCode () {
	  	if (this.address !== '') {
	  		let findA = []
	  		this.codeArr.forEach((item) => {
	  			if ((item.ch.indexOf(this.address) > -1) || (item.en.indexOf(this.address) > -1)) {
	  				findA.push(item)
          }
        })
        this.codeArr = findA
      } else {
			  this.codeArr = require('../../../assets/js/telcode.json')
      }
    },
    selectCode (item, index) {
	  	this.address = ''
      this.$emit('codeSelect', item, index)
    },
    goback() {
      this.$emit('gobackCode')
	    this.address = ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .cont-t
      margin-top: 65px
  .iosx
    .cont-t
      margin-top: 90px
  .cont-t
    width: 100%
    position: absolute
    left: 0
    top: 0
    overflow: auto
    margin-top: 65px
  .area-code-w
    overflow: auto
  .search-w
    height: .88rem
    padding: .1rem .3rem
    position: relative
    .icon
      width: .24rem
      position: absolute
      left: .6rem
      top: 50%
      transform translateY(-50%)
      img
        width: 100%
        display: block
    .input
      width: 100%
      height: 100%
      background-color: #F7F7F7
      border-radius 4px
      padding-left: .7rem
      color #060f26
      font-size: 12px
  .area-uls
    .area-item
      padding: 0 .3rem
      display: flex
      align-items center
      justify-content space-between
      height: 1rem
      border-bottom: 1px solid #e8e8e8
      font-size: .28rem
      color #060f26
</style>
