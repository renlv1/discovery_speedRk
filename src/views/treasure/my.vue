<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="v-content-wrapper">
      <ul>
        <li @click="myTask">
          <div class="li-left">
            <img src="./images/myTask.png" />
            <span>{{$t('treasure.text53')}}</span>
          </div>
          <div class="li-right">
            <img src="../../assets/img/treasure/right.png" />
          </div>
        </li>
        <!--<li>-->
          <!--<div class="li-left">-->
            <!--<img src="./images/taskRecord.png" />-->
            <!--<span>宝藏记录</span>-->
          <!--</div>-->
          <!--<div class="li-right">-->
            <!--<img src="../../assets/img/treasure/right.png" />-->
          <!--</div>-->
        <!--</li>-->
      </ul>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  components: {mFixedTop},
  name: "my",
  data() {
    return {
      titleName: this.$t('treasure.text54'),
      isGoBack: true
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  methods: {
    goPath() {
      this.$router.push('/menu')
      this.$store.commit('SET_FOOTET_TREASURE', 0)
    },
    myTask() {
      this.$router.push('/myTask')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    ul
      li
        display flex
        justify-content space-between
        font-size .28rem
        background-color #eee
        height 1.2rem
        margin-bottom .2rem
        padding 0 .4rem
        .li-left
          display flex
          flex-direction row
          align-items center
          img
            width .44rem
            height .44rem
            margin-right .2rem
        .li-right
          line-height 1.2rem
          img
            width .28rem
            height .28rem
</style>
