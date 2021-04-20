<template>
    <div>
        <div class='page-now'>
            <div class='button-box con'>
                <div class='button'>
                    <x-xbutton @click.native="tempPay">临停缴费</x-xbutton>
                </div>
                <div class='button'>
                    <x-xbutton @click.native="emergencyOpen">紧急开闸</x-xbutton>
                </div>
            </div>
            <div class='con content'>
                <!-- 临停车辆列表 -->
                <template v-for="(item,index) in carlist">
                    <div v-if="item.show" :key="index" class='card'>
                        <div class='station-box flex'>
                            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/icon_parking@3x.png">
                            <span>{{item.parking_station_name||'停车场'}}（{{item.latest_arrival_time}}入场）</span>
                        </div>
                        <plate-picker :initPlate="item.plate" @ok="getPlate"></plate-picker>
                        <div class='button-box wd80 con'>
                            <x-xbutton @click.native="tempPay(item.plate,item)">临停缴费</x-xbutton>
                        </div>
                        <div class='tip-box'>您可以
                            <span @click='bindcar(item.plate)'>绑定车辆</span>，避免他人绑定车辆影响您的使用</div>
                    </div>
                </template>

                <!-- 月卡申请列表 -->
                <div v-for="(item,index) in carapply" v-show="item.apply_status!=='agree'" :key="index" class='card'>
                    <div class='temp-applymonth'>
                        <div class='car-box' style='background-image:url("https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tad_bg@2x.png") '>
                            <div v-if="item.car_info" class='plate-box'>
                                <div v-for="(item,index) in  item.car_info" :key="index" class='plate'>{{item.plate||'缺少车牌'}}</div>
                            </div>
                            <div v-if="!item.car_info" class='plate'>{{item.plate}}</div>
                            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png">
                        </div>
                        <div class='monthstatus'>
                            <div>
                                月卡状态
                            </div>
                            <div :class='item.apply_status'>
                                {{monthstatus[item.apply_status]}}
                            </div>
                        </div>
                        <div v-if="item.apply_status=='refuse'" class='applybutton'>
                            <x-xbutton @click.native="applymonth(item.plate||item.car_info[0].plate)">重新申请</x-xbutton>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import PlatePicker from "../../components/PlatePicker/index";
import { mapState } from "vuex";
export default {
    name: "now",
    data() {
        return {
            carapply: [],
            carlist: [],
            monthstatus: {
                waiting: '审核中',
                agree: '已同意',
                refuse: '申请失败'
            },
        }
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {
        this.applaycontractlists();
        this.carListsMergeContracts();
        console.log('loginInfo', this.loginInfo)
    },
    methods: {
        bindcar(plate) {
            plate = typeof (plate) == 'string' ? plate : '';
            this.$router.push({
                path: "/car/car-plate-bind",
                query: { plate,bindType:'temp' }
            });
        },
        tempPay(plate, info) {
            plate = typeof (plate) == 'string' ? plate : '';
            let stationInfo = false;
            if (info) {
                stationInfo = {
                    station: info.parking_station_id,
                    stationName: info.parking_station_name,
                    address: ''
                }
                console.log('stationInfo', stationInfo, info)
            }
            this.$router.push({
                name: plate ? "temp-fee" : "temp-pay",
                query: { plate: plate, urlName: "temp-fee", type: plate ? "station" : "", stationInfo: stationInfo ? JSON.stringify(stationInfo) : undefined }
            });
        },
        applymonth(plate) {
            plate = typeof (plate) == 'string' ? plate : '';
            this.$router.push({
                path: "/car/car-plate-bind",
                query: { plate, bindType: 'month' }
            });
        },
        getPlate() { },
        emergencyOpen() {
            this.$router.push({
                name: 'emergency-open'
            })
        },
        costTempcar(item, index) {
            if (!item.parking_station) { return; }
            let postData = {
                station_id: item.parking_station,
                plate: item.plate
            }
            utils.gateway(utils.api.costTempcar, postData).then((res) => {
                console.log('计费', res, 'index', index);
                if (res && res.content) {
                    this.carlist[index].payamount = '(' + res.content.total_amount + '元）';
                    this.$forceUpdate();
                }
            });
        },
        carListsMergeContracts() {
            this.$loading.show();
            utils.gateway(utils.api.carListsMergeContracts).then(res => {
                this.$loading.hide();
                if (res && res.content) {
                    let list = res.content.lists || [];
                    this.carlist = list.map((item, i) => {
                        let isparkContracts = item.contracts.some((el) => {
                            return item.parking_station_id == el.station_id;
                        })
                        item.show = item.is_parking && !isparkContracts;  //车辆在场并且不再月卡场内算临停车
                        if (item.show) {
                            this.costTempcar(item, i);
                        }
                        if (item.latest_arrival_info.length > 0 && item.latest_arrival_info.arrival_time) {
                            item.latest_arrival_time = item.latest_arrival_info.arrival_time.substring(11, 16);
                        } else {
                            item.latest_arrival_time = '';

                        }
                        return item;
                    });
                }
            });
        },
        applaycontractlists() {
            let postData = {
                user_id: this.loginInfo.user_id
            }
            utils.gateway(utils.api.getContractApplayLists, postData).then(res => {
                if (res && res.content) {
                    this.carapply = res.content.lists || [];
                }
            });
        },
    },
    components: { PlatePicker }
};
</script>
