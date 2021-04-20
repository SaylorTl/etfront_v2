<template>
    <div class="page-ticket-config">
        <div class="ticket-config-header">商家小票信息配置</div>
        <div class="ticket-config-content">
            <div class="ticket-config-content-top">
                <x-xinput v-model="form.merchantName"
                          title="商家名称"
                          label-width="2rem"
                          placeholder="商家名称"
                          novalidate
                          disabled
                          :show-clear="false"
                          placeholder-align="left"
                          @on-focus="inputFocus(1)">
                    <img slot="right"
                         v-if="focusNumber === 1 && !!form.merchantName"
                         @click="inputClear('form.merchantName',$event)"
                         src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                </x-xinput>
                <x-xinput v-model="form.nameKeyword"
                          title="名称关键字"
                          label-width="2rem"
                          placeholder="名称关键字"
                          novalidate
                          :show-clear="false"
                          placeholder-align="left"
                          @on-focus="inputFocus(2)">
                    <img slot="right"
                         v-if="focusNumber === 2 && !!form.nameKeyword"
                         @click="inputClear('form.nameKeyword',$event)"
                         src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                </x-xinput>
                <x-xinput v-model="form.dateKeyword"
                          title="日期关键字"
                          label-width="2rem"
                          placeholder="日期关键字"
                          novalidate
                          :show-clear="false"
                          placeholder-align="left"
                          @on-focus="inputFocus(3)">
                    <img slot="right"
                         v-if="focusNumber === 3 && !!form.dateKeyword"
                         @click="inputClear('form.dateKeyword',$event)"
                         src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                </x-xinput>
                <x-xinput v-model="form.moneyKeyword"
                          title="金额关键字"
                          label-width="2rem"
                          placeholder="金额关键字"
                          novalidate
                          :show-clear="false"
                          placeholder-align="left"
                          @on-focus="inputFocus(4)">
                    <img slot="right"
                         v-if="focusNumber === 4 && !!form.moneyKeyword"
                         @click="inputClear('form.moneyKeyword',$event)"
                         src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                </x-xinput>

                <x-xinput v-model="form.orderKeyword"
                          title="订单关键字"
                          label-width="2rem"
                          placeholder="订单关键字"
                          novalidate
                          :show-clear="false"
                          placeholder-align="left"
                          @on-focus="inputFocus(5)">
                    <img slot="right"
                         v-if="focusNumber === 5 && !!form.orderKeyword"
                         @click="inputClear('form.orderKeyword',$event)"
                         src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                </x-xinput>
                <form-item label="资金池"
                           class="ticket-config-money-pool"
                           :content="pond_name"
                           :border="false"
                           arrow
                           v-if="showMoneyPool"
                           @handleClick="selectModal('money')"></form-item>
                <x-xinput v-model="otherKeyword"
                          title="其他关键字"
                          placeholder="其他关键字"
                          novalidate
                          :show-clear="false"
                          placeholder-align="left">
                    <div slot="right"
                         class="ticket-config-keyword-add"
                         @click="addOther">
                        <i :class="!!otherKeyword?'fa fa-check-square-o':'fa fa-plus'"></i>{{!!otherKeyword?'确认':'添加'}}
                    </div>
                </x-xinput>
            </div>
            <div class="ticket-config-other"
                 v-if="others.length > 0">
                <div class="ticket-config-other-title">其他关键字信息</div>
                <form-item :label="item"
                           class="ticket-config-other-item"
                           :border="false"
                           v-for="(item,index) in others"
                           :key="index">
                    <div slot="content"
                         @click="removeOther(index)">
                        <img src="../../assets/images/trash.svg">
                    </div>
                </form-item>
            </div>
            <div class="ticket-config-other">
                <form-item label="领券条件"
                           class="ticket-config-condition"
                           v-if="couponBtnShow">
                    <div slot="content"
                         class="ticket-config-condition-add"
                         @click="showCouponForm">
                        <i :class="!!isCouponForm?'fa fa-check-square-o':'fa fa-plus'"></i>{{!!isCouponForm?'确认':'添加'}}
                    </div>
                </form-item>
                <div v-if="isCouponForm">
                    <x-xinput v-model="couponForm.amount"
                              title="限领金额"
                              label-width="2rem"
                              placeholder="限领金额"
                              novalidate
                              type="number"
                              :min="0"
                              :show-clear="false"
                              placeholder-align="left"
                              @on-focus="inputFocus(6)">
                        <img slot="right"
                             v-if="focusNumber === 6 && !!moneyLimit"
                             @click="inputClear('moneyLimit',$event)"
                             src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                    </x-xinput>
                    <x-xinput v-model="couponForm.type_name"
                              title="优惠券类型"
                              label-width="2rem"
                              placeholder="优惠券类型"
                              novalidate
                              disabled
                              :show-clear="false"
                              placeholder-align="left">
                        <div slot="right"
                             class="ticket-config-keyword-add"
                             @click="selectModal('coupon')">
                            <i class="fa fa-search"></i>选择
                        </div>
                    </x-xinput>
                </div>
                <template v-if="conditions.length > 0">
                    <form-item v-for="(item,index)
                               in
                               conditions"
                               :key="index"
                               :label="'满'+item.amount + '元，领' + item.type_name"
                               class="ticket-config-other-item">
                        <div slot="content"
                             @click="removeCondition(index)">
                            <img src="../../assets/images/trash.svg">
                        </div>
                    </form-item>
                </template>
            </div>
            <div class="ticket-config-content-bottom">
                <x-xinput v-model="form.dateFormat"
                          title="时间格式"
                          label-width="2rem"
                          placeholder="时间格式"
                          novalidate
                          :show-clear="false"
                          disabled
                          placeholder-align="left">
                    <div slot="right"
                         class="ticket-config-keyword-add"
                         @click="showTime">
                        <i class="fa fa-search"></i>选择
                    </div>
                </x-xinput>
                <x-xinput v-model="form.dateLimit"
                          title="时间限制"
                          label-width="2rem"
                          placeholder="时间限制"
                          novalidate
                          :show-clear="false"
                          placeholder-align="left"
                          @on-focus="inputFocus(7)">
                    <img slot="right"
                         v-if="focusNumber === 7 && !!form.dateLimit"
                         @click="inputClear('form.dateLimit',$event)"
                         src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
                </x-xinput>
                <x-xswitch title="是否启用"
                           v-model="form.isOpen"></x-xswitch>
            </div>
        </div>
        <div class="ticket-config-footer"
             @click="handleSubmit">确认</div>
        <!-- 金额池  -->
        <my-picker :isShow="moneyPicker"
                   v-if="moneyPicker"
                   :data="moneyInfo"
                   @change="changeMoney"
                   @handleClose="closeMoney"></my-picker>
        <!-- 优惠券  -->
        <my-picker :isShow="couponPicker"
                   v-if="couponPicker"
                   :data="couponInfo"
                   @change="changeCoupon"
                   @handleClose="closeCoupon"></my-picker>
        <my-picker :isShow="timePicker"
                   v-if="timePicker"
                   :data="timeInfo"
                   @change="changeTime"
                   @handleClose="closeTime"></my-picker>
    </div>
