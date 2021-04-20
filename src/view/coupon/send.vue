<template>
    <div class='page-send'>
        <div class="card con addfrom">
            <div class="pad">
                <div class="logo-box"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/loading-icon.svg"></div>
                <plate-picker @ok="getPlate" :initPlate="plate"></plate-picker>
                <x-cell class="shop" title="商家" :value="merchantInfo.name"></x-cell>
                <x-cell v-show="park.station_name" title="停车场" :value="park.station_name"></x-cell>
                <x-cell v-show="park.begin" title="进场时间" :value="park.disTime"></x-cell>
                <x-cell v-show="!isUnfixedCoupon && reseivedCoupon>0" title="已发券提示" :value="utils.amountBlur(reseivedCoupon)+'元'"></x-cell>
                <x-cell v-show="park.money!=undefined && !(park.money<0)" title="临停费用" :value="park.money+'元'"></x-cell>
                <x-popuppicker v-show="!isUnfixedCoupon" title="优惠券类型" :data="couponList" show-name v-model="couponId" placeholder="请选择优惠券"></x-popuppicker>
                <x-cell v-show="isUnfixedCoupon" title="优惠券类型" :value="unfixedCouponName"></x-cell>
                <x-cell v-show="isUnfixedCoupon && unfixedMoneyDetail" title="使用情况" :value="unfixedMoneyDetail"></x-cell>
                <x-popuppicker v-show="isUnfixedCoupon" title="资金池" :data="pondList" show-name v-model="pondId" @on-show="onShow" placeholder="请选择资金池"></x-popuppicker>
                <x-xinput v-show="isUnfixedCoupon" @on-blur="amountBlur" type="number" title="金额" placeholder="0表示不限制，可填写大于0的数值" :show-clear="false" v-model="pass_amount"></x-xinput>
                <div class="button-box">
                    <x-xbutton @click.native="sendCoupon">发券</x-xbutton>
                </div>
                <div class="more touch">
                    <i v-show="!codeStr && couponId[0]" class="fa fa-hand-o-down fromicon" @click="showqrCode">点击扫码领券</i>
                    <x-qrcode v-show="codeStr" :value="codeStr" type="img"></x-qrcode>
                </div>
            </div>
            <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import PlatePicker from "../../components/PlatePicker/index";
import { mapState } from "vuex";

