<template>
  <div>
    <div class="container" :class="{'show': isShow}">
      <div class="title-wrapper">
        <div class="btn btn-cancel" @click="cancel">{{$t('categories.text59')}}</div>
        <div class="picker-title">{{title}}</div>
        <div class="btn btn-sure"  @click="sure">{{$t('categories.text60')}}</div>
      </div>
      <div class="time-wrapper">
        <div class="hours">
          <ul>
            <li v-for="(item, index) in getHours" :key="item.index" :class="{'highLight': index === hour}">{{item}}
            </li>
          </ul>
        </div>
        <div class="seg">
          <ul>
            <li>{{hour !== 0 ? ':' : ''}}</li>
            <li class="highLight">:</li>
            <li>{{hour !== 23 && mins !== 59 ? ':' : ''}}</li>
          </ul>
        </div>
        <div class="minute">
          <ul>
            <li v-for="(item, index) in getMinute" :key="item.index" :class="{'highLight': index === mins}">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "timePicker",
  data() {
    return {
      hour: 0,
      mins: 0
    }
  },
  props: {
    title: {
      type: String
    },
    chooseTimeType: {
      type: Number
    },
    isShow: {
      type: Boolean,
      require: true
    }
  },
  computed: {
    getHours() {
      let hourArr = []
      for (let i = 0; i < 24; i++) {
        i = i < 10 ? '0' + i : i
        hourArr.push(i)
      }
      return hourArr
    },
    getMinute() {
      let minArr = []
      for (let i = 0; i < 60; i++) {
        i = i < 10 ? '0' + i : i
        minArr.push(i)
      }
      return minArr
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScrollHours, true)
    window.addEventListener('scroll', this.handleScrollMins, true)
  },
  methods: {
    handleScrollHours() {
      console.log(document.querySelector('.hours').scrollTop)
      const scrollTop = document.querySelector('.hours').scrollTop
      this.hour = Math.floor(scrollTop / 30)
    },
    handleScrollMins() {
      const scrollTop = document.querySelector('.minute').scrollTop
      this.mins = Math.floor(scrollTop / 30)
    },
    sure() {
      this.$emit('sure', this.chooseTimeType, this.hour, this.mins)
      document.querySelector('.hours').scrollTop = 0
      document.querySelector('.minute').scrollTop = 0
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  ul
    li
      display flex
      line-height 30px
      height 30px
      font-size .32rem
      &.highLight
        font-weight: bold
        //transform scale(1.2)
  .container
    margin .4rem auto
    width 90%
    border-radius 8px
    box-shadow 1px 0 10px #ccc
    height 0
    opacity 0
    overflow hidden
    &.show
      height auto
      transition .3s
      opacity 1
      padding .4rem .35rem .6rem
    .title-wrapper
      padding-bottom .6rem
      display flex
      flex-direction row
      justify-content space-between
      font-size .3rem
      .picker-title
        font-size .3rem
      .btn-sure
        color #b79961
    .time-wrapper
      height 1.8rem
      display flex
      flex-direction row
      justify-content center
      overflow hidden
      .hours
        padding .6rem .4rem
        height 1.8rem
        overflow scroll
      .seg
        display flex
        flex-direction column
      .minute
        padding .6rem .4rem
        height 1.8rem
        overflow scroll
</style>
