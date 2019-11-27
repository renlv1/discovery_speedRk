<template>
  <div class="star">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
const CLS_ON = 'on';

export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    itemClasses() {
      let result = [];
      let score = Math.floor(this.score)
      for (let i = 0; i < score; i++) {
        result.push(CLS_ON);
      }
      return result;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
      &.on
        width .3rem
        height .26rem
        margin-right .06rem
        background-image: url('./star.svg')
</style>
