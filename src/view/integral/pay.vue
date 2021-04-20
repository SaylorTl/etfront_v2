<template>
    <div class="unit-bg page-temp-fee integral">
        <div @click="login" v-if="!integralUser.mobile" class="top-tiplogin">点击登录，享受会员优惠</div>
        <div class="cost-card card">
            <div class="cost-box-top">
                <div class="cost-box-top-desc">
                    <div>{{stationInfo.plate}}</div>
                    <div>{{stationInfo.station_name}}</div>
                </div>
                <div class="cost-box-top-image">
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190709/logo.png">
                </div>
            </div>
            <div class="cost-box-bottom">
                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_parking.svg">
                <div>{{stationInfo.station_address}}</div>
            </div>
        </div>
        <div class="cost-form">
            <form-item label="停车时长" :content="duringTime"></form-item>
            <form-item label="入场时间" :content="stationInfo.arrival_time"></form-item>
            <form-item label="可使用积分" :content="userIntegral.fixed_integral||'--'+' 分'"></form-item>
            <form-item label="停车费" :content="total +' 元'"></form-item>
            <form-item label="优惠券" :content="coupon +' 元'"></form-item>
            <form-item v-show="showIntegral" label="兑换时长（分）">
                <div slot="content">
                    <x-xinput v-model="timeMinute" @on-change="timeChange(timeMinute)" type="number" :placeholder="'最大输入'+maxTime" :show-clear="false" text-align="right"></x-xinput>
                </div>
            </form-item>
            <!-- <form-item v-show="showIntegral" label="兑换金额">
                <div slot="content">
                    <x-xinput v-model="timeMinute" @on-blur="timeBlur(timeMinute)" type="number" :placeholder="'最大输入'+maxTime" :show-clear="false" text-align="right"></x-xinput>
                </div>
            </form-item> -->
            <form-item v-show="showIntegral" label="兑换方式">
                <div slot="content">
                    <x-checklist label-position="right" :options="integralOption" :max="1" :min="1" v-model="integralType" @on-change="typeChange"></x-checklist>
                </div>
            </form-item>
            <form-item v-show="showIntegral" label="兑换时段" :border="false">
                <div slot="content">
                    <x-datetime v-model="startTime" readonly format="YYYY-MM-DD HH:mm"></x-datetime>
                    <x-datetime v-model="costResult.time_end" readonly format="YYYY-MM-DD HH:mm"></x-datetime>
                </div>
            </form-item>
            <form-item v-show="showIntegral" label="兑换金额" :content="(userIntegralInfo.deduct_mount.toString()||'--') +' 元'">
            </form-item>
            <x-xbutton :disabled="!canPay" @click.native="pay">{{btnText}}</x-xbutton>

        </div>
        <div class="bottom-menus flex">
            <img :class="{active:active==='1'}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190826/stop-1.svg" />
            <img @click="history" :class="{active:active==='2'}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190826/stop-2.svg" />
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils.js";
import auth from "../../utils/auth.js";
import FormItem from "../../components/FormItem/index";
import { mapState } from "vuex";

