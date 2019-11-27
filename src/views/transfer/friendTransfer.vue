<template>
    <div class="friend">
      <app-header :titleName="titleName"></app-header>
      <div class="friend-box">
        <cube-scroll
          ref="scroll"
          :options="options"
          :data="friendList"
          @pulling-up="onPullingDown" v-show="!emptyDatas">
          <ul class="friend-ul">
            <li v-for="(item,index) in friendList" :key="index" class="li-friend" @click="toTransfer(item)">
              <div class="user-img">
                <img :src="avatar + item.otherAddress" :onerror="defaultImg">
              </div>
              <div class="user-box">
                <div class="user-nick">{{item.nickName}}</div>
                <div class="user-name">{{item.username}}</div>
              </div>
            </li>
          </ul>
        </cube-scroll>
        <div class="empty-data" v-show="emptyDatas">
          <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
          <p class="text">{{$t('transfer.text5')}}</p>
        </div>
      </div>
      <v-loading v-show="loadingShow"></v-loading>
    </div>
</template>

<script>
  import appHeader from '../../components/mFixedTop'
    export default {
        data() {
          return{
            variable: 'http://ofydu65mj.bkt.clouddn.com/', // 拼接字符串需要的变量
            avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
            defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
            emptyDatas: false,
            count: 20,
            titleName: this.$t('transfer.text39'),
            friendListPage: 1,
            loadingShow: true,
            friendList: [], // 好友列表
            friendArr: [],
          }
        },
      created() {
          this.getAccountList()
      },
      methods: {
        onPullingDown () {
          this.getAccountList()
          // 没有数据，结束此次刷新
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 1000)
        },
        // 好友关系列表 http://wallet.pigamegroup.com/friend/list?page=1&lastUpdateAt=19991
        getAccountList () {
          this.$fetch.get('/friend/list',{
            page: this.friendListPage,
            lastUpdateAt: ''
          }).then(res => {
            if(res.success) {
              this.loadingShow = false
              let fendArr = []
              for (let i in res.data) {
                if (res.data[i].shipType === 1 && res.data[i].state === 102) {
                  fendArr.push(res.data[i])
                }
              }
              if(fendArr.length > 0) {
                this.emptyDatas = false
                if(this.friendListPage === 1) {
                  this.friendList = fendArr
                } else {
                  this.friendList.push(...fendArr)
                }
              } else {
                if(this.friendListPage === 1) {
                  this.emptyDatas = true
                  this.friendList = []
                }
              }
              // this.$refs.scroll.forceUpdate()
            } else {
              this.loadingShow = false
              this.emptyDatas = true
              this.friendListPage = 1
              this.friendList = []
            }
          }).catch(err => {
            console.log(err)
          })
        },
        toTransfer(item) {
          let data ={
            address: item.address,
            otherAddress: item.otherAddress,
            nick: item.nickName,
            username: item.username,
            flag:2
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
  .friend-box{
    width: 100%;
    overflow: hidden;
    position: fixed;
    padding 0 .4rem
    top: 1.2rem;
    left: 0;
    bottom: 0;
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
