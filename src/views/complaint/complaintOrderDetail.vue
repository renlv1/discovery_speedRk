<template>
  <div class="detail">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath"></mFixedTop>
    <div class="v-loading" v-show="isShow">
      <cube-loading></cube-loading>
    </div>
    <div class="v-content-wrapper">
      <div class="item">
        <div class="li-top">
          <p>{{$t('topUp.topUpList.item.text1')}} {{detailObj.id}} <span class="status">{{detailObj.typeTitle}}</span></p>
          <p>{{$t('complaint.text1')}} {{detailObj.amount}} {{detailObj.currency}}</p>
          <p>
            <span v-if="detailObj.bossNick === $store.state.userName">{{detailObj.userNick}}</span>
            <span v-if="detailObj.bossNick !== $store.state.userName">{{detailObj.bossNick}}</span>
            <span>{{$changeDate(detailObj.createAt, '.')}}</span></p>
        </div>
        <div class="li-bottom">
          <span class="calculate">{{detailObj.tipMsg}}</span>
        </div>
      </div>
      <step-complaint :stepData="stepList" :reqImgList="reqImgList" :desImgList="desImgList" :title="title"></step-complaint>
      <div class="btn-wrapper">
        <div class="btn cancel back-color" @click="openCancel" v-if="cancelBtn">{{$t('complaint.detail.text1')}}</div>
        <div class="btn cancel back-color" @click="openComplaint" v-if="proofBtn">{{$t('complaint.detail.text2')}}</div>
      </div>
      <confirm :confirmModalOptions="confirmCancelOptions" ref="cancel"></confirm>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import stepComplaint from '@/components/step/stepComplaint'
import confirm from '@/components/VDialog/VDialog'
import {getListDetail, twiceConfirm} from '../../api/topUp'
import {cancel} from '../../api/complaint'
import {mapGetters} from 'vuex'

