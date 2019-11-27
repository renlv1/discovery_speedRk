<template>
  <div class="reason-w">
    <mFixedTop :titleName="titleName" :isGoNumber="true" :isGoBack="isGoBack" @goPath="goPath()"></mFixedTop>
    <div class="content-t">
      <div class="user-wrap">
        <img :src="bountyMerchant.arLogoImg" alt="" class="avatar" @error="errorImg" ref="avatarImg">
        <span class="name">{{bountyMerchant.merchantName}}</span>
      </div>
      <div class="content">
        <div class="status-list">
          <div class="left-w first-status">
            <div class="status">
<!--              <img src="./image/ok_status.png" alt="" v-if="meStatus === 1">-->
<!--              <img src="./image/error_status.png" alt="" v-if="meStatus > 2">-->
            </div>
            <!--<div class="line line-one"></div>-->
          </div>
          <div class="right-w">
<!--             状态 1 待审核 2 审核通过 3审核失败 4冻结 5删除-->
<!--            待审核-->
            <div class="process-box" v-if="meStatus === 1">
              <div class="process-t">
<!--                <img src="../img/icon-line.png" style="width: .06rem;height: .27rem"  >-->
<!--                <div class="pro-right">{{$t('my.text102')}}</div>-->
              </div>
              <ul class="process-m" >
                <li class="li-item"  :key="index" v-for="(item,index) in expressInfoList">
                  <div class="process-left">
                    <div class="process-line">
                      <div class="circle first-li" ></div>
                      <div class="line"></div>
                    </div>
                  </div>
                  <div class="process-right">
                    <div class="process-info">
                      <div class="wuliu-info first-text">{{item.text}}</div>
                      <div class="wuliu-date first-text">{{item.content}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
<!--            审核失败-->
            <div class="process-box" v-if="meStatus === 3 || meStatus === 4 || meStatus === 5">
              <div class="process-t">
                <!--                <img src="../img/icon-line.png" style="width: .06rem;height: .27rem"  >-->
                <!--                <div class="pro-right">{{$t('my.text102')}}</div>-->
              </div>
              <ul class="process-failed" >
                <li class="li-item failed-li"  :key="index" v-for="(item,index) in successList">
                  <div class="process-left">
                    <div class="process-line">
                      <div class="circle first-li" ></div>
                      <div class="line"></div>
                    </div>
                  </div>
                  <div class="process-right">
                    <div class="process-info">
                      <div class="wuliu-info first-text">{{item.text}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
<!--            <div class="info-c" v-if="meStatus === 3">-->
<!--              <p class="text1">{{$t('notMerchant.text15')}}</p>-->
<!--              <p class="text2"></p>-->
<!--              <p class="time"></p>-->
<!--            </div>-->
<!--            <div class="info-c" v-if="meStatus === 4">-->
<!--              <p class="text1">{{$t('notMerchant.text16')}}</p>-->
<!--              <p class="text2"></p>-->
<!--              <p class="time"></p>-->
<!--            </div>-->
<!--            <div class="info-c" v-if="meStatus === 5">-->
<!--              <p class="text1">{{$t('notMerchant.text17')}}</p>-->
<!--              <p class="text2"></p>-->
<!--              <p class="time"></p>-->
<!--            </div>-->
          </div>
        </div>
        <!--<div class="status-list">-->
        <!--<div class="left-w">-->
        <!--<div class="line line-two"></div>-->
        <!--<div class="status">-->
        <!--<img src="./image/error_status.png" alt="">-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="right-w">-->
        <!--<div class="info-c">-->
        <!--<p class="text1 err-text">审核失败</p>-->
        <!--<p class="text2 err-text">原因：您已提交资料审核。平台将在约7个工作日完成审核，请耐心等待审核结果。</p>-->
        <!--<p class="time">2019.1.1 1:1</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div class="btn-w">
        <button class="submit" @click="submit" v-if="meStatus === 3">{{$t('notMerchant.text18')}}</button>
      </div>
    </div>
    <div class="v-loading" v-show="loadShow">
      <cube-loading></cube-loading>
    </div>
    <m-footer class="foot-box"></m-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import mFixedTop from '@/components/mFixedTop'
  export default {
    data() {
      return {
        loadShow: true,
        expressInfoList: [
          {text: this.$t('notOpen.text17')},
          {text: this.$t('notOpen.text18')},
          {text: this.$t('notOpen.text19'),content:this.$t('notOpen.text21')},
        ],
        successList: [
          {text: this.$t('notOpen.text17')},
          {text: this.$t('notOpen.text18')},
          {text: this.$t('notOpen.text20')},
        ],
        titleName: '',
        isGoBack: true,
        bountyMerchant: '',
        meStatus: '' // "status": 2, // 状态 1 待审核 2 审核通过 3审核失败 4冻结 5删除
      }
    },
    components: {
      mFixedTop,
      mFooter: () => import('@/components/footer')
    },
    /*eslint-disable*/
    created () {
      if (/iphone/gi.test(navigator.userAgent)) {
        if (screen.height >= 812) {
          document.documentElement.classList.add('iosx')
        } else {
          document.documentElement.classList.add('ios-app')
        }
      }
      if (this.$route.query.merchatData) {
        this.loadShow = false
        let mS = JSON.parse(this.$route.query.merchatData)
        this.meStatus = mS.merchantInfo.status
        this.bountyMerchant = mS.merchantInfo
        if(this.meStatus === 1) {
          this.titleName = this.$t('notOpen.text22')
        } else {
          this.titleName = this.$t('notOpen.text23')
        }
      } else {
        this.$fetch.post(`${this.$api}shopMine/getMerchantInfo`).then(res => {
          if (res.status === 'success') {
            this.loadShow = false
            this.bountyMerchant = res.data.merchantInfo
            this.meStatus = res.data.merchantInfo.status
            if(this.meStatus === 1) {
              this.titleName = this.$t('notOpen.text22')
            } else {
              this.titleName = this.$t('notOpen.text23')
            }
          } else {
            this.loadShow = false
          }
        })
      }
      // this.$fetch.post(`${this.$api}shopMine/getMerchantInfo`).then(res => {
      //   if (res.status === 'success') {
      //     this.loadShow = false
      //     this.bountyMerchant = res.data.merchantInfo
      //     this.meStatus = res.data.merchantInfo.status
      //     if(this.meStatus === 1) {
      //       this.titleName = '审核中'
      //     } else {
      //       this.titleName = '审核结果'
      //     }
      //   } else {
      //     this.loadShow = false
      //   }
      // })
    },
    methods: {
      goPath() {
        this.$router.push('/menu')
      },
      errorImg () {
        this.$refs.avatarImg.src = require('../../../assets/img/common/defaultAvatar.png')
      },
      submit () {
        this.$router.push({
          path: '/stepOne',
          query: {
            bountyMerchant: JSON.stringify(this.bountyMerchant)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  color = #060f26
  .ios
    .content-t
      padding-top: 65px !important
  .iosx
    .content-t
      padding-top: 90px !important
    .foot-shop
      padding-top 0!important
  .reason-w
    .content-t
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      overflow: auto
      background-color: #fff
      padding-top: 65px
    .user-wrap
      display: flex
      flex-direction column
      justify-content center
      align-items center
      padding: .36rem .2rem
      /*border-bottom: 1px solid #e8e8e8*/
      .avatar
        width: 1.28rem
        display: block
        margin-right: .2rem
        margin-bottom .3rem
      .name
        font-size: .28rem
        color color
    .content
      /*border-top: .2rem solid #f5f6fa*/
      /*padding: 0 .2rem*/
      .status-list
        display: flex
        .left-w
          display flex
          align-items center
          flex-direction column
          .status
            width: .3rem
            img
              width: 100%
              display: block
          .line
            width: 2px
            background-color: #3495f1
          .line-one
            flex 1
          .line-two
            height: .9rem
        .first-status
          margin-top: .54rem
        .right-w
          margin-left: .3rem
          .info-c
            border-bottom: 1px solid #e8e8e8
            padding: .34rem 0
          .text1
            color color
            font-size: .28rem
            &.err-text
              color #ff6973
          .text2
            line-height: 1.5
            font-size: .28rem
            color color
            margin: .22rem 0 .12rem
            &.err-text
              color #ff6973
          .time
            font-size: .28rem
            color #b3b3b3
    .btn-w
      padding: 0 .2rem
      margin-top: 1.6rem
      .submit
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
        color #000
        background-color: #FFEED4
        border-radius 4px
  .process-box{
    /*padding .4rem .3rem 0*/
    .process-t{
      padding .4rem .3rem 0
      display flex
      align-items center
      margin-bottom .5rem
      .pro-right{
        font-size .28rem
        color #060f26
        margin-left .2rem
      }
    }
    .process-m{
      .li-item{
        display flex
        position relative
        padding  0 .3rem
        &:last-child{
          .line{
            display none
          }
          .process-left{
            /*border-left none*/
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              border-radius 50%
              border 1px dashed #BFBFBF
              /*background-size: 100% 100%;*/
              width 30px
              height 30px
            }
            .circle{
              margin-top 0
              left .35rem
            }
          }
        }
        &:first-child{
          padding  0 .3rem
          position relative
          .process-right{
            .first-text{
              color #060f26
            }
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              background url("./img/finished.png") no-repeat center
              /*background-size: 100% 100%;*/
              width 30px
              height 30px
            }
            .circle{
              margin-top 0
              left .35rem
            }
          }
        }
        &:nth-child(2){
          padding  0 .3rem
          position relative
          .process-right{
            .first-text{
              color #060f26
            }
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              background url("./img/shening.png") no-repeat center
              /*background-size: 100% 100%;*/
              width 30px
              height 30px
            }
            .circle{
              margin-top 0
              left .35rem
            }
          }
        }
      }
      .process-left{
        //margin-right .2rem
        margin-left: .2rem
        /*border-left  1px solid #e8e8e8*/
        .process-line{
          position relative
          display flex
          flex-direction column
          justify-content center
          align-items center
          .line{
            border-left 1px solid #BFBFBF
            height 1rem
            width 1px
          }
          .circle{
            border-radius: 100%;
            width .4rem
            height .4rem
            /*background-color #e8e8e8*/
            /*position: absolute*/
            /*left .2rem*/
            margin-top .1rem
            &.finish-status{
              /*background url("../img/succeed.png") no-repeat center*/
              background-size: 100% 100%;
              width .3rem
              height .3rem
            }
          }
        }
      }
      .process-right{
        display flex
        flex-direction column
        align-items center
        justify-content space-between
        padding: 0 0 0 .2rem
        margin-top .2rem
        .process-info{
          font-size .24rem
          /*height: .3rem;*/
          line-height: .3rem;
          .wuliu-info{
            font-size .28rem
            color #999
            margin-bottom .14rem
            &.finish-info{
              color #060f26
            }
          }
          .wuliu-date{
            font-size .22rem
            color #999
          }
        }
      }
    }
    .process-failed{
      .li-item{
        display flex
        position relative
        padding  0 .3rem
        &:last-child{
          .line{
            display none
          }
          .process-left{
            /*border-left none*/
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              background url("./img/failed.png") no-repeat center
              /*background-size: 100% 100%;*/
              width 30px
              height 30px
            }
            .circle{
              margin-top 0
              left .35rem
            }
          }
        }
        &:first-child{
          padding  0 .3rem
          position relative
          .process-right{
            .first-text{
              color #060f26
            }
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              background url("./img/finished.png") no-repeat center
              /*background-size: 100% 100%;*/
              width 30px
              height 30px
            }
            .circle{
              margin-top 0
              left .35rem
            }
          }
        }
        &:nth-child(2){
          padding  0 .3rem
          position relative
          .process-right{
            .first-text{
              color #060f26
            }
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              background url("./img/finished.png") no-repeat center
              /*background-size: 100% 100%;*/
              width 30px
              height 30px
            }
            .circle{
              margin-top 0
              left .35rem
            }
          }
        }
      }
      .process-left{
        //margin-right .2rem
        margin-left: .2rem
        /*border-left  1px solid #e8e8e8*/
        .process-line{
          position relative
          display flex
          flex-direction column
          justify-content center
          align-items center
          .line{
            border-left 1px solid #BFBFBF
            height 1rem
            width 1px
          }
          .circle{
            border-radius: 100%;
            width .4rem
            height .4rem
            /*background-color #e8e8e8*/
            /*position: absolute*/
            /*left .2rem*/
            margin-top .1rem
            &.finish-status{
              /*background url("../img/succeed.png") no-repeat center*/
              background-size: 100% 100%;
              width .3rem
              height .3rem
            }
          }
        }
      }
      .process-right{
        display flex
        flex-direction column
        align-items center
        justify-content space-between
        padding: 0 0 0 .2rem
        margin-top .2rem
        .process-info{
          font-size .24rem
          /*height: .3rem;*/
          line-height: .3rem;
          .wuliu-info{
            font-size .28rem
            color #999
            margin-bottom .14rem
            &.finish-info{
              color #060f26
            }
          }
          .wuliu-date{
            font-size .22rem
            color #999
          }
        }
      }
    }
  }
>>>.foot-shop{
  /*padding-top 0.06rem!important*/
}
.iosx
  .foot-shop
    /*padding-top 0!important*/
</style>
