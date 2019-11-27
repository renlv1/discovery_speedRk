<template>
  <div class="v-content-wrapper">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <input v-model="userName" :placeholder="$t('forget.username')" class="v-placeholder-text user—name" autofocus="true"  v-bind:readonly="isReadOnly" :class="{isBottomBlack: !show}"/>
    <div v-show="show" class="btn" @click="nextStep">{{this.$t('forget.nextStep')}}</div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {checkaccount} from '@/api/login'
import {mapMutations} from 'vuex'
export default {
  components: {mFixedTop},
  data() {
    return {
      titleName: this.$t('forget.title'),
      isReadOnly: false,
      userName: '',
      show: true
    }
  },
  methods: {
    goPath() {
      this.$router.push('/login')
    },
    nextStep() {
      checkaccount(this.userName).then((res) => {
        if (res.data.success) {

          // 设置用户谷歌验证码
          const googleCode = res.data.data.openGoogleCode
          const userName = res.data.data.username
          const email = res.data.data.email

          this.setGoogleCode(googleCode)
          this.setUserName(userName)
          this.setEmail(email)

          this.$router.push('/forget/forgetNext')
          this.isReadOnly = true
          this.show = false
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    ...mapMutations({
      setGoogleCode: 'SET_GOOGLE',
      setUserName: 'SET_USER_NAME',
      setEmail: 'SET_EMAIL',
    })
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .user—name
    width 100%
    font-size .32rem
    height .8rem
    line-height .8rem
    color #000
    border-bottom 1px solid #bfbfbf
    &.isBottomBlack
      border-bottom 1px solid #000
    &:focus
      border-bottom 1px solid #000
  .btn
    margin-top 1.6rem
    text-align center
    display inline-block
    width 100%
    height 1rem
    line-height 1rem
    color #b79961
    font-size .32rem
    border-1px(#b79961, solid)
</style>
