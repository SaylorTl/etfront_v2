<template>
    <div class="page-emergency-open">
        <img class='bg-img' src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/car_bg_logo1@2x.png">
        <div class="card page-emergency-open-card">
            <form-item label="停车场" :content="station.name || '请选择'" arrow @handleClick="selectStation"></form-item>
            <div class="page-emergency-open-code" v-if="showCode">
                <div class="emergency-input"><input ref="char1" v-model="char1" placeholder="+" size="1" type="number" /></div>
                <div class="emergency-input"><input ref="char2" v-model="char2" placeholder="+" size="1" type="number" /></div>
                <div class="emergency-input"><input ref="char3" v-model="char3" placeholder="+" size="1" type="number" /></div>
                <div class="emergency-input"><input ref="char4" v-model="char4" placeholder="+" size="1" type="number" /></div>
            </div>
            <div class="page-emergency-open-btn">
                <x-xbutton :disabled="!canPress" @click.native="handleEmergency">{{btnTxt}}</x-xbutton>
            </div>
        </div>
        <my-picker :isShow="stationPicker" v-if="showStation" :data="stationArr" @change="changeStation" @handleClose="closeStation"></my-picker>
    </div>
</template>
<script>
import utils from "utils/utils";
import { mapState } from "vuex";
import FormItem from "components/FormItem/index";
import MyPicker from "components/MyPicker/index";
export default {
    name: "emergency-open",
    props: {},
    components: {
        FormItem,
        MyPicker
    },
    data() {
        return {
            station: {
                value: "",
                name: ""
            },
            btnTxt: "立刻申请",
            char1: "",
            char2: "",
            char3: "",
            char4: "",
            showCode: false,
            stationPicker: false,
            showStation: false,
            stationArr: [],
            canPress: false,
            step: 1
        };
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    watch: {
        char1(val) {
            if (val.length >= 1) {
                this.char1 = val.substr(0, 1);
                this.$refs.char1.blur();
                this.$refs.char2.focus();
            }
        },
        char2(val) {
            if (val.length >= 1) {
                this.char2 = val.substr(0, 1);
                this.$refs.char2.blur();
                this.$refs.char3.focus();
            }
        },
        char3(val) {
            if (val.length >= 1) {
                this.char3 = val.substr(0, 1);
                this.$refs.char3.blur();
                this.$refs.char4.focus();
            }
        },
        char4(val) {
            if (val.length >= 1) {
                this.char4 = val.substr(0, 1);
                this.$refs.char4.blur();
            }
        }
    },
    created() {
        this.getStations();
    },
    mounted() {},
    methods: {
        getStations() {
            utils.gateway(utils.api.getStationByUser).then(res => {
                if (
                    res.code === 0 &&
                    !!res.content &&
                    Array.isArray(res.content) &&
                    res.content.length > 0
                ) {
                    this.showStation = true;
                    let temp = res.content;
                    this.stationArr = temp.map(item => {
                        return {
                            value: item.station_id,
                            name: item.station_name
                        };
                    });
                }
            });
        },
        selectStation() {
            this.stationPicker = true;
        },
        handleEmergency() {
            if (this.step === 1) {
                let params = {
                    station_id: this.station.value,
                    mobile: this.loginInfo.mobile
                };
                utils.gateway(utils.api.getEmergencyCode, params).then(res => {
                    if (res.code === 0) {
                        this.showCode = true;
                        this.btnTxt = "立刻开闸";
                        this.step = 2;
                    } else {
                        this.showCode = false;
                        this.step = 1;
                        this.btnTxt = "立刻申请";
                        this.$vux.toast(
                            "下发开闸口令失败，请重试或联系客服",
                            "middle"
                        );
                    }
                });
            } else if (this.step === 2) {
                let params = {
                    station_id: this.station.value,
                    code: this.char1 + this.char2 + this.char3 + this.char4,
                    mobile: this.loginInfo.mobile
                };
                utils.gateway(utils.api.emergencyOpen, params).then(res => {
                    if (res.code === 0) {
                        this.$vux.toast.text("开闸成功", "middle");
                    } else {
                        this.$vux.toast.text(
                            "开闸失败，请重试或联系客服",
                            "middle"
                        );
                    }
                    this.showCode = false;
                    this.step = 1;
                    this.btnTxt = "立刻申请";
                });
            }
        },
        changeStation(data) {
            this.closeStation();
            this.station = data;
            this.canPress = true;
        },
        closeStation() {
            this.stationPicker = false;
        }
    }
};
</script>
