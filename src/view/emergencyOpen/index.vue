<template>
    <div class="emergency-open page-wrapper">
        <x-group>
            <x-popuppicker
                :title="carObj.title"
                :data="carObj.pickerList"
                v-model="car"
                @on-show="onShow"
                @on-hide="onHide"
                @on-change="onChange"
                placeholder="请选择"
            />
            <x-popuppicker
                :title="parkingLotObj.title"
                :data="parkingLotObj.pickerList"
                v-model="parkingLot"
                @on-show="onShow"
                @on-hide="onHide"
                @on-change="onChange"
                placeholder="请选择"
            />
        </x-group>
        <div class="emergency-open__btn-container">
            <x-xbutton class="btn" @click.native="handleApply">立刻申请</x-xbutton>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            carObj: {
                title: '车辆',
                pickerList: [
                    ['小米', 'iPhone', '华为', '情怀', '三星', '其他', '不告诉你']
                ]
            },
            car: ['iPhone'],
            parkingLotObj: {
                title: '停车场',
                pickerList: [
                    ['小米', 'iPhone', '华为', '情怀', '三星', '其他', '不告诉你']
                ]
            },
            parkingLot: ['iPhone'],
        }
    },
    methods: {
        onShow() {},
        onHide() {},
        onChange() {},
        handleApply() {
            this.$router.push('/emergency-open/code')
        }
    }
}
</script>
<style lang="less">
.emergency-open {
    .vux-no-group-title {
        margin-top: 0;
    }
    .weui-cells:before, .weui-cells:after {
        border: none
    }
    .weui-cell {
        padding-left: 0;
        padding-right: 0;
        font-size: 0.28rem;
        color: #303030;
        font-weight: bold;
    }
    .vux-cell-box:not(:first-child):before {
        left: 0;
    }
    &__btn-container {
        margin-top: 0.5rem;
    }
}
</style>
