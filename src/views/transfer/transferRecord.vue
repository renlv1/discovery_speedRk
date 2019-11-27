<template>
    <div class="transfer">
      <app-header :titleName="titleName"></app-header>
      <div class="main-b">
        <v-loading v-show="loadingShow"></v-loading>
        <div class="data-box">
          <cube-scroll
            ref="scroll"
            :options="options"
            :data="dataArr"
            @pulling-up="onPullingDown" v-show="!emptyDatas">
            <ul class="ul-data">
              <li class="li-data"  v-for="(item,index) in dataArr" :key="index"  @click="gotoDetails(item)">
                <div class="left-box">
                  <div class="img-box">
                    <img :src="avatar + item.otherAddress" :onerror="defaultImg">
                  </div>
                  <div class="left-c">
                    <div class="left-user">{{paymentType(item.paymentType)}} {{item.otherNick}}</div>
                    <div class="left-date" v-if="item.createAt">{{$changeDate(item.createAt, '.', 5)}} </div>
                  </div>
                </div>
                <div class="right-box" :class="{active:item.paymentType === 1}">{{plusOrMin(item.receiveAddress)}}{{item.amount | fourNumber}} <span v-if="item.currency === 'PAI'">π</span><span v-else>{{item.currency}}</span></div>
              </li>
            </ul>
          </cube-scroll>
          <div class="empty-data" v-show="emptyDatas">
            <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
            <p class="text">{{$t('transfer.text5')}}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import appHeader from '../../components/mFixedTop'
    export default {
        data() {
          return{
            avatar: `${this.$api}` + `file/img?type=user&size=2&id=`, // 头像地址前缀
            defaultImg: 'this.src="' + require('../../images/user_avatar.png') + '"',
            dataArr: [],
            pageIndex: 1, // 页码
            pageSize: 20, // 页面数量,
            loadingShow: true,
            address: '',
            titleName: this.$t('transfer.text40'),
            emptyDatas: false,
          }
        },
      created() {
        // this.getBalance()
        this.getUserBalance()
        setTimeout(() => {
          this.getData()
        },200)
      },
      methods: {
        ...mapActions([
          'getUserBalance',
        ]),
        onPullingDown () {
          this.getData()
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 1000)
        },
        // getBalance() {
        //   this.$fetch.get('/user/balance').then(res => {
        //     if(res.success){
        //       this.address = res.data.account.address
        //     }
        //   }).catch(err => {
        //     console.log(err)
        //   })
        // },
        // + 或 -
        plusOrMin(type) {
          if (type === this.userData.address) {
            return '+'
          } else {
            return '-'
          }
        },
        // 转账类型
        paymentType(type) { // paymentType = 1  转账， paymentType = 2  收款
          if(type === 1) {
            return this.$t('transfer.text16')
          } else if (type === 2) {
            return this.$t('transfer.text17')
          }
        },
        // 跳转
        gotoDetails (item) {
          // let data = {
          //   paymentType: item.paymentType,
          //   id: item.id,
          //   amount: item.amount,
          //   createAt: item.createAt,
          //   updateAt: item.updateAt,
          //   currency: item.currency,
          //   receiveAddress: item.receiveAddress,
          //   orderId: item.id,
          //   otherNick:item.otherNick
          // }
          this.$router.push({
            path: '/billDetail',
            query: {
              id: item.id
              // dataInfo: JSON.stringify(data)
            }
          })
        },
        getData() {
          this.$fetch.post('/tx/transactionlist', {
            page: this.pageIndex,
            pageSize: this.pageSize,
            orderType: 1
          }).then(res => {
            if (res.success) {
              this.loadingShow = false
              let dataList = res.data
              if(dataList.length > 0) {
                if(this.pageIndex === 1) {
                  this.dataArr = dataList
                } else {
                  this.dataArr.push(...dataList)
                }
                this.pageIndex++
              } else {
                if(this.pageIndex === 1) {
                  this.dataArr = []
                  this.emptyDatas = true
                }
              }
            } else {
              this.loadingShow = false
              this.emptyDatas = true
              this.pageIndex = 1
              this.dataArr = []
            }
          }).catch(err => {
            console.log(err)
          })
        },
      },
      computed: {
        ...mapGetters([
          'userData',
          'account'
        ]),
        options () {
          return {
            pullUpLoad: {
              txt: {
                more: this.$t('transfer.text7'),
                noMore: this.$t('transfer.text8')
              }
            }
          }
        }
      },
      components: {
        vLoading: resolve => require(['@/components/loading.vue'], resolve),
        appHeader
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .data-box{
    width: 100%;
    overflow: hidden;
    position: fixed;
    padding 0 .4rem
    top: 1.2rem;
    left: 0;
    bottom: 0;
    .ul-data{
      .li-data{
        display flex
        justify-content space-between
        align-items center
        height 1.4rem
        color #000
        font-size .28rem
        border-bottom  1px solid #e6e6e6
        .left-box{
          display flex
          align-items center
          .img-box{
            width .8rem
            margin-right .2rem
            img{
              width 100%
            }
          }
          .left-c{
            .left-user{
              color #000
              font-size .28rem
              margin-bottom .14rem
            }
            .left-date{
              color #bfbfbf
              font-size .24rem
            }
          }
        }
        .right-box{
          color #b79961
          font-size .24rem
          &.active{
            color #000
            font-size .24rem
          }
        }
      }
    }
  }
</style>