export default {
    name: "coupon-send",
    components: {
        PlatePicker
    },
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
    computed: {
        ...mapState(["loginInfo"])
    },
    watch: {
        merchantInfo: {
            handler: function () {
                if (this.merchantInfo.id) {
                    this.getCouponType();//优惠券
                    this.isUnfixedCoupon && this.getCouponpond();//账户资金池
                }
            },
            immediate: true
        },
    },
    data() {
        return {
            loading: false,
            couponList: [],
            pondList: [],
            plate: '',
            park: {},
            couponId: [],
            pondId: [],
            pass_amount: '',
            reseivedCoupon: 0,
            unfixedCouponId: '',
            unfixedCouponName: '',
            unfixedMoneyDetail: '',
            codeStr: '',
            showqrcode: false,
            utils: {
                amountBlur: utils.amountBlur
            }
        };
    },
    methods: {
        onShow() {

        },
        getPlate(item) {
            if (!item.isError) {
                this.plate = item.plate;
                this.getParked();
                this.reseivedCoupon = 0;
                this.getReceivedCoupon();
            }
        },
        amountBlur(v) {
            this.pass_amount = utils.amountBlur(v);
        },
        getParked() {
            let postData = {
                merchant_id: this.merchantInfo.id,
                plate: this.plate
            }
            utils.gateway(utils.api.checktemp, postData).then(res => {
                if (res && res.content) {
                    this.park = res.content.templists || {};
                    this.park.disTime = utils.eptimes.outTime(this.park.begin, 'MM/dd hh:mm');
                    this.park.station_name = res.content.station_name;
                } else {
                    this.park = { station_name: '', begin: '', money: '' };
                    this.qrStr = '';
                    this.$vux.toast.text(res.message);
                }
            });

        },
        dataInit() {
            this.park = {};
            this.plate = '';
            if (!this.isUnfixedCoupon) {
                this.couponId = [];//放行券商家优惠券不要置空
                this.unfixedCouponName = '';
            }
            this.pondId = [];
            this.reseivedCoupon = 0;
            this.pass_amount = '';
        },
        //发送优惠券
        sendCoupon() {
            if (!this.plate) {
                this.$vux.toast.text('请输入车牌'); return;
            }
            if (!this.park.station_name) {
                this.$vux.toast.text('车辆停车信息查询失败'); return;
            }
            if (this.isUnfixedCoupon) {
                if (!this.couponId[0]) {
                    this.$vux.toast.text('请选择资金池'); return;
                }
                if (!this.pass_amount) {
                    this.pass_amount = 0;//0表示不限制
                }
                if (!utils.validator.isMoney.test(this.pass_amount)) {
                    this.$vux.toast.text('金额格式不对'); return;
                }
            } else {
                if (!this.couponId[0]) {
                    this.$vux.toast.text('请选择优惠券'); return;
                }
            }
            let postData = {
                plate: this.plate,
                phone: this.loginInfo.mobile,
                type_id: this.couponId[0],
                merchant_id: this.merchantInfo.id
            };

            if (this.isUnfixedCoupon) {
                postData.pond_id = this.pondId[0];
                postData.pass_amount = this.pass_amount;
            } else {
                postData.pond_id = this.pondId[0];
            }

            this.$loading.show({ content: '正在发送中,请稍后...', mask: true });
            utils.gateway(utils.api.couponSend, postData).then(res => {
                this.$loading.hide();
                if (res && res.code == 0) {
                    this.$vux.toast.text('发送成功');
                    this.dataInit();
                } else {
                    this.$vux.toast.text(res.message);
                }
            });
        },
        qrCode() {
            setTimeout(() => { this.showqrCode() }, 10000)
        },
        showqrCode() {
            let urlhead = `${window.location.protocol}//${window.location.host}/coupon/receive?`;
            if (this.isUnfixedCoupon) {
                utils.gateway(utils.api.setQRtoken).then(res => {
                    if (res && res.content) {
                        let codeInfo = {
                            type: 'isUnfixedCoupon',
                            merchant_id: this.merchantInfo.id,
                            station: this.park.station_name,
                            intime: this.park.begin,
                            money: this.park.money,
                            pond_id: this.pondId[0],
                            token: res.content
                        }
                        this.codeStr = urlhead + 'codeInfo=' + JSON.stringify(codeInfo);
                        console.log('放行券领券', this.codeStr)
                        this.qrCode();
                    }
                });

            } else {
                let postData = {
                    page: 1,
                    pagesize: 500,
                    status: 'unused',
                    type: this.couponId[0],
                    phone: this.loginInfo.mobile,
                    merchant_id: this.merchantInfo.id
                }
                if (!this.merchantInfo.id) { this.$vux.toast.text("缺少商家信息"); return; }
                utils.gateway(utils.api.couponLists, postData).then(res => {
                    if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                        let codeInfo = {
                            type: 'isfixedCoupon',
                            merchant_id: this.merchantInfo.id,
                            money: this.park.money,
                            intime: this.park.begin,
                            station: this.park.station_name,
                            phone: this.loginInfo.mobile,
                            cnum: res.content.lists[0].cnum
                        }
                        this.codeStr = urlhead + 'codeInfo=' + JSON.stringify(codeInfo);
                        this.qrCode();
                        console.log('定额券领取', this.codeStr)
                    } else {
                        this.$vux.toast.text("无可用优惠券");
                        this.codeStr = '';
                    }
                });
            }
        },

        //优惠劵商户资金池
        getCouponpond() {
            let postData = { page: 1, pagesize: 500, expiry: 'Y', merchant_id: this.merchantInfo.id };
            utils.gateway(utils.api.pondLists, postData).then(res => {
                if (res && res.content) {
                    let list = res.content.lists || [];
                    if (list.length > 0) {
                        list = list.map((el) => {
                            el.name = el.type_name + '(剩余' + el.balance + '元)';
                            el.value = el.id.toString();
                            return el;
                        })
                        this.pondList = [list];
                        this.pondId = [list[0].value];
                        console.log('this.pondList', this.pondList)
                    }
                }
            });
        },
        //查询已经发券的金额
        getReceivedCoupon() {
            if (!(this.plate && this.merchantInfo.id)) {
                console.log('plate or merchant_id not undefined');
                return;
            }
            let postData = {
                batch: 'all', page: 1, pagesize: 1000, merchant_id: this.merchantInfo.id, plate: this.plate, status: 1, is_expired: 'N'
            };
            utils.gateway(utils.api.couponLists, postData).then(res => {
                if (res && res.content && Array.isArray(res.content.lists)) {
                    let lists = res.content.lists.map(item => parseFloat(item.denomination, 10));
                    const reducer = (accumulator, currentValue) => accumulator + currentValue;
                    this.reseivedCoupon = lists.reduce(reducer, 0);
                }
            });
        },
        //查询优惠券余额
        getAmountDetail() {
            let postData = {
                page: 1,
                pagesize: 500,
                limit_type: 'notsure',
                merchant: this.merchantInfo.id,
                create_id: this.couponId[0]
            }
            utils.gateway(utils.api.limitLists, postData).then(res => {
                if (res && res.content) {
                    let coupons = res.content.lists || [];
                    if (coupons[0]) {
                        let total = utils.accMul(coupons[0].limit_num, 1000);
                        let useNum = utils.accMul(coupons[0].used_num, 1000);
                        let remain = utils.accDel(total, useNum);
                        remain = utils.accDiv(remain, 1000);
                        this.unfixedMoneyDetail = `总额:${coupons[0].limit_num}元;余额${remain}元`;
                    }
                }
            });
        },
        getCouponType() {

            if (this.isUnfixedCoupon) {
                let postData = { pagesize: 500, page: 1, kind: '3' };
                utils.gateway(utils.api.couponTypeLists, postData).then(res => {
                    if (res && res.content && res.content) {
                        let list = res.content.lists || [];
                        if (list[0]) {
                            this.unfixedCouponName = list[0].coupon_type;
                            this.couponId = [list[0].id];
                            this.getAmountDetail();//查询放行券优惠券余额
                        }
                    }
                });
            } else {
                let postData = { pagesize: 500, page: 1, phone: this.loginInfo.mobile, merchant_id: this.merchantInfo.id };
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

