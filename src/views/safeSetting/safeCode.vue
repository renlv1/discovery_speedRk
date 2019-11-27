<template>
    <div class="transfer">
      <app-header :titleName="titleName"></app-header>
      <div class="main-b">
        <ul class="ul-tab" v-if="$route.query.password === 2">
          <li class="li-status" v-for="(item, index) in status" :key="index" @click="changeTab(index)" :class="{activeLi: orderTab === index}">{{item}}</li>
        </ul>
<!--     谷歌验证码    -->
        <div class="transfer-c" v-show="orderTab === 0">
          <div class="user-box" @click="focusA(1)">
            <div class="v-input-item" :class="{'focus': isFocus1, 'no-text': isEmpty1}">
<!--              <label class="label">{{$t('safe.text36')}}</label>-->
              <input type="password" class="input v-placeholder-text" @focus="focusInput(1)" @blur="blurInput(1)" v-model.trim="safeCode1" ref="input1" :placeholder="$t('safe.text36')">
            </div>
          </div>
          <div class="user-box" @click="focusA(2)">
            <div class="v-input-item" :class="{'focus': isFocus2, 'no-text': isEmpty2}">
<!--              <label class="label">{{$t('safe.text37')}}</label>-->
              <input type="password" class="input v-placeholder-text" @focus="focusInput(2)" @blur="blurInput(2)" v-model.trim="safeCode2" ref="input2" :placeholder="$t('safe.text37')">
            </div>
          </div>
          <div class="v-input-item input-email" :class="{'focus': isFocus3, 'no-text': isEmpty3}" @click="focusA(3)">
<!--            <label class="label">{{$t('safe.text38')}}</label>-->
            <input type="text" class="input v-placeholder-text" @blur="blurInput(3)"  @focus="focusInput(3)" v-model.trim="googleCode" ref="input3" :placeholder="$t('safe.text38')">
          </div>
        </div>
<!--      邮箱验证  -->
        <div class="transfer-c" v-show="orderTab === 1">
          <div class="user-box" @click="focusA(4)">
            <div class="v-input-item" :class="{'focus': isFocus4, 'no-text': isEmpty4}">
<!--              <label class="label">{{$t('safe.text36')}}</label>-->
              <input type="password" class="input v-placeholder-text" @focus="focusInput(4)" @blur="blurInput(4)" v-model.trim="safeCode3" ref="input4" :placeholder="$t('safe.text36')">
            </div>
          </div>
          <div class="user-box" @click="focusA(5)">
            <div class="v-input-item" :class="{'focus': isFocus5, 'no-text': isEmpty5}">
<!--              <label class="label">{{$t('safe.text37')}}</label>-->
              <input type="password" class="input v-placeholder-text" @focus="focusInput(5)" @blur="blurInput(5)" v-model.trim="safeCode4" ref="input5" :placeholder="$t('safe.text37')">
            </div>
          </div>
          <div class="input-email v-input-item" :class="{'focus': isFocus6, 'no-text': isEmpty6}" @click="focusA(6)">
<!--            <label class="label">{{$t('safe.text39')}}</label>-->
            <input type="text" class="input v-placeholder-text"  @blur="blurInput(6)"  @focus="focusInput(6)" v-model.trim="email" ref="input6" :placeholder="$t('safe.text39')">
            <div class="send-email" @click="sendEmail" :class="{'disable-btn': disabled}">{{countText}}</div>
          </div>
        </div>
        <div class="next" @click="nextBtn()">{{$t('safe.text21')}}</div>
      </div>
    </div>
</template>

