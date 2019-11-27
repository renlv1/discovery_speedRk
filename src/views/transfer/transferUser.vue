<template>
    <div class="transfer">
      <app-header :titleName="titleName"></app-header>
      <div class="main-b">
        <ul class="ul-tab">
          <li class="li-status" v-for="(item, index) in $t('transfer.status')" :key="index" @click="changeTab(index)" :class="{activeLi: orderTab === index}">{{item}}</li>
        </ul>
        <div class="transfer-c" v-show="orderTab === 0">
          <div class="user-box">
            <div class="v-input-item" :class="{'focus': isFocus}">
              <label class="label" :class="{'focusLabel': isFocus}">{{$t('transfer.text41')}}</label>
              <input type="text" class="input" @focus="focusInput(1)" v-model.trim="userName" @blur="blurInput(1)">
            </div>
          </div>
          <div class="v-input-item" :class="{'focus': isFocus2 }">
            <label class=" email-input" :class="{'focusLabel': isFocus2}">{{$t('transfer.text42')}}</label>
            <input type="text" class="input" @focus="focusInput(2)" v-model.trim="email" @blur="blurInput(2)">
          </div>
        </div>
        <div class="transfer-c" v-show="orderTab === 1">
          <div class="user-box">
            <div class="v-input-item" :class="{'focus': isFocus3 }">
              <label class="label" :class="{'focusLabel': isFocus3}">{{$t('transfer.text43')}}</label>
              <input type="text" class="input" @focus="focusInput(3)" v-model.trim="address" @blur="blurInput(3)">
            </div>
          </div>
        </div>
        <div class="next" @click="nextBtn()">{{$t('transfer.text44')}}</div>
      </div>
    </div>
</template>

<script>
  /* eslint-disable */
  import appHeader from '../../components/mFixedTop'
    export default {
       data() {
         return{
           isFocus: false,
           isFocus2: false,
           isFocus3: false,
           titleName: this.$t('transfer.text45'),
           orderTab: 0,
           userName: '',
           email: '',
           address: '',
           userAddress: '',
           nick: '',
           username: '',
           activeInput: false,
           activeEmail: false,
           activeAddress: false,
           serverEmail: '',
           errMsg2: '',
           status: ['用户名', '交易地址'],
         }
       },
      created() {
      },
      methods: {
        toastD (text) {
          this.toast = this.$createToast({
            txt: text,
            time: 2000,
            type: 'txt'
          })
          this.toast.show()
        },
        blurInput (index) {
          if(index === 1) {
            if(this.userName === '') {
              this.isFocus = false
            }
          } else if(index === 2){
            if(this.email.trim() === '') {
              this.isFocus2 = false
            }
          }else if (index === 3) {
            if(this.address.trim() === '') {
              this.isFocus3 = false
            }
          }
        },
        focusInput(index) {
          if(index === 1) {
            this.isFocus = true
          } else if(index === 2) {
            this.isFocus2 = true
          } else if(index === 3) {
            this.isFocus3 = true
          }
        },
        // 下一步
        nextBtn() {
          if(this.orderTab === 0) { // 用户名
            if(this.userName === '') {
              this.toastD( this.$t('transfer.text46'))
              return
            }
            if(this.email === '') {
              this.toastD( this.$t('transfer.text47'))
              return
            }
            this.$fetch.post('/user/checkaccount',{
              account:this.userName,
              showFlag: 10000
            }).then(res => {
              if (res.success) {
                let _res = res.data
                this.userAddress =  res.data.address
                this.nick = res.data.nickname
                this.username = res.data.username
                if (_res.email) {
                  this.serverEmail = _res.email
                } else{
                  this.toastD( this.$t('transfer.text48'))
                  return
                }
                if (this.email.trim() === '') {
                  this.toastD( this.$t('transfer.text47'))
                } else {
                    if (this.email.trim() !== this.serverEmail.substring(0, 4)) {
                     this.toastD( this.$t('transfer.text36'))
                    } else {
                      let data ={
                        email: this.email,
                        address: this.userAddress,
                        nick: this.nick,
                        username: this.username,
                        flag:3
                      }
                      this.$router.push({
                        path: '/confirmTransfer',
                        query:{
                          dataInfo: JSON.stringify(data)
                        }
                      })
                    }
                }
              } else {
                this.toastD(res.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          } else if(this.orderTab === 1) {  // 交易地址
            if(this.address === '') {
              this.toastD( this.$t('transfer.text49'))
              return
            }
            if(this.address.indexOf('PIC') > -1) { // 包括
              this.$fetch.post('/psysopen/checkPaiAddress',{
                address: this.address
              }).then(res => {
                if(res.success) {
                  let obj = JSON.parse(res.data)
                  console.log(obj)
                  this.userAddress =  obj.publicKey
                  let data ={
                    address: this.userAddress,
                    flag: 3,
                    type: 1
                  }
                  this.$router.push({
                    path: '/confirmTransfer',
                    query:{
                      dataInfo: JSON.stringify(data)
                    }
                  })
                } else {
                  this.toastD(res.msg)
                }
              }).catch(err => {
                console.log(err)
              })
            } else {
              this.$fetch.post('/user/checkaccount',{
                account: this.address
              }).then(res => {
                if(res.success) {
                  this.userAddress =  res.data.address
                  this.nick = res.data.nickname
                  this.username = res.data.username
                  let data ={
                    address: this.userAddress,
                    nick: this.nick,
                    username: this.username,
                    flag:3
                  }
                  this.$router.push({
                    path: '/confirmTransfer',
                    query:{
                      dataInfo: JSON.stringify(data)
                    }
                  })
                } else {
                  this.toastD(res.msg)
                }
              }).catch(err => {
                console.log(err)
              })
            }
          }
        },
        changeTab(index) {
          this.orderTab = index
          this.userName = ''
          this.email = ''
          this.address = ''
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
    .li-status{
      font-size .28rem
      color #999
      background #f0f0f0
      border-radius 8px
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
        background #d9f1ff
        color #000
      }
    }
  }
.user-box{
  margin-top .6rem
  height 1rem
  position relative
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
      &.focusLabel{
        color #000
      }
    }
    .email-input{
      flex 1
      color #bfbfbf
      display: block
      word-break:keep-all;
      white-space:nowrap;
      font-size: .3rem
      &.focusLabel{
        color #000
      }
    }
    .input{
      font-size: .3rem
      height: 100%
      display: block
      flex 1
      padding-left: .2rem
    }
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
