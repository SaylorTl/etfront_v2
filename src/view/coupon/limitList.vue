<template>
    <div class="page-limitList">
        <touch-up @touchUp="pullUp">
            <div class="con">
                <div v-for="(item,index) in conponLimitlist" :key="index" class="ticket card touch" v-show="item.id">
                    <div class="ticketcon">
                        <i @click="delReady(index,item)" class="fa fa-trash-o fa-lg del"></i>
                        <h3>{{item.type_name}}</h3>
                        <h4>商家名称：{{item.merchant_name}}</h4>
                        <h4>限制类型：{{limitOption[item.limit_type]}}</h4>
                        <h4>限制时段：{{dateOption[item.time_span]}}</h4>
                        <h4 v-show="isUnfixedCoupon">限制金额：{{item.limit_num}} 元</h4>
                        <h4 v-show="!isUnfixedCoupon">限制数量：{{item.limit_num}} 张</h4>
                        <div class="back touch" @click="openForm(index,item)">修改</div>
                    </div>
                    <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                </div>
            </div>
        </touch-up>
        <dialogs ref='dialogsdel' @sure="delSure" :dataOption='dataOptionDel'></dialogs>
        <dialogs ref='dialogs' :dataOption='dataOption'>
            <template slot="content">
                <div class="dialog-form">
                    <x-cell title="商家名称" :value="editItem.merchant_name"></x-cell>
                    <x-cell title="优惠券名称" :value="editItem.type_name"></x-cell>
                    <x-cell title="限制类型" :value="limitOption[editItem.limit_type]"></x-cell>
                    <x-popuppicker title="时间类型" :data="dateList" show-name v-model="dateId" placeholder="请选择日期类型"></x-popuppicker>
                    <x-xinput v-if="isUnfixedCoupon" title="金额" placeholder="请输入金额" :show-clear="false" v-model="editItem.limit_num"></x-xinput>
                    <x-xinput v-if="!isUnfixedCoupon" title="数量" placeholder="请输入数量" :show-clear="false" v-model="editItem.limit_num"></x-xinput>
                    <x-xbutton @click.native="edit">修改</x-xbutton>
                </div>
            </template>
        </dialogs>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import Dialogs from "../../components/Dialogs";
import touchUp from "../../components/touchUp";
import { mapState } from "vuex";
export default {
    name: "coupon-limitList",
    props: {
        merchantInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            conponLimitlist: [],
            delItem: {},
            upConfig: {
                upContent: "",
                downContent: "释放后加载"
            },
            limitOption: { auto: '自动领券限制', buy: '购买限制', assign: '发放限制', notsure: '总额限制' },
            dateList: [[{ name: '日', value: 'day' }, { name: '周', value: 'week' }, { name: '月', value: 'month' }]],
            dateOption: { week: '周', day: '日', month: '月' },
            editItem: {},
            dateId: [],
            page: 1,
            dataOptionDel: {
                closeicon: true,    // 布尔值，是否显示关闭右上角按钮
                buttonbox: true,    // 布尔值，是否显示button盒子
                title: '',          // 标题
                msg: '',            // 消息
                statusicon: 0,       // 消息状态icon 1成功  2失败  3警告  0不使用icon
                footerbgicon: true
            },
            dataOption: {
                closeicon: true,    // 布尔值，是否显示关闭右上角按钮
                title: '修改限制',          // 标题
                msg: '',            // 消息
                footerbgicon: true
            }
        }
    },
    components: { Dialogs, touchUp },
    computed: {
        ...mapState(["loginInfo"]),
        isUnfixedCoupon: function () {
            return this.merchantInfo.coupontype == '1' ? true : false;
        }
    },
    created() {
        this.getLimitList();
    },
    mounted() {
        this.dialogs = this.$refs['dialogs'];
        this.dialogsdel = this.$refs['dialogsdel'];
    },
    methods: {
        openForm(index, item) {
            this.editItem = {};
            this.dateId = [];
            this.editItem = { ...item };
            this.editItem.index = index;
            this.dateId = [this.editItem.time_span];
            this.dialogs.open();
        },
        //修改提交
        edit() {
            let item = this.editItem;
            if (!this.dateId[0]) { this.$vux.toast.text('请选择日期类型'); return }
            if (this.isUnfixedCoupon && !utils.validator.isMoney.test(item.limit_num)) { this.$vux.toast.text('金额格式不对'); return }
            if (!this.isUnfixedCoupon && !utils.validator.isIntUp0.test(item.limit_num)) { this.$vux.toast.text('数量请输入大于0的正整数'); return }
            let postData = {
                id: item.id,
                merchant: item.merchant,
                create_id: item.create_id,
                limit_type: item.limit_type,
                time_span: this.dateId[0],
                limit_num: item.limit_num,
                genre: 'app',
                phone: this.loginInfo.mobile
            }
            this.$loading.show({ content: '提交数据中...', mask: true });
            utils.gateway(utils.api.limitUpdate, postData).then((res) => {
                if (res && res.code === 0) {
                    this.$loading.hide();
                    let newItem = this.conponLimitlist[item.index];
                    newItem.time_span = this.dateId[0];
                    newItem.limit_num = item.limit_num;
                    this.conponLimitlist.splice(item.index, 1, newItem);
                    this.dialogs.close();
                    this.$vux.toast.text('修改成功!');
                } else {
                    this.$vux.toast.text(res.message);
                }
            });
        },
        delReady(index, item) {
            this.delItem = { ...item };
            this.delItem.index = index;
            let msg = '确定要删除 ' + item.type_name + ' ' + '的限制？';
            this.dataOptionDel.msg = msg;
            this.dialogsdel.init()
            this.dialogsdel.open();
        },
        delSure(sure) {
            if (sure) {
                let delItem = this.delItem;
                if (!delItem.id) { this.$vux.toast.text("缺少id"); return; }
                let postData = {
                    id: delItem.id,
                    genre: 'app',
                    phone: this.loginInfo.mobile
                }
                utils.gateway(utils.api.limitDelete, postData).then((res) => {
                    if (res && res.code === 0) {
                        this.conponLimitlist.splice(delItem.index, 1, {});
                        this.dialogsdel.close();
                        this.$vux.toast.text('删除成功!');
                    } else {
                        this.dialogsdel.close();
                        this.$vux.toast.text(res.message);
                    }
                });
            }
        },

        pullUp() {
            this.getLimitList();
        },
        getLimitList() {
            if (!this.loginInfo.mobile) { this.$vux.toast.text("缺少手机号，请退出后重新进入页面"); return; }
            let postData = {
                pagesize: 5,
                page: this.page,
                genre: 'app',
                phone: this.loginInfo.mobile,
                merchant: this.merchantInfo.id
            };
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.limitLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.conponLimitlist = this.conponLimitlist.concat(res.content.lists || []);
                    this.page++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
    }
};
</script>

