<template>
    <div class="page-historylist">
        <div class="type-box">
            <span @click="tab='use';tabClick(true)" class="touch" :class="{spanActive:tab=='use'}">使用历史</span>
            <span @click="tab='buy';tabClick(true)" class="touch" :class="{spanActive:tab=='buy'}">购买历史</span>
            <span @click="tab='send';tabClick(true)" v-show="!isUnfixedCoupon" class="touch" :class="{spanActive:tab=='send'}">分配历史</span>
        </div>
        <!-- 使用历史 -->

        <touch-up @touchUp="pullUp">
            <!-- 购买历史 -->
            <div v-show="tab=='buy'" class="con">
                <div v-for="(item,index) in buyList" :key="index" class="ticket card touch">
                    <div class="ticketcon">
                        <h3>{{item.type_name||"优惠券名称缺失"}}</h3>
                        <h4>购买时间：{{item.paytime}}</h4>
                        <h4 v-show="isUnfixedCoupon">购买金额：{{item.num}}元</h4>
                        <h4 v-show="isUnfixedCoupon">订单金额：{{item.amount}}元</h4>
                        <h4 v-show="isUnfixedCoupon">折扣：{{item.rent}}%</h4>
                        <h4 v-show="!isUnfixedCoupon">订单金额：{{item.amount}}元</h4>
                        <h4 v-show="!isUnfixedCoupon">单价：{{item.rent}}元</h4>
                        <h4 v-show="!isUnfixedCoupon">数量：{{item.num}}张</h4>
                        <h4 v-show="!isUnfixedCoupon">已用：{{item.used_num}}张</h4>
                        <h4>优惠时间：{{item.start_time == '永久' ? item.start_time : item.start_time + ' ~'}}</h4>
                        <h4 v-show="item.end_time!='永久'"><span class="visibility">优惠时间：</span>{{item.end_time}}</h4>
                        <i class="left"></i>
                        <i class="right"></i>
                    </div>
                    <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                </div>
            </div>
            <!-- 使用历史 -->
            <div v-show="tab=='use'" class="con">
                <div v-for="(item,index) in useList" :key="index" class="ticket card touch" v-show="!item.hide">
                    <div class="ticketcon">
                        <h3>{{item.type_name||"优惠券名称缺失"}}</h3>
                        <h4>优惠券面额：{{item.pass_amount || item.denomination || 0}}元</h4>
                        <h4>使用时间：{{item.assign_time}}</h4>
                        <h4>车牌：{{item.plate}}</h4>
                        <h4>分发人：{{item.distributor}}</h4>
                        <h4>优惠时间：{{item.start_time == '永久' ? item.start_time : item.start_time + ' ~'}}</h4>
                        <h4 v-show="item.end_time!='永久'"><span class="visibility">优惠时间：</span>{{item.end_time}}</h4>
                        <i class="left"></i>
                        <i class="right"></i>
                        <div @click="back(false,item,index)" v-show="item.status===1" class="back touch">撤回</div>
                    </div>
                    <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                </div>
            </div>
            <!-- 后台分配历史 -->
            <div v-show="tab=='send'" class="con">
                <div v-for="(item,index) in sendList" :key="index" class="ticket card touch">
                    <div class="ticketcon">
                        <h3>{{item.type_name||"优惠券名称缺失"}}</h3>
                        <h4>优惠券面额：{{item.denomination}}元</h4>
                        <h4>购买时间：{{item.create_time}}</h4>
                        <h4>数量：{{item.groupNum}}张</h4>
                        <h4>已用：{{item.used_num}}张</h4>
                        <h4>优惠时间：{{item.start_time == '永久' ? item.start_time : item.start_time + ' ~'}}</h4>
                        <h4 v-show="item.end_time!='永久'"><span class="visibility">优惠时间：</span>{{item.end_time}}</h4>
                        <i class="left"></i>
                        <i class="right"></i>
                    </div>
                    <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                </div>
            </div>
        </touch-up>
        <dialogs ref='dialogs' @sure="back" buttonbox :dataOption='dataOption'></dialogs>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import touchUp from "../../components/touchUp";
