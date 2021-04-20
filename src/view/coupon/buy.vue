<template>
    <div class="page-buylist">
        <touch-up @touchUp="pullUp">
            <div class="con">
                <div @click="openForm(item)" v-for="(item,index) in dataList" :key="index" class="ticket card touch">
                    <div class="ticketcon">
                        <h3>{{item.type_name}}</h3>
                        <h4>商家名称：{{item.merchants_name}}</h4>
                        <h4 v-show="isUnfixedCoupon">折扣 ：{{item.amount}}%</h4>
                        <h4 v-show="!isUnfixedCoupon">单价：{{item.amount}}元</h4>
                        <h4>优惠时间：{{item.start_time == '永久' ? item.start_time : item.start_time + ' ~'}}</h4>
                        <h4 v-show="item.end_time!='永久'"><span class="visibility">优惠时间：</span>{{item.end_time}}</h4>
                        <!-- <mt-button @click="buyCoupon(item)" size="small" type="primary">购买</mt-button> -->
                        <i class="left"></i>
                        <i class="right"></i>
                    </div>
                    <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                </div>
            </div>
        </touch-up>
        <dialogs ref='dialogs' :dataOption='dataOption'>
            <template slot="content">
                <div class="buy-from">
                    <x-cell title="优惠券名称" :value="buyItem.name"></x-cell>
                    <x-cell title="停车场" :value="buyItem.station_name"></x-cell>
                    <x-xinput v-if="isUnfixedCoupon" title="折扣" placeholder="请输入金额" :disabled="true" :show-clear="false" v-model="buyItem.price"><span slot="right">%</span></x-xinput>
                    <x-xinput v-if="isUnfixedCoupon" @on-blur="amountBlur" type="number" title="金额" placeholder="请输入金额" :show-clear="false" v-model="buyItem.num"><span slot="right">元</span></x-xinput>
                    <x-xinput v-if="!isUnfixedCoupon" title="单价" :show-clear="false" :disabled="true" v-model="buyItem.price"><span slot="right">元</span></x-xinput>
                    <x-xinput v-if="!isUnfixedCoupon" @on-blur="amountBlur" type="number" title="数量" placeholder="请输入数量" :show-clear="false" v-model="buyItem.num"><span slot="right">张</span></x-xinput>
                    <x-cell class="tatalMoney" title="应付费用" :value="amount"></x-cell>
                    <x-xbutton @click.native="payCoupon">支付</x-xbutton>
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
    name: "coupon-buy",
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
            upConfig: {
                upContent: "",
                downContent: "释放后加载"
            },
            buyItem: {},
            dataList: [],
            page: 1,
            dataOption: {
                closeicon: true,    // 布尔值，是否显示关闭右上角按钮
                buttonbox: false,    // 布尔值，是否显示button盒子
                title: '购买优惠券',          // 标题
                msg: '',            // 消息
                statusicon: 0,       // 消息状态icon 1成功  2失败  3警告  0不使用icon
                footerbgicon: true
            }
        }
    },
    components: { Dialogs, touchUp },
    computed: {
        ...mapState(["loginInfo"]),
        amount() {
            let amount = '--';
            if (this.buyItem.price && this.buyItem.num) {
                if (this.buyItem.type_kind == '3') {
                    let price = utils.accDiv(this.buyItem.price, 100);
                    amount = utils.accMul(this.buyItem.num, price);
                } else {
                    amount = utils.accMul(this.buyItem.num, this.buyItem.price);
                }
                amount = Math.floor(amount * 100) / 100 || '0.00';
            }
            return amount;
        },
        isUnfixedCoupon: function () {
            return this.merchantInfo.coupontype == '1' ? true : false;
        }
    },
    created() {
    },
    mounted() {
        this.dialogs = this.$refs['dialogs'];
        this.getCouponList();
    },
    methods: {
        amountBlur(v) {
            this.buyItem.num = utils.amountBlur(v);
        },
        openForm(item) {
            this.dialogs.open();
            let buyItem = { ...item };
            this.buyItem = {
                id: buyItem.id,
                name: buyItem.type_name,
                num: buyItem.num,
                price: buyItem.amount,
                merchant_id: this.merchantInfo.id,
                station_id: this.merchantInfo.station,
                station_name: this.merchantInfo.station_name,
                type_kind: buyItem.type_kind
            };
            console.log('购买item', this.buyItem)
        },
        payCoupon() {
            let buyItem = this.buyItem;
            let clientType = utils.clientcheck();
            if (!buyItem.num) { this.$vux.toast.text('请输入购买数量'); return; }
            if (!(this.amount > 0)) { this.$vux.toast.text('应付费用必须大于0'); return; }
            if (buyItem.num > 0 && buyItem.price > 0) {
                let postData = {
                    merchant: buyItem.merchant_id,
                    create_id: buyItem.id,
                    num: buyItem.num
                }
                if (this.buyItem.type_kind === '3') {//放行劵直接支付
                    if (clientType == 'CZY') this.czyPay(buyItem);
                    if (clientType == 'WECHAT') this.wxPay(buyItem);
                } else {
                    utils.gateway(utils.api.limitBuylimit, postData).then(res => {
                        if (res && res.code === 0) {
                            if (clientType == 'CZY') this.czyPay(buyItem);
                            if (clientType == 'WECHAT') this.wxPay(buyItem);
                        } else {
                            this.$vux.toast.text(res.message);
                        }
                    });
                }

            }
        },
        czyPay(payItem) {
            let loginInfo = this.loginInfo;
            if (!(loginInfo.user_id && loginInfo.open_id)) {
                this.$vux.toast.text('未获取到用户OpenId或userId，请退出并重新进入页面'); return;
            }
            if (!(this.amount > 0)) {
                this.$vux.toast.text('支付金额应大于0'); return;
            }
            let amount = utils.accMul(this.amount, 100);//支付单位为分
            let rent = utils.accMul(payItem.price, 100);//支付单位为分
            let num = utils.accMul(payItem.num, 100);//单位为分,张数也统一转*100，后台再/100
            let postData = {
                merchant: payItem.merchant_id,
                total_amount: amount,
                amount: amount,
                source: 'SQCZY_WECHAT',
                buy_id: payItem.id,
                num: num,
                rent: rent,
                body: '易停车优惠券购买' + payItem.station_name + '-' + this.loginInfo.mobile,
                openid: this.loginInfo.open_id,
                client_id: this.loginInfo.client_id,
                return_url: `${window.location.protocol}//${window.location.host}/coupon/buyresult`
            }
            this.$loading.show({ content: '正在创建订单...', mask: true })
            utils.gateway(utils.api.couponorderWechat, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.redirect) {
                    window.location.href = res.content.redirect;
                } else {
                    if (res && res.message) {
                        this.$vux.toast.text(res.message);
                    }
                    else {
                        this.$vux.toast.text('购买优惠券下单服务错误，请联系管理员');
                    }
                }
            }).catch(() => {
                this.$loading.hide();
                this.$vux.toast.text('购买优惠券下单服务错误，请联系管理员');
            })
        },
        wxPay(payItem) {
            let loginInfo = this.loginInfo;
            if (!(loginInfo.user_id && loginInfo.open_id)) {
                this.$vux.toast.text('未获取到用户OpenId或userId，请退出并重新进入页面'); return;
            }
            if (!(this.amount > 0)) {
                this.$vux.toast.text('支付金额应大于0'); return;
            }
            let amount = utils.accMul(this.amount, 100);//支付单位为分
            let rent = utils.accMul(payItem.price, 100);//支付单位为分
            let num = utils.accMul(payItem.num, 100);//单位为分,张数也统一转*100，后台再/100
            let host = location.host;
            let source = (host === 'nf.aparcar.cn' || host === 'w.aparcar.cn' || host === 'c.aparcar.cn') ? 'EP_WECHAT' : 'ZX_WECHAT';
            let postData = {
                merchant: payItem.merchant_id,
                total_amount: amount,
                amount: amount,
                source: source,
                buy_id: payItem.id,
                num: num,
                rent: rent,
                body: '易停车优惠券购买',
                openid: this.loginInfo.open_id,
                client_id: this.loginInfo.client_id,
                return_url: `${window.location.protocol}//${window.location.host}/coupon/buyresult`
            }
            this.$loading.show({ content: '正在创建订单...', mask: true })
            utils.gateway(utils.api.couponorderWechat, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.redirect) {
                    window.location.href = res.content.redirect;
                } else {
                    if (res && res.message) {
                        this.$vux.toast.text(res.message);
                    }
                    else {
                        this.$vux.toast.text('购买优惠券下单服务错误，请联系管理员');
                    }
                }
            }).catch(() => {
                this.$loading.hide();
                this.$vux.toast.text('购买优惠券下单服务错误，请联系管理员');
            })
        },
        pullUp() {
            this.getCouponList();
        },
        getCouponList() {
            if (!this.merchantInfo.id) {
                this.$vux.toast.text('缺少商户id'); return;
            }
            let postData = {
                pagesize: 5,
                page: this.page,
                merchant_id: this.merchantInfo.id
            };
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.buycreateLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.dataList = this.dataList.concat(res.content.lists);
                    this.page++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
    }
};
</script>

