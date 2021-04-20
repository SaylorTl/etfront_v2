<template>
    <div class="page-one-card-pass-history">
        <div class="card ui-flex ui-flex-row ui-content-between">
            <div class="ui-flex ui-flex-col ui-items-start">
                <h3 class="ui-h3 ui-ft-color-30 ui-fs20">粤B·AD630</h3>
                <div class="ui-flex ui-flex-row page-one-card-pass-history-border">
                    <p class="page-one-card-pass-history-brand">奔驰</p>
                    <p class="page-one-card-pass-history-model">C63</p>
                </div>
            </div>
            <img class="page-one-card-pass-history-car" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png" alt="">
        </div>
        <div class="page-one-card-pass-history-from">
            <div class="ui-flex ui-items-center ui-content-between page-one-card-pass-history-from-item">
                <p class="ui-h3 ui-ft-color-666">授权用户</p>
                <p class="ui-fs14 ui-ft-color-30 ui-fw-600">深圳 185****2307</p>
            </div>
            <div class="ui-flex ui-items-center ui-content-between page-one-card-pass-history-from-item">
                <p class="ui-h3 ui-ft-color-666">授权时间</p>
                <p class="ui-fs14 ui-ft-color-30 ui-fw-600">2018/3/21</p>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../../utils/utils";
export default {
    name: 'one-card-pass-history',
    props: {
        lists: {
            type: Object,
            default: function () {
                return {}
            },
        },
    },
    methods: {
        getList() {
            utils.gateway(utils.api.vehicleAuthlists).then(res => {
                if (res && res.content) {
                    let list = res.content.lists || [];
                    this.carlist = [list.map((el) => { el.name = el.plate; el.value = el.plate; return el; })];
                }
            });
        },
        onItemClick() {
            this.$emit('onItem', {})
        },
    },
}
</script>
<style lang="less">
@import "./index.less";
</style>
