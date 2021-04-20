<template>
    <div class="ui-loading" v-if="loadingShow" :style="style">
        <div class="ui-loading-wrapper" :class="{'mask':showMask}">
            <div class="ui-loading-pic">
                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/loading-icon.svg">
                <div class="my-loading-point">
                    <div class="my-loading-point-item"></div>
                    <div class="my-loading-point-item"></div>
                    <div class="my-loading-point-item"></div>
                </div>
            </div>
            <div class="ui-loading-text" :style="showMask?'color:#fff;':'color:#222;'">
                {{text}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'my-loading',
    props:['isShow'],
    components:{},
    data(){
        return {
            loadingShow:false,
            text:'',
            style:'position:fixed',
            showMask:false
        }
    },
    beforeCreate() { },
    created() { },
    beforeMount() { },
    mounted(){
        if(this.isShow){
            this.loadingShow = true;
        }
    },
    beforeUpdate() { },
    updated() {},
    beforeDestroy() { },
    destroyed() {
        this.$el.remove();
    },
    watch: {
        isShow(val){
            if(!val){
                this.loadingShow = false;
            }
        }
    },
    directives: {},
    methods: {
        changeStyle(){
            this.style = "position:absolute";
        },
        mask(){
            this.showMask = true;
        },
        show(options){
            this.text = options.content;
            let duration = 0;
            if(options.duration){
                duration = options.duration
            }
            if(options.mask){
                this.mask();
            }
            setTimeout(() => {
                this.loadingShow = true;
            },duration)
        },
        hide(){
            this.loadingShow = false;
        }
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>

