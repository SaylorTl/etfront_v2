<template>
    <div class="page-emergency-open">
        <div class="card page-emergency-open-card">
            <form-item label="停车场" :content="station.stationName || '请选择'" arrow @handleClick="selectStation"></form-item>
            <div class="page-emergency-open-time">
                <div class="page-emergency-open-time-title">上缴时间段</div>
                <x-datetime title="开始时间段" format="YYYY-MM-DD HH:mm" :min-year="min" :max-year="max" v-model="time_begin" @on-change="onChange"></x-datetime>
                <x-datetime title="结束时间段" format="YYYY-MM-DD HH:mm" :min-year="min" :max-year="max" v-model="time_end" @on-change="onChange"></x-datetime>
            </div>
            <form-item label="临停收入(单位：元)">
                <div slot="content">
                    <x-xinput v-model="total_amount" placeholder="收入" type="number" :debounce="500" text-align="right" :show-clear="false"></x-xinput>
                </div>
            </form-item>
            <div class="page-emergency-open-btn">
                <x-xbutton :disabled="!canPay" @click.native="pay">上缴收费</x-xbutton>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "utils/utils";
import FormItem from "../../components/FormItem/index";
import { mapState } from "vuex";
export default {
    name: "daily",
    props: {},
    components: {
        FormItem
    },
    data() {
        return {
            min: 1971,
            max: 2999,
            station: {
                station: "",
                stationName: ""
            },
            timeFormat: "YYYY/MM/DD",
            time_begin: utils.eptimes.outTime(new Date(), "YYYY-MM-DD HH:mm"),
            time_end: utils.eptimes.outTime(new Date(), "YYYY-MM-DD HH:mm"),
            total_amount: "",
            canPay: false,
            method: "",
            source: ""
        };
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    watch: {
        "station.station"(val) {
            if (!!val && parseFloat(this.total_amount) > 0) {
                if (utils.validator.isMoney.test(this.total_amount)) {
                    this.canPay = true;
                } else {
                    this.canPay = false;
                }
            } else {
                this.canPay = false;
            }
        },
        total_amount(val) {
            if (!!val && parseFloat(val) > 0 && !!this.station.station) {
                if (utils.validator.isMoney.test(val)) {
                    this.canPay = true;
                } else {
                    this.canPay = false;
                }
            } else {
                this.canPay = false;
            }
        }
    },
    mounted() {
        let { stationInfo } = this.$route.query;
        if (!!stationInfo) {
            this.station = JSON.parse(stationInfo);
        }
        this.getMethodAndSource();
    },
    methods: {
        onChange(val) {
            console.log(val);
        },
        selectStation() {
            this.$router.push({
                name: "ui-stations",
                query: {
                    urlName: "daily", //选择车场后需要跳转的路由名称
                    type: "station" //station表示只选择车场，否则会选择楼栋信息
                }
            });
        },
        getMethodAndSource() {
            if (this.loginInfo.app_id === "czy") {
                this.method = utils.api.czyDaily;
                this.source = "CZY";
            } else if (this.loginInfo.app_id === "wx6147f4792486b970") {
                this.method = utils.api.czyWechatDaily;
                this.source = "CZY_WECHAT";
            } else {
                this.method = utils.api.wechatDaily;
                if (this.loginInfo.app_id === "wxff787c2138809f0b") {
                    this.source = "EP_WECHAT";
                } else if (this.loginInfo.app_id === "wx66b5b91c83f20361") {
                    this.source = "ZX_WECHAT";
                }
            }
        },
        pay() {
            let params = {
                total_amount: this.total_amount * 100,
                amount: this.total_amount * 100,
                client_id: this.loginInfo.client_id,
                source: this.source,
                station_id: this.station.station,
                time_begin: this.time_begin,
                time_end: this.time_end,
                openid: this.loginInfo.open_id,
                body: "易停车日报上缴",
                return_url: encodeURIComponent(
                    window.location.protocol +
                        "//" +
                        window.location.host +
                        "/parking/daily-detail"
                )
            };
            utils.gateway(this.method, params).then(res => {
                if (res.code === 0) {
                    let temp = res.content;
                    window.location.href = temp.redirect;
                } else {
                    this.$vux.toast.text(res.message,'middle');
                }
            });
        }
    }
};
</script>

