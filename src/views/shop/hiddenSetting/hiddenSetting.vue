<template>
  <div class="shop">
    <v-header :titleName="titleName" :isGoNumber="true" @goPath="$router.go(-1)" :isGoBack="true"></v-header>
<!--    <mFixedTop :titleName="titleName" :isGoNumber="true" @goPath="$router.go(-1)" :isGoBack="true"></mFixedTop>-->
    <div class="shopInfo">
      <ul class="uls-one">
        <li>
          <div class="title">{{$t('hiddenSetting.text2')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('hiddenSetting.text3')" v-model.trim="ratio" @input="inputNum('ratio')">
            <span class="precet">%</span>
          </div>
        </li>
        <li @click="addressMap">
          <div class="title">{{$t('hiddenSetting.text4')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('hiddenSetting.text5')" v-model.trim="address" disabled>
            <div class="go-icon"><img src="../img/go.png"/></div>
          </div>
        </li>
        <li>
          <div class="title">{{$t('hiddenSetting.text6')}}</div>
          <div class="input-box">
            <input type="text" :placeholder="$t('hiddenSetting.text7')" v-model.trim="detailAddress">
          </div>
        </li>
      </ul>
      <div class="title-w">{{$t('hiddenSetting.text8')}}</div>
      <div class="flex-i">
        <p class="title-a">{{$t('hiddenSetting.text9')}}</p>
        <div class="flex-content-between" @click="gotoA">
          <div class="left-w">
            <p class="left-text">{{startTime}} - {{endTime}}</p>
            <p class="left-date">{{fnDate(mineDate)}}</p>
          </div>
          <div class="go-icon"><img src="../img/go.png"/></div>
        </div>
      </div>
      <div class="flex-i">
        <p class="title-a">{{$t('hiddenSetting.text10')}}</p>
        <div class="textarea-w">
          <textarea class="task-textarea" :placeholder="$t('hiddenSetting.text11')" v-model.trim="taskContent" @input="textareaVal"></textarea>
          <p class="number">{{addNum}}/500</p>
        </div>
      </div>
      <div class="flex-i">
        <p class="title-a">{{$t('hiddenSetting.text12')}}</p>
        <div class="file-w">
          <div class="loading" v-show="logoLoading">
            <img src="../../../assets/img/common/loading.gif" alt="">
          </div>
          <div class="logo-img" v-for="(item, index) in logoImg" :key="index">
            <img :src="item" alt="" class="logo-a">
            <div class="zhe" @click="deleteLogo(index)">
              <img src="../notOpen/img/delete.png" alt="" class="delete">
            </div>
          </div>
          <div class="file-box" v-show="maxlogoImg">
            <input type="file" class="file-input" @change="fillLogo(1)" ref="uploadFile" accept="image/*" multiple="multiple">
          </div>
        </div>
      </div>
    </div>
    <div class="btn-box common-btn">
      <div class="edit-btn common-btn" @click="submit">{{$t('hiddenSetting.text13')}}</div>
    </div>
    <v-map  v-if="mapShow"
            :titleName="titleName"
            :btnName="btnName"
            @hideMap="hideMap"
            @getPosition="getPosition"></v-map>
    <hide-time v-if="timeShow"
               @goBack="goBackHide"
               @okBtn="okBtn"
               :mineDate="mineDate"
               :startTime.sync="startTime"
               :endTime.sync="endTime"
    >
    </hide-time>
  </div>
</template>

<script>
	/* eslint-disable */
	import {compress, dataURItoBlob} from '../../../assets/js/upload'
  import mFixedTop from '@/components/mFixedTop'
  import Dialog from '@/components/dialog/index'
  // import VMap from '../../../components/map/map.vue'
  import VMap from './myMap'
  import hideTime from './hideTime'
	export default {
		data() {
			return {
        logoLoading: false,
        maxlogoImg: true,
				titleName: this.$t('hiddenSetting.text1'),
				btnName: this.$t('hiddenSetting.text15'),
				timeShow: false,
				mapShow: false,
				ratio: '',
				address: '',
				detailAddress: '',
				taskContent: '',
				logoImg: [],
				arLogoImg: [],
				addNum:0,
				longitude:0,//经度
				latitude:0,//纬度
				mineDate: [7,1,2,3,4,5,6],
				startTime: '00:00',
				endTime: '23:59',
				taskId: '',
        taskFlag: true
			}
		},
		created() {
			this.getMerchantTask()
		},
		methods: {
			getMerchantTask  () {
				this.$fetch.post(`${this.$api}shopMine/getMerchantTask`).then(res => {
					if (res.status === 'success' && res.data.merchantTaskList) {
						this.taskFlag = true
            let merchantTask = res.data.merchantTaskList[0]
            this.taskId = merchantTask.id
						this.ratio = merchantTask.profitRate
						this.mineDate = merchantTask.minedate.split(',')
						this.taskContent = merchantTask.content
            this.addNum = merchantTask.content.length
						this.address = merchantTask.address
						this.detailAddress = merchantTask.realAddress
            if (merchantTask.imglist) {
              this.logoImg = merchantTask.imglist.split(',')
            }
            if (this.logoImg.length > 3) {
              this.maxlogoImg = false
            } else {
              this.maxlogoImg = true
            }
            let mineTime = merchantTask.minetime
						this.startTime = mineTime.split('-')[0]
						this.endTime = mineTime.split('-')[1]
						this.latitude = merchantTask.latitude
						this.longitude = merchantTask.longitude
          } else {
						this.taskFlag = false
          }
        })
      },
			hideMap () {
				this.mapShow = false
			},
			inputNum (field) {
				let val = this[field]
				if (!/^\d/.test(val)) { // 不能输入特殊符号+-等,不能输入多个小数点，不能小数点后面超过4位小数
					this[field] = val.substring(0, val.length - 1)
				}
				if (/^\./.test(this[field])) { // 如果是"."
					this[field] = ''
				}
				this[field] = this[field].replace(/[^0-9]/g, '') // 只能是数字或者.
        if (this[field] === 0) {
	        this[field] = 0
        } else if (this[field] > 100) {
	        this[field] = 100
        }
			},
			goBackHide () {
				this.timeShow = false
      },
			okBtn (switchFlag, startTime, endTime, weekArr) {
        if (switchFlag === true) {
	        this.startTime = startTime
	        this.endTime = endTime
	        this.mineDate = weekArr
        } else {
	        this.startTime = '00:00'
	        this.endTime = '23:59'
	        this.mineDate = [7,1,2,3,4,5,6]
        }
				this.timeShow = false
      },
			getPosition (pos, address) {
        this.address = address
				this.longitude = pos.lng // 经度
        this.latitude = pos.lat //纬度
				this.mapShow = false
			},
			addressMap () {
				this.mapShow = true
      },
			gotoA () {
				this.timeShow = true
				// this.$router.push('/hideTime')
      },
      verivty () {
				let flag = true
	      if (this.logoImg.length === 0) {
		      this.toastD(this.$t('hiddenSetting.text16'))
		      flag = false
	      }
	      if (this.taskContent === '') {
		      this.toastD(this.$t('hiddenSetting.text17'))
		      flag = false
	      }
	      if (this.detailAddress === '') {
		      this.toastD(this.$t('hiddenSetting.text18'))
		      flag = false
	      }
	      if (this.address === '') {
		      this.toastD(this.$t('hiddenSetting.text19'))
		      flag = false
	      }
	      if (this.ratio === '') {
		      this.toastD(this.$t('hiddenSetting.text20'))
		      flag = false
	      }
        return flag
      },
			submit () {
				if (this.verivty()) {
					let merchantTask = {
						content:this.taskContent,//任务内容
            imglist:this.logoImg.join(','),//图片
						longitude:this.longitude,//经度
						latitude:this.latitude,//纬度
            address:this.address,//任务地点
            realAddress:this.detailAddress,//具体地点名
            minetime:this.startTime +'-'+this.endTime,//寻宝时间
            minedate:this.mineDate.join(','),//寻宝日期
						profitRate:this.ratio,////返利率
					}
					// if (this.taskFlag === true) {
					// 	merchantTask.id = this.taskId
					// }
					let url = ''
          if (this.taskId) {
            merchantTask.id = this.taskId
            url = `${this.$api}shopMine/modifyMerchantTask`  // 1.9 支付即藏宝修改商户任务
          } else {
            url = `${this.$api}shopMine/addMerchantTask` // 1.8 支付即藏宝添加商户任务
          }
          this.$fetch.post(url, merchantTask).then(res => {
          	if (res.status === 'success') {
          	  // this.$store.commit(SET_MERCHANT_TASK, merchantTask)
              this.toastD(this.$t('hiddenSetting.text21'))
              setTimeout(() => {
                this.$router.go(-1)
              },1500)
            } else {
		          Dialog({
			          title: '',
			          content: res.msg
		          })
            }
          })
        }
      },
			fnDate (arr) {
				let arr2 = []
				arr.forEach(item => {
        	let tm = Number(item)
	        if (tm === 1) arr2.push(this.$t('hiddenSetting.text22'))
	        if (tm === 2) arr2.push(this.$t('hiddenSetting.text23'))
	        if (tm === 3) arr2.push(this.$t('hiddenSetting.text24'))
	        if (tm === 4) arr2.push(this.$t('hiddenSetting.text25'))
	        if (tm === 5) arr2.push(this.$t('hiddenSetting.text26'))
	        if (tm === 6) arr2.push(this.$t('hiddenSetting.text27'))
	        if (tm === 7) arr2.push(this.$t('hiddenSetting.text28'))
        })
				return arr2.join('、')
      },
			deleteLogo (index) {
				this.logoImg.splice(index, 1)
				this.arLogoImg.splice(index, 1)
        if (this.logoImg.length > 3) {
          this.maxlogoImg = false
        } else {
          this.maxlogoImg = true
        }
			},
			async fillLogo () {
				let imgVal = this.$refs.uploadFile
				let imgObj = imgVal.files[0]
				if (imgObj) {
					let isLt2M = imgObj.size / 1024 / 1024 <= 5
					let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
					if (!(isLt2M && isType)) {
						this.toastD(this.$t('notOpen.text15'))
						imgVal.value = ''
						return
					}
				} else {
					return
				}
				let reader = new FileReader()
				let self = this
				reader.readAsDataURL(imgObj)
				self.logoLoading = true
				reader.onloadend = function () {
					let result = this.result
					let img = new Image()
					img.src = result
					img.onload = function () {
						let formData = new FormData()
						let data = compress(img)
						self.imgUrl = result
						let blob = dataURItoBlob(data)
						let reader2 = new FileReader()
						reader2.readAsArrayBuffer(blob)
						reader2.onloadend = function () {
							let f = new File([this.result], imgObj.name)
							let fileImg
							if (f) {
								fileImg = new File([this.result], imgObj.name)
							} else {
								fileImg = imgVal.files[0]
							}
							formData.append('file', imgVal.files[0])
							formData.append('sourceType', 1)
							let config = {
								headers: { 'Content-Type': 'multipart/form-data' }
							}
							self.$fetch.postFormdata(`${self.$api}blobfile/uploadBlobFile`, formData).then(res => {
								if (res.status === 'success') {
                  self.logoLoading = false
									self.logoImg.push(res.data[0].fileUrl)
									self.arLogoImg.push(res.data[0].fileName)
                  if (self.logoImg.length > 3) {
                    self.maxlogoImg = false
                  } else {
                    self.maxlogoImg = true
                  }
								} else {
                  self.logoLoading = false
									self.toastD(res.msg)
								}
							})
						}
					}
				}
			},
			toastD (text) {
				this.toast = this.$createToast({
					txt: text,
					time: 2000,
					type: 'txt'
				})
				this.toast.show()
			},
			// 输入文字控制
			textareaVal () {
				if (this.taskContent.length) {
					this.addNum = this.taskContent.length
					if (this.taskContent.length > 500) {
						this.addNum = 500
						this.taskContent = this.taskContent.substring(0,500)
					}
				}
			},
		},
		components: {
     mFixedTop,
      VMap,
			hideTime
		}
	}
</script>

<style lang="stylus" scoped>
  .shop
    /*position absolute*/
    /*left 0*/
    /*top 0*/
    /*width 100%*/
    /*height 100%*/
    /*overflow-y auto*/
  .map-w
    position: fixed
    top: 0
    left: 0
    width: 100%
    bottom: 0
    z-index: 100
  .shopInfo {
    background-color: #fff;
    padding-left: .3rem
    padding-right: .3rem
    margin-bottom 1rem
  }
  .uls-one {
    .precet{
      font-size 14px
      margin-left: .2rem;
    }
    li {
      display: flex;
      height: 1rem;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      .title {
        font-size: .28rem;
        color: #060f26;
      }
      .input-box {
        flex 1
        display: flex;
        align-items: center;
        .phone{
          width: 45%;
        }
        .area-code{
          text-align: right;
          font-size: .28rem;
          color: #3495f1;
          flex: 1;
          margin-right: .2rem;
        }
        .phone{
          font-size: .28rem;
          color: #b2b2b2;
        }
        .go-icon {
          margin-left: .2rem;
          width: 0.15rem;
          height: 0.28rem;
          img {
            display: block;
            width: 100%;
          }
        }
        input {
          font-size: .28rem;
          color: #060f26;
          text-align: right;
          flex 1
          padding-left: .5rem
          text-overflow ellipsis
          &::-webkit-input-placeholder {
            color: #b2b2b2;
          }
          &:-moz-placeholder {
            color: #b2b2b2;
          }
          &::-moz-placeholder {
            color: #b2b2b2;
          }
          &:-ms-input-placeholder {
            color: #b2b2b2;
          }
        }
      }
    }
  }

  .uls-two {
    .first-li{
      /*height: 1.68rem;*/
      .shopAdd{
        word-wrap:break-word;
        font-size: .28rem;
        color: #b2b2b2;
        width: 90%;
      }
      .shopTextarea{
        padding-top: .3rem;
      }
      .input-box{
        height: .8rem;
      }
    }
    li {
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: .3rem 0;
      &:nth-of-type(2){
        border-bottom: none;
      }
      .title {
        font-size: .28rem;
        color: #060f26;
        margin-bottom: .2rem;
      }
      .textarea-box{
        background-color: #fff;
        width: 100%;
        border-radius: 8px;
        font-size: .28rem;
        color: #060f26;
        border-bottom: 1px solid #e8e8e8;
      }
      .input-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .textarea{
          background-color: #fff;
          width: 100%;
          height: .8rem;
          padding: .22rem .2rem 0 .3rem;
          margin-bottom: .4rem;
          text-align: justify;
          color: #b2b2b2;
        }
        .warm-num{
          text-align: right;
          width: 100%;
          font-size: .28rem;
          color: #b2b2b2;
          position: absolute;
          z-index: 30;
          right: 0;
          bottom: 0;
          margin: 0 .2rem .15rem 0;
        }
        .go-icon {
          margin-left: .2rem;
          width: 0.15rem;
          height: 0.28rem;
          img {
            display: block;
            width: 100%;
          }
        }
        input {
          word-wrap:break-word;
          font-size: .28rem;
          color: #b2b2b2;
          &::-webkit-input-placeholder {
            color: #b2b2b2;
          }
          &:-moz-placeholder {
            color: #b2b2b2;
          }
          &::-moz-placeholder {
            color: #b2b2b2;
          }
          &:-ms-input-placeholder {
            color: #b2b2b2;
          }
        }
      }
    }
  }
  .btn-box{
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    background-color: rgb(255,182,75)
    color #fff
    font-size: .28rem
    z-index: 50
    .edit-btn {
      width: 100%
      height: 1rem
      line-height 1rem
      display: flex
      justify-content center
    }
  }
  .err-class{
    font-size: .28rem;
    color: #fe5a5a;
    margin-top: 0.2rem;
  }
  .title-w
    line-height: 1.1rem
    height: .88rem
    color #999
    font-size: .28rem
    margin-left: -.3rem
    padding-left: .3rem
    margin-right: -.3rem
    background-color: #f5f5f7
  .title-a
    line-height: .88rem
    color #060f26
    font-size: .28rem
  .flex-content-between
    display: flex
    align-items center
    justify-content space-between
    border-bottom: 1px solid #eeeff1
    padding: .3rem 0
    .left-w
      font-size 14px
      color #999
      .left-text
        margin-bottom: .36rem
      .left-date
        word-wrap:break-word
    .go-icon
      img
        width: 0.15rem;
        display: block
  .textarea-w
    width: 100%
    height: 1.6rem
    font-size: 14px
    color #060f26
    position: relative
    border-bottom: 1px solid #eeeff1
    .task-textarea
      padding-top: .22rem
      border-radius 6px
      width: 100%
      height: 1rem
    .number
      position: absolute
      text-align: right
      width: 100%
      z-index: 10
      right: 0
      bottom: 0
      /*margin: 0 .2rem .15rem 0*/
  .flex-content
    border-bottom: 1px solid #eeeff1
    padding: .3rem 0
  .file-w
    display: flex
    flex-wrap wrap
    .loading
      width: 1.4rem
      margin-right: .3rem
      img
        width: 100%
        display: block
    .file-box
      width: 1.4rem
      min-width 1.4rem
      height: 1.4rem
      margin-bottom: .3rem
      overflow: hidden
      background: url("../notOpen/img/upload.png") no-repeat center / cover
      .file-input
        width: 100%
        height: 100%
        opacity: 0
    .loading
      width: 1.4rem
      min-width 1.4rem
      margin-bottom: .3rem
      margin-right: .3rem
      img
        width: 100%
        display: block
    .logo-img
      position: relative
      width: 1.4rem
      min-width 1.4rem
      height: 1.4rem
      margin-bottom: .3rem
      margin-right: .3rem
      .logo-a
        width: 100%
        height: 100%
        border-radius 4px
      .zhe
        position: absolute
        left: 0
        bottom: 0
        height: .5rem
        width: 100%
        background-color: rgba(0,0,0,.5)
        display: flex
        align-items center
        justify-content center
        border-radius 0 0 4px 4px
        .delete
          width: .32rem
          display: block
</style>
