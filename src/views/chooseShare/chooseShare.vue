<template>
  <div class="choose-share">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="empty-data" v-show="shareList.length === 0 && shareList">
      <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
      <p class="text">{{$t('common.noData')}}</p>
    </div>
    <cube-scroll
      ref="scroll"
      :data="shareList"
      :options="options"
      @pulling-up="onPullingUp">
      <div class="v-loading" v-show="isShow">
        <cube-loading></cube-loading>
      </div>
      <div class="v-content-wrapper">
        <ul>
          <li class="item" @click="ifTopupTwFn(item)" v-for="item in shareList" :key="item.index">
            <div class="li-top">
              <div class="top-left">
                <img src="./img/avatar.png" alt="avatar" />
                <div class="left-box">
                  <p class="box-title">{{item.username}}</p>
                  <p>
                    <span class="box-title-subtitle">{{$t('topUp.chooseShare.listContent.text1')}}</span>
                    <star :score=Number(item.creditLevel)></star>
                  </p>
                </div>
              </div>
              <div class="top-right">
                <div class="right-box">
                  <p>{{$t('topUp.chooseShare.listContent.text2')}} <span>{{item.payBand}}</span></p>
                  <p>{{$t('topUp.chooseShare.listContent.text3')}} <span>{{item.feeRateStr}}</span></p>
                </div>
              </div>
            </div>
            <div class="li-bottom">{{$t('topUp.chooseShare.listContent.text4')}}<span>{{item.payAmount }}{{item.payCurrency}}</span>
            </div>
          </li>
        </ul>
      </div>
    </cube-scroll>
    <confirm :confirmModalOptions="confirmOptions" ref="myConfirm"></confirm>
    <confirm :confirmModalOptions="confirmOptionsTx" ref="myConfirmTx"></confirm>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import star from '@/components/star/star'
import {chooseShare, chooseBoss} from '../../api/topUp'
import confirm from '@/components/VDialog/VDialog'

export default {
  components: {mFixedTop, star, confirm},
  data() {
    return {
      titleName: this.$t('topUp.chooseShare.title'),
      pageIndex: 1,
      pageSize: 10,
      isShow: true,
      shareList: [],
      bossId: '', // 钱老板id
      confirmOptions: {
        title: "", //提示
        message: '',
        confirmCancel: () => {
          this.$refs.myConfirm.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this.takeTwiceConfirm()
          this.$refs.myConfirm.closeModel()
        },
      },
      confirmOptionsTx: {
        title: "", //提示
        message: '',
        confirmCancel: () => {
          this.$refs.myConfirmTx.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this.takeTwiceConfirmTx()
          this.$refs.myConfirmTx.closeModel()
        },
      },
      options: {
        pullUpLoad: { // 配置上拉加载，若要关闭可直接 pullUpLoad：false
          threshold: 0,
          txt: this.$t('common.pullLoadMore')
        }
      },
    }
  },
  created() {
    this.withdrawif()
     // 选择共享者列表
  },
  destroyed() {
    this.isShow = false
  },
  methods: {
    takeTwiceConfirmTx () {
      this.$fetch.post(`${this.$api2}draw/chooseBoss`,{
        id: this.$route.query.orderId, // 提现记录ID
        backPre: 'false', //不能返回上一页
        bossId: this.bossId
      }).then((res) => {
        if (res.status === 'success') {
          if (res.data) {
            let id = res.data.id
            this.$router.push({path: `/topUp/topUpOrder/${id}`,query: {falg: 1,backTx:'1'}})
          }
        } else {
          this.toastD(res.msg)
        }
      })
    },
    ifTopupTwFn(item) {
      if (this.$route.query.fal) {
        this.openTxConfirm(item)
      } else {
        this.openTwiceConfirm(item)
      }
    },
    openTxConfirm(item) { // 弹出二次确认弹窗
      this.confirmOptionsTx.message = this.$t('topUp.chooseShare.twiceOk.text1') + item.username + ' ?'
      this.bossId = item.id
      this.$refs.myConfirmTx.showModel()
    },
    openTwiceConfirm(item) { // 弹出二次确认弹窗
      this.confirmOptions.message = this.$t('topUp.chooseShare.twiceOk.text1') + item.username + ' ?'
      this.bossId = item.id
      this.$refs.myConfirm.showModel()
    },
    onPullingUp() {
      this._chooseShareList()
    },
    takeTwiceConfirm() {
      const id = this.$route.query.orderId
      chooseBoss(id, this.bossId).then((res) => {
        this.isShow = true
        if (res.data.status === 'success') {
          this.toastD(this.$t('topUp.chooseShare.twiceOk.text2'))
          let id = res.data.data.id
          this.$router.push({path: `/topUp/topUpOrder/${id}`, query: {backPre: 'false'}})
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
    withdrawif () {
      if (this.$route.query.fal) {
        this.withdrawFn()
      } else {
        this._chooseShareList()
      }
    },
    /*3.2 提现订单选择共享者
    接口URL: http://boss.pigamegroup.com/draw/chooseBoss*/
    /*参数
    id	long	提现订单记录ID
    sort	shot	1 排序方式 1:信用 2:成交金额 3:成交数量
    pageIndex	int	页码
    pageSize	int	每页显示数*/
    withdrawFn () {
      this.$fetch.post(`${this.$api2}/pigame/matchListByDraw`,{
        id: this.$route.query.orderId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.status === 'success') {
          this.isShow = false
          let _list = res.data.list
          if (_list.length) {
            this.shareList.push(...res.data.list)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.msg)
        }
      })
      /*this.$fetch.post(`${this.$api2}/draw/chooseBoss`,{
        id: this.$route.query.orderId,
        bossId: this.$route.query.bossOrderId,
      }).then((res) => {
        this.isShow = false
        console.log(res.status === 'success')
        if (res.status === 'success') {
          let _list = res.data.data.list
          if (_list.length) {
            this.shareList.push(...res.data.data.list)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.msg)
        }
      })*/
    },
    _chooseShareList() {
      const id = this.$route.query.orderId
      const sortBy = 1 // 1 排序方式 1:信用 2:成交金额 3:成交数量
      chooseShare(id, sortBy, this.pageIndex, this.pageSize).then((res) => {
        this.isShow = false
        if (res.data.status === 'success') {
          let _list = res.data.data.list
          if (_list.length) {
            this.shareList.push(...res.data.data.list)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
        } else {
          this.toastD(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .choose-share
    position relative
    height 100vh
    .empty-data
       top 50%!important
    .v-loading
       top 55%
    .v-content-wrapper
      ul
        .item
          background-color #f7f7f7
          padding .5rem .3rem 0
          border-radius 4px
          margin-bottom .3rem
          .li-top
            height 1.4rem
            display flex
            flex-direction row
            justify-content space-between
            border-bottom 1px dotted #000
            .top-left
              display flex
              flex-direction row
              img
                width .8rem
                height .8rem
              .left-box
                margin-left .2rem
                .box-title
                  line-height .48rem
                  font-size .3rem
                p
                  display flex
                  flex-direction row
                  .box-title-subtitle
                    margin-right .1rem
                    font-size .26rem
                    color #b79961
            .top-right
              .right-box
                line-height .4rem
                p
                  text-align right
                  font-size .24rem
                  span
                    color #b79961
          .li-bottom
            height 1rem
            line-height 1rem
            text-align right
            font-size .24rem
            span
              color #b79961
</style>
