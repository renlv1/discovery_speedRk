<template>
  <div class="container">
    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
    <div v-show="!isShowModify">
      <div class="m-c">
        <cube-scroll
          v-show="list.length"
          ref="scroll"
          :options="options"
          :data="list"
          @pulling-up="onPullingDown">
          <ul class="ul-list ">
            <li class="li-items" v-for="(item,index) in list" :key="index">
              <div class="li-left" :class="{'isClick': item.makeChoose === true}" @click="itemCheckOn(item, index)">
                <span class="box"></span>
                <span class="name">{{textF(item.name)}}</span>
              </div>
              <div class="li-right" @click="edit(index)">{{$t('addAddress.text15')}}</div>
            </li>
          </ul>
        </cube-scroll>
      </div>
      <div class="btn-box common-btn">
        <div class="edit-btn common-btn" @click="addFn" v-if="addFlag">{{$t('categories.text1')}}</div>
        <div class="edit-btn common-btn" @click="del" v-else>{{$t('addAddress.text16')}}</div>
      </div>
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
      <div v-if="!list.length" class="empty">
        <img src="@/assets/img/common/empty.png" alt="">
        <p>{{$t('common.empty')}}</p>
      </div>
    </div>
    <div class="modify" v-show="isShowModify">
      <input :placeholder="$t('addAddress.text18')" v-model="name" />
      <div class="btn-edit" @click="save">{{$t('addAddress.text17')}}</div>
    </div>
    <rate-dialog
      v-if="rateShow"
      :rateShow="rateShow"
      :placeholderTip="placeholderTip"
      @hideDialog="hideDialog"
      @selectOne="okFun">
    </rate-dialog>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import Dialog from '@/components/dialog/index'
import rateDialog from './rateDialog'

