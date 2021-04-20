
<template>
    <div>
        <div @click="action" class='monthcarinfo tap'>
            <img class='icon' :src="baseinfo.icon||'https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_EPLOGO@2x.png'">
            <div class='stationinfo'>
                <div class='rowflex'>
                    <div>{{ baseinfo.station_name||'未知车场' }}</div>
                    <div :class="carinfo.parking_station_id==baseinfo.station_id ? 'station-status on' : 'station-status'">
                        {{ carinfo.parking_station_id==baseinfo.station_id ? '在场' : '离场' }}
                    </div>
                </div>
                <div class='rowflex'>
                    <div class='rowflex c'>
                        停车指数
                        <img class='star' src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_starfull@2x.png'>
                        <img class='star' src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_starfull@2x.png'>
                        <img class='star' src='https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_starhalf@2x.png'>
                    </div>
                    <div class='rowflex'></div>
                </div>
            </div>
            <div class='msg' :style='{color: color}'>{{label}}</div>
            <div class='time-bar-box' :style='{backgroundColor: bgcolor||color}'>
                <div class='time-bar' :style='usewidth'>
                    <div class='bar'></div>
                </div>
            </div>
        </div>
        <div v-if="actionbox" class='lock-box'>
            <x-xbutton @click.native="cardRenew(baseinfo.ctt_car_id)">月卡续费</x-xbutton>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
export default {
    name: 'MonthCarinfo',
    data() {
        return {
            actionbox: false,
            label: '',
            usewidth: '',
            baranimation: '',
            color: '',
            bgcolor: '',
        }
    },
    props: {
        plate: {
            type: String,
            default() {
                return '';
            }
        },
        carinfo: {
            type: Object,
            default() {
                return {};
            }
        },
        baseinfo: {
            type: Object,
            default() {
                return {
                    station_name: '',
                    status: '',
                    stoptype: '',
                    icon: '',
                    begin_time: '',
                    end_time: '',
                }
            }
        }
    },
    components: {
    },
    mounted() {
        this.monthStatus();
    },
    methods: {
        cardRenew(ctt_car_id) {
            this.$router.push({ path: "/month/month-fee", query: { ctt_car_id: ctt_car_id } });
        },
        action() {
            this.actionbox = !this.actionbox;
        },
        monthStatus() {
            let vm = this;
            // vm.baseinfo.end_time = '2019-06-03 12:00:00';
            // vm.baseinfo.begin_time = '2019-05-01 12:00:00'; 
            // console.log('vm.data.baseinfo', vm.baseinfo)
            let etime = new Date(vm.baseinfo.end_time);
            let stime = new Date(vm.baseinfo.begin_time);
            let now = new Date();
            let label = "";
            let color = null;
            let day = Math.round((etime - now) / 1000 / 60 / 60 / 24);
            let total = Math.round((etime - stime) / 1000 / 60 / 60 / 24);
            let used = ((total - day) / total) * 100;
            if (Math.round((now - etime) / 1000 / 60 / 60 / 24) > 0) {
                label = "已过期";
                color = "#999";
            }else {
                used = used > 100 ? 100 : used;
                vm.bgcolor = null;
                if(utils.eptimes.outTime(stime,'yyyy-MM-dd') == utils.eptimes.outTime(etime,'yyyy-MM-dd')){
                    label = '待激活';
                    color = "red";
                    vm.bgcolor = "red";
                }else{
                    if (day <= 7) {
                        color = "red";
                        vm.bgcolor = "red";
                        label = day + " 天后过期";
                        label = day == 0 ? "今天过期" : label;
                    } else if (day > 7 && day <= 30) {
                        label = "还剩 " + day + " 天";
                    } else if (day > 30) {
                        vm.bgcolor = "#4bcc83";
                        label = vm.baseinfo.end_time.substring(0, 10) + " 到期";
                    }
                }
            }
            let data = vm.data;
            setTimeout(() => {
                vm.color = color;
                vm.label = label;
            }, 3000)
            this.usewidth = 'width:' + used + '%';
            // console.log('date', '还剩天数', day, '总共天数', total, '文案', label, '占比', used)
        }
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
