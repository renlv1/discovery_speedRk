<template>
  <div class="detail">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="v-content-wrapper">
      <h5>{{voteRecord.title}}</h5>
      <p class="description">{{voteRecord.content}}</p>
      <p class="vote-date">
        <span>{{$changeDate(voteRecord.startDate, '.')}} - {{$changeDate(voteRecord.deadline, '.')}}</span>
      </p>
      <div class="line"></div>
      <h3 class="subtitle">{{$t('voteCenter.detail.text1')}}</h3>
      <ol>
        <li class="item"
            :class="{active: currentIndex === index, isWidth: !(parseInt(voteRecord.isVote) === 2 && parseInt(voteRecord.status) === 1)}"
            v-for="(item, index) in optionList" :key="item.index" @click="chooseItem(item, index)">
          <div v-if="item.percent >= 0" class="li-bg" :style="{width: item.percent/16 + 'rem'}"
               v-show="parseInt(voteRecord.status) === 2"></div>
          <div class="progress">
            <div class="length" :style="`width:${item.percent}%`"></div>
          </div>
          <span v-if="item.percent >= 0" class="percent"
                v-show="parseInt(voteRecord.status) === 2">{{item.percent}}%</span>
          <div class="choose-icon" :class="{active: currentIndex === index}"
               v-show="parseInt(voteRecord.isVote) === 2 && parseInt(voteRecord.status) === 1"></div>
          <span class="content"
                :class="{isNoteColor: recodeId !== item.id && parseInt(voteRecord.isVote) === 1}">{{index + 1}}.{{item.description}}
                <span v-show="recodeId === item.id">{{$t('voteCenter.detail.text2')}}</span>
          </span>
        </li>
      </ol>
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <div @click="submit" class="btn" v-show="parseInt(voteRecord.isVote) === 2 && parseInt(voteRecord.status) === 1">
        {{$t('voteCenter.detail.text4')}}
      </div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {detail, submitUserVote} from '@/api/vote'

export default {
  components: {mFixedTop},
  data() {
    return {
      currentIndex: 0,
      detailObj: {},
      titleName: this.$t('voteCenter.detail.title'),
      voteRecord: '', // 投票详情
      optionList: [], // 选择项
      optionId: '',
      recodeId: '',
      isShow: true
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    chooseItem(item, index) {
      this.currentIndex = index
      this.optionId = item.id
    },
    submit() {
      let id = this.$route.params.id
      let optionId = this.optionId || this.optionList[0].id
      submitUserVote(id, optionId).then((res) => {
        if (res.data.status === 'success') {
          this.getDetail()
          this.toastD(this.$t('voteCenter.detail.text3'))
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    getDetail() {
      let id = this.$route.params.id
      detail(id).then((res) => {
        if (res.data.status === 'success') {
          this.isShow = false
          this.recodeId = res.data.data.optionId || ''
          this.voteRecord = res.data.data.vote || {}
          this.optionList = res.data.data.options
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .isNoteColor
    color #999
  .detail
    .v-content-wrapper
      padding-bottom 1.2rem
      h5
        font-size .3rem
        font-weight bolder
        margin-bottom .3rem
      .description
        font-size .28rem
        line-height 1.5
        margin-bottom .3rem
      .vote-date
        font-size .24rem
        color #999
        margin-bottom .4rem
      .line
        height 1px
        border 1px dotted #000
      .subtitle
        font-size .28rem
        margin .8rem 0 .2rem
      ol
        padding 0 .1rem
        .item
          position relative
          width 100%
          height 1rem
          display flex
          flex-direction row
          align-items center
          word-wrap break-word
          font-size .28rem
          margin-top .4rem
          &.isWidth
            .content
              left 0
          .li-bg
            height 1rem
            position absolute
            right 0
            top 0
            margin-right 0
            background-color #a2f2ed
            line-height 1rem
          .percent
            font-size .25rem
            text-align right
            position absolute
            right 0
            white-space nowrap
            padding-right .2rem
          .choose-icon
            width .4rem
            height .4rem
            margin-right .3rem
            background-size .38rem .38rem
            background-repeat no-repeat
            background-position center
            background-image url("./images/un-active.svg")
            &.active
              background-image url("./images/active.svg")
          .content
            font-size .25rem
            position absolute
            left .5rem
            margin-right .1rem
            width 90%
            line-height 1.3
          &.active
            background-color #fafafa
            span
              width 74%
            &.active
              background-color #fff
      .btn
        position fixed
        right 0
        left 0
        bottom 0
        width 100%
        text-align center
        background-color #b79961
        color #fff
        height 1rem
        line-height 1rem
        font-size .32rem
</style>
