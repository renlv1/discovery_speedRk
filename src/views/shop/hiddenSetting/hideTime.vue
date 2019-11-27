<template>
  <div class="paymentCurrency-w main-container">
    <v-header :titleName="titleName" :isGoNumber="true" @goPath="goBack" :isGoBack="true"></v-header>
    <div class="wrap">
      <div class="f-item">
        <span>{{$t('hiddenSetting.text30')}}</span>
        <cube-switch v-model="switchFlag" @input="inputSwitch"></cube-switch>
      </div>
      <div v-show="switchFlag">
        <div class="title-p">{{$t('hiddenSetting.text31')}}</div>
        <ul class="date-uls">
          <li v-for="(item, index) in weekDate" :key="index" @click="switchDate(item)" class="date-list" :class="{'activelist': item.flag === true}">{{item.week}}</li>
        </ul>
        <div class="title-p">{{$t('hiddenSetting.text32')}}</div>

        <cube-button @click="showTimePicker(1)" class="btn-c">
          <div class="flex-t">
            <div class="title">{{$t('hiddenSetting.text33')}}</div>
            <div class="input-box">
              <span>{{onlyStartTime}}</span>
              <div class="go-icon"><img src="../img/go.png"/></div>
            </div>
          </div>
        </cube-button>
        <cube-button @click="showTimePicker(2)" class="btn-c">
          <div class="flex-t">
            <div class="title">{{$t('hiddenSetting.text34')}}</div>
            <div class="input-box">
              <span>{{onlyEndTime}}</span>
              <div class="go-icon"><img src="../img/go.png"/></div>
            </div>
          </div>
        </cube-button>
      </div>
    </div>
    <div class="btn-box common-btn">
      <div class="edit-btn" @click="confirmOk">{{$t('hiddenSetting.text35')}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import mFixedTop from '@/components/mFixedTop'
  export default {
		data() {
			return {
        titleName:this.$t('hiddenSetting.text29'),
				// startTime: '00:00',
				// endTime: '23:59',
				weekDate: [
					{week: this.$t('hiddenSetting.text28'), flag: false, label: 7},
					{week: this.$t('hiddenSetting.text22'), flag: false, label: 1},
					{week: this.$t('hiddenSetting.text23'), flag: false, label: 2},
					{week: this.$t('hiddenSetting.text24'), flag: false, label: 3},
					{week: this.$t('hiddenSetting.text25'), flag: false, label: 4},
					{week: this.$t('hiddenSetting.text26'), flag: false, label: 5},
					{week: this.$t('hiddenSetting.text27'), flag: false, label: 6}
        ],
        onlyStartTime: '',
        onlyEndTime: '',
				switchFlag: true,
				activeIndex: 0,
        timeIndex: 1
			}
		},
    props:{
      startTime: {
        type: String
      },
      endTime: {
        type: String
      },
      mineDate: Array
    },
    created () {
		  this.onlyStartTime = this.startTime
      this.onlyEndTime = this.endTime
      // console.log( this.onlyStartTime)
      for (let i = 0; i < this.weekDate.length; i++) {
        for (let j = 0; j < this.mineDate.length; j++) {
          if (Number(this.mineDate[j])=== this.weekDate[i].label) {
            this.weekDate[i].flag = true
          }
        }
      }
    },
		methods: {
			showTimePicker(index) {
				this.timeIndex = index
				if (!this.timePicker) {
					this.timePicker = this.$createDatePicker({
						title: this.$t('hiddenSetting.text36'),
						min: [0, 0],
						max: [23, 59],
						// value: new Date(),
						startColumn: 'hour',
						columnCount: 2,
						onSelect: this.selectHandle,
						onCancel: this.cancelHandle
					})
				}
				this.timePicker.show()
			},
      ifTime(value) { // 判断时间是否是个位数
        if (value < 10) {
          return '0' + value
        }
        return value
      },
			selectHandle(date, selectedVal, selectedText) {
				if (this.timeIndex === 1) {
					this.onlyStartTime = this.ifTime(selectedVal[0]) + ':' + this.ifTime(selectedVal[1])
        } else {
					this.onlyEndTime = this.ifTime(selectedVal[0]) + ':' + this.ifTime(selectedVal[1])
        }
			},
			goBack () {
				this.$emit('goBack')
      },
			confirmOk () {
			  if(this.onlyStartTime>= this.onlyEndTime) {
          this.toastD(this.$t('myPiOrder.text38'))
        } else {
          let weekArr = []
          this.weekDate.forEach(item => {
            if (item.flag === true) {
              weekArr.push(item.label)
            }
          })
          this.$emit('okBtn', this.switchFlag, this.onlyStartTime, this.onlyEndTime, weekArr)
        }
      },
			cancelHandle() {
			},
			inputSwitch(index) {
				this.activeIndex = index
			},
			switchDate (item) {
				item.flag = !item.flag
      }
		},
    components: {
      // mFixedTop
    }
	}
</script>

<style scoped lang="stylus">
  .paymentCurrency-w
    z-index: 100
    position: fixed
    overflow: hidden
    background-color: #fff
    top 0
    left 0
    bottom 0
    width 100%
    height 100%
    .btn-c
      padding: 0
      background-color: #fff
    .btn-w
      background #fff
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      cursor: pointer;
      user-select: none;
      font-size: .28rem;
      align-items center
      color #fff
      .btn
        background-color:  rgb(255,182,75);
        cursor: pointer;
        user-select: none;
        width: 100%;
        height: .88rem;
        border-radius: .08rem;
        font-size: .28rem;
        display: flex;
        justify-content: center;
        align-items: center;
    .wrap
      min-height: calc(100vh - 2.2rem);
      .f-item
        padding: 0 .3rem
        border-bottom: 1px solid #dcdde1
        height: 1rem
        display: flex
        align-items center
        justify-content space-between
        span
          font-size: .28rem
          color #060f26
      .date-uls
        display: flex
        align-items center
        flex-wrap wrap
        padding: .4rem .3rem .2rem .3rem
        .date-list
          width: 30%
          height: .74rem
          display: flex
          align-items center
          justify-content center
          border-radius .16rem
          background-color: #f0f3f5
          color #999
          font-size: .28rem
          margin-right: 5%
          margin-bottom: .2rem
          &:nth-child(3n)
            margin-right: 0
          &.activelist
            color #fff
            background-color: rgb(255,182,75)
      .title-p
        line-height: 1.1rem
        height: .88rem
        color #999
        font-size: .28rem
        padding-left: .3rem
        background-color: #f5f5f7
      .f-c
        height: 2rem
        margin-bottom: 2.8rem
      .f-item
        padding: 0 .3rem
        border-bottom: 1px solid #dcdde1
        height: 1rem
        display: flex
        align-items center
        justify-content space-between
        span
          font-size: .28rem
          color #060f26
        .right
          display: flex
          align-items center
          .input
            width: 1.8rem
            height: 1rem
            padding-right: .2rem
      .flex-t
        display: flex;
        height: 1rem;
        padding: 0 .3rem
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e8e8e8;
        font-size: .28rem
        color #060f26
        .input-box
          display: flex;
          align-items: center;
          .go-icon
            margin-left: .2rem;
            width: 0.15rem;
            height: 0.28rem;
            img
              display: block;
              width: 100%;
</style>
