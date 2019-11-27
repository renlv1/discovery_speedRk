<template>
  <div class="steps" :data="stepData">
    <h5>{{title}}</h5>
    <ul>
      <li class="item" v-for="item in stepData" :key="item.index"
          :class="{success: item.status === 1, ongoing: item.status === 2, not: item.status === 3}">
        <div class="step-content">
          <div class="step-left">
            <i class="icon"></i>
            <i class="line"></i>
          </div>
          <div class="step-right">
            <div class="title">{{item.msg}}</div>
            <div class="description" v-if="item.colorMsg">
              <p v-html="trans(item.colorMsg)"></p>
            </div>
          </div>
        </div>
        <div v-clipboard:copy=stepData[4].colorMsg v-clipboard:success="clipboardSuccess" class="btn"
             v-if="item.index === 5 && (item.status === 1 || item.status === 2)" v-waves>{{$t('complaint.complaintContent.text8')}}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import waves from '@/dircetive/waves/waves' // 水波纹指令
//import clipboard from '@/dircetive/clipboard/index.js' // use clipboard by v-directive
import clipboard from '../dircetive/clipboard/index' // use clipboard by v-directive
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      defaultStatus: this.$t('common.labList.text1')
    }
  },
  props: {
    stepData: {
      type: Array,
      required: true
    },
    title: {
      type: String
    }
  },
  directives: {waves, clipboard},
  computed: {
    ...mapGetters([
      'label'
    ])
  },
  methods: {
    trans(str) {
      return str.replace(/\n/g, "</br></br>")
    },
    clipboardSuccess() {
      this.toastD(this.$t('complaint.complaintContent.text9'))
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .steps
    h5
      font-size .28rem
      margin-bottom .4rem
    ul
      padding-bottom 40px
      .item
        display flex
        justify-content space-between
        font-size .28rem
        color #999
        .step-content
          display flex
          justify-content flex-start
          width 80%
          .step-left
            display flex
            flex-direction column
            align-items center
            margin-right .2rem
            .icon
              display inline-block
              background-repeat no-repeat
              background-size cover
              width .5rem
              height .5rem
            .line
              display inline-block
              min-height .5rem
              flex 1
              width 2px
              background-color #f0f0f0
        &:last-child
          .step-left
            .line
              display none
        &.success
          .step-left
            .icon
              background-image url("./step/img/success.svg")
          .step-right
            .title
              color #000
        &.ongoing
          .step-left
            .icon
              background-image url("./step/img/ongoing.svg")
        &.not
          .step-left
            .icon
              background-image url("./step/img/not.svg")
        .step-right
          .title
            height .5rem
            line-height .55rem
          .description
            margin .3rem 0 .5rem
            p
              width 270px
        .btn
          border-1px(#b79961, solid)
          padding 0 .08rem
          height .5rem
          text-align center
          line-height .55rem
          white-space nowrap
          color #b79961
</style>
