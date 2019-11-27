<template>
  <div class="withdrawalOrder-wrap">
    <no-open v-if="statusNumber === -1 || Number($route.query.statusCode) === -1"></no-open>
    <order-template v-if="statusNumber === 1 || Number($route.query.statusCode) === 1"></order-template>
    <status v-if="statusNumber === 0
    || statusNumber === 2
    || statusNumber === 3
    || statusNumber === 4
    || Number($route.query.statusCode) === 0
    || Number($route.query.statusCode) === 2
    || Number($route.query.statusCode) === 3
    || Number($route.query.statusCode) === 4">

    </status>
  </div>
</template>

<script>
import {share} from "../../api/share"
export default {
  data() {
    return {
      noOpen: false,
      isShare: false,
      statusNumber: '',
      status: false,
      titleName: this.$t('sharer.title'),
    }
  },
  components: {
    noOpen: () => import('@/views/notOpenShare/notOpenShare.vue'),
    status: () => import('@/views/notOpenShare/auditSharer.vue'),
    orderTemplate: () => import('@/views/sharer/orderTemplate')
  },
  computed: {},
  created() {
    if (this.$route.query.statusCode) {
      this.$store.commit('SET_SHARE_STATUS', this.$route.query.statusCode)
    }
    this.chooseStatus()
  },
  destroyed() {
    this.timer = null
  },
  mounted() {
  },
  methods: {
    chooseStatus() {
      let address = this.$store.state.address
      share(address).then((res) => {
        if (res.data.data.status) {
          this.statusNumber = res.data.data.status
        } else {
          this.statusNumber = -1
        }
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @width: 100%;
  .withdrawalOrder-wrap {
    width: 100%;
  }
</style>
