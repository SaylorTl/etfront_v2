<template>
    <div class="page-scan-result">
        <div class="scan-result-list">
            <div class="scan-result-item card"
                 :class="{'active':index === currentTicket}"
                 v-for="(item,index) in ticketInfo"
                 :key="index">
                <div @click="checkRecognition(item,index)">
                    <div class="tc">
                        <div>订单号：</div>
                        <div>{{item.tnum}}</div>
                    </div>
                    <div class="tc">
                        <div>交易时间：</div>
                        <div>{{item.time}}</div>
                    </div>
                    <div class="tc">
                        <div>商家：</div>
                        <div>{{item.merchant_name}}</div>
                    </div>
                    <div class="tc">
                        <div>停车场：</div>
                        <div>{{item.station_name}}</div>
                    </div>
                    <div class="tc">
                        <div>金额：</div>
                        <div>{{item.money}}</div>
                    </div>
                </div>
                <div class="tc-border">
                    <div>可选优惠券：</div>
                </div>
                <div class="tc-list">
                    <div v-for="(sItem,sIndex) in item.terms"
                         :key="sIndex"
                         @click.stop="checkCoupon(item.terms,sItem,sIndex)">
                        <div>{{sItem.type_name}}</div>
                        <div class="tc-item-flg"
                             :class="{'active':sItem.flag}"><span></span></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="scan-result-footer">
            <div class="scan-result-picker">
                <plate-picker @ok="getPlate"></plate-picker>
            </div>
            <div class="scan-result-btn"
                 @click="getCouponTicket">领券</div>
        </div>
    </div>
</template>
<script>
import PlatePicker from "../../components/PlatePicker/index";
import utils from "../../utils/utils";
export default {
    name: "scan-result",
    components: {
        PlatePicker
    },
    props: {},
    data() {
        return {
            ticketInfo: "",
            couponInfo: "",
            currentTicket: -1,
            plate: "",
            couponId: "",
            merchantId: "",
            tnum: "",
            time: "",
            selectedData: ""
        };
    },
    mounted() {
        let tParams = this.$route.params;
        if (!!tParams && !!tParams.ticketInfo) {
            this.ticketInfo = tParams.ticketInfo;
            this.ticketInfo.map(item => {
                if (item.terms.length) {
                    item.terms = item.terms.map(s => {
                        return {
                            ...s,
                            flag: item.terms.length === 1 ? true : false
                        };
                    });
                }
                return {
                    ...item
                };
            });
        }
    },
    methods: {
        getPlate(data) {
            if (!data.isError) {
                this.plate = data.plate;
            }
        },
        checkRecognition(data, index) {
            this.currentTicket = index;
            this.merchantId = data.merchant_id;
            this.tnum = data.tnum;
            if(!!data.time && data.time.indexOf(':') != -1){
                let tempTime = data.time.split(':')[0];
                data.time = tempTime.substring(0,tempTime.length-2);
            }
            this.time = data.time;
            this.selectedData = data;
        },
        checkCoupon(allData,data, index) {
            data.flag = !data.flag;
            this.couponId = data.type_id;
            allData = allData.map((item,i) => {
                if(allData[index].flag){
                    if(i !== index){
                        item.flag = false;
                    }
                }
            })
        },
        getCouponTicket() {
            if (!this.plate) {
                this.$vux.toast.text("请输入车牌号", "middle");
                return;
            } else if (!this.merchantId) {
                this.$vux.toast.text("请选择商家信息", "middle");
                return;
            } else {
                if (this.selectedData.terms.length > 0) {
                    let temp = this.selectedData.terms.filter(
                        item => item.flag
                    );
                    if(temp.length === 0){
                        this.$vux.toast.text("请在已选商家中选择优惠券", "middle");
                        return;
                    }else{
                        this.couponId = temp[0].type_id;
                    }
                }
                if (!this.couponId) {
                    this.$vux.toast.text("请在已选商家中选择优惠券", "middle");
                    return;
                } else {
                    let params = {
                        plate: this.plate,
                        type_id: this.couponId,
                        merchant_id: this.merchantId,
                        tnum: this.tnum,
                        time: this.time
                    };
                    this.$loading.show({
                        content: "领券操作中..."
                    });
                    utils.gateway(utils.api.getScanTicket, params).then(res => {
                        if (res.code === 0) {
                            this.$vux.toast.text("领券成功", "middle");
                            this.$router.push({
                                name:'home'
                            })
                        } else {
                            this.$vux.toast.text(res.message, "middle");
                        }
                        this.$loading.hide();
                    });
                }
            }
        }
    }
};
</script>
