<template>
    <div class="card ui-card-warpper">
        <div v-if="!isSysInfo" class="ui-card ui-flex ui-flex-row ui-content-between ui-content-center">
            <!-- https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_exit.svg -->
            <img v-if="!showButton" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_entrance.svg" alt="" class="ui-self-center ui-card-in-img" />
            <div class="ui-flex ui-flex-row ui-self-center ui-flex-1 ui-content-between ui-card-content">
                <div class="ui-flex ui-flex-col ui-text-left">
                    <h3 class="ui-h3">粤B·AD630</h3>
                    <p class="ui-card-content-dec">深业上城 B座</p>
                </div>
                <div class="ui-flex ui-flex-col ui-text-right">
                    <h3 class="ui-h3 fail">进场</h3>
                    <p class="ui-card-content-dec">9:05</p>
                </div>
            </div>
        </div>
        <div v-if="isSysInfo" class="ui-msg-sys">
            <div class="ui-flex ui-flex-col ui-text-left">
                <h5 class="ui-h5-title">[系统通知] 2018/8/21 13:05</h5>
                <p class="ui-card-content-dec">彩悦酒店停车场因升级改造暂时不可用，对广大业主造成的不便我们表示歉意！</p>
            </div>
            <img class="ui-icon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/epmanager/images/arrow.svg" />
        </div>
        <div v-if="showButton && !isSysInfo" class="temp-btn">
            <div class="ui-card-border"></div>
            <button class="ui-content-center ui-justify-center btn btn_primary">月卡续费</button>
        </div>
    </div>
</template>
<script>

     export default {
        name: 'msg-card',
          props: {
            lists: {
                type: Object,
                default: function () {
                    return {}
                },
            },
            showButton: {
                type: Boolean,
                default: function () {
                    return false
                },
            },
            isSysInfo: {
                type: Boolean,
                default: function () {
                    return false
                },
            },
        },
        data () {
            return {

            }
        },
        components: {
        },
        methods: {
        },
    };
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
