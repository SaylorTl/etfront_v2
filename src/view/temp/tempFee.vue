<template>
    <div class="unit-bg page-temp-fee">
        <div class="cost-card card">
            <div class="cost-box-top">
                <div class="cost-box-top-desc">
                    <div>{{plate}}</div>
                    <div>{{stationInfo.stationName}}</div>
                </div>
                <div class="cost-box-top-image">
                    <img :src="logo">
                </div>
            </div>
            <div class="cost-box-bottom">
                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_parking.svg">
                <div>{{stationInfo.address}}</div>
            </div>
        </div>
        <div class="cost-form">
            <form-item label="停车场" :content="stationInfo.stationName" arrow @handleClick="skip"></form-item>
            <form-item label="停车时长" :content="duringTime"></form-item>
            <form-item label="入场时间" :content="enterTime"></form-item>
            <form-item label="备注" :content="remark"></form-item>
            <form-item label="优惠金额" :content="coupon+''"></form-item>
            <form-item label="应付金额" :border="false">
                <div slot="content">
                    <div class="cell-total">{{haveToPay}}<span>元</span></div>
                    <div class="cell-tips">{{calcStr}}</div>
                </div>
            </form-item>
            <form-item label="可用彩惠抵扣金" v-if="hasDeduction" :border="!hasDeduction">
                <div slot="content" class="month-fee-form__coupon">￥{{ caihuiDeduction.coupon_amount || ' _ ' }}元
                    <input type="checkbox" class="month-fee-checkbox" v-model="caihuiDeduction.isUsed">
                </div>
            </form-item>
        </div>
        <!-- <div class="cost-countdown">{{countDownTxt}}</div> -->
        <div class="cost-btn">
            <x-xbutton :disabled="!canPay" @click.native="pay">{{btnText}}</x-xbutton>
        </div>
        <div class="cost-tips">
            <div><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_question.svg"></div>
            <div>有疑问<a href="tel:400-1506888">联系客服</a></div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils.js";
