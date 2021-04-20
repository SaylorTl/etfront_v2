<template>
    <div class="page-one-card-pass-author">
        <div class="card ui-flex ui-flex-row ui-items-center ui-content-between">
            <img class="page-one-card-pass-author-img" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/home_ad01.png" alt="">
            <div class="ui-flex ui-flex-col ui-items-center ui-justify-center page-one-card-pass-author-history">
                <img class="page-one-card-pass-author-icon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_record@2x.png" alt="">
                <p @click="toHistory" class="ui-fs10 ui-ft-color-666 touch">历史记录</p>
            </div>
        </div>
        <div class="page-one-card-pass-author-from">
            <div class="ui-flex ui-items-center ui-content-between page-one-card-pass-author-from-item">
                <p class="ui-fs14 ui-ft-color-30 ui-fw-600">车辆</p>
                <p class="ui-h3 ui-ft-color-666">
                    <x-popuppicker v-if="carlist" :data="carlist" v-model="car" show-name placeholder="请选择车辆"></x-popuppicker>
                </p>
            </div>
            <div class="ui-flex ui-items-center ui-content-between page-one-card-pass-author-from-item">
                <p class="ui-fs14 ui-ft-color-30 ui-fw-600">授权手机号</p>
                <input class="ui-h3 ui-ft-color-666" type="tel" v-model="moble" placeholder="请输入授权手机号">
            </div>
            <div class="temp-btn">
                <button @click="action" class="btn btn_primary page-one-card-pass-author-from-btn touch">授权</button>
            </div>
        </div>
        <dialogs ref='dialogs' :dataOption='dataOption' @sure="auth"></dialogs>
    </div>
</template>
<script>
import utils from "../../../utils/utils";
import Dialogs from "../../../components/Dialogs";
import { mapState } from "vuex";
export default {
    name: "one-card-pass-author",
    components: { Dialogs },
    data() {
        return {
            moble: "",
            car: [],
            carlist: null,
            dataOption: {
                closeicon: true,    // 布尔值，是否显示关闭右上角按钮
                buttonbox: true,    // 布尔值，是否显示button盒子
                title: '确认授权',          // 标题
                msg: '授权后被授权人即可使用该车辆，是否确认授权？',            // 消息
                statusicon: 0,       // 消息状态icon 1成功  2失败  3警告  0不使用icon
                footerbgicon: true
            }
        };
    },
    created() {
        this.getcarLists()
    },
    mounted() { this.dialogs = this.$refs['dialogs']; },
    methods: {
        toHistory() {
            this.$router.push('/vehicle/lists')
            console.log(this.$router)
        },
        action() {
            if (!this.car[0]) { this.$vux.toast.text('请选择车牌'); return; }
            if (!utils.validator.isMobile.test(this.moble)) { this.$vux.toast.text('手机号格式不对'); return; }
            this.dialogs.open();
        },
        auth() {
            let postData = {
                plate: this.car[0],
                tel: this.moble
            }
            this.$loading.show({ content: '授权中...', mask: true });
            utils.gateway(utils.api.vehicleAuthAdd, postData).then((res) => {
                this.$loading.hide();
                if (res && res.code === 0) {
                    this.$vux.toast.text('授权成功');
                } else {
                    this.$vux.toast.text(res.message);
                }
            });
        },
        getcarLists() {
            this.carlist = null;
            utils.gateway(utils.api.getcarLists).then(res => {
                if (res && res.content) {
                    let list = res.content.lists || [];
                    this.carlist = [list.map((el) => { el.name = el.plate; el.value = el.plate; return el; })];
                }
            });
        },
        onShow() {
            console.log("on show");
        },
        onHide(type) {
            console.log("on hide", type);
        },
        onChange(val) {
            console.log("val change", val);
        }
    }
};
</script>
<style lang="less">
@import "./index.less";
</style>
