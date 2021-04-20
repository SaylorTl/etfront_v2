<template>
    <div class="page-no-plate unit-bg" v-if="direction === 'in'">
        <div class="page-no-plate-card card">
            <div class="header">
                <div class="theme">
                    <div class="theme-left">{{stationName}}</div>
                    <a href="tel:400-1506888"><div class="theme-right"><i class="fa fa-phone"></i></div></a>
                </div>
                <div class="desc">
                    {{address}}
                </div>
            </div>
            <div class="middle">
                <form-item label="出入口" :content="deviceName"></form-item>
                <form-item label="进场时间" :content="enterTime" v-if="isInstation"></form-item>
                <form-item label="无牌车扫码进场" content="" :border="false"></form-item>
            </div>
            <!-- <div v-if="isInstation">
                该车辆已经在{{stationName}}停车场内
            </div> -->
            
        </div>
        <div class="page-no-plate-welcome" v-if="direction === 'in'">欢迎光临！</div>
        <div class="page-no-plate-btn" v-if="!isInstation && direction === 'in'">
                <x-xbutton :disabled="!canOpen" @click.native="open">开闸进场</x-xbutton>
        </div>
        <div class="page-no-plate-tips" v-if="!isInstation && direction === 'in'">温馨提示：出场时请在出口处，微信扫码支付后离场~</div>
    </div>
</template>
<script>
import utils from "utils/utils.js";
import { mapState } from "vuex";
import FormItem from 'components/FormItem/index';
export default {
    name: "no-plate-in",
    components: {
        FormItem
    },
    props: {},
    data() {
        return {
            identity: "",
            deviceId: "",
            stationId: "",
            stationName: "",
            deviceName:"",
            enterTime:"",
            address:"",
            userId: "",
            mobile: "",
            canOpen: false,
            isInstation: false,
            direction:''
        };
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {
       this.$loading.show();
       if (this.$route.params.device_id && this.$route.params.device_id != 6420) {
            this.deviceId = this.$route.params.device_id;
        }
        if (this.$route.query.station_id) {
            this.stationId = this.$route.params.station_id;
        }
        if (this.deviceId) {
            this.whichDirection();
        } else {
            if (this.stationId) {
                this.$router.push({
                    name: "temp-pay",
                    query: {
                        stationId: this.stationId
                    }
                });
            } else {
                this.$router.push({
                    name: "temp-pay"
                });
            }
        } 
    },
    beforeDestroy(){
        if(this.$loading){
            this.$loading.hide();
        }
    },
    methods: {
        /**
         * 判断进出场方向
         */
        whichDirection() {
            utils
                .gateway(utils.api.getStationByDevice, {
                    device_id: this.deviceId
                })
                .then(json => {
                    if(this.$loading){
                        this.$loading.hide();
                    }
                    if (json.code === 0 && !!json.content) {
                        if (json.content.direction === "in") {
                            utils.setTitle('无牌车信息');
                            this.direction = 'in';
                            this.inStation();
                        } else {
                            this.$router.push({
                                name: "temp-fee",
                                query: {
                                    deviceId: this.deviceId,
                                    stationId:json.content.station_id
                                }
                            });
                        }
                    } else {
                        this.$vux.toast.text(json.message, "middle");
                    }
                });
        },
        /**
         * 判断车辆是否在场内
         */
        inStation() {
            let params = {};
            if (this.loginInfo.unionid) {
                params = {
                    unionid: this.loginInfo.unionid,
                    device_id:this.deviceId
                };
            }else{
                params = {
                    mobile: this.loginInfo.mobile,
                    device_id:this.deviceId
                };
            }

            utils.gateway(utils.api.isInStation, params).then(res => {
                if (res.code === 0 && !!res.content) {
                    let temp = res.content;
                    if (temp.flag) {
                        this.deviceId = temp.device_id;
                        this.stationId = temp.station_id;
                        this.stationName = temp.station_name;
                        this.deviceName = temp.device_name;
                        this.enterTime = temp.enter_time;
                        this.address = temp.address;
                        this.userId = temp.user_id;
                        this.mobile = temp.mobile;
                        this.isInstation = true;
                        this.$vux.toast.text('您的车辆已经在场内，请勿重复扫码','middle');
                    } else if (
                        !temp.flag &&
                        !!temp.user_id &&
                        !!temp.mobile
                    ) {
                        this.userId = temp.user_id;
                        this.mobile = temp.mobile;
                        this.deviceId = temp.device_id;
                        this.stationId = temp.station_id;
                        this.stationName = temp.station_name;
                        this.deviceName = temp.device_name;
                        this.enterTime = temp.enter_time;
                        this.address = temp.address;
                        this.canOpen = true;
                    }
                } else {
                    if (this.$route.query.isCheck) {
                        this.canOpen = true;
                    } else {
                        this.$router.replace({
                            name: "login",
                            query: {
                                redirectRoute: `${
                                    window.location.href
                                }`
                            }
                        });
                    }
                }
            });
        },
        open() {
            let params = {
                user_id: this.userId,
                device_id: this.deviceId
            };
            utils.gateway(utils.api.openDevice, params).then(res => {
                if(res.code === 0){
                    this.$vux.toast.text(res.message,'middle');
                    this.canOpen = false;
                }
            });
        }
    }
};
</script>