<script>
  /* eslint-disable */
  import appHeader from '../../components/mFixedTop'
  import {mapGetters} from 'vuex'
    export default {
       data() {
         return{
           countText: this.$t('safe.text40'),
           disabled: false,
           safeCode1: '',
           safeCode2: '',
           safeCode3: '',
           safeCode4: '',
           googleCode: '',
           isFocus1: false,
           isFocus2: false,
           isFocus3: false,
           isFocus4: false,
           isFocus5: false,
           isFocus6: false,
           isEmpty1: false,
           isEmpty2: false,
           isEmpty3: false,
           isEmpty4: false,
           isEmpty5: false,
           isEmpty6: false,
           countTime: 60,
           isFocus: false,
           titleName: this.$t('safe.text30'),
           orderTab: 0,
           userName: '',
           email: '',
           address: '',
           imgAddress: '',
           nick: '',
           username: '',
           activeInput: false,
           activeEmail: false,
           activeAddress: false,
           serverEmail: '',
           errMsg2: '',
           status: [this.$t('safe.text11'), this.$t('safe.text41')],
         }
       },
      created() {
         if (this.$route.query.password === 1) {
           this.orderTab = 1
         }
      },
      computed: {
        ...mapGetters([
          'userData'
        ])
      },
      methods: {
         // 聚焦input
        focusA (index) {
          this.$refs['input' + index].focus()
        },
        // 发送验证码
        sendEmail () {
          this.disabled = true
          this.$fetch.post('/user/sendEmailCode', {
            email: this.userData.email,
            sendType: 2
          }).then(res => {
            if (res.success) {
              this.countDown()
              this.toastD(this.$t('safe.text24'))
            } else {
              this.disabled = false
              this.toastD(res.msg)
            }
          })
        },
        // 倒计时
        countDown () {
          this.disabled = true
          if (this.countTime === 0) {
            this.countText = this.$t('safe.text40')
            this.countTime = 60
            this.disabled = false
          } else {
            this.countTime--
            this.countText = this.countTime
            this.timer = setTimeout(() => this.countDown(), 1000)
          }
        },
        toastD (text) {
          this.toast = this.$createToast({
            txt: text,
            time: 2000,
            type: 'txt'
          })
          this.toast.show()
        },
        blurInput (index) {
          if (index === 1) {
            if (this.safeCode1 === '') {
              this.isFocus1 = false
            } else {
              this.isEmpty1 = true
            }
          } else if (index === 2) {
            if (this.safeCode2 === '') {
              this.isFocus2 = false
            } else {
              this.isEmpty2 = true
            }
          } else if (index === 3) {
            if (this.googleCode === '') {
              this.isFocus3 = false
            } else {
              this.isEmpty3 = true
            }
          } else if (index === 4) {
            if (this.safeCode3 === '') {
              this.isFocus4 = false
            } else {
              this.isEmpty4 = true
            }
          } else if (index === 5) {
            if (this.safeCode4 === '') {
              this.isFocus5 = false
            } else {
              this.isEmpty5 = true
            }
          } else if (index === 6) {
            if (this.email === '') {
              this.isFocus6 = false
            } else {
              this.isEmpty6 = true
            }
          }
        },
        // 聚焦
        focusInput (index) {
          if (index === 1) this.isFocus1 = true
          if (index === 2) this.isFocus2 = true
          if (index === 3) this.isFocus3 = true
          if (index === 4) this.isFocus4 = true
          if (index === 5) this.isFocus5 = true
          if (index === 6) this.isFocus6 = true
        },
        // 谷歌修改安全密码
        modifySetting () {
          let dataObj = {}
          if (this.orderTab === 0) {
            dataObj = {
              tradePwd: this.safeCode2,
              code: this.googleCode,
              codeType: 1
            }
          } else {
            dataObj = {
              tradePwd: this.safeCode4,
              code: this.email,
              codeType: 2
            }
          }
          this.$fetch.post('/security/setTractionPwd', dataObj).then(res => {
            if (res.success) {
              this.toast2 = this.$createToast({
                txt: this.$t('safe.text42'),
                time: 1000,
                type: 'txt',
                onTimeout: () => {
                  this.$router.push('/safeSetting')
                }
              })
              this.toast2.show()
            } else {
              this.toastD(res.msg)
            }
          })
        },
        // 下一步
        nextBtn() {
          if(this.orderTab === 0) {
            if (this.safeCode1 === '') {
              this.toastD(this.$t('safe.text43'))
              return
            }
            if (this.safeCode2 === '') {
              this.toastD(this.$t('safe.text44'))
              return
            }
            let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/
            if (!reg.test(this.safeCode1) || !reg.test(this.safeCode2)) {
              this.toastD(this.$t('safe.text45'))
              return;
            }
            if (this.safeCode1 !== this.safeCode2) {
              this.toastD(this.$t('safe.text46'))
              return
            }
            if (this.googleCode === '') {
              this.toastD(this.$t('safe.text14'))
              return
            }
            this.modifySetting()
          } else if(this.orderTab === 1) {
            if (this.safeCode3 === '') {
              this.toastD(this.$t('safe.text43'))
              return
            }
            if (this.safeCode4 === '') {
              this.toastD(this.$t('safe.text44'))
              return
            }
            let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/
            if (!reg.test(this.safeCode3) || !reg.test(this.safeCode4)) {
              this.toastD(this.$t('safe.text45'))
              return;
            }
            if (this.safeCode3 !== this.safeCode4) {
              this.toastD(this.$t('safe.text46'))
              return
            }
            if (this.email === '') {
              this.toastD(this.$t('safe.text23'))
              return
            }
            if (this.$route.query.password === 1) {
              this.setSafeFn()  // 设置安全密码
            } else {
              this.modifySetting()  // 修改安全密码
            }
          }
        },
        // 设置安全密码
        setSafeFn () {
          this.$fetch.post('/security/setTractionPwd', {
            tradePwd: this.safeCode4,
            code: this.email,
            codeType: 2
          }).then(res => {
            if (res.success) {
              this.$store.dispatch('getUserBalance')
              this.toast2 = this.$createToast({
                txt: this.$t('safe.text47'),
                time: 1000,
                type: 'txt',
                onTimeout: () => {
                  this.$router.push('/safeSetting')
                }
              })
              this.toast2.show()
            } else {
              this.toastD(res.msg)
            }
          })
        },
        changeTab(index) {
          this.orderTab = index
          this.safeCode1 = ''
          this.safeCode2 = ''
          this.safeCode3 = ''
          this.safeCode4 = ''
          this.email = ''
          this.googleCode = ''
          this.isEmpty1 = false
          this.isEmpty2 = false
          this.isEmpty3 = false
          this.isEmpty4 = false
          this.isEmpty5 = false
          this.isEmpty6 = false
          this.isFocus1 = false
          this.isFocus2 = false
          this.isFocus3 = false
          this.isFocus4 = false
          this.isFocus5 = false
          this.isFocus6 = false
        }
      },
      components: {
        // vLoading: resolve => require(['@/components/loading.vue'], resolve),
        appHeader
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ul-tab{
    margin-top .5rem
    height 1rem
    display flex
    justify-content space-between
    align-items center
    margin-bottom: .4rem
    .li-status{
      font-size .28rem
      color #999
      background #f0f0f0
      border-radius 4px
      height 1rem
      flex 1
      display flex
      justify-content center
      align-items center
      margin-right .3rem
      &:last-child{
        margin-right 0
      }
      &.activeLi{
        background #ffe600
        color #000
      }
    }
  }
  .v-input-item{
    height: 1rem
    width: 100%
    display: flex
    align-items center
    margin-bottom: .2rem
    position: relative
    border-bottom: 1px solid #e6e6e6
    .label{
      color #bfbfbf
      display: block
      word-break:keep-all;
      white-space:nowrap;
      min-width 1.6rem
      font-size: .3rem
    }
    .input{
      font-size: .3rem
      height: 100%
      display: block
      flex 1
      padding-left: .2rem
    }
  }
.user-box{
  margin-bottom: .2rem
  height 1rem
  position relative

  .input-user{
    font-size .28rem
    color #000
    height 100%
    width 100%
    /*border-bottom 1px solid #e6e6e6*/
    &::-webkit-input-placeholder {
      color: #bfbfbf;
    }
    &:-moz-placeholder {
      color: #bfbfbf;
    }
    &::-moz-placeholder {
      color: #bfbfbf;
    }
    &:-ms-input-placeholder {
      color: #bfbfbf;
    }
  }
}
  .input-email{
    font-size .28rem
    color #000
    height 1rem
    width 100%
    /*border-bottom 1px solid #e6e6e6*/
    position relative
    .send-email{
      position: absolute
      right: 0
      top: 0
      line-height: 1rem
      padding: 0 .2rem
      font-size: .28rem
      color #b79961
      &.disable-btn{
        pointer-events none
      }
    }
    input{
      color #000
      font-size .28rem
      width 100%
      height 100%
      padding-right .5rem
      &::-webkit-input-placeholder {
        color: #bfbfbf;
      }
      &:-moz-placeholder {
        color: #bfbfbf;
      }
      &::-moz-placeholder {
        color: #bfbfbf;
      }
      &:-ms-input-placeholder {
        color: #bfbfbf;
      }
    }
    .errorMsg{
      position absolute
      top 1.2rem
      color: #F75050;
      font-size .28rem
    }
  }
.next{
  line-height 1rem
  text-align center
  margin-top 1.6rem
  width 100%
  height 1rem
  color #b79961
  border-radius 4px
  border 1px solid #b79961
  font-size .32rem
}
</style>
