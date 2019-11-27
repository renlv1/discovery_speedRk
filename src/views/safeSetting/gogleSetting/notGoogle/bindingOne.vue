<template>
  <div class="secret-wrapper">
    <!--    绑定谷歌第二步-->
    <div class="secret-container">
      <m-fixed-top :titleName="titleName"></m-fixed-top>
      <div class="content">
        <div class="step-left">
          <span class="t-m">1/2 {{$t('safe.text3')}}</span>
        </div>
        <div class="c-wrap">
          <div id="qrcode3"></div>
          <p class="string">{{$route.query.secret}}</p>
          <p class="tips">{{$t('safe.text4')}}</p>
          <div class="btn-a btn-one" id="copy3" @click="copyString" :data-clipboard-text="$route.query.secret">{{$t('safe.text5')}}</div>
          <div class="btn-a btn-two" @click="gotoTwo">{{$t('safe.text6')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import QRCode from 'qrcodejs2'
  import Clipboard from 'clipboard'

  export default {
    data () {
      return {
        titleName: this.$t('safe.text7'),
        isSetting: false
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    mounted () {
      this.getQrcode()
    },
    methods: {
      // toast弹窗
      creatToast (msg) {
        let toast1 = this.$createToast({
          txt: msg,
          time: 1500,
          type: 'txt'
        })
        toast1.show()
      },
      copyString () {
        var clipboard1 = new Clipboard('#copy3');
        clipboard1.on('success', (e) => {
          this.creatToast(this.$t('safe.text8'))
          e.clearSelection();
        })
        clipboard1.on('error', function(e) {
          this.creatToast(this.$t('safe.text9'))
        })
        var ua = window.navigator.userAgent.toLowerCase();
        //微信
        if(ua.match(/MicroMessenger/i) === 'micromessenger'){
          //微信浏览器绑定事件
          /*$(".app").bind('click', function (event) {
           window.location.href = '';
           })*/
        }else{//非微信浏览器
          if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {   //iPhone|iPod|iPad浏览器
            var loadDateTime = new Date();
            window.setTimeout(function () {
              var timeOutDateTime = new Date();
              if (timeOutDateTime - loadDateTime < 3000) {
               // window.location = "https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8";//ios下载页面
              } else {
                window.close();
              }
            }, 25);
            window.location = "otpauth://TYPE/LABEL?PARAMETERS";    //调用ios启动页地址
          }else if (navigator.userAgent.match(/android/i)) {  //安卓浏览器
            var state = null;
            try {
              window.location = 'otpauth://TYPE/LABEL?PARAMETERS'; //调用andriod启动页地址
              setTimeout(function(){
               // window.location= "https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8"; //android下载页面
              },500);
            } catch(e) {}
          }
        }
      },
      gotoTwo () {
        this.$router.push('/bindingTwo')
      },
      getQrcode() {
        let qrUrl = this.$route.query.qrUrl
        let qrcode3 = new QRCode('qrcode3', {
          width: 136,
          height: 136,
          text: qrUrl, // 二维码地址
          colorDark : "#000",
          colorLight : "#fff",
        })
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  img
    display: block
    width: 100%
  .secret-wrapper
    // margin-top: 1.76rem
    // padding: 0 .4rem
    .secret-container
      margin-top: 1.76rem
      padding-top: .2rem
      .content
        .step-left
          .t-m
            font-size: .28rem
            font-weight: bolder
            color #518ef8
            display: inline-block
            background-color: #eff4f9
            height: .8rem
            line-height: .8rem
            padding: 0 .4rem
            border-radius 0 .4rem .4rem 0
        .c-wrap
          display: flex
          align-items center
          justify-content center
          flex-direction column
          padding: 0 .4rem
          color #000
          #qrcode3
            margin: .8rem 0 .6rem
          .string
            font-size: .28rem
            font-weight: bold
          .tips
            font-size: .28rem
            margin: .3rem 0 .8rem
          .btn-a
            width: 100%
            height: 1rem
            display: flex
            align-items center
            justify-content center
            font-size: .32rem
            border-radius 4px
            margin-bottom: .4rem
          .btn-one
            background-color: #518ef8
            color #fff
          .btn-two
            background-color: #f5f5f5
            color #999
</style>
