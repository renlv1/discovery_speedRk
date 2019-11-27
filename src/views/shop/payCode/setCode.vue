<template>
  <div class="set-code" v-if="isSetCode">
    <div class="app-header">
      <div class="back" @click="hidePage">
        <div class="goback-icon"></div>
      </div>
      <div class="title">{{title}}</div>
    </div>
    <div class="form">
      <ul class="uls-one">
        <li @click="showCurrency">
          <div class="title">{{$t('code.text60')}}</div>
          <div class="input-box">
            <input style="color: rgb(255, 182, 75)" type="text" v-model.trim="currency" disabled>
            <div class="go-icon"><img src="../img/go.png" /></div>
          </div>
        </li>
        <li>
          <div class="title">{{$t('code.text61')}}</div>
          <div class="input-box">
            <input type="text" v-model="profitRate" :placeholder="$t('code.text62')" />
          </div>
        </li>
      </ul>
    </div>
    <div class="btn" @click="save">{{$t('hiddenSetting.text13')}}</div>
    {{flag}}
    <!-- 价格币种 -->
    <currencyData v-show="isCurreny" @goback="goback" :currencyIndex="currentIndex"></currencyData>
  </div>
</template>

<script>
import currencyData from '../currencyData.vue'

export default {
  components: {currencyData},
  name: "setCode",
  props: {
    title: {
      type: String
    },
    flag: {
      type: String
    },
    currencyText: {
      type: String
    },
    currencyIndex: {
      type: Number,
    }
  },
  data() {
    return {
      isSetCode: false,
      isCurreny: false,
      profitRate: '',
      currency: '',
      currentIndex: 0
    }
  },
  mounted() {
  },
  methods: {
    hidePage() {
      this.$emit('hidePage')
    },
    showCurrency() {
      this.isCurreny = true
    },
    goback(item) {
      this.currency = item
      if (this.currency === 'USD') {
        this.currentIndex = 1
      } else if (this.currency === 'CNY') {
        this.currentIndex = 2
      } else {
        this.currentIndex = 0
      }
      this.isCurreny = false
    },
    save() {
      let codeType
      let acceptCurrency
      this.title === this.$t('code.text63') ? codeType = 1 : codeType = 2
      this.currency === 'π' ? acceptCurrency = 'PAI' : acceptCurrency = this.currency
      this.$http.post(`${this.$api}shopMine/modifyPayCode?codeType=${codeType}&acceptCurrency=${acceptCurrency}&profitRate=${this.profitRate}&pvRate=0`).then((res) => {
        if (res.data.status === 'success') {
          this.toastD(this.$t('shippingAddress.text17'))
          this.$emit('checkIsOpenER')
          setTimeout(() => {
            this.isSetCode = false
          }, 500)
        }
      })
    },

    getOpenErStatus() {
      let codeType
      this.title === this.$t('code.text63') ? codeType = 1 : codeType = 2
      this.$http.post(`${this.$api}shopMine/getPayCode?codeType=${codeType}`).then((res) => {
        let merchant = res.data.data.merchantPayCode
        merchant.acceptCurrency === 'PAI' ? this.currency = 'π' : this.currency = merchant.acceptCurrency
        if (merchant.acceptCurrency === 'USD') {
          this.currentIndex = 1
        } else if (merchant.acceptCurrency === 'CNY') {
          this.currentIndex = 2
        } else {
          this.currentIndex = 0
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ios {
    .form {
      top 60px
    }
  }

  .iosx {
    .form {
      top 90px
    }
  }

  .set-code
    width 100%
    position fixed
    bottom 0
    top 0
    z-index 999
    background-color rgb(247, 247, 247);
    overflow hidden
    .form
      position absolute
      width 100%
      background-color #fff
      padding 0 .3rem
      .uls-one {
        .precet {
          font-size .28rem
          margin-left: .2rem;
        }
        .li-item {
          border-bottom: none;
          .title {
            color: #060f26;
          }
        }
        li {
          display: flex;
          height: 1rem;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e8e8e8;
          &:last-child {
            border-bottom: none;
          }
          .title {
            font-size: .28rem;
            color: #060f26;
          }

          .input-box {
            display: flex;
            align-items: center;

            .phone {
              width: 45%;
            }

            .area-code {
              text-align: right;
              font-size: .28rem;
              color: #3495f1;
              flex: 1;
              margin-right: .2rem;
            }

            .phone {
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
              height: 1rem
              text-align: right;

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

  .iosx {
    .btn {
      height 1.3rem
      line-height 1.3rem
    }
  }

  .btn {
    position fixed
    bottom 0
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    background: rgb(255, 182, 75);
    font-size: .32rem;
  }
</style>
