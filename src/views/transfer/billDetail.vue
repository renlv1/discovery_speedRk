<template>
    <div class="transfer">
      <app-header :titleName="titleName"></app-header>
      <div class="main-b">
        <div class="banner" :class="{active: data.paymentType === 2,active2: data.paymentType === 1}">
          <div class="right-box">{{plusOrMin(data.receiveAddress)}}{{data.amount | fourNumber}} <span v-if="data.currency === 'PAI'">π</span><span v-else>{{data.currency}}</span></div>
          <div class="success">{{$t('transfer.text9')}}</div>
        </div>
        <ul class="ul-data">
          <li class="li-data">
            <div class="left">{{$t('transfer.text10')}}</div>
            <div class="right">{{paymentType(data.paymentType)}} {{data.otherNick}}</div>
          </li>
          <li class="li-data">
            <div class="left">{{$t('transfer.text11')}}</div>
            <div class="right">{{data.id}}</div>
          </li>
          <li class="li-data">
            <div class="left">{{$t('transfer.text12')}}</div>
            <div class="right">{{data.receiveAddress}}</div>
          </li>
          <li class="li-data">
            <div class="left">{{$t('transfer.text13')}}</div>
            <div class="right" v-if="data.createAt">{{$changeDate(data.createAt, '.', 5)}}</div>
          </li>
          <li class="li-data">
            <div class="left">{{$t('transfer.text14')}}</div>
            <div class="right" v-if="data.updateAt">{{$changeDate(data.updateAt, '.', 5)}}</div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>  import appHeader from '../../components/mFixedTop'
          import {mapGetters} from 'vuex'
    export default {
       data() {
         return{
           titleName: this.$t('transfer.text15'),
           // dataInfo: JSON.parse(this.$route.query.dataInfo),
           data: ''
         }
       },
      created() {
         this.getDetail()
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
         getDetail() {
           this.$fetch.post('/tx/queryTransactionDetail',{
             transactionId: this.$route.query.id
           }).then(res => {
             if(res.success) {
               this.data = res.data
             } else {
               this.toastD(res.msg)
             }
           }).catch(err => {
             console.log(err)
           })
         },
        paymentType(type) {  // paymentType = 1  转账， paymentType = 2  收款
          if(type === 1) {
            return this.$t('transfer.text16')
          } else if (type === 2) {
            return this.$t('transfer.text17')
          }
        },
        plusOrMin(type) {
          if (type === this.userData.address) {
            return '+'
          } else {
            return '-'
          }
        },
      },
      computed: {
        ...mapGetters([
          'userData',
          'account'
        ])
      },
      components: {
        // vLoading: resolve => require(['@/components/loading.vue'], resolve),
        appHeader
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.banner{
  width 100%
  height 2rem
  display flex
  flex-direction column
  justify-content center
  text-align center
  border-radius 8px
  &.active{
    background #e6faf8
  }
  &.active2{
    background #faf0f1
  }
  .right-box{
    color #000
    font-size .34rem
    span{
      color #b79961
      font-size .34rem
    }
  }
  .success{
    margin-top .15rem
    color #000
    font-size .34rem
  }
}
.ul-data {
  .li-data {
    display flex
    justify-content space-between
    align-items center
    height 1.4rem
    color #000
    font-size .28rem
    border-bottom 1px solid #e6e6e6
    .left{
      color #999
      font-size .28rem
    }
    .right{
      color #000
      font-size .28rem
    }
  }
}
</style>