export default {
  components: {mFixedTop, stepComplaint, confirm},
  data() {
    return {
      titleName: this.$t('complaint.detail.title'),
      title: this.$t('complaint.detail.subTitle'),
      detailObj: {},
      stepList: {},
      reqImgList: [], // 申述图片
      desImgList: [], // 举证图片
      isShow: true,
      cancelBtn: false, // 判断是否存在取消申诉按钮
      proofBtn: false, // 判断是否存在提交举证按钮
      confirmCancelOptions: {
        title: "",
        message: this.$t('complaint.detail.twice.tip'), //提示
        confirmCancel: () => {
          this.$refs.cancel.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this._cancelOrder()
          this.$refs.cancel.closeModel()
        },
      },
    }
  },
  created() {
    this._getListDetail()
  },
  mounted() {
    /*this.$nextTick(() => {
      this._getListDetail()
    })*/
  },
  computed: {
    ...mapGetters([
      'label'
    ])
  },
  methods: {
    goPath () { // 返回到我的
      this.$router.push('/complaintOrder')
    },
    openComplaint() {
      let type
      if (this.$route.query.fals) {
        type = 2
      } else {
        type = 1
      }
      this.$router.push({
        path: '/complaint',
        query: {id: this.detailObj.id, boss:this.detailObj.bossNick, type: type, isArbitration: 1, canHelp: this.detailObj.canHelp}
      })
    },
    openCancel() { // 确认取消弹窗
      this.$refs.cancel.showModel()
    },
    openSure() { // 确认已打款弹窗
      this.$refs.sure.showModel()
    },
    chooseShare() { // 去选择共享者
      this.$router.push({
        path: '/topUp/chooseShare',
        query: {orderId: this.detailObj.id}
      })
    },
    getTxDetail (id) {
      this.$fetch.post(`${this.$api2}draw/queryOrderDetail`,{orderId:id}).then((res) => {
        this.isShow = false
        let stepList = {}

        if (res.status === 'success') {
          this.detailObj = res.data
          const arbitration = res.data.arbitration
          stepList.status = arbitration.aState // 当前所在的位置

          stepList.reqType = arbitration.reqType // 申诉原因

          stepList.reqMessage = arbitration.reqMessage // 申诉描述

          stepList.desMessage = arbitration.desMessage // 仲裁描述


          if (arbitration.reqImgList) {
            var reqImg = arbitration.reqImgList.split(',')
          }
          this.reqImgList.push(reqImg) // 申述的照片
          this.reqImgList = this.reqImgList[0]


          if (arbitration.desImgList) {
            var desImg = arbitration.desImgList.split(',').slice(0, 3)
          }

          this.desImgList.push(desImg) // 提供证据的照片
          this.desImgList = this.desImgList[0]

          const canHelp = parseInt(res.data.canHelp)
          const isRefuse = parseInt(res.data.isRefuse)

          if (canHelp === 2) {
            this.proofBtn = true
          }
          if (isRefuse === 1) {
            this.cancelBtn = true
          }

          this.stepList = stepList
        } else {
          this.toastD(res.msg)
        }
      })
    },
    _getListDetail() { // 详情
      let id = this.$route.params.id
      if (this.$route.query.fals) { // 提现申述详情
        this.getTxDetail(id)
      } else { // 充值申述详情
        getListDetail(id).then((res) => {
          this.isShow = false
          let stepList = {}
          if (res.data.status === 'success') {
            this.detailObj = res.data.data
            const arbitration = res.data.data.arbitration
            stepList.status = arbitration.aState // 当前所在的位置

            stepList.reqType = arbitration.reqType // 申诉原因

            stepList.reqMessage = arbitration.reqMessage // 申诉描述

            stepList.desMessage = arbitration.desMessage // 仲裁描述

            if (arbitration.reqImgList) {
              var reqImg = arbitration.reqImgList.split(',')
              this.reqImgList.push(reqImg) // 申述的照片
              this.reqImgList = this.reqImgList[0]
            }


            if (arbitration.desImgList) {
              if (arbitration.desImgList.split(',')) {
                var desImg = arbitration.desImgList.split(',').slice(0, 3)
              }
            }

            this.desImgList.push(desImg) // 提供证据的照片
            this.desImgList = this.desImgList[0]

            const canHelp = parseInt(res.data.data.canHelp)
            const isRefuse = parseInt(res.data.data.isRefuse)


            if (canHelp === 2) {
              this.proofBtn = true
            }
            if (isRefuse === 1) {
              this.cancelBtn = true
            }

            this.stepList = stepList
          } else {
            this.toastD(res.data.msg)
          }
        })
      }
    },
    _cancelOrder() {
      const id = this.detailObj.id
      cancel(id).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('common.cancelSuccessTip'))
          this.$router.push('/complaint')
        } else {
          this.toastD(res.data.msg)
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/assets/css/mixin"
  .detail
    .v-content-wrapper
      position relative
      .item
        padding .4rem .3rem 0
        background-color #f7f7f7
        margin-bottom 10px
        .li-top
          height 1.6rem
          border-bottom 1px dotted #000
          p
            display flex
            flex-direction row
            justify-content space-between
            font-size .28rem
            .status
              color #999
              font-size .24rem
            &:nth-child(2)
              margin .2rem 0
            &:nth-child(3)
              font-size .24rem
              color #999
        .li-bottom
          display flex
          justify-content flex-end
          height .8rem
          line-height .8rem
          font-size .24rem
          .calculate
            color #b79961
      .btn-wrapper
        position fixed
        bottom .5rem
        z-index 9999
        right .4rem
        float right
        .btn
          font-size .28rem
          float left
          width 2rem
          height .8rem
          line-height .8rem
          text-align center
          border-radius .1rem
        .back-color
          border 1px solid #999
        .orange-color
          margin-left .4rem
          background-color #ffe600
</style>