import auth from "../../utils/auth.js";
import FormItem from "../../components/FormItem/index";
import { mapState } from "vuex";
export default {
    name: "temp-fee",
    props: {},
    components: { FormItem },
    data() {
        return {
            stationInfo: {},
            plate: "",
            duringTime: "00:00",
            enterTime: "--/--",
            exitTime: "00:00",
            remark: "无",
            coupon: "0",
            haveToPay: "__",
            calcStr: "",
            uuid: "",
            canPay: false,
            canRun: true,
            timer: "",
            deviceId: "",
            unLicenseUser: "",
            btnText: "支付",
            sourceId: "",
            isNoPlate: false,
            refreshTime: 60,
            countDownTxt: "",
            logo: "http://cache.aparcar.cn/car/unknown.jpg",
            caihuiDeduction: {
                isUsed: false
            },
            hasDeduction: false
        };
    },
    computed: {
        ...mapState(["loginInfo","clientType"])
    },
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
        const { stationInfo, plate, deviceId } = this.$route.query;
        if (!!plate) {
            this.plate = plate;
            this.getCarFlagByPlate();
            if (!!stationInfo) {
                this.stationInfo = JSON.parse(stationInfo);
                this.getFeeInfoByStation();
                this.timer = setInterval(() => {
                    this.getFeeInfoByStation();
                }, 60 * 1000);
            } else {
                this.dealStation(plate);
                this.timer = setInterval(() => {
                    this.dealStation(plate);
                }, 60 * 1000);
            }
        } else if (!!deviceId) {
            this.deviceId = deviceId;
            let params = {
                device_id: deviceId
            };
            this.getPlateByBarrier(params);
        }
        // this.countDownTxt = "温馨提示:60秒后将重新计费";
    },
    beforeDestroy() {},
    // beforeRouteEnter(to, from, next) {
    //     if (from.name === "no-plate") {
    //         utils.setTitle("无牌车缴费");
    //         next();
    //     } else {
    //         utils.setTitle("临停缴费");
    //         next();
    //     }
    // },
    beforeRouteLeave(to, from, next) {
        clearInterval(this.timer);
        next();
    },
    methods: {
        /**
         * 根据车牌获取车标信息
         */
        getCarFlagByPlate() {
            utils
                .gateway(utils.api.getCarInfo, { plate: this.plate })
                .then(res => {
                    if (res.code === 0 && !!res.content && !!res.content.logo) {
                        this.logo = `http://cache.aparcar.cn/car/${res.content.logo}`;
                    }
                });
        },
        /**
         * 根据设备ID获取车牌信息
         */
        getPlateByBarrier(params) {
            utils.gateway(utils.api.getPlateByDeviceId, params).then(res => {
                console.log("车牌信息：", res.data);
                if (
                    res.code === 0 &&
                    !!res.content &&
                    Array.isArray(res.content) &&
                    res.content.length > 0 &&
                    res.content[0].plate != "识别错误"
                ) {
                    this.plate = res.content[0].plate;
                    this.dealStation(this.plate);
                    utils.setTitle("临停缴费")
                } else {
                    this.getNoLicenseInfo();
                }
            });
        },
        /**
         * 根据车牌获取停车信息
         */
        getParkingInfoByPlate(plate) {
            return utils
                .gateway(utils.api.getParkingInfoByPlate, {
                    plate
                })
                .then(res => res);
        },
        dealStation(plate) {
            this.getParkingInfoByPlate(plate).then(res => {
                if (res.code === 0 && !!res.content) {
                    let result = res.content;
                    this.stationInfo = {
                        station: result.station,
                        stationName: result.station_name,
                        address: !!result.staion_address
                            ? result.staion_address
                            : "",
                        car: result.car
                    };
                    this.getFeeInfoByStation();
                } else {
                    this.$router.push({
                            name: "temp-pay",
                            query: {
                                stationId:this.deviceId?this.$route.query.stationId:''
                            }
                        });
                }
            });
        },
        /**
         * 查询无牌车信息
         */
        getNoLicenseInfo() {
            let param = {
                device_id: this.deviceId,
                unionid: this.loginInfo.unionid
            };
            if (!this.loginInfo.unionid) {
                param = {
                    device_id: this.deviceId,
                    mobile: this.loginInfo.mobile
                };
            }
            utils.gateway(utils.api.getUnlicensePlate, param).then(res => {
                if (res.code === 0 && res.content) {
                    if (res.content.flag) {
                        utils.setTitle("无牌车缴费")
                        this.plate = "无牌车";
                        this.isNoPlate = true;
                        this.unLicenseUser = res.content.user_id;
                        this.stationInfo = {
                            station: res.content.station_id,
                            stationName: res.content.station_name,
                            address: !!res.content.staion_address
                                ? res.content.staion_address
                                : ""
                        };
                        this.getFeeInfoByStation();
                    } else {
                        utils.setTitle("临停缴费")
                        this.$router.push({
                            name: "temp-pay",
                            query: {
                                stationId:this.deviceId?this.$route.query.stationId:''
                            }
                        });
                    }
                } else {
                    this.$router.push({
                        name: "temp-pay",
                        query: {
                            stationId:this.deviceId?this.$route.query.stationId:''
                        }
                    });
                }
            });
        },
        /**
         * 无牌车计费
         */
        unLicenseCharge() {
            let deviceId = this.deviceId;
            let userId = this.unLicenseUser;
            utils
                .gateway(utils.api.unLicenseCharge, {
                    client_id: userId,
                    device_id: deviceId
                })
                .then(res => {
                    if (res.code === 0 && !!res.content) {
                        let temp = res.content;
                        let haveToPay = this.haveToPay;
                        let coupon = this.coupon;
                        if (
                            Array.isArray(temp.coupon_info) &&
                            temp.coupon_info.length === 0
                        ) {
                            coupon = 0;
                            haveToPay = parseFloat(temp.total_amount);
                        } else {
                            coupon = parseFloat(temp.coupon_info.coupon_money);
                            haveToPay = (
                                parseFloat(temp.total_amount) -
                                parseFloat(temp.coupon_info.coupon_money)
                            ).toFixed(2);
                        }
                        let total = parseFloat(temp.total_amount);
                        if (haveToPay <= 0) {
                            haveToPay = 0;
                            coupon = total;
                        }
                        this.canPay = true;
                        this.total = parseFloat(temp.total_amount);
                        this.haveToPay = haveToPay;
                        this.enterTime = temp.time_begin.replace(/-/g, "/");
                        this.exitTime = temp.time_end.replace(/-/g, "/");
                        this.duringTime = this.transforData(
                            temp.time_begin,
                            temp.time_end
                        );
                        this.coupon = coupon;
                        this.uuid = temp.cost_uuid;
                        this.calcStr = `(￥${this.total} - ￥${this.coupon})`;
                        if (this.total === 0 || this.haveToPay === 0) {
                            this.btnText = "确认出场";
                            this.canPay = true;
                        } else if (this.haveToPay > 0) {
                            this.btnText = "支付";
                            this.canPay = true;
                        }
                    } else {
                        this.$vux.toast.text(res.message, "middle");
                    }
                });
        },
        /**
         * 无牌车开闸
         */
        unLicenseOpen() {
            let userId = this.unLicenseUser,
                deviceId = this.deviceId;
            let params = {};
            if (this.isNoPlate) {
                params = {
                    client_id: this.loginInfo.client_id,
                    source_id: this.sourceId,
                    cost_uuid: this.uuid,
                    device_id: this.deviceId,
                    user_id: this.loginInfo.user_id
                };
            } else {
                params = {
                    client_id: this.loginInfo.client_id,
                    source_id: this.sourceId,
                    cost_uuid: this.uuid
                };
            }
            utils.gateway(utils.api.costOpenDevice, params).then(res => {
                if (res.code != 0) {
                    this.$vux.toast.text(res.message, "middle");
                } else {
                    this.$router.push({
                        name: "temp-result",
                        query: {
                            plate: this.plate,
                            status: "success"
                        }
                    });
                }
            });
        },
        // countDown(){
        //     this.refreshTime = 60;
        //     let timer = setInterval(() => {
        //         this.refreshTime--;
        //         this.countDownTxt = `温馨提示:${this.refreshTime}秒后将重新计费`;
        //         if(this.refreshTime === 0){
        //             clearInterval(timer);
        //         }

        //     }, 1000);
        // },
        /**
         * 停车场是否支持缴费
         */
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
                if (
                    res.code === 0 &&
                    !!res.content &&
                    Array.isArray(res.content)
                ) {
                    if (res.content.length > 0) {
                        let result = res.content;
                        let tempArr = result.filter(item => {
                            return (
                                item.channel_appid === appId &&
                                item.paymethod_type === "TEMP"
                            );
                        });
                        if (tempArr.length > 0) {
                            this.source = tempArr[0].source;
                            this.sourceId = tempArr[0].source_id;
                            if (!this.isNoPlate) {
                                this.statistics();
                            } else {
                                this.unLicenseCharge();
                            }
                        } else {
                            if (this.loginInfo.app_id === "czy") {
                                this.source = "CZY";
                                this.sourceId = 22;
                                if (!this.isNoPlate) {
                                    this.statistics();
                                } else {
                                    this.unLicenseCharge();
                                }
                            } else {
                                this.$vux.toast.text(
                                    "该车场不支持缴费",
                                    "middle"
                                );
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
        statistics() {
            //计费
            let params = {
                station_id: this.stationInfo.station,
                plate: this.plate
            };
            this.$loading.show();
            utils.gateway(utils.api.tempCharge, params).then(res => {
                this.$loading.hide();
                console.log("计费结果：", res);
                if (res.code === 0 && !!res.content) {
                    let temp = res.content;
                    let wgflag = false;
                    let deductionObj = {};
                    if (
                        !!temp.coupon_info &&
                        Array.isArray(temp.coupon_info.coupon_lists) &&
                        temp.coupon_info.coupon_lists.length === 0
                    ) {
                        this.coupon = 0;
                        this.haveToPay = parseFloat(temp.total_amount);
                    } else {
                        let couponLists = temp.coupon_info.coupon_lists;
                        deductionObj = temp.coupon_info.coupon_lists.find(item => {
                            return item.coupon_type === 6;
                        })
                        wgflag = couponLists.some(item => {
                            //银联无感标识
                            return parseInt(item.coupon_type) === 4;
                        });
                        this.coupon = parseFloat(temp.coupon_info.coupon_money);
                        this.haveToPay = (
                            parseFloat(temp.total_amount) -
                            parseFloat(temp.coupon_info.coupon_money)
                        ).toFixed(2);
                    }

                    let total = parseFloat(temp.total_amount);
                    if (this.haveToPay <= 0) {
                        this.haveToPay = 0;
                        this.coupon = total;
                    }
                    this.total = parseFloat(temp.total_amount);
                    this.enterTime = utils.eptimes.outTime(
                        temp.time_begin.replace(/-/g, "/"),
                        "MM/dd hh:mm"
                    );
                    this.exitTime = utils.eptimes.outTime(
                        temp.time_end.replace(/-/g, "/"),
                        "MM/dd hh:mm:ss"
                    );
                    this.duringTime = this.transforData(
                        temp.time_begin,
                        temp.time_end
                    );
                    this.uuid = temp.cost_uuid;
                    this.calcStr = `(￥${this.total} - ￥${this.coupon})`;
                    let minusZero =
                        parseFloat(temp.total_amount) -
                            parseFloat(this.coupon) ==
                        0;
                    console.log("havaToPay", this.haveToPay);
                    if (temp.total_amount > 0 && minusZero) {
                        this.canPay = true;
                        this.btnText = "确认出场";
                    } else if (this.haveToPay > 0) {
                        this.btnText = "支付";
                        this.canPay = true;
                    }
                    if (this.clientType === 'CZY'  && deductionObj && deductionObj.coupon_amount && parseFloat(deductionObj.coupon_amount) >= this.haveToPay ){ // 处理彩惠抵扣金
                        this.caihuiDeduction.coupon_amount = parseFloat(deductionObj.coupon_amount);
                        this.hasDeduction = true;
                        this.caihuiDeduction.coupon_uuid = deductionObj.coupon_uuid;
                        this.caihuiDeduction.defaultTotal = this.haveToPay; //存储实付金额
                        this.$watch('caihuiDeduction.isUsed', this.handleUseDeduction);
                        this.caihuiDeduction.isUsed = true;
                    }   
                    if (wgflag) {
                        this.$vux.confirm.show({
                            title: "温馨提示",
                            content:
                                "该车场支持银联/民生无感支付，请避免重复缴费！",
                            confirmText: "继续支付",
                            onShow:() => {
                                
                            },
                            onHide:() => {
                                console.log("Plugin: I'm hiding");
                            }
                        });
                    }
                } else {
                    this.$vux.toast.text(res.message, "middle");
                }
            });
        },
        handleUseDeduction (newVal, oldVal) {
            if(!newVal){ //不使用抵扣
                this.btnText = this.caihuiDeduction.defaultTotal > 0 ? '支付':'确认出场';
                this.calcStr = `(￥${this.total} - ￥${this.coupon})`;
                return this.haveToPay = this.caihuiDeduction.defaultTotal;
            }
            if(this.caihuiDeduction.coupon_amount >= this.haveToPay ){ // 全额抵扣
                this.haveToPay === 0 
                ? this.calcStr = `(￥${this.total} - ￥${this.coupon})`
                : this.calcStr = `(￥${this.total} - ￥${this.coupon} - ￥${this.haveToPay})`;
                this.haveToPay = 0;
                this.btnText = '确认抵扣';
            }
            /* else{ // 部分抵扣
                if(this.clientType === 'CAIHUI'){
                    this.haveToPay -= this.caihuiDeduction.coupon_amount;
                    this.calcStr = `(￥${this.total} - ￥${this.coupon} - ￥${this.this.caihuiDeduction.coupon_amount})`;
                    this.btnText = '支付';
                }
            
            } */
        },
        transforData(startTime, endTime) {
            let result = "";
            let s = utils.eptimes.outTime(
                startTime.replace(/-/g, "/"),
                "yyyy/MM/dd hh:mm:ss"
            );
            s = new Date(s).getTime();
            let e = utils.eptimes.outTime(
                endTime.replace(/-/g, "/"),
                "yyyy/MM/dd hh:mm:ss"
            );
            e = new Date(e).getTime();
            let dValue = e - s;
            if (parseInt(dValue / 1000) === 0) {
                result = "0分";
            } else if (
                parseInt(dValue / 1000) > 0 &&
                parseFloat(dValue / 1000) < 60
            ) {
                result = "0分";
            } else if (
                parseFloat(dValue / 1000) >= 60 &&
                parseFloat(dValue / 1000 / 60) < 60
            ) {
                result = parseInt(dValue / 1000 / 60) + "分";
            } else if (
                parseFloat(dValue / 1000 / 60) >= 60 &&
                parseFloat(dValue / 1000 / 60 / 60) < 24
            ) {
                result =
                    parseInt(dValue / 1000 / 60 / 60) +
                    "小时 " +
                    parseInt((dValue / 1000 / 60) % 60) +
                    "分";
            } else if (parseFloat(dValue / 1000 / 60 / 60) >= 24) {
                result =
                    parseInt(dValue / 1000 / 60 / 60 / 24) +
                    "天 " +
                    parseInt((dValue / 1000 / 60 / 60) % 24) +
                    "小时 " +
                    parseInt((dValue / 1000 / 60) % 60) +
                    "分";
            }
            return result;
        },
        pay() {
            if (this.haveToPay === 0 || this.total === 0) {
                this.unLicenseOpen();
            } else {
                if (this.canRun) {
                    let uuid = this.uuid;
                    let total = this.total;
                    let haveToPay = this.haveToPay;
                    let clientId = this.loginInfo.client_id;
                    let openid = this.loginInfo.open_id;
                    let source =  this.source;
                    let body =
                        "临停-" +
                        this.stationInfo.stationName +
                        "-" +
                        this.plate +
                        "-" +
                        utils.eptimes.outTime(this.enterTime, "MMddhhmmss") +
                        "-" +
                        utils.eptimes.outTime(this.exitTime, "MMddhhmmss");

                    let returnURL = `${window.location.protocol}//${window.location.host}/temp/temp-result?plate=${this.plate}`;
                    let attach = "";
                    this.$loading.show();
                    let method =
                        this.loginInfo.app_id === "czy"
                            ? utils.api.getCzyTempOrder
                            : utils.api.getTempOrder;
                    let params = {
                        cost_uuid: uuid,
                        total_amount: total * 100,
                        amount: haveToPay * 100,
                        client_id: clientId,
                        device_id: !!this.deviceId ? this.deviceId : "",
                        source,
                        body,
                        openid,
                        return_url: returnURL,
                        attach,
                        plate:this.plate,
                        station_id:this.stationInfo.station
                    };
                    if (this.clientType === 'CZY' && this.caihuiDeduction.isUsed) { //处理使用抵扣金
                        method = utils.api.getDeductionTempOrder;
                        params.attach = {};
                        params.attach.coupon_selected = [this.caihuiDeduction.coupon_uuid];
                        params.source = 'DEDUCTION';
                    }
                    utils.gateway(method, params).then(res => {
                        console.log("订单结果：", res);
                        if (res.code === 0) {
                            let temp = res.content;
                            window.location.href = temp.redirect;
                        } else {
                            this.$router.push({
                                name: "temp-result",
                                query: {
                                    status: "fail",
                                    plate: this.plate
                                }
                            });
                        }
                    });
                    this.canRun = false;
                }
            }
        },
        skip() {
            this.$router.push({
                name: "ui-stations",
                query: {
                    plate: this.plate,
                    urlName: "temp-fee",
                    type: "station"
                }
            });
        }
    }
};
</script>
<style scoped>
.month-fee-checkbox{
    box-sizing: padding-box;
    position: relative;
    vertical-align: middle;
    appearance: none;
    width: 17px;
    height: 17px;
    padding: 2px;
    border: rgb(75, 204, 131) solid 3px;
    border-radius: 10px;
    outline: 0;
    background: #fff;
}
.month-fee-checkbox:checked{
    background: rgb(51, 51, 51);
    background-clip: content-box;
}
</style>
