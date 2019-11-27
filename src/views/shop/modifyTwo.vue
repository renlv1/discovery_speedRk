<template>
  <div class="wrapper">
    <m-fixed-top :titleName="titleName" :isGoNumber="true" @goPath="goPath" :isGoBack="isGoBack"></m-fixed-top>
    <ul class="info-wrapper">
      <li>
        <span class="li-left">{{$t('addAddress.text37')}}</span>
        <input v-model="merchantName" :placeholder="$t('notMerchant.text34')" class="li-right flex-left" maxlength="25"/>
      </li>
      <li>
        <span class="li-left">{{$t('addAddress.text38')}}</span>
        <div class="li-right flex-left">
          <input v-model="legalName" :placeholder="$t('notMerchant.text43')" />
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('addAddress.text39')}}</span>
        <div class="li-right flex-bew" @click="showMerType(0)">
          <span v-if="phoneCode === ''">{{info.phoneCode ? `+${info.phoneCode}` : '+86'}}</span>
          <span v-if="phoneCode !== ''">{{phoneCode}}</span>
          <img src="../../assets/img/common/goTo-path.svg" />
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('addAddress.text40')}}</span>
        <div class="li-right flex-left">
          <input v-model="mobile"  :placeholder="$t('notMerchant.text45')" />
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('addAddress.text41')}}</span>
        <div class="li-right flex-bew li-black" @click="showMerType(1)">
          <input v-model="merType" :placeholder="$productType(info.merType)" disabled />
<!--          <p>{{merType ? merType : $productType(info.merType)}}</p>-->
          <img src="../../assets/img/common/goTo-path.svg" />
        </div>
      </li>
      <li>
        <span class="li-left">{{$t('addAddress.text42')}}</span>
        <div class="li-right flex-bew li-black" @click="showMerType(2)">
          <input v-model="applyType" :placeholder="type(info.applyType)" disabled/>
<!--          <p>{{applyType ? applyType : type(info.applyType)}}</p>-->
          <img src="../../assets/img/common/goTo-path.svg" />
        </div>
      </li>
      <li @click="gotoMap" v-if="applyTypeIndex === 1" >
        <span class="li-left">{{$t('addAddress.text43')}}</span>
        <div class="li-right flex-bew li-black">
          <input v-model="merchantAddress" :placeholder="info.merchantAddress" disabled/>
          <img src="../../assets/img/common/goTo-path.svg" />
        </div>
      </li>
      <li v-if="applyTypeIndex === 1" class="li-address">
        <span class="li-left flex-top">{{$t('addAddress.text44')}}</span>
        <div class="li-right flex-left no-bottom">
          <div class="area-box">
            <textarea v-model.trim="detailedAddress" :placeholder="$t('notMerchant.text39')" maxlength="100" />
            <span class="textNum">{{calcTextLen ? calcTextLen: 0}}/100</span>
          </div>
        </div>
      </li>
      <li v-if="applyTypeIndex === 0">
        <span class="li-left flex-top">{{$t('addAddress.text45')}}</span>
        <div class="li-right flex-bew">
          <input v-model="shopUrl" :placeholder="$t('notMerchant.text37')"/>
        </div>
      </li>
    </ul>
    <mer-type v-show="isShowMerType" :arr="dataSource" @chooseItem="clickItem"></mer-type>
    <m-map v-if="mapShow" @hideMap="hideMap" @positon2="positon2"></m-map>
    <div class="btn common-btn" @click="save" v-if="!isShowMerType">
      <div class="btn-sure">{{$t('addAddress.text46')}}</div>
    </div>
  </div>
</template>

<script>
import mFixedTop from '@/components/mFixedTop'
import merType from './merType'
import mMap from './notOpen/map'

