<template>
  <div class="treasure">
    <v-map :titleName="$t('treasure.title')" v-if="$store.state.footerTreasureIndex === 0"></v-map>
    <confirmed-task v-if="$store.state.footerTreasureIndex === 1"></confirmed-task>
    <my v-if="$store.state.footerTreasureIndex === 2"></my>
    <div class="bottom-tabs">
      <ul>
        <li @click="chooseMenu(0)">
          <img v-show="$store.state.footerTreasureIndex !== 0" src="./images/un_select.png" />
          <img v-show="$store.state.footerTreasureIndex === 0" src="./images/select.png" />
          <p :class="{active: $store.state.footerTreasureIndex === 0}">{{$t('treasure.title')}}</p>
        </li>
        <li @click="chooseMenu(1)">
          <img v-show="$store.state.footerTreasureIndex !== 1" src="./images/un_confirm.png" />
          <img v-show="$store.state.footerTreasureIndex === 1" src="./images/confirm.png" />
          <p :class="{active: $store.state.footerTreasureIndex === 1}">{{$t('treasure.bottomText1')}}</p>
        </li>
        <li @click="chooseMenu(2)">
          <img v-show="$store.state.footerTreasureIndex !== 2" src="./images/un_my.png" />
          <img v-show="$store.state.footerTreasureIndex === 2" src="./images/my.png" />
          <p :class="{active: $store.state.footerTreasureIndex === 2}">{{$t('treasure.bottomText2')}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VMap from '../../components/map/map.vue'
import confirmedTask from '../../views/treasure/confirmedTask'
import my from '../../views/treasure/my'

export default {
  // SET_FOOTET_TREASURE
  components: {VMap, confirmedTask,my},
  name: "treasure",
  methods: {
    chooseMenu(index) {
      this.$store.commit('SET_FOOTET_TREASURE', index)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .iosx {
    ul {
      padding-top 10px !important
      height: 1.4rem !important
      justify-content flex-start !important
      li {
        justify-content flex-start !important
      }
    }
  }

  .treasure
    min-height 100vh
    .bottom-tabs
      width 100%
      position fixed
      bottom 0
      z-index 999
      ul
        width 100%
        display flex
        flex-direction row
        background-color #fff
        height 1.1rem
        li
          width 33%
          display flex
          flex-direction column
          align-items center
          justify-content center
          font-size .2rem
          img
            margin-bottom .1rem
            width .44rem
            height .44rem
          p
            color #000
            &.active
              color #b79961
</style>
