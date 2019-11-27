<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="v-content-wrapper">
      <div class="wrap-top">
        <p>{{$t('treasure.text26')}}({{number}}/{{total}})</p>
        <div class="friend-list">
          <div class="no-friend" v-if="number === 0">
            <img src="../../assets/img/treasure/chooseFriend.png" />
            <p class="no-friend-text">{{$t('treasure.text25')}}</p>
          </div>
          <div class="has-friend" v-if="number !== 0">
            <ul>
              <li v-for="item in chooseFriends" :key="item">
                <img src="../../assets/img/treasure/chooseFriend.png" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="has-friend-list">
      <p class="friend-text">{{$t('treasure.text27')}}</p>
      <ul>
        <li v-for="(item,index) in friendList" :key="index" @click="chooseFriend(item)">
          <span class="list-left" :class="{'active': item.isActive}"></span>
          <div class="list-right">
            <img src="../../assets/img/treasure/chooseFriend.png" />
            <span class="friend-name">{{item.friendusername}} {{item.nickName ? item.nickName : item.username}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn" @click="sure">{{$t('treasure.text28')}}</div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {friend} from "../../api/treasure";

export default {
  name: "PriorityAllocation",
  components: {mFixedTop},
  data() {
    return {
      avatar: `${this.$api}` + `file/img?type=user&size=2&id=`,// 头像地址前缀
      titleName: this.$t('treasure.text29'),
      isGoBack: true,
      number: 0,
      total: 10,
      friendList: [],
      chooseFriends: [],
    }
  },
  created() {
    this.getFriendList()
  },
  mounted() {
    if (this.$route.query.fromApp || this.$store.state.isiOS) { // 隐藏从iOS客户端进入H5后首页的返回icon
      this.isGoBack = false
      this.$store.commit('IS_IOS', true)
    } else {
      this.isGoBack = true
    }
  },
  methods: {
    getFriendList() {
      friend().then((res) => {
        let friendList =res.data.data
        friendList.forEach(item => {
          item.isActive = false
        })
        this.friendList = friendList
      })
    },
    chooseFriend(item) {
      if (this.chooseFriends.length < 10) {
        if (item.isActive) {
          item.isActive = false
          this.chooseFriends.forEach((friend, index) => {
            if (friend === item.otherAddress) {
              this.number--
              this.chooseFriends.splice(index, 1)
            }
          })
        } else {
          item.isActive = true
          this.chooseFriends.push(item.otherAddress)
          this.number++
        }
        this.number = this.chooseFriends.length
      } else {
        item.isActive = false
        this.chooseFriends.pop()
        this.toastD(this.$t('treasure.text30'),)
      }
    },
    sure() {
      this.$store.commit('SET_FRIEND_NUM', this.number)
      if (this.$route.query.flag) {
        this.$router.push({
          path: '/modify',
          query: {
            number: this.number,
            startTime: this.$route.query.startTime,
            endTime: this.$route.query.endTime,
            weekArr: this.$route.query.weekArr,
            id: this.$route.query.id
          }
        })
      } else {
        this.$router.push({
          path: '/treasureNext',
          query: {
            address: this.$route.query.address,
            startTime: this.$route.query.startTime,
            endTime: this.$route.query.endTime,
            weekArr: this.$route.query.weekArr,
            number: this.number,
            addressStr: this.chooseFriends.join(',')
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    padding-bottom .4rem
    background-color #fff
    .wrap-top
      font-size .3rem
      .friend-list
        .no-friend
          margin-top .25rem
          display flex
          flex-direction row
          align-items center
          img
            width 1rem
            height 1rem
            margin-right .3rem
            border-radius 4px
          .no-friend-text
            line-height .4rem

        .has-friend
          margin-top .25rem
          ul
            width 100%
            display flex
            flex-direction row
            flex-wrap wrap
            li
              margin-right .3rem
              img
                border-radius 4px
                width 1rem
                height 1rem
  .has-friend-list
    .friend-text
      /*position absolute*/
      width 100%
      background-color #f7f7f7
      padding .34rem 0 .14rem .4rem
      font-size .3rem
      color #999
    ul
      padding .8rem .4rem 0
      margin-bottom: 50px;
      li
        height 1.4rem
        display flex
        flex-direction row
        align-items center
        .list-left
          display block
          width .4rem
          height .4rem
          border-radius 100%
          border 1px solid #bfbfbf
          margin-right .4rem
          &.active
            width .4rem
            height .4rem
            background url("../../assets/img/treasure/chosen.png") no-repeat
            background-size .4rem .4rem
            border none
        .list-right
          display flex
          flex-direction row
          align-items center
          img
            width 1rem
            height 1rem
            border-radius 4px
            margin-right .3rem
          .friend-name
            font-size .3rem
  .btn
    width 100%
    background-color #fff
    position fixed
    bottom 0
    font-size .32rem
    border 1px solid #b79961
    color #b79961
    height 1rem
    line-height 1rem
    text-align center
</style>
