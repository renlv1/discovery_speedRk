<template>
  <div class="container">
    <div v-show="!showList">
      <div>
        <mFixedTop :titleName="titleName"></mFixedTop>
        <ul>
          <li>
            <span class="left">{{$t('sellShip.text1')}}：</span>
            <div class="right" @click="showCompanyList">
              <input v-model="company" :placeholder="$t('sellShip.text2')" disabled />
              <div class="go-icon"><img src="./img/go.png" /></div>
            </div>
          </li>
          <li>
            <span class="left">{{$t('sellShip.text3')}}：</span>
            <input class="right" v-model="single" :placeholder="$t('sellShip.text4')" />
          </li>
        </ul>
      </div>
      <div class="btn" @click="sure" :class="{'notClick': company === '' || single === ''}">{{$t('sellShip.text5')}}
      </div>
    </div>
    <div class="list-box" v-show="showList">
      <div class="fixed-top">
        <mFixedTop :titleName="titleName1" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></mFixedTop>
        <div class="name nowrap" :class="{'padding-left': !isGoBack}">{{titleName2}}</div>
      </div>
      <ul class="list">
        <li @click="chooseCompany(item)" v-for="item in list" :key="item.index">{{item.expressName}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'

export default {
  name: "sellShip",
  components: {mFixedTop},
  data() {
    return {
      isGoBack: true,
      showListFlag: true,
      titleName1: '选择物流公司',
      titleName2: this.$t('paiOrder.text1'),
      titleName: this.$t('sellShip.text6'),
      company: '', // 物流公司
      companyId: '',
      single: '', //单号
      list: [],
      pageIndex: 1,
      showList: false
    }
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    showCompanyList() {
      this.showList = true
      this.showListFlag = false
    },
    goPath() {
      this.showList = false
      this.showListFlag = true
    },
    chooseCompany(item) {
      // 选择公司
      this.company = item.expressName
      this.companyId = item.id
      this.showList = false
      this.showListFlag = true
    },
    getCompanyList() {
      this.$http.post(`${this.$api}shopMine/queryExpressList?pageIndex=${this.pageIndex}&pageSize=20`).then((res) => {
        this.list = res.data.data
      })
    },
    sure() {
      if (this.company !== '' && this.single !== '') {
        let orderId = this.$route.query.orderId
        this.$http.post(`${this.$api}shopMine/startOrderExpress?orderId=${orderId}&expressId=${this.companyId}&expressCode=${this.single}`).then((res) => {
          if (res.data.status === 'success') {
            this.toastD(this.$t('sellShip.text7'))
            setTimeout(() => {
              this.$router.push({
                path: '/myOrderDetail',
                query: {
                  orderId: orderId,
                  activeIndex: 3,
                  flag: 1
                }
              })
            }, 500)
          } else {
            this.toastD(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .container {
    position relative
    height 100vh
    overflow scroll
    ul {
      margin-top 30px
      display flex
      flex-direction column
      align-items center
      padding 0 .3rem
      li {
        width 100%
        height 1rem
        line-height 1rem
        margin-bottom 10px
        align-items center
        font-size .3rem
        display flex
        flex-direction row
        .left {
          width 30%
        }
        .right {
          display flex
          flex 1
          flex-direction row
          justify-content space-between
          border-bottom 1px solid #ccc
          padding-bottom 5px
          .go-icon {
            margin-left: .2rem;
            width: 0.15rem;
            height: 0.28rem;

            img {
              display: block;
              width: 100%;
            }
          }

        }
      }
    }
    .btn {
      position absolute
      bottom 0
      height 1rem
      line-height 1rem
      width 100%
      text-align center
      background-color #ffb64b
      font-size .32rem
      color #fff
    }
    .notClick {
      background-color #ccc
    }
    .list-box {
      width 100%
      margin-top 0
      position absolute
      top 0
    }
    .list {
      li {
        margin-top 10px
        border-bottom: 1px solid #e8e8e8
        width 100%
        height 1rem
        line-height 1rem
        padding: 0 .3rem
        color #060f26
        font-size: .28rem
        margin-bottom 0 !important
      }
    }
  }
  .iosx{
    .btn{
      height 1.3rem
      line-height 1.3rem!important
    }
  }
</style>