import Dialogs from "../../components/Dialogs";
import { mapState } from "vuex";
export default {
    name: "coupon-history",
    components: { Dialogs, touchUp },
    props: {
        merchantInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isUnfixedCoupon: {
            type: Boolean,
            default: () => { return false }
        }
    },
    data() {
        return {
            loading: false,
            tab: 'use',
            pagesize: 5,
            useList: [],
            buyList: [],
            sendList: [],
            usePage: 1,
            buyPage: 1,
            sendPage: 1,
            upConfig: {
                upContent: "",
                downContent: "释放后加载"
            },
            dataOption: {
                closeicon: true,    // 布尔值，是否显示关闭右上角按钮
                buttonbox: true,    // 布尔值，是否显示button盒子
                title: '确定撤回优惠券？',          // 标题
                msg: '',            // 消息
                statusicon: 0,       // 消息状态icon 1成功  2失败  3警告  0不使用icon
                footerbgicon: true
            },
            recallNum: 0 //记录撤回次数
        }
    },
    mounted() {
        this.dialogs = this.$refs['dialogs'];
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {
        this.tabClick();
    },
    methods: {
        tabClick(init) {
            let tab = this.tab;
            if (tab === 'use') { if (init) { this.usePage = 1; this.useList = []; } this.getUselist(); }
            else if (tab === 'buy') { if (init) { this.buyPage = 1; this.buyList = []; } this.getBuylist(); }
            else if (tab === 'send') { if (init) { this.sendPage = 1; this.sendList = []; } this.getSendlist(); }
        },
        back(t, item, index) {
            if (!t) {
                let actionItem = {};
                actionItem.id = item.id;
                actionItem.index = index;
                this.actionItem = actionItem;
                this.dialogs.open();
            } else {
                if (!this.loginInfo.mobile) { this.$vux.toast.text("缺少手机号，请退出后重新进入页面"); return; }
                let actionItem = this.actionItem;
                let postData = {
                    source: 'app',
                    coupon_id: actionItem.id,
                    phone: this.loginInfo.mobile
                }
                utils.gateway(utils.api.reclaimExecute, postData).then((res) => {
                    if (res && res.code === 0) {
                        let newItem = this.useList[actionItem.index];
                        let isAllClear = false;
                        newItem.hide = true;
                        this.useList.splice(actionItem.index, 1, newItem);
                        isAllClear = this.useList.every(item => item.hide === true);
                        this.dialogs.close();
                        this.$vux.toast.text('撤回成功!');
                        this.recallNum++;
                        if (isAllClear) {
                            this.usePage = 1;
                            this.useList = [];
                            this.recallNum = 0;
                            this.getUselist();
                        }
                    } else {
                        this.dialogs.close();
                        this.$vux.toast.text(res.message);
                    }
                });
            }
        },
        pullUp() {
            this.tabClick();
        },
        //使用历史
        getUselist() {
            let postData = {
                page: this.usePage,
                pagesize: this.pagesize,
                sort: 'assign_time_desc',
                status: 'used',
                phone: this.loginInfo.mobile,
                merchant_id: this.merchantInfo.id
            }
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.couponLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.useList = this.useList.concat(res.content.lists || []);
                    this.usePage++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
        //购买历史
        getBuylist() {
            let postData = {
                page: this.buyPage,
                pagesize: this.pagesize,
                paid: 'Y',
                merchant_id: this.merchantInfo.id
            }
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.orderLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.buyList = this.buyList.concat(res.content.lists || []);
                    this.buyPage++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
        //分配历史

        getSendlist() {
            let postData = {
                page: this.sendPage,
                pagesize: this.pagesize,
                create_type: 'allotte',
                batch: 'group',
                phone: this.loginInfo.mobile,
                merchant_id: this.merchantInfo.id
            }
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.couponLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.sendList = this.sendList.concat(res.content.lists || []);
                    this.sendPage++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
    },
    watch: {
        recallNum: function (val) {
            // 撤回次数为一页的数量时更新前端的分页 防止请求时 page出现误差
            if (val === this.pagesize && this.usePage > 1) {
                this.usePage--;
                this.recallNum = 0;
            }
        }
    }
};
</script>

