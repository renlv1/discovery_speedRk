<template>
  <div class="transfer">
    <app-header :titleName="titleName" :isGoBack="isGoBack" @goPathA="goPath" :isGoNumber="true"></app-header>
    <div class="main-b">
      <ul class="uls-child">
        <router-link class="li-item" tag="li" to="/findIncome">
          <div class="li-left">
            <div class="icon-box"></div>
            <div class="li-c">{{$t('findBao.text18')}}</div>
          </div>
          <div class="li-right">
            <div class="right-box"><img src="../../assets/img/transfer/right-arrow.svg"></div>
          </div>
        </router-link>
        <router-link class="li-item" tag="li" to="/propsCard">
          <div class="li-left">
            <div class="icon-box"></div>
            <div class="li-c">{{$t('findBao.text19')}}</div>
          </div>
          <div class="li-right">
            <div class="right-box"><img src="../../assets/img/transfer/right-arrow.svg"></div>
          </div>
        </router-link>
      </ul>
    </div>
    <bottom-menu :tabState="tabState"></bottom-menu>
  </div>
</template>

<script>
  import appHeader from '../../components/mFixedTop'
  export default {
    data() {
      return{
        tabState: 2,
        isGoBack: true,
        loadingShow: true,
        variable: 'http://ofydu65mj.bkt.clouddn.com/', // 拼接字符串需要的变量
        avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
        defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
        emptyDatas: false,
        count: 20,
        titleName: this.$t('findBao.text19'),
        friendList: [], // 好友列表
      }
    },
    created() {
      this.getAccountList()
    },
    mounted() {
      if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
        this.isGoBack = false
        this.$store.commit('IS_IOS', true)
      } else {
        this.isGoBack = true
      }
    },
    methods:{
      goPath () {
        this.$router.push('/menu')
      },
      onPullingDown () {
        this.getAccountList()
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      // 最近转账记录 http://wallet.pigamegroup.com/tx/tx_accountlist
      getAccountList () {
        this.$fetch.get('/tx/tx_accountlist',{
          count: this.count
        }).then(res => {
          if(res.success) {
            this.loadingShow = false
            let fendArr = res.data
            if(fendArr.length > 0) {
              this.emptyDatas = false
              if(this.count === 20) {
                this.friendList = fendArr
              } else {
                this.friendList.push(...fendArr)
              }
            } else {
              this.friendList = []
              this.emptyDatas = true
            }
          } else {
            this.emptyDatas = true
            this.loadingShow = false
          }
        }).catch(err => {
          console.log(err)
        })
      },
      toTransfer(item) {
        let data ={
          address: item.address,
          nick: item.nick,
          username: item.username,
          flag:1
        }
        this.$router.push({
          path: '/confirmTransfer',
          query:{
            dataInfo: JSON.stringify(data)
          }
        })
      }
    },
    computed: {
      options () {
        return {
          pullUpLoad: {
            txt: {
              more: this.$t('transfer.text7'),
              noMore: this.$t('transfer.text8')
            }
          }
        }
      }
    },
    components: {
      appHeader,
      bottomMenu: () => import('@/components/bottomMenu')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../assets/css/mixin.styl"
  .uls-child{
    margin .4rem 0 .8rem
    .li-item{
      padding 0 .2rem 0 .4rem
      display flex
      justify-content space-between
      align-items center
      height 1.2rem
      width 100%
      background #f7f7f7
      border-radius 4px
      margin-bottom .2rem
      &:nth-child(1){
        .icon-box{
          bg-image ("../../assets/img/find/income")
        }
      }
      &:nth-child(2){
        .icon-box{
          bg-image ("../../assets/img/find/propsCard")
        }
      }
      .li-left{
        display flex
        align-items center
        font-size 0
        .icon-box{
          width .36rem
          height: .36rem
          background-position center
          background-size cover
          background-repeat no-repeat
          margin-right .2rem
        }
        .li-c{
          font-size .28rem
          color #000
        }
      }
      .li-right{
        width .2rem
        height 1.2rem
        line-height 1rem
        .right-box{
          height 1.2rem
          width 100%
          img{
            width 100%
          }
        }
      }
    }
  }
  .friend-list{
    margin-bottom .2rem
    font-size .28rem
    color #000
  }
</style>
