<template>
  <div class="login" @keyup.enter="loginTo">
    <div class="v-content-wrapper">
      <div class="bg-img-container">
        <div class="login-logo"></div>
        <div class="sub-logo"></div>
      </div>
      <div class="input-box">
        <input ref="username" @input="errT = ''" type="text" :placeholder="$t('login.text1')" v-model="loginForm.username">
        <input ref="password" @input="errT = ''" type="password" :placeholder="$t('login.text2')" v-model="loginForm.password">
      </div>
      <div style="text-align: left; font-size: 14px;color: red">{{errT}}</div>
      <p class="forget" @click="forget">{{$t('login.text3')}}？</p>
      <div @click="loginTo" class="btn" v-waves>{{$t('login.text4')}}</div>
      <div class="register" @click="register">{{$t('login.text5')}}</div>
      <div class="language" @click="open">{{getCurText}}</div>
      <common-popup class="popup-ref" ref="CustomPopupRef">
        <div slot="PoperContent" class="PoperContentView">
          <ul>
            <li class="item" v-for="(item, index) in languageList" :key="item.key" @click="chooseLanguage(index)">
              <i :class="{active: currentIndex === index}"></i>
              <p>{{item.language}}</p>
            </li>
          </ul>
          <div class="cancel" @click="cancel">{{$t('login.text6')}}</div>
        </div>
      </common-popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import waves from '@/dircetive/waves/waves' // 水波纹指令
import commonPopup from '@/components/Popup'

