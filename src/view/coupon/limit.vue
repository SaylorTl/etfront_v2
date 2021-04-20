<template>
    <div class="page-home page-coupon">
        <div class="home-tab">
            <x-tab :line-width="4">
                <x-tabitem :selected="tab==='add'" @on-item-click="tab='add'">添加限制</x-tabitem>
                <x-tabitem :selected="tab==='list'" @on-item-click="tab='list'">限制管理</x-tabitem>
            </x-tab>
        </div>
        <div class="tab-content">
            <div v-show="tab==='add'" class="card con addfrom">
                <div class="pad">
                    <div class="logo-box"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/loading-icon.svg"></div>
                    <x-cell class="shop" title="商家" :value="merchantInfo.name"></x-cell>
                    <x-popuppicker title="限制类型" :data="typeList" @on-change="getCouponType" show-name v-model="typeId" placeholder="请选择限制类型"></x-popuppicker>
                    <x-popuppicker title="优惠券类型" :data="couponList" show-name v-model="couponId" placeholder="请选择优惠券"></x-popuppicker>
                    <x-popuppicker title="时间类型" :data="dateList" show-name v-model="dateId" placeholder="请选择日期类型"></x-popuppicker>
                    <x-xinput v-if="isUnfixedCoupon" type="number" @on-blur="amountBlur" title="金额" placeholder="输入金额" :show-clear="false" v-model="limitNum"></x-xinput>
                    <x-xinput v-if="!isUnfixedCoupon" title="数量" placeholder="输入数量" :show-clear="false" v-model="limitNum"></x-xinput>
                    <div class="button-box">
                        <x-xbutton @click.native="submit">添加</x-xbutton>
                    </div>
                </div>
                <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
            </div>
            <limit-list :merchantInfo="merchantInfo" v-if="tab==='list'"></limit-list>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
import limitList from './limitList';

export default {
    name: "coupon-limit",
    data() {
        return {
            tab: 'add',
            couponList: [],
            typeList: [],
            limitNum: '',
            typeId: ['auto'],
            couponId: [],
            dateId: [],
            merchantInfo: {},
            dateList: [[{ name: '日', value: 'day' }, { name: '周', value: 'week' }, { name: '月', value: 'month' }]]
        };
    },
    components: {
        limitList
    },
    computed: {
        ...mapState(["loginInfo"]),
        isUnfixedCoupon: function () {
            return this.merchantInfo.coupontype == '1' ? true : false;
        }
    },
    watch: {
        loginInfo: {
            handler: function () {
                if (this.loginInfo.mobile) {
                    this.getMerchantInfo();
                    this.getCouponType();
                }
            },
            immediate: true
        }
    },
    created() {
    },
    mounted() { },
    methods: {
        submit() {
            if (!this.typeId[0]) { this.$vux.toast.text('请选择限制类型'); return }
            if (!this.couponId[0]) { this.$vux.toast.text('请选择优惠劵'); return }
            if (!this.dateId[0]) { this.$vux.toast.text('请选择日期类型'); return }
            if (this.isUnfixedCoupon && !utils.validator.isMoney.test(this.limitNum)) { this.$vux.toast.text('金额格式不对'); return }
            if (!this.isUnfixedCoupon && !utils.validator.isIntUp0.test(this.limitNum)) { this.$vux.toast.text('数量请输入大于0的正整数'); return }
            let postData = {
                merchant: this.merchantInfo.id,
                create_id: this.couponId[0],
                limit_type: this.typeId[0],
                time_span: this.dateId[0],
                limit_num: this.limitNum,
                genre: 'app',
                phone: this.loginInfo.mobile
            }
            this.$loading.show({ content: '正在添加数据,请稍后...', mask: true });
            utils.gateway(utils.api.limitAdd, postData).then((res) => {
                this.$loading.hide();
                if (res && res.code === 0) {
                    this.$vux.toast.text('添加成功');
                    if (!this.isUnfixedCoupon) {
                        this.couponId = [];
                    }
                    this.limitNum = '';
                    this.dateId = [];
                    this.typeId = [];
                } else {
                    this.$vux.toast.text(res.message)
                }
            });
        },
        amountBlur(v) {
            this.limitNum = utils.amountBlur(v);
        },
        getMerchantInfo() {
            if (!(this.loginInfo.mobile)) { return; }
            let postData = {
                page: 1,
                pagesize: 1,
                phone: this.loginInfo.mobile
            };
            utils.gateway(utils.api.merchantInfo, postData).then((res) => {
                if (res && res.content && res.content.lists) {
                    this.merchantInfo = res.content.lists[0] || {};
                    this.getCouponType();
                    if (this.isUnfixedCoupon) {
                        this.typeList = [[{ name: '自动领券限制', value: 'auto' }, { name: '总额限制', value: 'notsure' }]];
                    } else {
                        this.typeList = [[{ name: '自动领券限制', value: 'auto' }, { name: '购买限制', value: 'buy' }, { name: '发放限制', value: 'assign' }]];
                    }
                }
            });
        },
        getCouponType() {
            this.couponList = [];
            this.couponId = [];
            if (this.isUnfixedCoupon) {
                let postData = {
                    pagesize: 500,
                    page: 1,
                    kind: '3'
                };
                utils.gateway(utils.api.couponTypeLists, postData).then(res => {
                    if (res && res.content && res.content) {
                        console.log('res.content', res.content)
                        let list = res.content.lists || [];
                        this.couponList = [list.map((el) => { el.name = el.coupon_type; el.value = el.id.toString(); return el; })];
                        if (list[0]) {
                            this.unfixedCouponName = list[0].coupon_type;
                            this.couponId = [list[0].id.toString()];
                        }
                    }
                });
            } else {
                let postData = {
                    pagesize: 500,
                    page: 1,
                    phone: this.loginInfo.mobile,
                    merchant_id: this.merchantInfo.id
                };
                if (this.typeId[0] === 'buy') {
                    utils.gateway(utils.api.buycreateLists, postData).then(res => {
                        if (res && res.content ) {
                            let list = res.content.lists || [];
                            this.couponList = [list.map((el) => { el.name = el.type_name; el.value = el.id.toString(); return el; })];
                        }
                    });
                } else {
                    utils.gateway(utils.api.merchantCoutype, postData).then(res => {
                        if (res && res.content && res.content) {
                            let list = res.content || [];
                            this.couponList = [list.map((el) => { el.name = el.coupon_type; el.value = el.id.toString(); return el; })];
                        }
                    });
                }
            }
        },
    }
};
</script>
