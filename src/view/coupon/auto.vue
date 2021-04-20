<template>
    <div class="page-home page-coupon">
        <div class="home-tab">
            <x-tab :line-width="4">
                <x-tabitem :selected="tab==='add'" @on-item-click="tab='add'">添加车牌</x-tabitem>
                <x-tabitem :selected="tab==='list'" @on-item-click="tab='list'">车牌管理</x-tabitem>
            </x-tab>
        </div>
        <div class="tab-content">
            <div v-show="tab==='add'" class="card con addfrom">
                <div class="pad">
                    <div class="logo-box"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/loading-icon.svg"></div>
                    <plate-picker @ok="getPlate" :initPlate="plate"></plate-picker>
                    <x-cell class="shop" title="商家" :value="merchantInfo.name"></x-cell>
                    <x-popuppicker v-show="!isUnfixedCoupon" title="优惠券类型" :data="couponList" show-name v-model="couponId" placeholder="请选择优惠券"></x-popuppicker>
                    <x-xinput v-if="isUnfixedCoupon" @on-blur="amountBlur" title="领取金额" placeholder="输入金额" :show-clear="false" v-model="editInfo.num"></x-xinput>
                    <x-xinput v-if="!isUnfixedCoupon" @on-blur="amountBlur" title="领取张数" placeholder="输入张数" :show-clear="false" v-model="editInfo.num"></x-xinput>
                    <x-xinput title="车主姓名" placeholder="车主姓名" :show-clear="false" v-model="editInfo.name"></x-xinput>
                    <x-xinput title="车主手机号" placeholder="车主手机号" :show-clear="false" v-model="editInfo.mobile"></x-xinput>
                    <div class="button-box">
                        <x-xbutton @click.native="checkPlate">添加</x-xbutton>
                    </div>
                </div>
                <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
            </div>
            <auto-list :merchantInfo="merchantInfo" v-if="tab==='list'"></auto-list>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
import PlatePicker from "../../components/PlatePicker/index";
import autoList from './autoList';

export default {
    name: "coupon-auto",
    data() {
        return {
            tab: 'add',
            loading: false,
            couponList: [],
            plate: '',
            couponId: [],
            merchantInfo: {},
            editInfo: {
                merchant_id: '',
                ctype_id: '',
                car_id: '',
                num: '',
                name: '',
                doer: '',
                mobile: ''
            },
        };
    },
    components: {
        autoList,
        PlatePicker
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
                }
            },
            immediate: true
        }
    },
    created() {
    },
    mounted() { },
    methods: {
        checkPlate() {
            if (!this.plate) { this.$vux.toast.text('请输入车牌'); return false; }
            let postData = { plate: this.plate };
            utils.gateway(utils.api.carExists, postData).then((res) => {
                if (res && res.content && res.content.old_id) {
                    this.editInfo.plate = this.plate;
                    this.editInfo.car_id = res.content.old_id;
                    this.submit();
                    return true;
                } else {
                    this.$vux.toast.text('系统无此车牌'); return false;
                }
            });
        },
        //添加提交
        submit() {
            let editInfo = this.editInfo;
            editInfo.ctype_id = this.couponId[0];
            editInfo.merchant_id = this.merchantInfo.id;
            editInfo.doer = this.loginInfo.mobile;
            if (!editInfo.merchant_id) { this.$vux.toast.text('请选择商家'); return }
            if (!editInfo.plate) { this.$vux.toast.text('请输入车牌'); return }
            if (!editInfo.ctype_id) { this.$vux.toast.text('请选择优惠劵'); return }
            if (this.isUnfixedCoupon && !utils.validator.isMoney.test(editInfo.num)) { this.$vux.toast.text('金额格式不对'); return }
            if (!this.isUnfixedCoupon && !utils.validator.isIntUp0.test(editInfo.num)) { this.$vux.toast.text('张数请输入大于0的正整数'); return }
            if (!editInfo.name) { this.$vux.toast.text('请填入车主姓名'); return }
            if (!utils.validator.isMobile.test(editInfo.mobile)) { this.$vux.toast.text('手机号格式不对'); return }
            if (!editInfo.doer) { this.$vux.toast.text('缺少操作人手机号'); return }
            this.$loading.show({ content: '添加中...', mask: true });
            utils.gateway(utils.api.autoAdd, editInfo).then((res) => {
                this.$loading.hide();
                if (res && res.code === 0) {
                    this.$vux.toast.text('添加成功');
                    if (!this.isUnfixedCoupon) { this.couponId = []; }
                    this.plate = '';
                    this.editInfo = { merchant_id: '', ctype_id: '', car_id: '', num: '', name: '', doer: '', mobile: '' };
                } else {
                    this.$vux.toast.text(res.message);
                }
            });
        },
        getPlate(item) {
            if (!item.isError) {
                this.plate = item.plate;
            }
        },
        amountBlur(v) {
            this.pass_amount = utils.amountBlur(v);
        },
        getMerchantInfo() {
            let postData = {
                page: 1,
                pagesize: 1,
                phone: this.loginInfo.mobile
            };
            utils.gateway(utils.api.merchantInfo, postData).then((res) => {
                if (res && res.content && res.content.lists) {
                    this.merchantInfo = res.content.lists[0];
                    this.getCouponType();
                    console.log('this.merchantInfo', this.merchantInfo)
                }
            });
        },
        getCouponType() {

            if (this.isUnfixedCoupon) {
                let postData = {
                    pagesize: 500,
                    page: 1,
                    kind: '3'
                };
                utils.gateway(utils.api.couponTypeLists, postData).then(res => {
                    if (res && res.content && res.content) {
                        let list = res.content.lists || [];
                        if (list[0]) {
                            this.unfixedCouponName = list[0].coupon_type;
                            this.couponId = [list[0].id];
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
                utils.gateway(utils.api.merchantCoutype, postData).then(res => {
                    if (res && res.content && res.content) {
                        let list = res.content || [];
                        this.couponList = [list.map((el) => { el.name = el.coupon_type; el.value = el.id.toString(); return el; })];
                    }
                });
            }
        },
    }
};
</script>
