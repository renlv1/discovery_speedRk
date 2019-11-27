import Vue from 'vue'
import VHeader from './mFixedTop.vue'
const Vheader = {
  install: function (Vue) {
    // Vue.component()是用来注册全局组件的
    Vue.component('vHeader', VHeader)
  }
}
export default Vheader
