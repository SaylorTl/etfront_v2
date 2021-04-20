<template>
    <div class="unit-bg page-temp-pay integral">
        <div @click="login" v-if="!integralUser.mobile" class="top-tiplogin">点击登录，享受会员优惠</div>
        <div class="temp-card card">
            <div class="temp-label">
                <div>请输入车牌：</div>
                <div class="temp-history-btn">
                    <div class="special-btn" @click="changeSpecial">{{specialText}}</div>
                    <div class="history-btn" v-if="historyPlates.length > 0" @click="changeHistory">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/history-plate.svg" />
                    </div>
                </div>
            </div>
            <div class="temp-plate">
                <plate-picker :isSpecial="isSpecial" :initPlate="plate" @ok="getPlate"></plate-picker>
                <div class="temp-plate-err" v-if="!!plateMsg && isGreen && !isSpecial">当前是<span class="green">{{plateMsg}}</span>绿牌车填写栏，蓝牌请取消</div>
                <div class="temp-plate-err red" v-if="!!plateMsg && isError && !isSpecial && !isGreen">{{plateMsg}}</div>
            </div>
            <div class="temp-history">
                <history-plate :historyPlates="historyPlates" :showHistory="showHistory" @historyChange="showHistoryPlate"></history-plate>
            </div>
            <div class="temp-btn">
                <x-xbutton :disabled="noPay" @click.native="isInStation(plate)">查询停车费</x-xbutton>
            </div>
            <div class="temp-tips">
                <p><span>*</span>1.车牌识别有误的车辆，到人工收费处缴费；</p>
                <p>2.请在免费出场时间内离场，超时需要补缴停车费。</p>
            </div>
        </div>
        <div class="bottom-menus flex">
            <div class="tip">客服热线：<a href="tel:4001506888">4001506888</a></div>
            <img @click="active='1'" :class="{active:active==='1'}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190826/stop-1.svg" />
            <img @click="history" :class="{active:active==='2'}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190826/stop-2.svg" />
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils.js";
import PlatePicker from "../../components/PlatePicker/index";
import HistoryPlate from "../../components/HistoryPlate/index";
import { mapState } from "vuex";
export default {
    name: "integral-plate",
    components: {
        PlatePicker,
        HistoryPlate
    },
    data() {
        return {
            integralUser: {},
            active: '1',
            plate: "",
            isSpecial: false,
            historyPlates: [], //'京A88888警','沪A66666', '桂A5RET', '渝A99999'
            showHistory: true,
            noPay: true,
            inStation: false,
            specialText: "特",
            plateMsg: "",
            isError: false,
            isGreen: "",
            feeType: ""
        };
    },
    computed: {

    },
    mounted() {
        this.getHistoryList();
        this.getLocationLetter();
        const { plate, type } = this.$route.query;
        if (!!plate) {
            this.plate = plate;
        }
        this.integralUser = JSON.parse(window.localStorage.getItem('integralUser')) || {};
    },
    methods: {
        history() {
            this.$router.push({ path: "/integral/history" });
        },
        login() {
            this.$router.push({ path: "/integral/login" });
        },
        getLocationLetter() {
            if (!!this.locationInfo) {
                const { longitude, latitude } = this.locationInfo;
                utils.gateway(utils.api.getPlateLocation, {
                    longitude,
                    latitude
                }).then(res => {
                    if (res.code === 0) {
                        const { abbreviation, letter } = res.content;
                        if (!!abbreviation && !!letter) {
                            this.plate = abbreviation + letter;
                        }
                    }
                });
            }
        },
        getHistoryList() {
            let that = this;
            utils
                .gateway(utils.api.getHistoryPlates, { page: 1, pagesize: 5 })
                .then(res => {
                    if (
                        res.code === 0 &&
                        !!res.content &&
                        Array.isArray(res.content.lists)
                    ) {
                        if (res.content.lists.length > 0) {
                            let lists = res.content.lists;
                            this.historyPlates = lists.map(item => item.plate);
                        } else {
                            this.historyPlates = [];
                            this.showHistory = false;
                        }
                    } else {
                        this.showHistory = false;
                    }
                });
        },
        getPlate(data) {
            console.log("车牌号：", data);
            let plateInfo = data;
            if (!plateInfo.isError) {
                this.noPay = false;
                this.isError = false;
                this.plate = plateInfo.plate;
                //  this.isInStation(this.plate);
                if (plateInfo.isGreen) {
                    this.isGreen = plateInfo.isGreen;
                    this.plateMsg = "新能源";
                } else {
                    this.isGreen = false;
                }
            } else {
                this.isError = true;
                // this.plateMsg = "车牌格式错误";
                this.noPay = true;
            }
        },
        showHistoryPlate(data) {
            this.plate = data;
        },
        changeHistory() {
            if (this.historyPlates.length === 0 || this.isSpecial) {
                return;
            } else {
                this.showHistory = !this.showHistory;
            }
        },
        changeSpecial() {
            this.isSpecial = !this.isSpecial;
            this.specialText = this.isSpecial ? "普" : "特";
        },
        isInStation(plate) {
            utils.gateway(utils.api.getParkingInfoByPlate, { plate: plate }).then(res => {
                if (res && res.code === 0 && res.content) {
                    this.inStation = true;
                    let content = res.content;
                    this.$router.push({ path: "/integral/pay", query: {  plate } });
                } else {
                    this.$vux.alert.show('没查到停车记录，请重新查询')
                }
            });
        }
    }
};
</script>
