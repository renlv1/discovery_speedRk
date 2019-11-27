<template>
  <div class="steps" :data="stepData">
    <h5>{{title}}</h5>
    <ul>
      <li class="stepData"
          :class="{success: stepData.status > 0, ongoing: stepData.status === 0, not: stepData.status < 0}">
        <div class="step-content">
          <div class="step-left">
            <i class="icon"></i>
            <i class="line"></i>
          </div>
          <div class="step-right">
            <div class="title">{{stepData.reqType}}</div>
            <div class="description">{{stepData.reqMessage}}</div>
            <ul class="reqImgList">
              <li class="img-item" v-for="(item, index) in reqImgList" :key="index">
                <img :src="item" />
              </li>
            </ul>
          </div>
        </div>
      </li>
      <li class="stepData"
          :class="{success: stepData.status > 1, ongoing: stepData.status === 1, not: stepData.status < 1}">
        <div class="step-content">
          <div class="step-left">
            <i class="icon"></i>
            <i class="line"></i>
          </div>
          <div class="step-right">
            <div class="title">{{$t('complaint.complaintContent.text5')}}</div>
            <div class="description">
              {{stepData.desMessage}}
            </div>
            <ul class="reqImgList">
              <li class="img-item" v-for="(item, index) in desImgList" :key="index">
                <img :src="item" />
              </li>
            </ul>
          </div>
        </div>
      </li>
      <li class="stepData"
          :class="{success: stepData.status > 2, ongoing: stepData.status === 2, not: stepData.status < 2}">
        <div class="step-content">
          <div class="step-left">
            <i class="icon"></i>
            <i class="line"></i>
          </div>
          <div class="step-right">
            <div class="title">{{$t('complaint.complaintContent.text6')}}</div>
          </div>
        </div>
      </li>
      <li class="stepData"
          :class="{success: stepData.status > 3, ongoing: stepData.status === 3, not: stepData.status < 3}">
        <div class="step-content">
          <div class="step-left">
            <i class="icon"></i>
            <i class="line"></i>
          </div>
          <div class="step-right">
            <div class="title">{{$t('complaint.complaintContent.text7')}}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  props: {
    stepData: {
      type: Object,
      required: true
    },
    reqImgList: { // 申诉图片数组
      type: Array,
      required: false
    },
    desImgList: { // 举证图片数组
      type: Array,
      required: false
    },
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    trans(str) {
      return str.replace('/\r\n/g/', "</br>")
    }
  },
  computed: {
    ...mapGetters([
      'label'
    ])
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .steps
    padding .8rem 0
    h5
      font-size .28rem
      margin-bottom .4rem
    ul
      .stepData
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
              background-image url("./img/success.svg")
          .step-right
            .title
              color #000
        &.ongoing
          .step-left
            .icon
              background-image url("./img/ongoing.svg")
        &.not
          .step-left
            .icon
              background-image url("./img/not.svg")
        .step-right
          margin-bottom .5rem
          .title
            height .5rem
            line-height .55rem
          .description
            margin .3rem 0 .5rem
          .reqImgList
            display flex
            flex-direction row
            .img-item
              img
                width 1.4rem
                height 1.4rem
              &:nth-child(2)
                margin 0 .3rem
        .btn
          border-1px(#b79961, solid)
          padding 0 .08rem
          height .5rem
          text-align center
          line-height .55rem
          white-space nowrap
          color #b79961
</style>
