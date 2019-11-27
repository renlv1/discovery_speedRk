<template>
    <!-- 底部弹窗层组件 -->
    <div>
        <!-- 弹出层 -->
        <div :class="{'CustomPopup':showCustomPopup}"></div>
        <div class="CustomPopupContent " :class="{'CustomPopupContentShow':showCustomPopup}">
            <slot name="PoperContent"></slot>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        name: 'commonPopup',
        data() {
            return {
                showCustomPopup: false,
            }
        },
        methods: {
            showCustom() {
                this.showCustomPopup = true
            },
            closeCustom() {
                this.showCustomPopup = false
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .CustomPopupContent
        position fixed
        bottom 0
        left 30px
        right 30px
        transition all 0.3s ease
        transform translateY(100%)
        z-index 3000
        text-align center
    .CustomPopupContentShow
        transform: translateY(-50%)
</style>
