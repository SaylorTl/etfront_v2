<template>
    <div class="unit-bg page-temp-pay">
        <div class="temp-pay-ad">
            <!-- <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/home_ad01.png"> -->
        </div>
        <div class="temp-card card" ref="fff">
            <div class="temp-label">
                <div>请输入车牌：</div>
                <div class="temp-history-btn">
                    <div class="special-btn" @click="changeSpecial">{{specialText}}</div>
                    <div class="history-btn" v-if="historyPlates.length > 0 " @click="changeHistory">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/history-plate.svg" />
                    </div>
                </div>
            </div>
            <div class="temp-plate">
                <plate-picker :isSpecial="isSpecial" :initPlate="plate" @ok="getPlate"></plate-picker>
                <div class="temp-plate-err" v-if="!!plateMsg && isGreen && !isSpecial">当前是<span class="green">{{plateMsg}}</span>绿牌车填写栏，蓝牌请取消</div>
                <div class="temp-plate-err red" v-if="!!plateMsg && isError && !isSpecial && !isGreen">{{plateMsg}}
                </div>
            </div>
            <div class="temp-history">
                <history-plate :historyPlates="historyPlates" :showHistory="showHistory" @historyChange="showHistoryPlate"></history-plate>
            </div>
            <div class="temp-btn">
                <x-xbutton :disabled="noPay" @click.native="pay">缴费</x-xbutton>
            </div>
            <div class="temp-tips">
                <p><span>*</span>1.车牌识别有误的车辆，到人工收费处缴费；</p>
                <p>2.请在免费出场时间内离场，超时需要补缴停车费。</p>
            </div>
        </div>
        <div class="temp-pay-call">
            <a href="tel:4001506888"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/robot-icon1.svg"></a>
        </div>
        <div class="temp-pay-skip-btn card"  @click="redirectHome">
            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tad_logo@2x.png">
            <div>主功能页面入口</div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils.js";
import PlatePicker from "../../components/PlatePicker/index";
import HistoryPlate from "../../components/HistoryPlate/index";
import { mapState } from 'vuex';
export default {
    name: "temp-pay",
    components: {
        PlatePicker,
        HistoryPlate
    },
    data() {
        return {
            plate: "",
            isSpecial: false,
            historyPlates: [], //'京A88888警','沪A66666', '桂A5RET', '渝A99999'
            showHistory: true,
            noPay: true,
            inStation: false,
            stationInfo: {},
            specialText: "特",
            plateMsg: "",
            isError: false,
            isGreen: "",
            feeType: "",
            stationId: ""
        };
    },
    computed:{
        ...mapState(['loginInfo'])
    },
    created() {
        this.getLocationLetter();
        this.getHistoryList();
        const { plate, type, stationId } = this.$route.query;
        if (!!plate) {
            this.plate = plate;
            this.showHistory = false;
        }
        if (!!type) {
            this.feeType = type;
            if(this.feeType === 'proxy' && !this.loginInfo.user_id){
                this.$router.push({
                    path:'/user/login',
                    query:{
                        redirectRoute:window.location.href
                    }
                })
            }
        }
        if (!!stationId) {
            this.stationId = stationId;
        }
    },
    beforeRouteEnter(to, from, next) {
        const { type } = to.query;
        if (!!type && type === "proxy") {
            utils.setTitle("月卡缴费");
        } else {
            utils.setTitle("临停缴费");
        }
        next();
    },
    methods: {
        getLocationLetter() {
            const { longitude, latitude } = this.$store.state.locationInfo;
            utils
                .gateway(utils.api.getPlateLocation, {
                    longitude,
                    latitude
                })
                .then(result => {
                    if (result.code === 0) {
                        const { abbreviation, letter } = result.content;
                        //当没有历史记录的时候显示前两位
                        if (
                            !!abbreviation &&
                            !!letter &&
                            this.historyPlates.length === 0 &&
                            !this.$route.query.plate
                        ) {
                            this.plate = abbreviation + letter;
                        }
                    }
                });
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
            if (this.isSpecial) {
                this.showHistory = false;
            }
        },
        isInStation(plate) {
            return utils
                .gateway(utils.api.getParkingInfoByPlate, { plate: plate })
                .then(res => res);
        },
        getStationById(station_id){
            return utils.gateway(utils.api.getStationById,{station_id}).then(res => res);
        },
        pay() {
            if (!!this.stationId) {
                this.getStationById(this.stationId).then(res => {
                    if (res.code === 0 && !!res.content) {
                        this.inStation = true;
                        let result = res.content;
                        this.stationInfo = {
                            station: result.station_id,
                            stationName: result.station_name,
                            address: result.address
                        };
                        this.skipFitPath();
                    }else{
                        this.$vux.toast.show({
                                text: res.message,
                                time: 3000
                            });
                        this.noPay = true;
                    }
                });
            } else {
                this.isInStation(this.plate).then(res => {
                    if (res.code === 0 && !!res.content) {
                        this.inStation = true;
                        let result = res.content;
                        this.stationInfo = {
                            station: result.station,
                            stationName: result.station_name,
                            address: result.station_address,
                            car: result.car
                        };
                        this.skipFitPath();
                    } else {
                        if (this.isSpecial) {
                            this.$vux.toast.show({
                                text: res.message,
                                time: 3000
                            });
                            this.noPay = true;
                        } else {
                            this.skipFitPath();
                        }
                    }
                });
            }
        },
        skipFitPath() {
            if (!!this.$route.query && !!this.$route.query.type) {
                this.$router.push({
                    name: "month-fee",
                    query: {
                        plate: this.plate,
                        type: this.$route.query.type
                    }
                });
            } else if (!!this.stationInfo.station) {
                this.$router.push({
                    name: "temp-fee",
                    query: {
                        stationInfo: JSON.stringify(this.stationInfo),
                        plate: this.plate
                    }
                });
            } else {
                this.$router.push({
                    name: "ui-stations",
                    query: {
                        plate: this.plate,
                        urlName: "temp-fee",
                        type: "station"
                    }
                });
            }
        },
        redirectHome() {
            let query = { actived: 2 } 
            if (this.feeType === 'proxy'){
                query.actived = 1 
            } 
            this.$router.push({
                name: "home",
                query
            });
        }
    }
};
</script>
