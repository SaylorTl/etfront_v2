
<template>
    <!-- component/dialog/index.js
@template
    <dialogs ref='dialogs' :dataOption='dataOption' initopen>
        <template slot="head"> 自定义内容</template>
        <template slot="content"> 自定义内容</template>
        <template slot="footer"> 自定义内容</template>
    </dialogs>
@example
this.$refs.dialogs
this.$refs.dialogs.close()  关闭方法
this.$refs.dialogs.open()   打开方法
@desc
接收@param {dataOption} [Object] 配置参数
例：
initopen:false,       // 组件初始化直接打开（也可以单独调用open方法打开）     
    dataOption: {
      closeicon: true,    // 布尔值，是否显示关闭右上角按钮
      buttonbox:false,    // 布尔值，是否显示button盒子
      title: '',          // 标题
      msg: '',            // 消息
      statusicon:0,       // 消息状态icon 1成功  2失败  3警告  0不使用icon
      footerbgicon:true   // 布尔值，是否显示底部背景图片
    },

 @扩展
一共有三个插槽，
插槽1：
head   放置在head盒子内容后面
 插槽2：
content 放置在content盒子内容后面
插槽3：
footer 放置在footer盒子内容后面 -->
    <div class='full-box' v-if="show" :style='closeanimation'>
        <div class='dialog-box'>
            <img class='close' v-if="data.closeicon" @click="close" src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190709/close.svg'>
            <div class='head'>
                {{data.title}}
                <slot name="head"></slot>
            </div>
            <div class='content'>
                {{data.msg}}
                <slot name="content"></slot>
                <div v-if="data.buttonbox" class="button-box flex-row">
                    <div @click="action(false)" class="cancel touch">取消</div>
                    <div @click="action(true)" class="sure touch">确定</div>
                </div>
            </div>
            <div class='footer'>
                <img v-if="data.footerbgicon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'Dialogs',
    data() {
        return {
            show: false,
            data: {},
            closeanimation: ''
        }
    },
    props: {
        buttonbox: {
            type: Boolean
        },
        initopen: {
            type: Boolean
        },
        dataOption: {
            type: Object,
            default() {
                return {
                    closeicon: true,
                    buttonbox: false,
                    title: '',
                    msg: '',
                    statusicon: 0,
                    footerbgicon: true
                }
            }
        }
    },
    watch: {
        dataOption: {
            handler: function () {
                this.init();
            },
            immediate: true
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let initdata = this.dataOption;
            this.data = Object.assign({}, initdata);
            if (this.initopen) { this.show = true; }
        },
        action(t) {
            if (t) {
                this.$emit('sure', true);
                this.show = false;
            }
            this.show = false;
        },
        open() {
            this.show = true;
        },
        close() {
            this.show = false;
        }
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
