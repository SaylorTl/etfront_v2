<template>
    <div class='page-lovecar'>
        <div v-if="showCard" @click='applymonth' class='apply-box  card con tap'>
            <div class='t1'>停车月卡</div>
            <div class='t2'>EP停车车场会员</div>
            <div class='t3'>申请月卡</div>
            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/car_bg_parkingcard@2x.png">
        </div>
        <div v-if="showCard" @click='bindcar' class='apply-box  card con tap'>
            <div class='t1'>我的车辆</div>
            <div class='t3'>绑定车辆</div>
            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/car_bg_parkingcard@2x.png">
        </div>
        <div v-for="(item,index) in carlist" :key="index" class='card con item-box'>
            <car-info :carinfo="item.carinfo" />
            <template v-if="item.contracts.length>0">
                <month-carinfo v-for="(v,k) in item.contracts" :key="k" :carinfo="item.carinfo" :baseinfo="v" v-show="v.show" />
            </template>
            <div v-if="item.carinfo.is_parking||(!item.contracts||item.contracts.length==0)" class='lock-box'>
                <div v-if="item.carinfo.is_parking" class='lock'>
                    <span>锁车</span>
                    <x-xswitch title="" prevent-default @on-click="actionReady(item.carinfo,index)" :value-map="['N', 'Y']" v-model="item.carinfo.is_lock"></x-xswitch>
                </div>
                <x-xbutton v-if="!item.contracts||item.contracts.length==0" @click.native="applymonth(item.carinfo.plate)">申请月卡</x-xbutton>
            </div>
        </div>
        <div v-if="carlist.length > 0" class='action-box con'>
            <div @click='applymonth'>
                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_parkingcard@2x.png">
                申请月卡
            </div>
            <div @click='bindcar'>
                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_parkingcard@2x.png">
                绑定车辆
            </div>
        </div>
        <dialogs ref='dialogs' :dataOption='dataOption' @sure="statusChange"></dialogs>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import CarInfo from "../../components/CarInfo";
import MonthCarinfo from "../../components/MonthCarinfo";
import Dialogs from "../../components/Dialogs";
export default {
    name: "loveCar",
    components: {
        CarInfo,
        Dialogs,
        MonthCarinfo
    },
    data() {
        return {
            carlist: [],
            showCard: false,
            statusOption: { Y: "启用", N: "禁用" },
            dataOption: {
                closeicon: true, // 布尔值，是否显示关闭右上角按钮
                buttonbox: true, // 布尔值，是否显示button盒子
                title: "", // 标题
                msg: "", // 消息
                statusicon: 0, // 消息状态icon 1成功  2失败  3警告  0不使用icon
                footerbgicon: true
            }
        };
    },
    created() {
        this.carListsMergeContracts();
    },
    mounted() {
        this.dialogs = this.$refs["dialogs"];
    },
    methods: {
        statusChange(sure) {
            if (sure) {
                let actionItem = this.actionItem;
                console.log("plate", actionItem.plate);
                let postData = {
                    plate: actionItem.plate,
                    station: actionItem.parking_station_id,
                    cmd: actionItem.is_lock === "N" ? "unlock" : "lock"
                };
                this.$loading.show({ content: "提交数据中...", mask: true });
                utils.gateway(utils.api.updateLock, postData).then(res => {
                    this.$loading.hide();
                    if (res && res.code === 0) {
                        let newItem = this.carlist[actionItem.index];
                        newItem.carinfo.is_lock = actionItem.is_lock;
                        this.carlist.splice(actionItem.index, 1, newItem);
                        this.dialogs.close();
                        this.$vux.toast.text(actionItem.actionName + "成功!");
                    } else {
                        this.dialogs.close();
                        this.$vux.toast.text(res.message);
                    }
                });
            }
        },
        actionReady(baseinfo, index) {
            let Value = baseinfo.is_lock;
            let actionItem = {};
            actionItem.index = index;
            actionItem.plate = baseinfo.plate;
            actionItem.parking_station_id = baseinfo.parking_station_id;
            if (Value === "Y") {
                actionItem.is_lock = "N";
            } else if (Value === "N") {
                actionItem.is_lock = "Y";
            } else {
                actionItem.is_lock = "Y";
            }
            actionItem.actionName =
                this.statusOption[actionItem.is_lock] || "启用";
            this.actionItem = actionItem;
            let msg = "您确定要" + actionItem.actionName;
            this.dataOption.msg = msg;
            this.dialogs.init();
            this.dialogs.open();
        },
        bindcar(plate) {
            plate = typeof plate == "string" ? plate : "";
            this.$router.push({
                path: "/car/car-plate-bind",
                query: { plate, bindType: "temp" }
            });
        },
        applymonth(plate) {
            let plateStr = typeof plate === 'string'?plate:'';
            if (!!plateStr) {
                this.$router.push({
                    path: "/ui/ui-stations",
                    query: {
                        plate,
                        bindType: "month",
                        urlName: "car-card-upload"
                    }
                });
            } else {
                this.$router.push({
                    path: "/car/car-plate-bind",
                    query: { bindType: "month" }
                });
            }
        },
        carListsMergeContracts() {
            this.$loading.show();
            this.carlist = [];
            utils.gateway(utils.api.carListsMergeContracts).then(res => {
                if (res && res.content) {
                    let lists = res.content.lists || [];
                    for (var n in lists) {
                        let row = {
                            carinfo: {
                                logo:
                                    "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/carlogo/" +
                                        lists[n]["brand_logo"] || "unknown.jpg",
                                car_id: lists[n]["car_id"],
                                plate: lists[n]["plate"],
                                serial: lists[n]["car_serial"],
                                color: lists[n]["car_color"],
                                is_lock: lists[n]["is_lock"],
                                is_parking: lists[n]["is_parking"],
                                parking_station_name:
                                    lists[n]["parking_station_name"],
                                parking_station_id:
                                    lists[n]["parking_station_id"]
                            },
                            contracts: []
                        };

                        if (lists[n]["contracts"].length > 0) {
                            for (var m in lists[n]["contracts"]) {
                                let t = lists[n]["contracts"][m];
                                let item = {
                                    show:
                                        t.contract_status != "canceled" &&
                                        t.contract_status != "deleted",
                                    icon: "",
                                    contract_id: t.contract_id,
                                    ctt_car_id: t.ctt_car_id,
                                    station_name: t.station_name,
                                    station_id: t.station_id,
                                    is_lock: t.is_lock === "Y" ? "Y" : "N", //  Y/N
                                    begin_time: t.begin_time,
                                    end_time: t.end_time
                                };
                                row.contracts.push(item);
                            }
                        }
                        row.carinfo.has_contract = row.contracts.length > 0;
                        this.carlist.push(row);
                    }
                }
                if (this.carlist.length === 0) {
                    this.showCard = true;
                }
                this.$loading.hide();
            });
        }
    }
};
</script>
