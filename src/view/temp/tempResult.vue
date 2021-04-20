<template>
    <div class="unit-bg page-temp-result">
        <div class="pay-result-card card" v-if="step === 1">
            <div class="pay-result-face">
                <expression :status='status'></expression>
            </div>
            <div>{{desc}}</div>
            <div v-show="status === 'success' && feeType !== 'month'">请在10分钟内离场</div>
            <div class="pay-result-btn">
                <x-xbutton @click.native="skip">知道了</x-xbutton>
            </div>
        </div>
        <div class="pay-result-card card" v-if="step === 2">
            <div class="pay-result-face">
                <countdown @timeover="timeover" :totalTime="totalTime" :initTime="initTime"></countdown>
            </div>
            <div v-show="status === 'success'">请在10分钟内离场</div>
            <div class="pay-result-btn">
                <x-xbutton @click.native="skip">知道了</x-xbutton>
            </div>
        </div>
    </div>
</template>
<script>
import expression from "components/Expression/index.vue";
import countdown from "components/CountDown/index.vue";
import utils from "utils/utils.js";
export default {
    name: "temp-result",
    props: {},
    components: {
        expression,
        countdown
    },
    data() {
        return {
            plate: "",
            status: "",
            desc: "",
            step: 1,
            initTime: 600,
            totalTime: 600,
            leaveTime: "",
            isiOS: false,
            feeType: ""
        };
    },
    created() {
        this.$store.commit("setLoading", false);
        let date = parseInt(new Date().getTime() / 1000);
        if (!!this.leaveTime) {
            let o = this.leaveTime - date;
            if (o > 0) {
                this.initTime = o;
            } else {
                this.$router.push({
                    name: "temp-pay"
                });
            }
        }
    },
    mounted() {
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                let date = parseInt(new Date().getTime() / 1000);
                if (!!this.leaveTime) {
                    let o = this.leaveTime - date;
                    if (parseInt(o) > 0) {
                        this.initTime = o;
                    } else {
                        this.$router.push({
                            name: "temp-pay"
                        });
                    }
                }
            }
        });
        let { status, plate, feeType } = this.$route.query;
        if (!!plate) {
            this.plate = plate;
        }
        if (!!feeType) {
            this.feeType = feeType;
        }
        if (!!status) {
            this.status = status;
            if (status.indexOf("?") !== -1) {
                status = status.replace("?", "&");
                this.status = status.substring(0, status.indexOf("&"));
            }

            if (this.status === "success") {
                this.desc = `${this.plate}缴费成功`;
                if (!!this.plate && this.plate !== "无牌车") {
                    this.savePlate().then(res => {});
                }
            } else {
                this.desc = "缴费失败";
            }
        }
    },
    methods: {
        skip() {
            if (this.step === 1) {
                if (this.status === "success") {
                    if (this.feeType === "month") {
                        this.redirectPage();
                    } else {
                        this.step = 2;
                        //记录当前时间
                        let time = parseInt(new Date().getTime() / 1000);
                        this.leaveTime = time + 600;
                    }
                } else {
                    if (this.plate === "无牌车") {
                        this.$vux.toast.text(
                            "请重新扫描无牌车出场二维码",
                            "middle"
                        );
                    } else if (this.feeType === "month") {
                        this.$router.push({
                            path: "/personal/home",
                            query: {
                                actived: 1,
                                plate: this.$route.query.plate
                            }
                        });
                    } else {
                        this.$router.push({
                            name: "temp-pay",
                            query: {
                                plate: this.$route.query.plate
                            }
                        });
                    }
                }
            } else if (this.step === 2) {
                this.redirectPage();
            }
        },
        savePlate() {
            return utils
                .gateway(utils.api.addHistoryPlate, {
                    plate: this.plate
                })
                .then(result => result);
        },
        timeover() {
            this.redirectPage();
        },
        redirectPage() {
            if (this.feeType === "month") {
                this.$router.push({
                    path: "/personal/home",
                    query: {
                        actived: 1,
                        plate: this.$route.query.plate
                    }
                });
            } else {
                this.$router.push({
                    name: "temp-pay"
                });
            }
        }
    }
};
</script>

