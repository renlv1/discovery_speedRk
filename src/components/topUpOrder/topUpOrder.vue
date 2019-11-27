<template>
  <div class="topUpOrder">
    <div class="v-content-wrapper">
      <cube-tab-bar v-model="selectedLabel" @click="changeHandler">
        <cube-tab v-for="item in tabs" :label="item.label" :key="item.label"></cube-tab>
      </cube-tab-bar>
      <cube-tab-panels v-model="selectedLabel">
        <slot></slot>
      </cube-tab-panels>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    tabs: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      selectedLabel: '',
      defaultLabel: ''
    }
  },
  mounted() {
    this.selectedLabel = this.tabStates.head === 0 ? this.tabs[0].label : this.tabs[1].label
  },
  methods: {
    changeHandler(label) {
      this.$emit('currentStatus', label)
    }
  },
  computed: {
    ...mapGetters([
      'label',
      'voteLabel'
    ]),
    tabStates() {
      return this.$store.state.votePageState
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.v-content-wrapper
  padding .4rem 0
</style>
