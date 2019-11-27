<template>
  <transition name="slide">
    <div class="payType">
      <mFixedTop :titleName="titleName"></mFixedTop>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <div class="v-content-wrapper">
        <ul class="type-list">
          <li class="item" v-for="(item, index) in typeList" @click="chooseCoin(item, index)" :key="index">
            <div class="choose-icon" :class="{isHidden: currentCoinIndex !== index}">
              <img src="./img/choose.svg" />
            </div>
            <div class="item-img">
              <img />
              <span class="cur">{{item.currency}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {getPayType} from '@/api/topUp'
import {ERR_OK} from "../../assets/js/config"
import {mapMutations, mapGetters} from 'vuex'

export default {
  components: {mFixedTop},
  data() {
    return {
      isShow: true,
      currentIndex: 0,
      titleName: this.$t('other.text2'),
      typeList: []
    }
  },
  created() {
    if (this.$route.query.tx){
      this._getPayTypeTx()
    } else {
      this._getPayType()
    }

  },
  methods: {
    chooseCoin(item, index) { // 选择币种
      const currency = item.currency
      this.currentIndex = index
      this.setCurrentCoin(currency)
      this.setCurrentCoinIndex(index)
      this.$router.back()
    },
    _getPayType() {
      getPayType(1).then((res) => {
        this.isShow = false
        if (res.status === ERR_OK) {
          this.typeList = res.data.data
        }
      })
    },
    _getPayTypeTx() {
      getPayType(3).then((res) => {
        this.isShow = false
        if (res.status === ERR_OK) {
          this.typeList = res.data.data
        }
      })
    },
    ...mapMutations({
      setCurrentCoin: 'SET_CURRENT_COIN',
      setCurrentCoinIndex: 'SET_CURRENT_COIN_INDEX'
    })
  },
  computed: {
    ...mapGetters([
      'currentCoinIndex'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .v-content-wrapper
    .type-list
      .item
        display flex
        align-items center
        height 1.2rem
        line-height 1.2rem
        .choose-icon
          margin-top 2px
          display flex
          align-items center
          height 1.2rem
          width 20px
          margin-right .3rem
          img
            width .5rem
            height .5rem
          &.isHidden
            opacity 0
        .item-img
          flex 1
          border-1px-bottom(#eee)
          .cur
            font-size .34rem
</style>