export default {
    name: "integral-Pay",
    props: {},
    components: { FormItem },
    data() {
        return {
            active: '1',
            integralType: ['cancel'],
            integralOption: [{ key: 'time', value: '时长' }],
            total: 0,
            maxTime: 0,
            timeMinute: '',
            dValue: 0,
            costResult: {},
            userIntegralInfo: { deduct_mount: '' },
            userIntegral: { fixed_integral: 0, temp_integral: 0 },
            startTime: '----/--/--   --:--:--',
            plate: "",
            duringTime: "00:00",
            coupon: "0",
            haveToPay: "--",
            uuid: "",
            canPay: false,
            canRun: true,
            btnText: "停车缴费",
            sourceId: "",
            timer: '',
            integralUser: {},
            notuse: false,
            stationInfo: {}
        };
    },
    computed: {
        ...mapState(["loginInfo"]),
        showIntegral: function () {
            return this.integralUser.mobile && (!this.userIntegral.flag) && (!this.notuse) && this.total !== 0;
        }
    },
    mounted() {
        const { plate } = this.$route.query;
        this.plate = plate;
        this.isInStation(plate);
        this.integralUser = JSON.parse(window.localStorage.getItem('integralUser')) || {};
        this.timer = setInterval(() => {
            this.statistics();
        }, 170000);
        //先获取积分，再计费
    },
    methods: {
        login() {
            this.$router.push({ path: "/integral/login", query: { plate: this.plate } });
        },
        history() {
            this.$router.push({ path: "/integral/history" });
        },
        typeChange(e) {
            let type = this.integralType[0];
            if (type === 'time') {
                if (!(utils.validator.isInt.test(this.timeMinute) && this.timeMinute > 0)) {
                    this.timeMinute = '';
                    this.$forceUpdate();
                    console.log('this.timeMinutethis.$forceUpdate()', this.timeMinute);
                    this.integralType = ['cancel'];
                    this.$vux.alert.show('兑换时长请输入大于0的整数');
                    return ;
                }
                this.getTimeAmount();
            } else {
                this.startTime = '----/--/--   --:--:--';
                this.userIntegralInfo.deduct_mount = '--';
                this.statistics();
            }
        },
        //查询车辆在场信息
        isInStation(plate) {
            utils.gateway(utils.api.getParkingInfoByPlate, { plate: plate }).then(res => {
                if (res && res.code === 0 && res.content) {
                    this.stationInfo = res.content;
                    this.stationInfo.arrival_time = utils.eptimes.outTime(res.content.arrival_time, 'yyyy/MM/dd hh:mm:ss');
                    if (this.integralUser.mobile) {
                        this.getIntegral();
                    } else {
                        this.statistics();
                    }
                    this.getFeeInfoByStation();
                } else {
                    this.$vux.alert.show('没查到停车记录，请重新查询')
                }
            });
        },
        //获取用户积分
        getIntegral() {
            utils.gateway(utils.api.integralCovert, {
                mobile: this.integralUser.mobile,
                station_name: this.stationInfo.station_name
            }).then(res => {
                if (res && res.content) {
                    this.userIntegral = res.content || { fixed_integral: 0, temp_integral: 0 };
                    this.statistics();
                }
            })
        },
        timeChange() {
            //当时长有变化时  需要重新计费和重置时间
            //当输入值大于最大值时this.timeMinute会重置为最大值，这情况下不需要重置时间和积分类型
            if (this.maxTime !== this.timeMinute) {
                this.integralType = ['cancel'];
                this.startTime = '----/--/--   --:--:--';
                this.userIntegralInfo.deduct_mount = '--';
            }
        },
        //时间处理
        timeFormat(temp) {
            this.duringTime = this.transforData(temp.time_begin, temp.time_end);
            this.maxTime = this.userIntegral.time <= this.dValue ? this.userIntegral.time : this.dValue;
        },
        //查询时长兑换
        getTimeAmount() {
            let val = this.timeMinute;
            if (this.integralType[0] === 'time' && (utils.validator.isInt.test(this.timeMinute) && this.timeMinute > 0)) {
                if (!(utils.validator.isInt.test(val) && val > 0)) { this.timeMinute = ''; return }
                if (val > this.maxTime) { this.timeMinute = this.maxTime; }
                let date = new Date(this.costResult.time_end);
                let min = date.getMinutes();
                date.setMinutes(min - this.timeMinute);
                this.startTime = utils.eptimes.outTime(date, 'yyyy/MM/dd hh:mm:ss');
                const times = utils.eptimes.outTime(this.startTime, 'yyyy-MM-dd hh:mm:ss') + '@' + utils.eptimes.outTime(this.costResult.time_end, 'yyyy-MM-dd hh:mm:ss');
                console.log('times', times)
                let params = {
                    cost_uuid: this.costResult.cost_uuid,
                    mobile: this.integralUser.mobile,
                    convert_type: this.userIntegral.convert_type,
                    convert_use_time: times
                };
                this.$loading.show();
                utils.gateway(utils.api.integralUsed, params).then(res => {
                    this.$loading.hide();
                    if (res && res.content) {
                        this.userIntegralInfo = { ...res.content };
                        if (this.userIntegralInfo.deduct_mount > 0) {
                            this.userIntegralInfo.deduct_mount = this.userIntegralInfo.deduct_mount.toFixed(2);
                            let haveToPay = this.total || 0;
                            if (this.coupon > 0) {
                                haveToPay = utils.accDel(haveToPay, this.coupon).toFixed(2);
                            }
                            if (this.userIntegralInfo.deduct_mount > 0) {
                                haveToPay = utils.accDel(haveToPay, this.userIntegralInfo.deduct_mount).toFixed(2);
                            }
                            if (haveToPay === '0.00') {
                                this.btnText = `确认出场`;
                            } else if (haveToPay > 0) {
                                this.btnText = `停车缴费/${haveToPay}元`;
                            }
                            else {
                                this.canPay = false;
                                this.btnText = `缴费金额异常`;
                            }
                            console.log('this.haveToPay', haveToPay);
                            this.haveToPay = haveToPay;
                            //更新时间this.userIntegralInfo.convert_time
                            //this.timeMinute = this.userIntegralInfo.convert_time;
                            let date = new Date(this.costResult.time_end);
                            let min = date.getMinutes();
                            date.setMinutes(min - this.timeMinute);
                            this.startTime = utils.eptimes.outTime(date, 'yyyy/MM/dd hh:mm:ss');
                        }
                    }
                    console.log('integralUsed', res);
                });
            }
        },

        //计费
        statistics() {
            let params = {
                station_id: this.stationInfo.station,
                plate: this.plate
            };
            this.$loading.show();
            this.canPay = false;
            utils.gateway(utils.api.tempCharge, params).then(res => {
                this.$loading.hide();

                console.log("计费结果：", res);
                if (res.code === 0 && !!res.content) {
                    let temp = res.content || {};
                    if (temp.coupon_info && Array.isArray(temp.coupon_info.coupon_lists)) {
                        //1:一卡通  2:优惠券 3:月卡折扣 4:银联无感 5:积分
                        let notuse = temp.coupon_info.coupon_lists.some(el => { return el.coupon_type === 1 || el.coupon_type === 4 })
                        //1，4不能使用积分
                        if (notuse) {
                            this.notuse = true;
                            this.$vux.alert.show('一卡通和银联无感不能使用积分')
                        }
                    }
                    temp.time_end = utils.eptimes.outTime(temp.time_end, 'yyyy/MM/dd hh:mm:ss');
                    this.costResult = temp;
                    if (Array.isArray(temp.coupon_info) && temp.coupon_info.length === 0) {
                        this.coupon = 0;
                        this.haveToPay = parseFloat(temp.total_amount);
                    } else {
                        this.coupon = parseFloat(temp.coupon_info.coupon_money);
                        this.haveToPay = (parseFloat(temp.total_amount) - parseFloat(temp.coupon_info.coupon_money)).toFixed(2);
                    }
                    let total = parseFloat(temp.total_amount);
                    if (this.haveToPay <= 0) {
                        this.haveToPay = 0;
                        this.coupon = total;
                    }
                    this.canPay = true;
                    this.total = parseFloat(temp.total_amount);
                    this.timeFormat(temp);//时长处理。限制时间选择处理
                    this.uuid = temp.cost_uuid;
                    if (this.total === 0 || this.haveToPay === 0) {
                        this.canPay = true;
                        this.btnText = "确认出场";
                    } else if (this.haveToPay > 0) {
                        this.btnText = "停车缴费/" + this.haveToPay + '元';
                        this.canPay = true;
                    }
                    this.getTimeAmount();
                }
            });
        },
        transforData(startTime, endTime) {
            let result = "";
            let s = utils.eptimes.outTime(startTime.replace(/-/g, "/"), "yyyy/MM/dd hh:mm:ss");
            s = new Date(s).getTime();
            let e = utils.eptimes.outTime(endTime.replace(/-/g, "/"), "yyyy/MM/dd hh:mm:ss");
            e = new Date(e).getTime();
            let dValue = e - s;
            this.dValue = parseInt((e - s) / 1000 / 60);
            result = utils.eptimes.diffTime(dValue);
            return result;
        },
        //0元开闸出场
        unLicenseOpen() {
            const { user_id } = { ...this.integralUser }
            let params = {
                user_id,
                client_id: this.loginInfo.client_id,
                source_id: this.sourceId,
                cost_uuid: this.uuid
            };
            utils.gateway(utils.api.costOpenDevice, params).then(res => {
                if (res && res.code === 0) {
                    this.$vux.toast.text('已下发出闸', "middle");
                    this.$router.push({ path: "/integral/plate" });
                } else {
                    this.$vux.toast.text(res.message, "middle");
                }
            });
        },
        //停车场是否支持缴费
        getFeeInfoByStation() {
            this.$loading.show();
            let params = {
                station_id: this.stationInfo.station
            };
            let appId = auth.getAppid();
            // this.countDown();
            utils.gateway(utils.api.getFeeInfoByStation, params).then(res => {
                this.$loading.hide();
                console.log("是否支持缴费：", res);
                if (res && res.code === 0 && !!res.content && Array.isArray(res.content)) {
                    if (res.content.length > 0) {
                        let result = res.content;
                        let tempArr = result.filter(item => {
                            return (item.channel_appid === appId && item.paymethod_type === "TEMP");
                        });
                        if (tempArr.length > 0) {
                            this.source = tempArr[0].source;
                            this.sourceId = tempArr[0].source_id;
                        } else {
                            if (this.loginInfo.app_id === "czy") {
                                this.source = "CZY";
                                this.sourceId = 22;
                            } else {
                                this.$vux.toast.text("该车场不支持缴费", "middle");
                            }
                        }
                    } else {
                        this.$vux.toast.text("该车场不支持缴费", "middle");
                    }
                } else {
                    this.$vux.toast.text(res.message, "middle");
                }
            });
        },
        //下单后扣减积分
        orderuseIntegral(temp, redirectPlate) {
            const { user_id, username, mobile } = { ...this.integralUser }
            const { station, plate } = { ...this.stationInfo }
            let costResult = this.costResult;
            let params = {
                user_id,
                username,
                mobile,
                tnum: temp.tnum
            };
            utils.gateway(utils.api.integralusedAdd, params).then(res => {
                this.canPay = true;
                console.log("积分使用结果：", res);
                if (redirectPlate) {
                    this.$router.push({ path: "/integral/plate" });
                } else {
                    window.location.href = temp.redirect;
                }
                return;
            });
        },
        //微信支付
        pay() {
            if (this.haveToPay === '0.00' || this.haveToPay === 0 || this.total === 0) {
                this.unLicenseOpen();
            } else {
                if (this.canRun) {
                    let cost_uuid = this.uuid;
                    let total = this.total;
                    let haveToPay = this.haveToPay;
                    let clientId = this.loginInfo.client_id;
                    let openid = this.loginInfo.open_id;
                    let source = this.source;
                    let body = "积分缴费-" + this.stationInfo.station_name + "-" + this.plate + "-" + utils.eptimes.outTime(this.costResult.time_begin, "MMddhhmm") + "-" + utils.eptimes.outTime(this.costResult.time_end, "MMddhhmm");
                    let return_url = `${window.location.protocol}//${window.location.host}/integral/payResult?plate=` + this.plate;
                    let attach = "";
                    this.$loading.show();
                    let method = utils.api.getTempOrder;
                    let params = {
                        cost_uuid,
                        total_amount: total * 100,
                        amount: haveToPay * 100,
                        client_id: clientId,
                        source,
                        body,
                        openid,
                        return_url,
                        attach
                    };
                    utils.gateway(method, params).then(res => {
                        this.canPay = true;
                        console.log("订单结果：", res);
                        if (res && res.content) {
                            if (this.userIntegralInfo.deduct_mount > 0) {
                                this.orderuseIntegral(res.content);
                            } else {
                                window.location.href = res.content.redirect;
                            }
                        }
                        else {
                            this.$vux.alert.show(res.message)
                        }
                    });
                    this.canRun = false;
                }
            }
        },
    }
};
</script>
<style scoped type="less">
.cost-form {
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 300px;
}
</style>
