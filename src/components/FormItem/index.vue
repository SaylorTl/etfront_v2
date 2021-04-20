<template>
    <div class="ui-form-item"
         :class="(arrow && border)?'border active':((!arrow && border)?'border':(arrow && !border)?'arrow':'')"
         @click="handleClick">
        <div class="ui-form-item-left">
            <div class="ui-form-item-label">
                <div v-if="!!label">{{label}}</div>
                <slot name="label"
                      v-else></slot>
            </div>
            <div class="ui-form-item-content">
                <div v-if="!!content">{{content}}</div>
                <slot name="content"
                      v-else></slot>
            </div>
        </div>
        <div class="ui-form-item-right"
             v-if="arrow">
            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/arrow-right.svg">
        </div>
    </div>
</template>
<script>
export default {
    name: "form-item",
    props: {
        label: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            default: ""
        },
        border: {
            type: Boolean,
            default() {
                return true;
            }
        },
        arrow: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    created() {
        
    },
    methods: {
        handleClick() {
            if(this.arrow){
                this.$emit("handleClick");
            }else{
                return;
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>

