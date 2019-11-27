<template>
  <div class="task-details">
    <mFixedTop :titleName="titleName" @goPath="goPath" :isGoNumber="true"></mFixedTop>
    <div class="content-w">
      <p>{{task}}</p>
      <div class="img-w" v-show="imglist.length">
        <div v-for="(item, index) in imglist" :key="index" class="img-box" ref="imgList">
          <img :src="imgSplit(item)" alt="" @error="errorImg(index)">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
		data() {
			return {
        titleName: this.$t('findBao.text43'),
        imglist: []
      }
		},
    created () {
		  if (this.$route.query.task) {
		    this.task = this.$route.query.task
        if (this.$route.query.imglist) {
          this.imglist = this.$route.query.imglist.split(',')
        }
      }
    },
    methods: {
      imgSplit (img) {
        if (img) {
          if (img.indexOf('http') > -1) {
            return img
          } else {
            return 'http://ofjn5cjui.bkt.clouddn.com/' + data
          }
        }
      },
      errorImg (index) {
        this.$refs.imgList[index].style.display = 'none'
      },
      goPath () {
        if (this.$route.query.mapData) {
          this.$router.push({
            path: '/findTreasure',
            query: {
              mapData: this.$route.query.mapData
            }
          })
        } else {
          this.$router.go(-1)
        }
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    }
	}
</script>

<style scoped lang="stylus">
.iosx-app{
  .content-w{
    padding-top 2rem!important
}
}
.task-details
  width: 100%
  .content-w
    padding: 1.5rem .4rem .3rem .4rem
    font-size: .28rem
    color #000
    .img-w
      width: 100%
      margin-top: .4rem
      .img-box
        img
          width: 100%
          display: block
          margin-bottom: .2rem
</style>
