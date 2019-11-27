<template>
  <div class="wuliuDetail">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="info-box">
      <div class="company-box">
        <div class="express">{{$t('my.text100')}}： {{expressName}}</div>
      </div>
      <div class="track-box">
        <div class="track-left">{{$t('my.text101')}}： {{expressNumber}}</div>
        <div class="copy-btn" v-clipboard:copy="expressNumber" v-clipboard:success="success" v-clipboard:error="error">{{$t('account.text14')}}</div>
      </div>
    </div>
    <div class="line-two"></div>
    <div class="process-box">
      <div class="process-t">
        <div class="box">
          <img src="./img/icon-line.png" style="width: .06rem;height: .27rem"  >
          <div class="pro-right">{{$t('my.text102')}}</div>
        </div>
        <div>{{orderStatus(state)}}</div>
      </div>
      <ul class="process-m" v-if="expressInfoList">
        <li class="li-item" :key="index" v-for="(item,index) in expressInfoList" >
          <div class="process-left">
            <div class="process-line">
              <div class="circle first-li" ></div>
              <div class="line"></div>
            </div>
          </div>
          <div class="process-right">
            <div class="process-info">
              <div class="wuliu-info first-text">{{item.context}}</div>
              <div class="wuliu-date first-text">{{item.time}}</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-message" v-else>{{message}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
export default {
  data() {
    return{
      titleName: this.$t('my.text103'),
      expressName: '', //物流公司
      expressNumber: '', // 物流单号
      orderData: [],
      state: '',//快递单当前签收状态 0在途中、1 已揽收、2疑难、3已签收、4退签、5同城派送中、6退回、7转单
      message: '',
      expressInfoList: [],
    }
  },
  components: {mFixedTop},
  created() {
    this.getDetail()
  },
  methods:{
    // 快递单当前签收状态 0在途中、1已揽收、2疑难、3已签收、4退签、5同城派送中、6退回、7转单
    orderStatus(i) {
      if (i === 0) return this.$t('payReturn.text6')
      if (i === 1) return this.$t('payReturn.text7')
      if (i === 2) return this.$t('payReturn.text8')
      if (i === 3) return this.$t('payReturn.text9')
      if (i === 4) return this.$t('payReturn.text10')
      if (i === 5) return this.$t('payReturn.text11')
      if (i === 6) return this.$t('payReturn.text12')
      if (i === 7) return this.$t('payReturn.text13')
    },
    getDetail() {
      let orderId = this.$route.query.orderId
      this.$http.post(`${this.$api}shopMine/queryOrderExpress?orderId=${orderId}`).then((res) => {
        if(res.status === 200){
          let data = res.data.data
          this.expressName = data.expressName
          this.expressNumber = data.expressNumber
          this.expressInfoList = data.expressInfoList
          this.state = data.state
          this.message = data.message
          console.log(res.data.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 复制
    success () {
      this.$createToast({
        type: 'plain',
        txt: this.$t('account.text15')
      }).show()
    },
    error () {
      this.$createToast({
        type: 'plain',
        txt: this.$t('account.text16')
      }).show()
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios
    .paiPay
      padding-top: 65px
  .iosx
    .paiPay
      padding-top: 90px
  .wuliuDetail
    background-color #fff
  .info-box{
    padding 0 .3rem
    .express{
      padding .4rem 0
      font-size .28rem
      color #060f26
      border-bottom 1px solid #edeef0
    }
    .track-box{
      padding .4rem 0
      display flex
      justify-content space-between
      .track-left{
        font-size .28rem
        color #060f26
      }
      .copy-btn{
        font-size .28rem
        color #ffb64b
      }
    }
  }
  .process-box{
    /*padding .4rem .3rem 0*/
    .process-t{
      font-size .28rem
      padding .4rem .3rem 0
      display flex
      align-items center
      flex-direction row
      justify-content space-between
      margin-bottom .5rem
      .box {
        display flex
        align-items center
        .pro-right{
          color #060f26
          margin-left .2rem
        }
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
            border-left none
          }
        }
        &:first-child{
          padding  0 .3rem
          position relative
          .process-right{
            .first-text{
              color #ffb64b
            }
          }
          .process-line{
            display flex
            justify-content left
            margin-left -0.02rem
            .first-li {
              background url("./img/succeed.png") no-repeat center
              background-size: 100% 100%;
              width .3rem
              height .3rem
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
        border-left  1px solid #e8e8e8
        .process-line{
          display flex
          flex-direction column
          justify-content center
          align-items center
          .circle{
            border-radius: 100%;
            width .22rem
            height .22rem
            background-color #e8e8e8
            position: absolute
            left .4rem
            margin-top .1rem
            &.finish-status{
              background url("./img/succeed.png") no-repeat center
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
        padding: 0 0 .3rem .5rem
        .process-info{
          font-size .24rem
          /*height: .3rem;*/
          line-height: .3rem;
          .wuliu-info{
            font-size .24rem
            color #999
            margin-bottom .14rem
            &.finish-info{
              color #ffb64b
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
  .status-list{
    .status-li{
      border-left 1px solid #e8e8e8
      .status-content-before{

      }
    }
  }
  .no-message{
    padding .3rem
    color #ffb64b
    font-size .24rem
  }
</style>
