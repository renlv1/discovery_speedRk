<template>
  <div class="load-more-box">
    <div class="loading-img">
      <img src="../assets/img/common/loading.gif">
    </div>
    <p class="desc">{{$t('transfer.text7')}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {}
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  //  加载中的样式
  .load-more-box
    margin-top 2rem
    padding-top: .5rem
    .desc
      font-size: .24rem
      color: #999;
      text-align: center;
      margin-top: .2rem;
    .loading-img
      width: .8rem;
      height: .8rem;
      margin: .3rem auto 0;
      img
        width: 100%
        height: 100%
</style>
