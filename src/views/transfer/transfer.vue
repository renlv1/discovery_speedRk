<template>
    <div class="transfer">
      <app-header :titleName="titleName" :isGoBack="isGoBack"></app-header>
      <div class="main-b">
        <ul class="uls-child">
          <router-link class="li-item" tag="li" to="/friendTransfer">
            <div class="li-left">
              <div class="icon-box"><img src="../../assets/img/transfer/friend.svg"></div>
              <div class="li-c">{{$t('transfer.text1')}}</div>
            </div>
            <div class="li-right">
              <div class="right-box"><img src="../../assets/img/transfer/right-arrow.svg"></div>
            </div>
          </router-link>
          <router-link class="li-item" tag="li" to="/transferUser">
            <div class="li-left">
              <div class="icon-box"><img src="../../assets/img/transfer/user.svg"></div>
              <div class="li-c">{{$t('transfer.text2')}}</div>
            </div>
            <div class="li-right">
              <div class="right-box"><img src="../../assets/img/transfer/right-arrow.svg"></div>
            </div>
          </router-link>
          <router-link class="li-item" tag="li" to="/transferRecord">
            <div class="li-left">
              <div class="icon-box"><img src="../../assets/img/transfer/record.svg"></div>
              <div class="li-c">{{$t('transfer.text3')}}</div>
            </div>
            <div class="li-right">
              <div class="right-box"><img src="../../assets/img/transfer/right-arrow.svg"></div>
            </div>
          </router-link>
        </ul>
        <div class="friend-list">{{$t('transfer.text4')}}</div>
        <div class="friend-box">
          <ul class="friend-ul">
            <li v-for="(item,index) in friendList" :key="index" class="li-friend" @click="toTransfer(item)">
              <div class="user-img">
                <img :src="avatar + item.address" :onerror="defaultImg">
              </div>
              <div class="user-box">
                <div class="user-nick">{{item.nick}}</div>
                <div class="user-name">{{item.username}}</div>
              </div>
            </li>
          </ul>
          <div class="empty-data" v-show="emptyDatas">
            <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
            <p class="text">{{$t('transfer.text5')}}</p>
          </div>
        </div>
        <v-loading v-show="loadingShow"></v-loading>
      </div>
    </div>
</template>

<script>
import appHeader from '../../components/mFixedTop'
    export default {
      data() {
         return{
           isGoBack: true,
           loadingShow: true,
           variable: 'http://ofydu65mj.bkt.clouddn.com/', // 拼接字符串需要的变量
           avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
           defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
           emptyDatas: false,
           count: 20,
           titleName: this.$t('transfer.text6'),
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
        vLoading: resolve => require(['@/components/loading.vue'], resolve),
        appHeader
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.transfer{
  overflow auto!important
}
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
    .li-left{
      display flex
      align-items center
      font-size 0
      .icon-box{
        width .34rem
        margin-right .2rem
        img{
          width 100%
        }
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
.friend-box{
  width: 100%;
  /*overflow: hidden;*/
  /*position: fixed;*/
  /*padding 0 .4rem*/
  /*top: 7.2rem;*/
  /*left: 0;*/
  /*bottom: 0;*/
  .li-friend{
    height 1.4rem
    display: flex;
    align-items center
    border-bottom 1px solid #e6e6e6
    .user-img{
      border-radius 4px
      width .8rem
      height .8rem
      margin-right .2rem
      img{
        display block
        width 100%
      }
    }
    .user-box{
      .user-nick{
        font-size .28rem
        color #000
        margin-bottom .14rem
      }
      .user-name{
        font-size .24rem
        color #bfbfbf
      }
    }
  }
}
</style>
