<template>
  <div class="mergeMap">
    <mFixedTop :titleName="titleName" ></mFixedTop>
    <div class="m-c">
      <cube-scroll
        v-show="list.length"
        ref="scroll"
        :options="options"
        :data="list"
        @pulling-up="onPullingDown">
        <ul class="ul-list ">
          <li class="li-items" v-for="(item,index) in list" :key="index" @click="checkOne(index,item.everytotal,item.id)" :class="{changeFlag: disabelIndex === index}" v-show="item.id !== minemapid && item.confirmStatus === 0">
            <div class="circle-one" ref="circleRef"></div>
            <div class="li-cont">
              <div class="li-ti">
                <div class="li-address">{{item.address}}</div>
                <div class="money">{{item.everytotal}} π</div>
              </div>
              <div class="money-box">
                <div class="li-num">{{item.id}}</div>
                <div class="time">{{$changeDate(item.unlockLog , '.', 5)}}</div>
              </div>
            </div>
          </li>
        </ul>
      </cube-scroll>
      <div class="empty-data" v-show="!list.length">
        <div class="noData"><img src="../../assets/img/order/no_data.svg"></div>
        <p class="text">{{$t('common.noData')}}</p>
      </div>
    </div>
    <div class="btn-add">
      <div class="btn-del" @click="submit()">{{$t('mergeMap.text11')}}</div>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog'
  export default {
    data() {
      return{
        emptyDatas:false,
        disabelIndex: 0,
        checkFlag: 0,
        titleName: this.$t('mergeMap.text12'),
        list: [
          // {title: '我是藏宝地址我是藏宝地址我是藏宝地址阿萨德阿萨德阿萨德',money: '3π',time: '2018.11.22',checkFlag:false,},
          // {title: '我是藏宝地址我是藏宝地址我是藏宝地址阿萨德阿萨德阿萨德',money: '3π',time: '2018.11.22',checkFlag:true,},
          // {title: '我是藏宝地址我是藏宝地址我是藏宝地址阿萨德阿萨德阿萨德',money: '3π',time: '2018.11.22',checkFlag:false,}
          ],
        pageIndex: 1,
        pageSize: 10,
        everytotal: 0,
        mytotal: 0,
        minemapid: '',
        myid: '',
      }
    },
    created() {
      if (/iphone/gi.test(navigator.userAgent)) {
        if (screen.height >= 812) {
          document.documentElement.classList.add('iosx-app')
        } else {
          document.documentElement.classList.add('ios-app')
        }
      }
      if(this.$route.query.everytotal) {
        this.everytotal = this.$route.query.everytotal
        this.minemapid = this.$route.query.minemapid
      }
      this.getData()
    },
    methods: {
      getData() {
        this.$fetch.post(`${this.$api2}pai/queryMyMineMapList`,{
          status: 2,
          // isComplaint: 1,
          page: this.pageIndex,
          pagesize: this.pageSize
        }).then(res => {
          let _list = res.data
          let newList = []
          _list.forEach(item => {
            if(item.id !== Number(this.minemapid) && item.confirmStatus === 0) {
              newList.push(item)
            }
          })
          if (newList.length) {
            this.list.push(...newList)
            this.pageIndex++
          } else {
            this.$refs.scroll.forceUpdate()
          }
          this.mytotal =  this.list[0].everytotal
          this.myid = this.list[0].id
        }).catch(err => {
          console.log(err)
        })
      },
      checkOne(index,everytotal, myid) {
        this.disabelIndex = index
        this.mytotal = everytotal
        this.myid = myid
      },
      onPullingDown () {
        this.getData()
      },
      fourNumber(value,n = 4) {
        value = parseFloat(value)
        let str = ''
        if (value) {
          const index = String(value).indexOf('.')
          if (index > 0) {
            const arr = String(value).split('.')
            if (arr[1].length >= n) {
              str = `${arr[0]}.${arr[1].slice(0, n)}`
            } else {
              str = value.toFixed(n)
            }
          } else {
            str = value.toFixed(n)
          }
          return str
        } else {
          return '0.00'
        }
      },
      // 确定合并
      submit() {
        let sum = this.fourNumber((Number(this.mytotal)*1000 + Number(this.everytotal * 0.9)* 1000) / 1000)  // 合并后的金额  =  本页面的mytotal + 上个页面的everytotal*0.9
        // console.log((Number(this.mytotal)*1000 + Number(this.everytotal * 0.9)* 1000) / 1000)
        Dialog({
          content: this.$t('mergeMap.text13')+ sum + this.$t('mergeMap.text14'),
          type: this.$t('mergeMap.text8'),
          okText: this.$t('mergeMap.text9'),
          okFn: () => {
            this.$fetch.post(`${this.$api2}pai/manualMerge`,{
              firstId:  this.minemapid,
              secondId: this.myid
            }).then(res => {
              if(res.status === 'success') {
                Dialog({
                  content: this.$t('mergeMap.text10'),
                  okText: this.$t('mergeMap.text11'),
                  okFn: () => {
                    this.$router.push({
                      path: '/findDetails',
                      query: {
                        minemapid: this.minemapid
                      }
                    })
                  }
                })
              } else {
                this.toastD(res.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          },
        })
      }
    },
    computed: {
      options () {
        return {
          pullUpLoad: {
            txt: {
              more: this.$t('mergeMap.text1'),
              noMore: this.$t('mergeMap.text2')
            }
          }
        }
      }
    },
    components: {
      mFixedTop: () => import('@/components/mFixedTop'),
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .iosx-app{
    .m-c{
      top 2rem
    }
    .btn-add{
      height 1.2rem
      padding-bottom .3rem
    }
  }
  .circle-one{
    width .4rem
    height .4rem
    border 1px solid #999
    border-radius 50%
    position: relative;
  }
  .m-c{
    width: 100%;
    overflow: hidden;
    position: fixed;
    top 1.3rem;
    left: 0;
    bottom 1rem
    .ul-list{
      padding .3rem
      .li-items{
        display flex
        align-items center
        margin-bottom .2rem
        &.changeFlag{
          .circle-one{
            background-color: #FFE600;
            border: none
            width: .4rem;
            height: .4rem;
            border-radius: 100%;
            background: url("./check.png") no-repeat center;
            background-size: 100%;
            transition: background-color .3s linear;
          }
        }
        .li-cont{
          margin-left .2rem
          width 90%
          border-radius 8px
          background-color #f7f7f7
          padding .3rem
          .li-ti{
            display flex
            justify-content space-between
            font-size .28rem
            color #000
            line-height 1.3
            .li-address{
              margin-right .1rem
              width 75%
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .money{
              text-align right
              width 25%
              font-size .28rem
              color #b79961
            }
          }
          .money-box{
            margin-top .2rem
            display flex
            justify-content space-between
            .li-num{
              font-size .28rem
              color #000
            }
            .time{
              font-size .28rem
              color #999
            }
          }
        }
      }
    }
  }
  .btn-add{
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    height: 1rem;
    border 1px solid #b79961
    font-size: .32rem;
    color: #b79961;
  }
</style>
