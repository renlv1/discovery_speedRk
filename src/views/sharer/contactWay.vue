<template>
  <div class="contactWay-wrap">
    <m-fixed-top :titleName="titleName"></m-fixed-top>
    <div class="main-c">
      <div class="li-box" v-for="(item,index) in contactWayList" :key="item.index" @click="deleteContact(index,item.type,item.info)">
        <div class="info-tit recharge-order">{{item.type}}</div>
        <div class="inoc"><span class="top-up-fees">{{item.info}}</span><img src="../../assets/img/common/goTo-path.svg" alt=""></div>
      </div>
    </div>
    <div class="hint" v-show="contactErrMsg">{{contactErrMsg}}</div>
    <div class="add-contact" @click="addContactFn">{{$t('sharer.contactWay.text5')}}</div>
    <!--新增联系方式弹窗-->
    <transition name="safeDialog">
    <div class="dialog" v-show="dialogShow">
      <div class="null-bg"></div>
      <div class="dialog-content">
        <div class="contact-list">
          <div class="contact-li" @click="addIndexContactFn(index)" v-for="(item,index) in contactLists" :key="index">{{item.text}}</div>
        </div>
        <div class="cancel" @click="cancelFn()">{{$t('withdrawDeposit.text10')}}</div>
      </div>
    </div>
  </transition>
    <!--删除index联系方式-->
    <transition name="safeDialog">
      <div class="dialog" v-show="deleteDialogShow">
        <div class="null-bg"></div>
        <div class="dialog-content">
          <div class="del" @click="delContactFn()">{{$t('sharer.contactWay.text6')}}</div>
          <div class="cancel" @click="cancelFn2()">{{$t('withdrawDeposit.text10')}}</div>
        </div>
      </div>
    </transition>
    <!--新增联系账号-->
    <add-ContactList v-show="contactShow" :rateTitle="contactTitle" @succeedContact="contactSucceed" @cancelDialog="closeDialog"></add-ContactList>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Dialog from '@/components/dialog'
  export default {
    data() {
      return {
        titleName: this.$t('sharer.contactWay.title'),
        dialogShow: false,
        deleteDialogShow: false,
        contactShow: false,
        contactTitle: '', //弹窗标题
        contactCode: '',//inputValue
        contactProcedure: '', // 默认提示
        contactErrMsg: '', // 错误提示
        contactLists: [
          {
            text: 'wechat'
          },
          {
            text: 'qq'
          },
          {
            text: 'facebook'
          },
          {
            text: 'skype'
          },
          {
            text: 'twitter'
          },
          {
            text: 'whatsapp'
          },
          {
            text: 'line'
          }
        ],
        contactWayList: [], //联系方式
        qq: '',
        wechat: '',
        facebook: '',
        skype: '',
        twitter: '',
        whatsapp: '',
        line: '',
        contactIndex: 0,
        qqArr: [],
        wechatArr: [],
        facebookArr: [],
        skypeArr: [],
        twitterArr: [],
        whatsappArr: [],
        lineArr: [],
        delIndex: 0, // 删除第n个的index
        delType: '', // 当前的联系方式
        delInfo: '',  // 当前的联系号码
        payCode: ''
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
      addContactList: () => import('@/components/addContactList')
    },
    computed: {
      ...mapGetters([
        'isboss',
        'address'
      ])
    },
    created() {
      this.sharerInformation() // 得到共享者
    },
    mounted() {},
    methods: {
      // 提示
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      // 得到共享者信息
      sharerInformation () {
        this.$fetch.post(`${this.$api}pigame/queryByAddress`, {address: this.address}).then((res) => {
          if (res.status === 'success') {
            let getSharer = res.data
            // 联系方式
            let contactWayData = JSON.parse(getSharer.contactWay)
            for (let key in contactWayData) { // 从后台获取联系方式存到数组里
              let contactArr = contactWayData[key].split(',')
              for (let i = 0; i < contactArr.length; i++) {
                let obj = {}
                obj.info = contactArr[i]
                obj.type = key
                this.contactWayList.push(obj)
              }
            }
            for (let i = 0; i < this.contactWayList.length; i++) { // 分别获取各种联系方式的数据存到数组并分割成字符串
              if (this.contactWayList[i].type === 'wechat') {
                this.wechatArr.push(this.contactWayList[i].info)
                if (this.wechatArr.length === 1) {
                  this.wechat = this.contactWayList[i].info
                } else {
                  this.wechat = this.wechatArr.join(',')
                }
              } else if (this.contactWayList[i].type === 'qq') {
                this.qqArr.push(this.contactWayList[i].info)
                if (this.qqArr.length === 1) {
                  this.qq = this.contactWayList[i].info
                } else {
                  this.qq = this.qqArr.join(',')
                }
              } else if (this.contactWayList[i].type === 'facebook') {
                this.facebookArr = []
                this.facebookArr.push(this.contactWayList[i].info)
                if (this.facebookArr.length === 1) {
                  this.facebook = this.contactWayList[i].info
                } else {
                  this.facebook = this.facebookArr.join(',')
                }
              } else if (this.contactWayList[i].type === 'skype') {
                this.skypeArr = []
                this.skypeArr.push(this.contactWayList[i].info)
                if (this.skypeArr.length === 1) {
                  this.skype = this.contactWayList[i].info
                } else {
                  this.skype = this.skypeArr.join(',')
                }
              } else if (this.contactWayList[i].type === 'twitter') {
                this.twitterArr = []
                this.twitterArr.push(this.contactWayList[i].info)
                if (this.twitterArr.length === 1) {
                  this.twitter = this.contactWayList[i].info
                } else {
                  this.twitter = this.twitterArr.join(',')
                }
              } else if (this.contactWayList[i].type === 'whatsapp') {
                this.whatsappArr = []
                this.whatsappArr.push(this.contactWayList[i].info)
                if (this.whatsappArr.length === 1) {
                  this.whatsapp = this.contactWayList[i].info
                } else {
                  this.whatsapp = this.whatsappArr.join(',')
                }
              } else if (this.contactWayList[i].type === 'line') {
                this.lineArr = []
                this.lineArr.push(this.contactWayList[i].info)
                if (this.lineArr.length === 1) {
                  this.line = this.contactWayList[i].info
                } else {
                  this.line = this.lineArr.join(',')
                }
              }
            }
          }
        })
      },
      addContactFn () {
        this.contactErrMsg = ''
        if (this.contactWayList.length < 5) {
          this.dialogShow = true
        } else {
          this.dialogShow = false
          this.contactErrMsg = this.$t('sharer.contactWay.text1')
        }
      },
      cancelFn () {
        this.dialogShow = false
      },
      cancelFn2 () {
        this.deleteDialogShow = false
      },
      deleteContact (index,type,info) {
        this.deleteDialogShow = true
        this.delIndex = index
        this.delType = type
        this.delInfo = info
        this.contactErrMsg = ''
      },
      // 新增第n个联系方式
      addIndexContactFn (index) {
        setTimeout(() => {
          this.contactShow = true
        },260)
        this.contactIndex = index
        this.contactTitle =  this.contactLists[index].text
        this.dialogShow = false
      },
      // 确认添加联系账号
      contactSucceed (payCode,errInputMsg) {
        let index = this.contactIndex
        if (payCode){
          this.contactWayList = []
          if (index === 0) {
            this.wechatArr.push(payCode) // 把添加的方式加到每个联系方式的数组
            if (this.wechatArr.length === 1) {
              this.wechat = payCode
            } else {
              this.wechat = this.wechatArr.join(',') // 把每个联系方式的数组转换成字符串
            }
          } else if (index === 1) {
            this.qqArr.push(payCode)
            if (this.qqArr.length === 1) {
              this.qq = payCode
            } else {
              this.qq = this.qqArr.join(',')
            }
          } else if (index === 2) {
            this.facebookArr.push(payCode)
            if (this.facebookArr.length === 1) {
              this.facebook = payCode
            } else {
              this.facebook = this.facebookArr.join(',')
            }
          } else if (index === 3) {
            this.skypeArr.push(payCode)
            if (this.skypeArr.length === 1) {
              this.skype = payCode
            } else {
              this.skype = this.skypeArr.join(',')
            }
          } else if (index === 4) {
            this.twitterArr.push(payCode)
            if (this.twitterArr.length === 1) {
              this.twitter = payCode
            } else {
              this.twitter = this.twitterArr.join(',')
            }
          } else if (index === 5) {
            this.whatsappArr.push(payCode)
            if (this.whatsappArr.length === 1) {
              this.whatsapp = payCode
            } else {
              this.whatsapp = this.whatsappArr.join(',')
            }
          } else if (index === 6) {
            this.lineArr.push(payCode)
            if (this.lineArr.length === 1) {
              this.line = payCode
            } else {
              this.line = this.lineArr.join(',')
            }
          }
          let formData = new FormData()
          formData.append('qq', this.qq)
          formData.append('wechat', this.wechat)
          formData.append('facebook', this.facebook)
          formData.append('skype', this.skype)
          formData.append('twitter', this.twitter)
          formData.append('whatsapp', this.whatsapp)
          formData.append('line', this.line)
          this.$http.post(`${this.$api2}pigame/modifyBossContactWay`,formData).then((res) => {
            if (res.data.status === 'success'){
              payCode = ''
              errInputMsg = ''
              this.contactWayList = []
              this.contactIndex = 0
              let addContactWay = JSON.parse(res.data.data.contactWay)
              for (let key in addContactWay) {
                let addContactWayArr = addContactWay[key].split(',')
                for (let i = 0; i < addContactWayArr.length; i++) {
                  let obj = {}
                  obj.info = addContactWayArr[i]
                  obj.type = key
                  this.contactWayList.push(obj)
                }
              }
              this.contactShow = false
              this.dialogShow = false
              this.toastD(this.$t('sharer.contactWay.text2'))
              payCode = ''
            } else {
              errInputMsg = res.data.msg
              payCode = ''
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          payCode = ''
        }
      },
      // 取消新增，关闭弹窗
      closeDialog (payCode,errInputMsg) {
        this.contactShow = false
        errInputMsg = ''
        payCode = ''
      },
      // 删除第n个联系方式
      delContactFn () {
         let delIndex = this.delIndex
         let delType = this.delType
         this.deleteDialogShow = false
        if (this.contactWayList.length <= 1) {
           // 只能保留一个联系方式
          this.contactErrMsg = this.$t('sharer.contactWay.text3')
        } else {
          this.contactWayList.splice(delIndex, 1)
          if (delType === 'qq') {
            this.qqArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'qq') {
                this.qqArr.push(item.info)
              }
            })
            this.qq = this.qqArr.join(',')
          } else if (delType === 'wechat') {
            this.wechatArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'wechat') {
                this.wechatArr.push(item.info)
              }
            })
            this.wechat = this.wechatArr.join(',')
          } else if (delType === 'facebook') {
            this.facebookArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'facebook') {
                this.facebookArr.push(item.info)
              }
            })
            this.facebook = this.facebookArr.join(',')
          } else if (delType === 'skype') {
            this.skypeArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'skype') {
                this.skypeArr.push(item.info)
              }
            })
            this.skype = this.skypeArr.join(',')
          } else if (delType === 'twitter') {
            this.twitterArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'twitter') {
                this.twitterArr.push(item.info)
              }
            })
            this.twitter = this.twitterArr.join(',')
          } else if (delType === 'whatsapp') {
            this.whatsappArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'whatsapp') {
                this.whatsappArr.push(item.info)
              }
            })
            this.whatsapp = this.whatsappArr.join(',')
          } else if (delType === 'line') {
            this.lineArr = [] // 清空每个联系方式的数组
            this.contactWayList.forEach((item) => {
              if (item.type === 'line') {
                this.lineArr.push(item.info)
              }
            })
            this.line = this.lineArr.join(',')
          }
          this.contactWayList = []
          let formData = new FormData()
          formData.append('qq', this.qq)
          formData.append('wechat', this.wechat)
          formData.append('facebook', this.facebook)
          formData.append('skype', this.skype)
          formData.append('twitter', this.twitter)
          formData.append('whatsapp', this.whatsapp)
          formData.append('line', this.line)
          this.$http.post(`${this.$api2}pigame/modifyBossContactWay`,formData).then((res) => {
            if (res.data.status === 'success'){
              this.contactErrMsg = ''
              let addContactWay = JSON.parse(res.data.data.contactWay)
              for (let key in addContactWay) {
                let addContactWayArr = addContactWay[key].split(',')
                for (let i = 0; i < addContactWayArr.length; i++) {
                  let obj = {}
                  obj.info = addContactWayArr[i]
                  obj.type = key
                  this.contactWayList.push(obj)
                }
              }
              this.toastD(this.$t('sharer.contactWay.text4'))
            } else {
              errInputMsg = res.data.msg
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  @activeColor: #a2f2ed;
  @butBgColor: #f0f0f0;
  @titFont: .3rem;
  @butFont: .28rem;
  @textFont: .24rem;
  @hintColor: #999;
  @textColor: #000;
  @stateColor: #b79961;
  .contactWay-wrap{
    width: @width;
    height: calc(100vh - 74px);
    background-color: #fff;
    padding: 0 .4rem;
    margin-top: 74px;
    .main-c{
      width: @width;
      .li-box{
        width: @width;
        height: 1rem;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: .2rem;
        .info-tit{
          font-size: @titFont;
          color: @textColor;
        }
        .inoc{
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: .28rem;
          img{
            display: block;
            width: .3rem;
            height: .3rem;
          }
          .withdrawal-rate{
            color: @stateColor;
          }
          .top-up-fees{
            color: #bfbfbf;
          }
        }
      }
    }
    .hint{
      color: #e93a3a;
      font-size: 12px;
      padding-top: 10px;
    }
    .add-contact{
      width: @width;
      height: 1.2rem;
      line-height: 1.2rem;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      border-top: 1px solid @stateColor;
      font-size: .32rem;
      color: @stateColor;
    }
    .dialog{
      position: fixed;
      width: 100%;
      height: 100vh;
      background-color: rgba(255,255,255,.7);
      left: 0;
      top: 0;
      z-index: 200;
      padding: 0 0.4rem;
      display: flex;
      flex-flow: column;
      align-items: center;
      &.safeDialog-enter, &.safeDialog-leave-to{
        opacity: 0;
        .dialog-content{
          transform: translate(0, 50%);
        }
      }
      &.safeDialog-enter-active{
        transition: .3s cubic-bezier(0,.36,.98,.4);
        .dialog-content{
          transition: .3s cubic-bezier(0,.36,.98,.4);
        }
      }
      &.safeDialog-leave-active{
        transition: .2s cubic-bezier(0,.36,.98,.4);
        .dialog-content{
          transition: .2s cubic-bezier(0,.36,.98,.4);
        }
      }
      .null-bg{
        width: @width;
        height: 60%;
      }
      .dialog-content{
        width: 80%;
        height: auto;
        background-color: #fff;
        position: fixed;
        bottom: .7rem;
        margin: auto;
        .contact-list{
          width: @width;
          background-color: #fff;
          border: 1px solid #000;
          border-radius: .08rem;
          margin-bottom: .2rem;
          opacity: 1;
          .contact-li{
            width: 90%;
            margin: auto;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            border-bottom: 1px dashed;
            font-size: .3rem;
            color: #000;
            &:last-child{
              border-bottom: none;
            }
          }
        }
        .cancel{
          width: @width;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          border: 1px solid #000;
          border-radius: .08rem;
          font-size: .3rem;
          color: #000;
          background-color: #fff;
        }
        .del{
          width: @width;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          border: 1px solid #000;
          border-radius: .08rem;
          font-size: .3rem;
          color: #ff717d;
          background-color: #fff;
          margin-bottom: .3rem;
        }
      }
    }
    /deep/ .dialog-safe{
       .form-item{
        &:after{
          display: none !important;
        }
      }
    }
  }
</style>