export default {
  components: {mFixedTop,
    rateDialog},
  name: "categories",
  data() {
    return {
      rateShow:false,
      addFlag: true,
      switchShow: false,
      isGoBack: true,
      titleName: this.$t('addAddress.text19'),
      list: [],
      loadShow: true,
      pageIndex: 1,
      merchantId: '', // 商户id
      currentIndex: 0,
      isShowModify: false, // 显示编辑页面
      name: '',
      productList: [],
      productIds: '',
      placeholderTip: this.$t('addAddress.text29')
    }
  },
  computed: {
    options() {
      return {
        pullUpLoad: {
          txt: {
            noMore: this.$t('common.noMore')
          }
        }
      }
    }
  },
  mounted() {
    this.getMerchantId()
  },
  methods: {
    addFn() {
      this.rateShow = true
    },
    okFun(name) {
      this.$fetch.post(`${this.$api}shopMine/addMerchantProductCat`, {
        name: name
      }).then((res) => {
        if (res.status === 'success') {
          this.toastD(this.$t('addAddress.text30'))
          this.list = []
          this.getList()
          this.rateShow = false
        } else {
          this.rateShow = false
          this.toastD(res.msg)
        }
      })
    },
    hideDialog() {
      this.rateShow = false
    },
    textF (text) {
      if (!text) return ''
      return window.decodeURI(text)
    },
    goPath() {
      if (this.isShowModify) {
        this.isShowModify = false
      } else {
        if(this.$store.state.editFlag !== '') {
          if (Number(this.$store.state.editFlag) === 1) { // 返回新增页面
            this.$router.push('/addGoods')
          } else if (Number(this.$store.state.editFlag) === 2) { // 返回编辑页面
            this.$router.push({
              path: '/editGoods',
              query: {
                id: this.$route.query.id
              }
            })
          }
        } else {
          this.$router.push('/openShop')
        }
      }
    },
    getMerchantId() {
      this.$http.post(`${this.$api}shopMine/getMerchantInfo`).then((res) => {
        this.merchantId = res.data.data.merchantInfo.id
        this.getList()
      })
    },
    itemCheckOn(item, index) {
      this.addFlag = false
      // this.currentIndex = index
      item.makeChoose = !item.makeChoose
      let idIndex = this.productList.indexOf(item.id)
      if (idIndex >= 0) { // 如果已经包含就去除
        this.productList.splice(idIndex, 1)
      } else { // 如果没有包含就添加
        this.productList.push(item.id)
      }
      if (this.productList.length > 0) {
        this.addFlag = false
      } else {
        this.addFlag = true
      }
      this.productIds = this.productList.join(',')
    },
    getList() {
      this.$http.post(`${this.$api}shopMine/getMerchantProductCatList?merchantId=${this.merchantId}&pageIndex=${this.pageIndex}&pageSize=20`).then((res) => {
        this.loadShow = false
        const _list = res.data.data
        _list.forEach(item => {
          item.makeChoose = false
        })
        if (_list.length) {
          this.list.push(..._list)
          this.pageIndex++
        } else {
          this.$refs.scroll.forceUpdate()
        }
        // this.list[0].makeChoose = true
        // this.productList.push(this.list[0].id)
      })
    },
    edit(i) {
      // 编辑
      this.name = ''
      this.isShowModify = true
      this.currentIndex = i
    },
    save() {
      let name = this.name
      this.operating(1, name)
    },
    del() {
      Dialog({
        title: this.$t('addAddress.text20'),
        content: this.$t('categories.text65'),
        okFn: () => {
          let name = this.list[this.currentIndex].name
          this.operating2(2, name)
          this.addFlag = true
        }
      })
      // 删除类目
    },
    operating(status, name) {
      let catId = this.list[this.currentIndex].id
      // let aName = window.encodeURI(name)
      this.$fetch.post(`${this.$api}shopMine/modifyMerchantProductCat`,{
        catId: catId,
        name: name,
        status: status
      }).then((res) => {
        if (res.status === 'success') {
          if (status === 2) { // 删除
            this.toastD(this.$t('addAddress.text21'))
            setTimeout(() => {
              this.list.splice(this.currentIndex, 1)
            }, 500)
          } else { // 修改
            this.toastD(this.$t('addAddress.text22'))
            setTimeout(() => {
              this.isShowModify = false
            }, 500)
          }
          this.pageIndex = 1
          this.list = []
          this.getList()
        } else {
          this.toastD(res.msg)
        }
      })
    },
    operating2(status, name) {
      let catId = this.list[this.currentIndex].id
      // let aName = window.encodeURI(name)
      this.$fetch.post(`${this.$api}shopMine/deleteMerchantProductCat`,{
        catIds: this.productIds
      }).then((res) => {
        if (res.status === 'success') {
          if (status === 2) { // 删除
            this.toastD(this.$t('addAddress.text21'))
          } else { // 修改
            this.toastD(this.$t('addAddress.text22'))
            setTimeout(() => {
              this.isShowModify = false
            }, 500)
          }
          this.productList = []
          this.productIds = ''
          this.pageIndex = 1
          this.list = []
          this.getList()
        } else {
          this.toastD(res.msg)
        }
      })
    },
    onPullingDown() {
      this.getList()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .container
    position relative
    height 100vh
    .m-c
      .ul-list
        padding 0 .3rem
        .li-items
          font-size .32rem
          display flex
          flex-direction row
          height 1rem
          line-height 1rem
          justify-content space-between
          .li-left
            width 80%
            display flex
            flex-direction row
            align-items center
            &.isClick
              color rgb(255, 182, 75);
              .box
                border: .02rem solid rgb(255, 182, 75);
                &::before
                  content ''
                  display: block
                  width: .16rem
                  height: .16rem
                  border-radius 50%
                  background-color: rgb(255, 182, 75);
            .box
              margin-bottom 2px
              display: flex
              align-items center
              justify-content center
              width: .32rem
              height: .32rem
              border-radius 50%
              border: .02rem solid #e5e5e5
              margin-right 10px
            .name
              width 100%
              overflow: hidden;
              text-overflow: ellipsis;
          .li-right
            font-size .28rem
            color rgb(255, 182, 75);
    .btn
      position fixed
      bottom 0
      text-align center
      line-height 1rem
      font-size .32rem
      color #ffb64b
      border-radius 5px
      height 1rem
      width 100%
      border 1px solid #ffb64b
      background-color #fff
    .modify
      padding 0 .3rem
      font-size .32rem
      position absolute
      width 100%
      top 60px
      input
        width 100%
        margin-top 50px
        padding 5px
        height 1rem
        line-height 1rem
        border-bottom 1px solid #ccc
      .btn-edit
        margin 100px auto 0
        text-align center
        line-height 1rem
        font-size .32rem
        color #ffb64b
        border-radius 5px
        height 1rem
        width 100%
        border 1px solid #ffb64b
        background-color #fff
</style>