export default {
  name: "modifyTwo",
  components: {mFixedTop, merType, mMap},
  data() {
    return {
      shopUrl: '',
      mapShow: false,
      isGoBack: true,
      titleName: this.$t('addAddress.text47'),
      info: {},
      isShowMerType: false,
      dataSource: [],
      flag: 1,
      merType: '',
      applyType: '',
      detailedAddress: '',
      merchantName: '',
      legalName: '',
      phoneCode: '',
      mobile: '',
      merchantAddress: '',
      merTypeIndex: '',
      applyTypeIndex: ''
    }
  },
  computed: {
    calcTextLen() {
      let len
      if (this.detailedAddress !== '') {
        len = this.detailedAddress.length
      }
      return len
    }
  },
  mounted() {
    this.getMerchantInfo()
  },
  methods: {
    gotoMap () {
      this.mapShow = true
    },
    hideMap () {
      this.mapShow = false
    },
    positon2 (pos, address) {
      this.latitude = pos.lat
      this.longitude = pos.lng
      this.mapShow = false
      this.merchantAddress = address
    },
    clickItem(index) {
      if (this.flag === 1) {
        this.merType = this.dataSource[index]
        this.merTypeIndex = index
      } else if (this.flag === 2) {
        this.applyType = this.dataSource[index]
        this.applyTypeIndex = index
      } else {
        this.phoneCode = this.dataSource[index]
      }
      this.isShowMerType = false
    },
    goPath() {
      if (this.isShowMerType) {
        this.isShowMerType = false
      } else {
        this.$router.push({
          path: '/userInformation',
          query: {
            merchantId: this.$route.query.id
          }
        })
      }
    },
    showMerType(num) {
      this.isShowMerType = true
      this.flag = num
      if (num === 1) {
        this.dataSource = this.$t('shops.classifyData1')
      } else if (num === 2) {
        this.dataSource = [this.$t('addAddress.text48'), this.$t('addAddress.text49')]
      } else if (num === 0) {
        let codeArr = []
        for (let key in this.$mockData) {
          codeArr.push(this.$mockData[key].code)
        }
        this.dataSource = codeArr
      }
    },
    type(num) {
      if (num === 1) {
        return this.$t('addAddress.text48')
      } else {
        return this.$t('addAddress.text49')
      }
    },
    getMerchantInfo() {
      let id = this.$route.query.id
      this.$http.post(`${this.$api}shopMine/getMerchantInfoByMerchantId?merchantId=${id}`).then(res => {
        if (res.data.status === 'success') {
          this.info = res.data.data
          this.legalName = this.info.legalName
          this.detailedAddress = this.info.detailedAddress
          this.mobile = this.info.mobile
          this.shopUrl = this.info.shopUrl
          this.merchantName = this.info.merchantName
          if(this.info.applyType === 1) {
            this.applyTypeIndex = 0
          } else {
            this.applyTypeIndex = 1
          }
        }
      })
    },
    save() {
      let merchantName = this.merchantName !== '' ? this.merchantName : this.info.merchantName
      let legalName = this.legalName !== '' ? this.legalName : this.info.legalName
      let phoneCode = this.phoneCode !== '' ? this.phoneCode : this.info.phoneCode
      let mobile = this.mobile !== '' ? this.mobile : this.info.mobile
      let merType = this.merType !== '' ? this.merTypeIndex + 1 : this.info.merType
      let applyType = this.applyType !== '' ? this.applyTypeIndex + 1 : this.info.applyType
      let merchantAddress = this.merchantAddress ? this.merchantAddress : this.info.merchantAddress
      let detailedAddress = this.detailedAddress ? this.detailedAddress : this.info.detailedAddress
      let longitude
      typeof this.longitude !== 'undefined' ? longitude = this.longitude : longitude = this.info.longitude
      let latitude
      typeof this.latitude !== 'undefined' ? latitude = this.latitude : latitude = this.info.latitude
      let shopUrl = this.shopUrl !== '' ? this.shopUrl : this.info.shopUrl
      this.$fetch.post(`${this.$api}shopMine/modifyMerchantAudit`, {
        merchantName: merchantName,
        legalName: legalName,
        phoneCode: phoneCode,
        mobile: mobile,
        merType: merType,
        applyType: applyType,
        merchantAddress: merchantAddress,
        detailedAddress: detailedAddress,
        shopUrl: shopUrl,
        longitude: longitude,
        latitude: latitude
      }).then(res => {
        if(res.status === 'success') {
          setTimeout(() => {
            this.$router.push({
              path: '/reason',
              query: {
                bountyMerchant: JSON.stringify(this.info)
              }
            })
          }, 500)
        } else {
          this.toastD(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    color #999
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color #999
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color #999
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color #999
  }
  .wrapper
    /*min-height 100vh*/
    position relative
    overflow auto!important
    .info-wrapper
      font-size .28rem
      background-color #fff
      margin-bottom 15px
      li
        width 100%
        justify-content space-between
        line-height .6rem
        display flex
        flex-direction row
        align-items center
        padding 0 .3rem
        &.li-address
          align-items flex-start
        .box-wrapper
          display flex
          flex-direction row
          align-items center
        .flex-left
          display flex
          flex-direction column
          justify-content flex-start
        .flex-bew
          align-items center
          justify-content space-between !important
          img
            width 15px
            height 15px
        .no-bottom
          border-bottom none !important
        .li-left
          color rgb(153, 153, 153)
          height auto
          width 20%
          margin-right 12px
        .hasTop
          display flex
          justify-content flex-start
        .li-right
          width: 100%
          display flex
          flex 1
          border-bottom 1px solid #f1f1f1
          justify-content flex-end
          padding .2rem 0
          color #000
          &.li-black{
            input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
            /* WebKit browsers */
            color #000
          }
            input:-moz-placeholder, textarea:-moz-placeholder {
              /* Mozilla Firefox 4 to 18 */
              color #000
            }
            input::-moz-placeholder, textarea::-moz-placeholder {
                    /* Mozilla Firefox 19+ */
                    color #000
                  }
            input:-ms-input-placeholder, textarea:-ms-input-placeholder {
              /* Internet Explorer 10+ */
              color #000
            }
          }
          input
            flex 1
          .area-box
            position relative
            width 100%
            height: 2.8rem
            border 1px solid #eee
            textarea
              margin .1rem
              padding: .22rem .2rem 0 .3rem 0
              width: 96%
              height: 2rem
            .textNum
              position absolute
              right 10px
              bottom 0
              /*margin: .2rem .2rem .15rem 0*/
          .img
            padding 0
.btn {
  position: fixed
  bottom: 0
  left: 0
  width: 100%
  background-color: rgb(255,182,75)
  color #fff
  font-size: .28rem
  z-index: 50
  .btn-sure{
    width: 100%
    height: 1rem
    display: flex
    align-items center
    justify-content center
  }
}
</style>
