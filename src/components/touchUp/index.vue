
<template>
    <div class="touch-box" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
        <slot></slot>
    </div>
</template>
<script>

export default {
    name: 'touchUp',
    data() {
        return {
            start: {}
        }
    },
    mounted() {
    },

    methods: {

        touchstart(e) {
            this.start = e.changedTouches[0];
            //  console.log('touchend', e, dom.scrollHeight, dom.scrollTop);
        },
        touchmove(e) {
            //   console.log('touchmove', e);
        },
        touchend(e) {
            let dom = document.querySelector(".touch-box")
            let end = e.changedTouches[0];
            let num = this.start.screenY - end.screenY;
            let bottom = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
            if (typeof (num) == 'number' && num > 100 && bottom < 20) {
                this.$emit('touchUp')
            }
          //  console.log('touchend', bottom);
        },
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
