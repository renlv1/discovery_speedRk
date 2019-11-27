<template>
  <div class="v-content-wrapper">
    <mFixedTop :titleName="titleName"></mFixedTop>
    <div class="order-info">
      <p>{{$t('topUp.topUpList.item.text1')}} {{$route.query.id}}</p>
      <p>{{$t('menu.my.menu.text3')}} {{$route.query.boss}}</p>
    </div>
    <!-- 申诉内容 -->
    <div class="complaint-content">
      <h5 v-if=isArbitration class="title">{{$t('complaint.complaintContent.text1')}}</h5>
      <ul v-if=isArbitration>
        <li v-for="(item, index) in reasons" class="reason" :class="{activeReason: currentIndex === index}"
            @click="chooseReason(item, index)" :key="index">
          <i class="icon-reason"></i>
          <p class="description">{{item}}</p>
        </li>
      </ul>
      <h5 class="subtitle">{{$t('complaint.complaintContent.text2')}}</h5>
      <input v-model="description" class="v-placeholder-text ipt" :placeholder=placeHoldText maxlength="500" />
      <div class="upload-pic-box">
        <cube-upload
          ref="upload"
          v-model="files"
          :simultaneous-uploads="1"
          :max="3"
          @file-removed="removedPic"
          @file-submitted="submitPic"
          @file-error="errHandler">
          <div class="clear-fix">
            <cube-upload-file v-for="(file, i) in files" :file="file" :key="i"></cube-upload-file>
            <cube-upload-btn>
              <div v-show="files.length !== 3">
                <img class="upload_file" src="./img/add.svg" />
              </div>
            </cube-upload-btn>
          </div>
        </cube-upload>
      </div>
      <div class="btn" @click="submit">{{$t('common.dialog.text2')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {uploadimg, createArbitration, drawCreateArbitration} from '../../api/complaint'
import {compress, dataURItoBlob} from '../../assets/js/upload'
import {mapGetters} from 'vuex'

export default {
  components: {mFixedTop},
  data() {
    return {
      currentIndex: 0,
      titleName: this.$t('menu.order.menu.text4'),
      reasons: this.$t('complaint.complaintContent.complaintReasons'),
      reason: this.$t('complaint.complaintContent.reason'),
      description: '',
      files: [],
      images: [],
      placeHoldText: this.$t('complaint.complaintContent.text3'),
      isArbitration: true // 判断是否是提交举证
    }
  },
  computed: {
    ...mapGetters([
      'address'
    ])
  },
  created() {
    if (Number(this.$route.query.canHelp) === 2) {
      this.isArbitration = false
      this.placeHoldText = this.$t('complaint.complaintContent.text4')
    }
  },
  methods: {
    removedPic() {
      this.images.pop()
    },
    submitPic(file) {
      let f = file.file
      uploadimg(f, 0).then((res) => {
        if (res.data.success) {
          let list = res.data.data
          let imgUrl = ''
          list.forEach((item) => {
             imgUrl = item.fileUrl
          })
          this.images.push(imgUrl)
        } else {
          this.toastD(this.$t('complaint.complaintContent.uploadPicErr'))
          this.files.pop() // 把不符合的文件删除
        }
      })
    },
    errHandler(file) {
      // const msg = file.response.message
      this.toastD('Upload failed')
    },
    submit() {
      const id = this.$route.query.id
      if (Number(this.$route.query.type) === 1 && this.files.length > 0) { // 充值申诉
        createArbitration(id, this.images, this.description, this.reason).then((res) => {
          if (res.data.status === 'success') {
            this.toastD(this.$t('complaint.complaintContent.successProvide'))
            this.$router.push(`/complaintOrder/${id}`)
          } else {
            this.toastD(res.data.msg)
          }
        })
      } else if (Number(this.$route.query.type) !== 1 && this.files.length > 0) { // 提现申诉
        drawCreateArbitration(id, this.images, this.description, this.reason).then((res) => {
          if (res.data.status === 'success') {
            this.toastD(this.$t('complaint.complaintContent.successProvide'))
            this.$router.push(`/complaintOrder/${id}`)
          } else {
            this.toastD(res.data.msg)
          }
        })
      } else if (this.files.length === 0) {
        this.toastD(this.$t('complaint.complaintContent.noComplaintPic'))
      }
    },
    chooseReason(item, index) {
      this.currentIndex = index
      this.reason = item
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    font-size .28rem
    .order-info
      display flex
      flex-direction row
      justify-content space-between
      padding-bottom .55rem
      border-bottom 1px dotted #999

    .complaint-content
      .title
        padding .6rem 0 .3rem
      ul
        margin 0 .4rem
        .reason
          height 1rem
          display flex
          flex-direction row
          align-items center
          .icon-reason
            display inline-block
            width .4rem
            height .4rem
            background-image url("./img/unActive.svg")
            background-repeat no-repeat
            background-size cover
            margin-right .2rem
          .description
            color #999
          &.activeReason
            .icon-reason
              background-image url("./img/active.svg")
              background-repeat no-repeat
              background-size cover
            .description
              color #000

      .subtitle
        margin .6rem 0 .3rem
      .ipt
        width 100%
        height 1rem
        line-height 1rem
        border-bottom 1px solid #999
        font-size .3rem
      .upload-pic-box
        position relative
        display flex
        flex-direction row
        margin .8rem 0 1.4rem
        .upload_file
          width 1.4rem
          height 1.4rem
      .btn
        width 100%
        height .8rem
        color #b79961
        text-align center
        line-height .8rem
        font-size .3rem
        border 1px solid #b79961
        border-radius .04rem
</style>
