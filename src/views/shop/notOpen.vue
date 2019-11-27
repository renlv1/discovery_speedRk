<template>
  <div class="notOpen">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div class="main-c">
      <div class="img-bg"><img src="./notOpen/img/not-open.png"></div>
      <div class="main-t">{{$t('notOpen.text8')}}</div>
      <div class="btn-open" @click="btnApply()">{{$t('notOpen.text9')}}</div>
      <ul class="uls">
        <li class="list" v-for="(item,index) in List" :key="index">
          <div class="li-top">
            <div class="top-l"><img :src="item.imgUrl"></div>
            <div class="top-r">
              <div class="top-t">{{item.text}}</div>
            </div>
          </div>
          <div class="li-b">{{item.content}}</div>
        </li>
      </ul>
    </div>
    <VFooter/>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import VFooter from '@/components/footer'
export default {
  components: {mFixedTop, VFooter},
  data() {
    return{
      titleName: 'π Merchant',
      isGoBack: true,
      List: [
        {imgUrl: require('./notOpen/img/tiaojian.png'), text: this.$t('notOpen.text2'),content: this.$t('notOpen.text3')},
        {imgUrl: require('./notOpen/img/apply.png'), text: this.$t('notOpen.text4'),content: this.$t('notOpen.text5')},
        {imgUrl: require('./notOpen/img/back.png'), text: this.$t('notOpen.text6'),content: this.$t('notOpen.text7')}
        ]
    }
  },
  methods: {
    btnApply () {
        this.$fetch.post(`${this.$api}shopMine/getMerchantInfo`).then(res => {
          if (res.status === 'success') {
            this.$router.push({
              path: '/stepOne'
            })
          } else {
            this.toastD(res.msg)
          }
        })
    },
    goPath() { // 返回到我的
      this.$router.push('/menu')
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.main-c{
  padding 0 15px
  margin-top .6rem
  .img-bg{
    margin 0 auto
    width 2.04rem
    img{
      width 100%
    }
  }
  .main-t{
    margin .3rem auto .4rem
    text-align center
    width 75%
    line-height 1.5
    font-size .14rem
    color rgb(0,0,0)
  }
  .btn-open{
    margin 0 auto
    padding 0 15px
    width 100%
    height 1rem
    background rgb(255,237,212)
    border-radius 4px
    font-size 16px
    color #000
    text-align center
    line-height 1rem
  }
  .uls{
    margin-top .4rem
    .list{
      margin-bottom .6rem
      &:nth-child(1){
        .li-b{
          margin-left .6rem
        }
      }
      &:nth-child(2){
        .top-l{
          width .32rem!important
          img{
            width 100%
          }
        }
      }
      &:nth-child(3){
        .top-l{
          width .37rem!important
          img{
            width 100%
          }
        }
      }
      .li-top{
        display flex
        align-items center
        .top-l{
          display flex
          align-items center
          width .39rem
          margin-right .2rem
          img{
            width 100%
          }
        }
        .top-r{
          font-size 14px
          color #000
        }
      }
      .li-b{
        line-height 1.5
        margin-left .5rem
        margin-top .2rem
        font-size 12px
        color rgb(153,153,153)
      }
    }
  }
}
>>>.foot-shop{
  /*padding-top 0.06rem!important*/
}
.iosx
  .foot-shop
    /*padding-top 0!important*/
</style>
