<template>
    <div class="page-authorize">
        <touch-up @touchUp="pullUp">
            <img class='bg-img' src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/car_bg_logo1@2x.png">
            <div class="card con seach-box addfrom">
                <x-popuppicker title="授权商家" :data="merchantInfos" show-name v-model="merchantId" placeholder="请选择商家"></x-popuppicker>
                <x-xinput title="被授权手机号" placeholder="请输入被授权手机号" :show-clear="false" v-model="mobile"></x-xinput>
                <div class="button-box">
                    <x-xbutton class="small" @click.native="authorize">授权</x-xbutton>
                </div>
            </div>
            <div class="touch">
                <div class="con">
                    <div v-for="(item,index) in list" :key="index" class="ticket card touch">
                        <div class="ticketcon">
                            <h4>被授权手机号：{{item.mobile}}</h4>
                            <h4>商家：{{item.merchant_name}}</h4>
                            <h4>授权时间:{{item.modifytime}}</h4>
                            <h4>授权状态:{{statusOption[item.status]}}</h4>
                            <div class="switch-box">
                                <x-xswitch title="" prevent-default @on-click="actionReady(index)" :value-map="['N', 'Y']" v-model="item.status"></x-xswitch>
                            </div>
                        </div>
                        <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                    </div>
                </div>
            </div>
        </touch-up>
        <dialogs ref='dialogs' :dataOption='dataOption' @sure="statusChange"></dialogs>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import Dialogs from "../../components/Dialogs";
import touchUp from "../../components/touchUp";
import { mapState } from "vuex";
export default {
    name: "coupon-authorize",
    data() {
        return {
            mobile: '',
            merchantInfo: {},
            merchantInfos: [],
            merchantId: [],
            list: [],
            actionItem: {},
            upConfig: {
                upContent: "",
                downContent: "释放后加载"
            },
            statusOption: { Y: '启用', N: '禁用', D: '删除' },
            page: 1,
            dataOption: {
                closeicon: true,    // 布尔值，是否显示关闭右上角按钮
                buttonbox: true,    // 布尔值，是否显示button盒子
                title: '',          // 标题
                msg: '',            // 消息
                statusicon: 0,       // 消息状态icon 1成功  2失败  3警告  0不使用icon
                footerbgicon: true
            }
        }
    },
    components: { Dialogs, touchUp },
    computed: {
        ...mapState(["loginInfo"])
    },
    watch: {
        loginInfo: {
            handler: function () {
                if (this.loginInfo.mobile) {
                    this.getMerchantInfo();
                }
            },
            immediate: true
        }
    },
    created() {

    },
    mounted() {
        this.dialogs = this.$refs['dialogs'];
    },
    methods: {
        actionReady(index) {
            let actionItem = {};
            let item = this.list[index];
            if (!(item.mobile)) { this.$vux.toast.text("缺少手机号"); return; }
            actionItem = { ...item };
            if (actionItem.status === 'Y') {
                actionItem.status = 'N';
            } else if (actionItem.status === 'N') {
                actionItem.status = 'Y';
            }
            actionItem.index = index;
            actionItem.actionName = this.statusOption[actionItem.status];
            this.actionItem = actionItem;
            let msg = '您确定要' + actionItem.actionName + actionItem.mobile + '的授权？';
            this.dataOption.msg = msg;
            this.dialogs.init()
            this.dialogs.open();
        },
        statusChange(sure) {
            if (sure) {
                let actionItem = this.actionItem;
                let postData = {
                    status: actionItem.status,
                    low_mobile: actionItem.mobile,
                    merchant_id: this.merchantInfo.id,
                    sup_mobile: this.loginInfo.mobile
                }
                this.$loading.show({ content: '操作中...', mask: true });
                utils.gateway(utils.api.authorGive, postData).then((res) => {
                    this.$loading.hide();
                    if (res && res.code === 0) {
                        this.list.splice(actionItem.index, 1, actionItem);
                        this.dialogs.close();
                        this.$vux.toast.text(actionItem.actionName + '成功!');
                    } else {
                        this.dialogs.close();
                        this.$vux.toast.text(res.message);
                    }
                });
            }
        },
        authorize() {
            if (!this.merchantId[0]) {
                this.$vux.toast.text('请选择商家'); return;
            }
            if (!utils.validator.isMobile.test(this.mobile)) {
                this.$vux.toast.text('手机号格式不对'); return;
            }
            var that = this;
            let postData = {
                low_mobile: this.mobile,
                merchant_id: this.merchantId[0],
                status: 'Y',
                sup_mobile: this.loginInfo.mobile
            }
            this.$loading.show({ content: '授权中...', mask: true });
            utils.gateway(utils.api.authorGive, postData).then((res) => {
                this.$loading.hide();
                if (res && res.code === 0) {
                    this.$vux.toast.text('授权成功');
                    this.list = [];
                    this.page = 1;
                    this.pullUp();
                } else {
                    this.$vux.toast.text(res.message);
                }
            });
        },
        backTop() {
        },
        pullUp() {
            this.getList();
        },
        getList() {
            if (!this.merchantInfo.id) { this.$vux.toast.text("缺少商户id，请退出后重新进入页面"); return; }
            let postData = {
                pagesize: 5,
                page: this.page,
                merchant: this.merchantInfo.id
            };
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.authorLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.list = this.list.concat(res.content.lists || []);
                    this.page++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
        getMerchantInfo() {
            if (!this.loginInfo.mobile) {
                this.$vux.toast.text('没获取到用户手机号'); return;
            }
            let postData = { page: 1, pagesize: 1, phone: this.loginInfo.mobile };
            utils.gateway(utils.api.merchantInfo, postData).then((res) => {
                if (res && res.content) {
                    let list = res.content.lists || [];
                    this.merchantInfos = [list.map((el) => { el.value = el.id.toString(); return el; })];
                    this.merchantInfo = list[0] || {};
                    if (this.merchantInfo.id) {
                        this.merchantId = [this.merchantInfo.id.toString()];
                        this.getList();
                    }
                }
            });
        }
    }
};
</script>

