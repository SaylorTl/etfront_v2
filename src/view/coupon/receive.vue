<template>
    <div class="page-home page-coupon">
        <img class='bg-img' src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/car_bg_logo1@2x.png">
        <div class="tab-content">
            <div class="card con addfrom">
                <div class="pad">
                    <div class="logo-box"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/loading-icon.svg"></div>
                    <plate-picker @ok="getPlate" :initPlate="plate"></plate-picker>
                    <div class="tip">扫码进场的无牌车请输入：EP+手机号后5位数字</div>
                    <div v-show="showInfo">
                        <x-cell class="shop" title="停车场" :value="codeInfo.station"></x-cell>
                        <x-cell class="shop" title="进场时间" :value="codeInfo.intime"></x-cell>
                        <x-cell class="shop" title="临停费用" :value="codeInfo.money||''+'元'"></x-cell>
                    </div>
                    <div class="button-box">
                        <x-xbutton @click.native="submit">领券</x-xbutton>
                    </div>
                </div>
                <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
import PlatePicker from "../../components/PlatePicker/index";

export default {
    name: "coupon-receive",
    data() {
        return {
            codeInfo: {},
            showInfo: false,
            plate: ''
        };
    },
    components: {
        PlatePicker
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {
        if (this.$route.query.codeInfo) {
            this.codeInfo = JSON.parse(this.$route.query.codeInfo);
        }
    },
    methods: {
        getPlate(item) {
            if (!item.isError) {
                this.plate = item.plate;
                this.getParked();
            }
        },
        getParked() {
            let codeInfo = this.codeInfo;
            let postData = {
                merchant_id: codeInfo.merchant_id,
                plate: this.plate
            }
            utils.gateway(utils.api.checktemp, postData).then(res => {
                if (res && res.content) {
                    let park = res.content.templists || {};
                    this.showInfo = true;
                    codeInfo.station = res.content.station_name
                    codeInfo.intime = utils.eptimes.outTime(park.begin, 'MM/dd hh:mm');
                    codeInfo.money = park.money;
                } else {
                    this.showInfo = false;
                    this.$vux.toast.text(res.message);
                }
            });
        },
        submit() {
            if (!this.plate) { this.$vux.toast.text("请输入车牌"); return; }
            let postData = {}
            let codeInfo = this.codeInfo;
            if (codeInfo.type === 'isUnfixedCoupon') {
                postData = {
                    plate: this.plate,
                    merchant_id: codeInfo.merchant_id,
                    token: codeInfo.token,
                    pond_id: codeInfo.pond_id
                }
            } else if (codeInfo.type === 'isfixedCoupon') {
                postData = {
                    plate: this.plate,
                    cnum: codeInfo.cnum,
                    phone: codeInfo.phone,
                }
            }
            this.$loading.show({ content: '正在领取,请稍后...', mask: true });
            utils.gateway(utils.api.sendSweepcode, postData).then((res) => {
                this.$loading.hide();
                if (res && res.code === 0) {
                    this.$vux.toast.text('领取成功');
                } else {
                    this.$vux.toast.text(res.message);
                }
            }).catch(() => {
                this.$vux.toast.text('领券服务未知错误');
            })
        },
    }
};
</script>
