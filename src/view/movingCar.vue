<template>
    <div class="moving-car page-wrapper">
        <div class="moving-car__tips">
            <span>请输入车牌：</span>
            <span></span>
        </div>
        <div class="moving-car__picker-container">
            <plate-picker />
        </div>
        <div class="moving-car__form">
            <x-xinput
                title="您的手机号"
                text-align="right"
                :show-clear="false"
            />
            <x-xinput
                title="备注"
                text-align="right"
                placeholder="情况说明"
                :show-clear="false"
            />
        </div>
        <div class="moving-car__btn-container">
            <x-xbutton
                class="btn"
                @click.native="handleSubmit"
            >提交</x-xbutton>
        </div>
    </div>
</template>
<script>
import PlatePicker from 'components/PlatePicker'
export default {
    components: { PlatePicker },
    data() {
        return {}
    },
    methods: {
        handleSubmit() {
            this.$vux.confirm.show({
                title: '',
                content: '将电话通知车主，请等候来电！',
                confirmText: '我知道啦',
                showCancelButton: false,
                onCancel: () => {
                },
                onConfirm: () => {}
            })
        }
    }
}
</script>
<style lang="less">
.moving-car {
    padding-top: 0.8rem;
    .weui-label {
        color: #303030;
        font-weight: 600;
    }
    .weui-cell {
        padding-left: 0;
        padding-right: 0;
        &::before {
            left: 0;
        }
    }
    &__tips {
        color: #999;
    }
    &__picker-container {
        margin-top: 0.27rem;
    }
    &__form {
        margin-top: 0.3rem;
    }
    &__btn-container {
        margin-top: 1rem;
    }
}
</style>