</template>
<script>
import FormItem from "../../components/FormItem/index";
import MyPicker from "../../components/MyPicker/index";
import utils from "utils/utils.js";
import { mapState } from "vuex";
export default {
    name: "ticket-config",
    props: {},
    components: {
        FormItem,
        MyPicker
    },
    data() {
        return {
            focusNumber: 0,
            showMoneyPool: false,
            isCouponForm: false,
            showConditions: false,
            moneyPicker: false,
            moneyInfo: [],
            couponPicker: false,
            couponInfo: [],
            configId: "",
            couponBtnShow: true,
            timePicker: false,
            timeInfo: [
                { name: "YYYY-MM-DD", value: "YYYY-MM-DD" },
                { name: "YYYY-M-D", value: "YYYY-M-D" },
                { name: "YYYY/MM/DD", value: "YYYY/MM/DD" },
                { name: "YYYY/M/D", value: "YYYY/M/D" },
                { name: "MM/DD/YYYY", value: "MM/DD/YYYY" },
                { name: "M/D/YYYY", value: "M/D/YYYY" },
                { name: "YY-MM-DD", value: "YY-MM-DD" },
                { name: "YY/MM/DD", value: "YY/MM/DD" },
                { name: "YYYY年MM月DD日", value: "YYYY年MM月DD日" },
                { name: "M D,YYYY", value: "M D,YYYY" },
                { name: "D M YYYY", value: "D M YYYY" }
            ],
            merchantInfo: {
                merchantId: "",
                merchantName: "",
                merchantType: ""
            },
            couponForm: {
                amount: "",
                type: "",
                type_name: ""
            },
            otherKeyword: "",
            others: [],
            conditions: [],
            moneyLimit: "",
            pond_name: "",
            form: {
                merchantName: "",
                nameKeyword: "",
                dateKeyword: "",
                moneyKeyword: "",
                orderKeyword: "",
                pond_id: "",
                dateFormat: "",
                dateLimit: "",
                isOpen: true
            }
        };
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {
        this.initForm();
        this.getMerchantInfo();
    },
    methods: {
        selectMoney() {},
        inputFocus(number) {
            this.focusNumber = parseInt(number);
        },
        inputClear(key, event) {
            let keyArr = key.split(".");
            if (keyArr.length === 1) {
                this[keyArr[0]] = "";
            } else {
                this[keyArr[0]][keyArr[1]] = "";
            }
        },
        initForm() {
            this.otherKeyword = "";
            this.others = [];
            this.conditions = [];
            this.form = {
                merchantName: "",
                nameKeyword: "",
                dateKeyword: "",
                moneyKeyword: "",
                orderKeyword: "",
                pond_id: "",
                dateFormat: "",
                dateLimit: "",
                isOpen: true
            };
        },
        getMerchantInfo() {
            let params = {
                page: 1,
                pagesize: 20,
                phone: this.loginInfo.mobile
            };
            utils.gateway(utils.api.merchantInfo, params).then(res => {
                if (
                    !!res.content &&
                    !!res.content.lists &&
                    res.content.lists.length > 0
                ) {
                    this.merchantInfo.merchantId = res.content.lists[0].id;
                    this.merchantInfo.merchantName = res.content.lists[0].name;
                    this.merchantInfo.merchantType =
                        res.content.lists[0].coupontype;
                    this.form.merchantName = this.merchantInfo.merchantName;
                    this.getCouponpond();
                    this.getReceipt();
                    this.showCoupons();
                }
            });
        },
        getCouponpond() {
            let params = {
                page: 1,
                pagesize: 1000,
                expiry: "Y",
                merchant_id: this.merchantInfo.merchantId
            };
            utils.gateway(utils.api.getCouponpond, params).then(res => {
                if (res && res.content && Array.isArray(res.content.lists)) {
                    if (res.content.lists.length > 0) {
                        this.showMoneyPool = true;
                        let temp = res.content.lists;
                        this.moneyInfo = temp.map(item => {
                            return {
                                name: `${item.balance}元`,
                                value: item.id,
                                total: item.total,
                                balance: item.balance,
                                status: item.status,
                                type: item.type,
                                start_time: item.start_time,
                                end_time: item.end_time
                            };
                        });
                    } else {
                        this.$vux.toast.text("请配置金额池", "middle");
                    }
                } else {
                    this.showMoneyPool = false;
                }
            });
        },
        getReceipt() {
            this.$loading.show({
                content: "页面信息加载中...",
                mask: true
            });
            let params = {
                merchant_id: this.merchantInfo.merchantId,
                page: 1,
                pagesize: 20
            };
            utils.gateway(utils.api.getReceiptInfo, params).then(res => {
                this.$loading.hide();
                if (
                    res.code === 0 &&
                    !!res.content &&
                    !!res.content.lists &&
                    res.content.lists.length > 0
                ) {
                    let result = res.content.lists[0];
                    this.configId = result.id;
                    this.form = {
                        merchantName: result.merchant_name,
                        nameKeyword: result.name_keyword,
                        dateKeyword: result.time_keyword,
                        dateLimit: result.time_limit,
                        dateFormat: result.time_format,
                        moneyKeyword: result.money_keyword,
                        orderKeyword: result.tnum_keyword,
                        isOpen: result.status === 1 ? true : false
                    };
                    this.others = !!result.other_keyword
                        ? result.other_keyword.split(",")
                        : [];
                    this.conditions = result.terms;
                }
                // else{
                //     this.$vux.toast.text(res.message,'middle');
                // }
            });
        },
        showCoupons() {
            if (!!this.merchantInfo.merchantId) {
                let params = {
                    merchant_id: this.merchantInfo.merchantId,
                    phone: this.loginInfo.mobile
                };
                utils.gateway(utils.api.merchantCoutype, params).then(res => {
                    console.log("优惠券信息：", res);
                    if (
                        !!res.content &&
                        Array.isArray(res.content) &&
                        res.content.length > 0
                    ) {
                        this.couponInfo = res.content.map(item => {
                            return {
                                name: item.coupon_type,
                                value: item.id
                            };
                        });
                        // this.couponPicker = true;
                    }
                });
            } else {
                this.$vux.toast.text("没有获取到商家信息！", "middle");
            }
        },
        showCouponForm() {
            if (!this.isCouponForm) {
                this.couponForm = {
                    amount: "",
                    type: "",
                    type_name: ""
                };
                this.isCouponForm = true;
            } else {
                if (!this.couponForm.amount || !this.couponForm.type_name) {
                    this.$vux.toast.text(
                        "请填写限领金额及选择优惠券类型",
                        "middle"
                    );
                    return false;
                } else {
                    this.conditions.push({
                        amount: this.couponForm.amount,
                        type: this.couponForm.type,
                        type_name: this.couponForm.type_name
                    });
                    if (
                        this.conditions.length === 1 &&
                        this.merchantInfo.merchantType === 1
                    ) {
                        this.couponBtnShow = false;
                    }
                    this.isCouponForm = false;
                }
            }
        },
        handleSubmit() {
            let terms = [];
            if (this.conditions.length > 0) {
                terms = this.conditions.map(item => {
                    return {
                        amount: item.amount,
                        type: item.type
                    };
                });
            }
            let param = {
                pond_id: this.form.pond_id,
                merchant_id: this.merchantInfo.merchantId,
                name_keyword: this.form.nameKeyword,
                money_keyword: this.form.moneyKeyword,
                time_keyword: this.form.dateKeyword,
                tnum_keyword: this.form.orderKeyword,
                other_keyword:
                    this.others.length > 0 ? this.others.join(",") : "",
                time_format: this.form.dateFormat,
                time_limit: this.form.dateLimit,
                status: this.form.isOpen ? 1 : 0,
                terms: JSON.stringify(terms)
            };
            let method = "";
            if (!!this.configId) {
                param.id = this.configId;
                method = utils.api.updateReceiptConfig;
            } else {
                method = utils.api.addReceiptConfig;
            }
            if (!this.checkForm()) {
                return;
            } else {
                utils.gateway(method, param).then(res => {
                    if (res.code === 0) {
                        this.$vux.toast.text("操作成功", "middle");
                        this.getReceipt();
                    } else {
                        this.$vux.toast.text(res.message, "middle");
                    }
                });
            }
        },
        checkForm() {
            if (!this.merchantInfo.merchantId) {
                this.$vux.toast.text("请关联商户信息", "middle");
                return false;
            } else if (!this.form.nameKeyword) {
                this.$vux.toast.text("请填入名称关键字", "middle");
                return false;
            } else if (!this.form.moneyKeyword) {
                this.$vux.toast.text("请填入金额关键字", "middle");
                return false;
            } else if (!this.form.dateKeyword) {
                this.$vux.toast.text("请填入日期关键字", "middle");
                return false;
            } else if (!this.form.orderKeyword) {
                this.$vux.toast.text("请填入订单关键字", "middle");
                return false;
            } else if (!/^[1-9]\d*/.test(this.form.dateLimit)) {
                this.$vux.toast.text("请填入正确的时间限制", "middle");
                return false;
            } else {
                return true;
            }
        },
        addOther() {
            if (!!this.otherKeyword) {
                this.others.push(this.otherKeyword);
                this.otherKeyword = "";
            }
        },
        removeOther(index) {
            this.others.splice(index, 1);
        },
        selectModal(key) {
            if (key === "money") {
                this.moneyPicker = true;
            } else if (key === "coupon") {
                this.couponPicker = true;
            }
        },
        changeMoney(data) {
            this.form.pond_id = data.value;
            this.pond_name = data.name;
            this.closeMoney();
        },
        closeMoney() {
            this.moneyPicker = false;
        },
        changeCoupon(data) {
            console.log("优惠券", data);
            this.couponForm.type = data.value;
            this.couponForm.type_name = data.name;
            this.closeCoupon();
        },
        closeCoupon() {
            this.couponPicker = false;
        },
        removeCondition(index) {
            this.conditions.splice(index, 1);
        },
        showTime() {
            this.timePicker = true;
        },
        changeTime(data) {
            this.form.dateFormat = data.value;
            this.closeTime();
        },
        closeTime() {
            this.timePicker = false;
        }
    }
};
</script>
