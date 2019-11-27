<template>
  <div class="wabao-w">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="bg2"></div>
    <div class="title">{{$t('treasure.text49')}}</div>
    <p class="text">{{$t('findBao.text47')}}</p>
    <div class="star-w">
      <div v-for="i in 3" :key="i" class="star-list">
        <div class="star" :class="{'active-star': activeIndex >= i}" @click="selectStar(i)"></div>
      </div>
    </div>
    <div class="finish-btn" @click="finishOk">
      <div class="btn">{{$t('treasure.text50')}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog'
export default {
  data() {
    return {
      titleName: this.$t('treasure.text51'),
      latitude: 0,
      longitude: 0,
      activeIndex: 2,
      mineMapData: ''
    }
  },
  created () {
  },
  components: {
    mFixedTop: () => import('@/components/mFixedTop')
  },
  methods: {
    selectStar (i) {
      this.activeIndex = i
    },
    finishOk () {
      if (this.activeIndex === 0) {
        let toast1 = this.$createToast({
          txt: this.$t('treasure.text52'),
          time: 1500,
          type: 'txt'
        })
        toast1.show()
        return
      }
      this.$fetch.post(`${this.$api}pai/confirmMine`, {
        mineMapId: this.$route.query.id,
        longitude: this.longitude,
        latitude: this.latitude,
        type: 2,
        wabaoscore: this.activeIndex
      }).then(res => {
        if (res.status === 'success') {
          Dialog({
            title: this.$t('findBao.text51'),
            okFn: () =>{
              this.$router.push('/treasure')
            }
          })
        } else {
          Dialog({
            title: res.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/css/mixin.styl"
  .wabao-w
    text-align: center
    .bg2
      width: 6rem
      height: 4.48rem
      background-position center
      background-size cover
      margin: 1.8rem auto 0
      background-repeat no-repeat
      bg-image ("../../assets/img/find/waOk")
    .title
      font-size: .42rem
      font-weight: bold
      color #ff717d
      margin: .4rem 0 .2rem
    .tips1
      font-size: .28rem
      color #000
      max-width: 69%;
      margin: 0 auto 1.8rem;
      line-height: 1.5;
      .red
        color #ff717d
    .text
      font-size: .24rem
      color #999
      margin-bottom: .1rem
    .star-w
      margin .5rem 0
      display: flex
      align-items center
      justify-content center
      .star-list
        .star
          width: .47rem
          height: .47rem
          background-position center
          background-size cover
          margin: 0 .2rem
          background-repeat no-repeat
          bg-image ("../../assets/img/find/star-normal")
          &.active-star
            bg-image ("../../assets/img/find/star-active")
    .finish-btn
      padding: 0 .4rem
      margin: .8rem 0 .2rem
      .btn
        width: 100%
        height: 1rem
        border: 1px solid #b79961
        border-radius 6px
        font-size: .32rem
        color #b79961
        display: flex
        align-items center
        justify-content center
    .tips2
      font-size: .24rem
      color #999
</style>
