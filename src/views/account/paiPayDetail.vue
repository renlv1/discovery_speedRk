<template>
    <div class="paiPayDetail">
      <mFixedTop :titleName="titleName"></mFixedTop>
        <div class="banner">
            <div class="all-box">
                <div class="all-top">{{$t('paiPay.text20')}}</div>
                <div class="money">{{mapData.paitotal | fourNumber}}</div>
            </div>
            <div class="number-box">
                <div class="number-top">{{$t('paiPay.text21')}}</div>
                <div class="number-b">{{mapData.presentCount - mapData.alreadyPresentCount}}</div>
            </div>
        </div>
       <ul class="tab-ul">
           <li class="li-tab" v-for="(item,index) in tabArr" @click="changeFn(index)" :key="index">
               <div class="li-t" :class="{tabLi: tabShow === index}">{{item}}</div>
               <div :class="{tabActive: tabShow === index}"></div>
           </li>
       </ul>
        <ul class="parent-ul">
            <cube-scroll
                v-show="list.length"
                ref="scroll"
                :options="options"
                :data="list"
                @pulling-up="onPullingDown">
                <li v-for="(item,index) in list" :key="index" class="li-item">
                    <div class="li-top">
                        <div class="number">{{$t('paiPay.text22')}} {{item.presentNo}} {{$t('paiPay.text23')}}</div>
                        <div class="money">{{item.profitAmount}} π</div>
                    </div>
                    <div class="li-d">{{$t('paiPay.text24')}}{{$changeDate(item.mapPresentAt,'.')}}</div>
                </li>
            </cube-scroll>
        </ul>
      <div class="v-loading" v-show="loadShow">
        <cube-loading></cube-loading>
      </div>
        <div v-if="!list.length" class="empty">
            <img src="@/assets/img/common/empty.png" alt="">
            <p>{{$t('common.empty')}}</p>
        </div>
    </div>
</template>

<script>
  import mFixedTop from '@/components/mFixedTop'
    export default {
        data() {
            return{
                loadShow: false,
                mapData: JSON.parse(this.$route.query.mapData),
                titleName: this.$t('paiPay.text25'),
                tabArr: [this.$t('paiPay.text26'), this.$t('paiPay.text27')],
                tabShow: 0,
                list: [],
                waitPresentAmount: '', // 返还总金额
                presentCount: '', // 已还期数1
                payCurrency: '',
                variable: 'https://discoverypi.blob.core.windows.net/',
                status: 1, // 1未返还 2已返还
                pageIndex:1,
                pageSize: 10,
                profitUserType: 1 // 类型1买家 2商家
            }
        },
        components: {
          mFixedTop
        },
        computed: {
            options () {
                return {
                    pullUpLoad: {
                        txt: {
                            more: this.$t('common.loading'),
                            noMore: this.$t('common.noMore')
                        }
                    }
                }
            }
        },
        methods: {
            getData () {
              this.$fetch.post(`${this.$api}shopMine/getOrderPresentMapRecordList`,{
                    orderId: this.mapData.id,
                    status: this.status,
                    page: this.pageIndex,
                    pageSize: this.pageSize,
                    profitUserType: this.$route.query.profitUserType
                }).then(res => {
                    if(res.status === 'success'){
                        this.loadShow = false
                        // this.waitPresentAmount = res.data.bountyOrderRecord.waitPresentAmount
                        // this.presentCount = res.data.bountyOrderRecord.presentCount
                        // this.payCurrency = res.data.bountyOrderRecord.payCurrency
                        const _list = res.data
                        if(_list.length) {
                            this.list.push(..._list)
                            this.pageIndex++
                        } else {
                            this.$refs.scroll.forceUpdate()
                        }
                    } else {
                        this.loadShow = false
                        this.toastD(res.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            changeFn(index) {
                this.tabShow = index
                this.status = index + 1
                this.pageIndex = 1
                this.list = []
                this.loadShow = true
                this.getData()
            },
            onPullingDown () {
                this.getData()
            }
        },
        mounted () {
            this.getData()
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .ios
        .paiPayDetail
            padding-top: 64px
    .iosx
        .paiPayDetail
            padding-top: 89px
    .paiPayDetail
        background-color #fff
>>>.app-header{
    border-bottom none
    background-color #3495f1
    color #fff
}
.banner{
    padding .8rem 0 1rem 0
    display flex
    width 100%
    background-color #ffb64b
    .all-box{
        border-right 2px solid #8dc0f1
        flex 1
        padding-left .6rem
        .all-top{
            font-size .28rem
            color #fff
            opacity .6
            margin-bottom .24rem
        }
        .money{
            font-size .38rem
            color #fff
        }
    }
    .number-box{
        flex 1
        padding-left 1rem
        .number-top{
            font-size .28rem
            color #fff
            opacity .6
            margin-bottom .24rem
        }
        .number-b{
            font-size .38rem
            color #fff
        }
    }
}
.tab-ul{
    display flex
    background-color: #fff;
    width: 100%;
    height 1.3rem
    border-radius: 22px;
    margin-top -.5rem
    .li-tab{
        padding-top .5rem
        flex 1
        text-align center
        display flex
        flex-direction column
        align-items center
        .li-t{
            font-size .28rem
            color #060f26
            &.tabLi {
                color #ffb64b
            }
        }
        .tabActive{
            margin-top .15rem
            width 1rem
            border-radius 2px
            height .04rem
            background #ffb64b
        }
    }
}
.parent-ul{
    width: 100%;
    overflow: hidden;
    position: fixed;
    top: 5rem;
    left: 0;
    bottom: 0;
    padding 0 .3rem
    .li-item{
        padding .2rem 0
        border-bottom 1px solid #eeeff1
        .li-top{
            display flex
            justify-content space-between
            margin-bottom .2rem
            .number{
                font-size .28rem
                color #060f26
            }
            .money{
                font-size .28rem
                color #ffb64b
            }
        }
        .li-d{
            font-size .28rem
            color #b2b2b2
        }
    }
}
</style>
