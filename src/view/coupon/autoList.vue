<template>
    <div class="page-autoList">
        <touch-up @touchUp="pullUp">
            <div class="card con seach-box">
                <plate-picker @ok="getPlate" :initPlate="searchplate"></plate-picker>
            </div>
            <div class="con">
                <div v-for="(item,index) in conponAutolist" :key="index" class="ticket card touch" v-show="item.show">
                    <div class="ticketcon">
                        <i @click="actionReady(index,'D')" class="fa fa-trash-o fa-lg del"></i>
                        <h3>车牌：{{item.plate}}</h3>
                        <h4>优惠劵类型：{{item.coupon_type}}</h4>
                        <h4 v-show="isUnfixedCoupon">领取金额：{{item.num}}元</h4>
                        <h4 v-show="!isUnfixedCoupon">领取张数：{{item.num}}张</h4>
                        <h4>车主姓名：{{item.name}}</h4>
                        <h4>车主手机号：{{item.mobile}}</h4>
                        <h4>添加人：{{item.adder}}</h4>
                        <h4>添加时间：{{item.creationtime}}</h4>
                        <h4>状态：{{statusOption[item.status]}}</h4>
                        <div class="switch-box">
                            <x-xswitch title="" prevent-default @on-click="actionReady(index,item.status)" :value-map="['N', 'Y']" v-model="item.status"></x-xswitch>
                        </div>
                    </div>
                    <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                </div>
            </div>
        </touch-up>
        <dialogs ref='dialogs' :dataOption='dataOption' @sure="statusChange"></dialogs>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import Dialogs from "../../components/Dialogs";
import PlatePicker from "../../components/PlatePicker/index";
import touchUp from "../../components/touchUp";
import { mapState } from "vuex";
export default {
    name: "coupon-autoList",
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
            searchplate: '',
            conponAutolist: [],
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
    components: { Dialogs, PlatePicker, touchUp },
    computed: {
        ...mapState(["loginInfo"]),
        isUnfixedCoupon: function () {
            return this.merchantInfo.coupontype == '1' ? true : false;
        }
    },
    created() {
        this.getAutoList();
    },
    mounted() {
        this.dialogs = this.$refs['dialogs'];
    },
    methods: {
        actionReady(index, Value) {
            let actionItem = {};
            let item = this.conponAutolist[index];
            if (!(item.plate || item.id)) { this.$vux.toast.text("缺少车牌或记录id"); return; }
            if (Value === 'Y') {
                actionItem.status = 'N';
            } else if (Value === 'N') {
                actionItem.status = 'Y';
            } else {
                actionItem.status = 'D';
            }
            actionItem.id = item.id;
            actionItem.index = index;
            actionItem.actionName = this.statusOption[actionItem.status];
            this.actionItem = actionItem;
            let msg = '您确定要' + actionItem.actionName + ' ' + item.plate + ' ' + '的自动领券配置？';
            this.dataOption.msg = msg;
            this.dialogs.init()
            this.dialogs.open();
        },
        statusChange(sure) {
            if (sure) {
                let actionItem = this.actionItem;
                let postData = {
                    status: actionItem.status,
                    id: actionItem.id,
                    mobile: this.loginInfo.mobile
                }
                utils.gateway(utils.api.autoUpdate, postData).then((res) => {
                    if (res && res.code === 0) {
                        let newItem = this.conponAutolist[actionItem.index];
                        newItem.status = actionItem.status;
                        if (newItem.status === 'D') { newItem.show = false; }//页面控制显示属性不能和switch绑定值使用同一个，switch会监听主动更新  D为N导致出现bug
                        this.conponAutolist.splice(actionItem.index, 1, newItem);
                        this.dialogs.close();
                        this.$vux.toast.text(actionItem.actionName + '成功!');
                    } else {
                        this.dialogs.close();
                        this.$vux.toast.text(res.message);
                    }
                });
            }
        },
        getPlate(item) {
            if (!item.isError && item.plate != this.searchplate) {
                this.page = 1;
                this.conponAutolist = [];
                this.searchplate = item.plate;
                this.getAutoList();
            } else if (item.isError && item.plate === '' && item.plate !== this.searchplate) { //清空搜索框
                this.searchplate = item.plate;
                //修正this.page的值，清空输入框的时候默认显示第一页的车牌数据
                this.conponAutolist = [];
                this.page = 1;
                this.getAutoList();
            }
        },

        pullUp() {
            this.getAutoList();
        },
        getAutoList() {
            if (!this.merchantInfo.id) { this.$vux.toast.text("缺少商户id，请退出后重新进入页面"); return; }
            let postData = { pagesize: 5, page: this.page, merchant_id: this.merchantInfo.id };
            if (this.searchplate) { postData.plate = this.searchplate }
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.autoLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    let list = res.content.lists || [];
                    list = list.map((el) => { el.show = el.status !== 'D' ? true : false; return el; })
                    this.conponAutolist = this.conponAutolist.concat(list);
                    this.page++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
    }
};
</script>

