<template>
  <div class="footer">
    <ul>
      <li @click="gotoPagePay" tag="li"
          :class="{'router-link-active': this.$route.path === '/pay'}">
        <img class="normal" :src="require(`../assets/img/footer/1_shopping-icon.png`)" alt="">
        <img class="active" :src="require(`../assets/img/footer/2_shopping-icon.png`)" alt="">
        <p>{{$t('verify.text8')}}</p>
      </li>
      <li @click="gotoPage" tag="li"
          :class="{'router-link-active': this.$route.path === '/reason' || this.$route.path === '/openShop' || this.$route.path === '/notOpen'}">
        <img class="normal" :src="require(`../assets/img/footer/1.png`)" alt="">
        <img class="active" :src="require(`../assets/img/footer/1_active.png`)" alt="">
        <p class="foot-shop foot-two">商家</p>
      </li>
      <router-link to="/myShop" tag="li" excat class="foot-li" :class="{activeLi: footShow}">
        <img class="normal" src="../assets/img/footer/2.png" alt="">
        <img class="active" src="../assets/img/footer/2_active.png" alt="">
        <p class="foot-shop">我的</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      footShow: false,
      mStatusInfo: {}, // 开通商户的信息
      status: '',
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      this.$fetch.post(`${this.$api}shopMine/getMerchantInfo`).then(res => {
        if (res.status === 'success') {
          this.status = res.data.merchantInfo.status
          this.$store.commit('SET_MER_ID', res.data.merchantInfo.sourceUserAddress)
          if (res.data.merchantInfo.status !== 0) {
            this.$store.commit('SET_MERCHANT_INFO', JSON.stringify(res.data.merchantInfo))
            this.$store.commit('SET_STATUS', res.data)
            this.$store.commit('SET_IS_MERCHANT', true)
          } else {
            this.$store.commit('SET_IS_MERCHANT', false)
          }
        }
      })
    },
    gotoPagePay() {
      this.$router.push('/pay')
    },
    gotoPage() {
      // 商户状态 0:没有申请过(status=0 body有内容的话里面就是之前老商户的信息，body没有内容表示不是老商户) 1:待审核 2:审核通过 3:审核失败 4:冻结 5:删除
      const isMerchant = this.$store.state.isMerchant
      const status = this.$store.state.merchantInfo.status
      // console.log(status)
      this.$nextTick(() => {
        if (isMerchant) {
          if (this.status > -1) {
            if (this.status === 1 || this.status === 3 || this.status === 4 || this.status === 5) {
              this.$router.push({
                path: '/reason',
                query: {
                  merchatData: JSON.stringify(this.$store.state.mStatus)
                }
              })
            } else if (this.status === 2) {
              this.$router.push({
                path: '/openShop',
                query: {
                  merchatData: JSON.stringify(this.$store.state.mStatus),
                  count: this.$store.state.mCount
                }
              })
            } else if (this.status === 0) {
              this.$router.push('/notOpen')
            }
          }
        } else {
          this.$router.push('/notOpen')
        }
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    background: #fff;
    z-index: 2;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 1.1rem;
    color: #bdbdbd;
    ul {
      display: flex;
      align-items: center;
      text-align: center;
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        padding: .2rem 0 .14rem;
        line-height: 1;
        position: relative;
        &.router-link-exact-active, &.router-link-active {
          img {
            &.normal {
              display: none;
            }
            &.active {
              display: inline-block;
            }
          }
          .foot-two{
            /*padding-top: .15rem;*/
          }
          p {
            color: rgb(255,182,75);
          }
        }
        img {
          width: 0.4rem;
          height: 0.4rem;
          vertical-align: top;
          &.normal {
            display: inline-block;
          }
          &.active {
            display: none;
          }
        }
        p {
          padding-top: 0.15rem;
          font-size: 0.2rem;
        }
      }
    }
  }
</style>
