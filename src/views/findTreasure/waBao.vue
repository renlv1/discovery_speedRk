<template>
  <div class="wabao-w">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="bg2"></div>
    <div class="title">{{$t('findBao.text44')}}</div>
    <p class="tips1">{{$t('findBao.text45')}} <span class="red">{{mineMapData.firstOutTotal}}π</span> {{$t('findBao.text46')}}</p>
    <p class="text">{{$t('findBao.text47')}}</p>
    <div class="star-w">
      <div v-for="i in 5" :key="i" class="star-list">
        <div class="star" :class="{'active-star': activeIndex >= i}" @click="selectStar(i)"></div>
      </div>
    </div>
    <div class="finish-btn" @click="finishOk">
      <div class="btn">{{$t('findBao.text48')}}</div>
    </div>
    <p class="tips2">{{$t('findBao.text49')}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  import Dialog from '@/components/dialog'
	export default {
		data() {
			return {
        titleName: '评价',
        latitude: 0,
        longitude: 0,
        activeIndex: 3,
        mineMapData: ''
      }
		},
    created () {
		  let queryId = this.$route.query.id
		  if (queryId) {
        this.getMineMapDetails(queryId)
      }
    },
    methods: {
      selectStar (i) {
        this.activeIndex = i
      },
      getMineMapDetails (id) {
        this.$fetch.post(`${this.$api}pai/queryMyMineMapDetails`, {
          minemapid: id
        }).then(res => {
          if (res.status === 'success') {
            this.mineMapData = res.data
            this.longitude = res.data.longitude
            this.latitude = res.data.latitude
          }
        })
      },
      finishOk () {
        if (this.activeIndex === 0) {
          let toast1 = this.$createToast({
            txt: this.$t('findBao.text50'),
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
          type: 1,
          wabaoscore: this.activeIndex
        }).then(res => {
          if (res.status === 'success') {
            Dialog({
              title: this.$t('findBao.text59'),
              okFn: () =>{
                this.$router.push('/myFindTreasure')
              }
            })
          } else {
            Dialog({
              title: res.msg
            })
          }
        })
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
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
    background: url("../../assets/img/find/waOk@2x.jpg") no-repeat center / cover
    @media(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
      background: url("../../assets/img/find/waOk@3x.jpg") no-repeat center / cover
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
    margin: .4rem 0 .2rem
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
