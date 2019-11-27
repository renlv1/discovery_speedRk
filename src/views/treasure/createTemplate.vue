<template>
  <div>
    <mFixedTop :titleName="titleName" :isGoBack="isGoBack"></mFixedTop>
    <div class="v-content-wrapper">
      <textarea class="content-template" v-model="content" :placeholder="$t('treasure.text55')"></textarea>
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
                <img class="upload_file" src="../complaint/img/add.svg" />
              </div>
            </cube-upload-btn>
          </div>
        </cube-upload>
      </div>
      <div class="btn" @click="sureCreate">{{$t('treasure.text8')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import {uploadimg} from '../../api/complaint'
import {addGuide} from '../../api/treasure'
export default {
  components: {mFixedTop},
  name: "createTemplate",
  data() {
    return {
      titleName: this.$t('treasure.text15'),
      isGoBack: true,
      files: [],
      images: [],
      content: ''
    }
  },
  methods: {
    removedPic() {
      this.images.pop()
    },
    submitPic(file) {
      let f = file.file
      uploadimg(f, 2).then((res) => {
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
    sureCreate() {
      addGuide(this.content, this.images, 1).then((res) => {
        if(res.data.status === 'success') {
          this.toastD(this.$t('treasure.text58'))
          this.$router.back()
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .v-content-wrapper
    padding-top 0
    padding-bottom 0
    height calc(100vh - 2rem)
    .content-template
      padding-top 3px
      text-indent 5px
      width 100%
      height 3.2rem
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
      position absolute
      bottom 0
      left 0
      font-size .32rem
      border 1px solid #b79961
      color #b79961
      height 1rem
      line-height 1rem
      text-align center
</style>