export default {
  components: {commonPopup},
  directives: {waves},
  data() {
    return {
      languageList: [
        {language: '简体中文', lan: 'CN'},
        {language: 'English', lan: 'EN'},
      ],
      currentIndex: parseInt(localStorage.getItem('index')) || 0,
      errT: '',
      loadingBtn: false,
      safeShow: false,
      errInputMsg: '',
      verifyCode: '',
      verifyShow: false,
      loginForm: {
        username: localStorage.getItem('userName') || '',
        password: ''
      },
      redirect: undefined
    }
  },
  mounted() {
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  computed: {
    getCurText() {
      if (this.languageList[this.currentIndex]) {
        return this.languageList[this.currentIndex].language
      } else {
        return '简体中文'
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    register() { // 注册
      this.$router.push('/register')
    },
    forget() { // 忘记密码
      this.$router.push('/forget')
    },
    cancel() {
      this.$refs.CustomPopupRef.closeCustom()
    },
    open() {
      this.$refs.CustomPopupRef.showCustom()
    },
    loginTo() {
      if (this.loginForm.username !== '' && this.loginForm.password !== '') {
          this.$store.dispatch('login', this.loginForm).then(() => {
            if (!this.$store.state.errMsg) { // 成功登录后
              this.$store.commit('SET_USER_NAME', this.loginForm.username)
              this.$store.dispatch('getUserBalance')
              this.$router.push('/menu')
            } else {
              this.toastD(this.$store.state.errMsg)
            }
        }).catch((error) => {
          console.log(error)
        })
        // this.$fetch.post('/user/userlogin',{
        //   username: this.loginForm.username,
        //   password: this.loginForm.password
        // }).then(res => {
        //   if(res.success === true) {
        //     this.$store.commit('SET_USER_NAME', this.loginForm.username)
        //     this.$store.dispatch('getUserBalance')
        //     this.$router.push('/menu')
        //   } else {
        //     this.toastD(res.data.msg)
        //   }
        // }).catch(err => {
        //   console.log(err)
        // })
      } else {
        this.toastD('请将登录信息填写完整！')
      }
    },

    chooseLanguage(index) {
      this.currentIndex = index
      localStorage.setItem('index', this.currentIndex)
      localStorage.setItem('discoveryLang', this.languageList[this.currentIndex].lan)
      this.cancel()
      location.reload()
    },
  }
}
</script>

<style scoped lang="stylus">
  @import "../assets/css/mixin.styl"
  .login
    display: flex
    align-items center
    justify-content center
    flex-direction column
    .v-content-wrapper
      height calc(100vh - 1.8rem)
      .bg-img-container
        display flex
        flex-direction row
        .login-logo
          margin-left 1.8rem
          height 1.67rem
          width 2.36rem
          bg-image ("../assets/img/menu/newMenu/logo")
          background-position center
          background-size cover
          background-repeat no-repeat
        .sub-logo
          margin-left 5px
          height .34rem
          width 2.1rem
          bg-image ("../assets/img/menu/newMenu/topspeed")
          background-position center
          background-size cover
          background-repeat no-repeat
      .input-box
        margin-top .8rem
        input
          width 100%
          height: .8rem
          font-size: .3rem
          color #000
          padding: 0 .2rem
          margin-bottom: .6rem
          border-bottom: 1px solid #bfbfbf
          &:focus
            color #000
            border-bottom: 1px solid #000
      .forget
        float right
        color #b79961
        font-size .28rem
      .btn
        margin-top 1.4rem
        border-radius: 0.04rem;
        font-size: 0.32rem;
        color: #000;
        text-align: center;
        height: 1rem;
        line-height: 1.1rem;
        background-color: #ffe941;
      .register
        margin-top .6rem
        color #b79961
        text-align center
        font-size .32rem
      .language
        position absolute
        bottom .8rem
        color #b79961
        left 50%
        transform translateX(-50%)
        font-size .32rem
      .popup-ref
        .PoperContentView
          padding-bottom 10px
          font-size .3rem
          background-color: #fff
          ul
            background-color #fff
            margin-bottom .2rem
            border 1px solid #000
            border-radius 4px
            box-shadow 0 0 2px #fff
            .item
              margin 0 .35rem
              height 1rem
              display flex
              flex-direction row
              align-items center
              line-height 1rem
              font-size 0
              border-bottom 1px dotted #000
              &:nth-child(2)
                border-bottom none
              i
                display block
                width .4rem
                height .4rem
                border-radius 50%
                background-color #ccc
                margin-right .2rem
                &.active
                  background-image url("../assets/img/login/active.svg")
                  background-repeat no-repeat
                  background-size cover
                  background-color #fff
              p
                font-size .3rem
          .cancel
            height 1rem
            line-height 1rem
            background-color #fff
            border 1px solid #000
            border-radius 4px
      .dialog-w
        position: fixed
        left: 0
        top: 0
        right: 0
        bottom: 0
        width: 100%
        height: 100%
        z-index: 200
        color #19191a
        &.dialog-enter-active, &.dialog-leave-active
          transform translateY(0)
          transition: transform .3s linear;
        &.dialog-enter, &.dialog-leave-to
          transform translateY(100%)
        .dialog-content
          width: 100%
          height: 100%
        .dialog-box
          background-color: #fff
          width: 100%
          position: absolute
          bottom: 0
          left: 0
          padding: 0 .3rem .6rem
          border-radius 4px 4px 0 0
          .close
            position: absolute
            right: 0
            top: 0
            padding: .4rem
            .close-icon
              width: .32rem
              height: .32rem
          .dialog-title
            font-size: .32rem
            font-weight: bold
            padding: .9rem 0 .6rem
            text-align: center
          .bet-uls-d
            padding: .45rem
            border-radius 4px
            background-color: #f5f6fa
            display: flex
            align-items center
            flex-wrap wrap
            .bet-list-d
              display: flex
              align-items center
              justify-content center
              flex-direction column
              background-color: #fff
              border: 1px solid #e6e7eb
              border-radius .08rem
              width: 1.8rem
              height: 2.2rem
              margin-right: .3rem
              font-size: .24rem
              &.active-li
                color #00a6f1
                border-color #00a6f1
              .img-icon
                width: 1.08rem
                height: 1.28rem
                margin-bottom: .2rem
</style>
