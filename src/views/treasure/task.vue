<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="v-content-wrapper">
      <cube-tab-bar v-model="selectedLabel" @click="changeHandler">
        <cube-tab v-for="item in tabs" :label="item.label" :key="item.label"></cube-tab>
      </cube-tab-bar>
      <cube-tab-panels v-model="selectedLabel">
        <slot></slot>
      </cube-tab-panels>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <ul class="list-content">
        <li v-for="item in taskList" :key="item.index" @click="setTask(item)">{{item.content}}</li>
      </ul>
      <div class="btn" @click="createTemplate">{{$t('treasure.text15')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {taskTemplate} from "../../api/treasure";

export default {
  name: "task",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      titleName: this.$t('treasure.text18'),
      tabs: this.$t('treasure.text16'),
      taskList: [],
      selectedLabel: '',
      defaultLabel: '',
      isShow: true
    }
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }

    this.selectedLabel = this.$store.state.setTaskIndex === 0 ? this.tabs[0].label : this.tabs[1].label
    this.getTemplate()
  },
  methods: {
    createTemplate() {
      this.$router.push('/createTemplate')
    },
    changeHandler(label) {
      if (label === this.$t('treasure.text17')) {
        this.$store.commit('SET_TASK_INDEX', 1)
      } else {
        this.$store.commit('SET_TASK_INDEX', 0)
      }
      this.getTemplate()
    },
    getTemplate() {
      taskTemplate().then((res) => {
        this.isShow = false
        if (this.$store.state.setTaskIndex === 0) {
          this.taskList = res.data.data.my
        } else {
          this.taskList = res.data.data.system
        }
      })
    },
    setTask(item) {
      this.$store.commit('SET_TASK_CONTENT', item.content)
      if (this.$route.query.flag) {
        this.$router.push({
          path: '/modify',
          query: {
            id: this.$route.query.id
          }
        })
      } else {
        this.$router.push({
          path: '/treasureNext',
          query: {
            id: this.$route.query.id
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    position relative
    min-height calc(100vh - 1.56rem)
    background-color #fff
    padding .4rem
    .list-content
      margin-top .4rem
      li
        padding .2rem 0
        font-size .28rem
        color #000
        min-height 1height
        height auto
        line-height .5rem
        border-bottom 1px solid #ccc
        width 100%
        word-wrap break-word
    .btn
      width 100%
      left 0
      position absolute
      bottom 0
      font-size .32rem
      border 1px solid #b79961
      color #b79961
      height 1rem
      line-height 1rem
      text-align center
</style>
