<template>
    <div class="page-integral-history">
        <div class="history">
            <touch-up @touchUp="pullUp">
                <div class="con">
                    <div @click="more(index)" v-for="(item,index) in dataList" :key="index" class="ticket card touch">
                        <div class="ticketcon">
                            <h3>{{item.station_name}}</h3>
                            <h4>使用时间{{item.use_time}}</h4>
                            <div class="money">￥{{item.amount}}</div>
                            <div class="more" v-show="item.show">
                                <h4 class="flex-between"><span>停车时间</span><span>{{item.enter_time}}</span> </h4>
                                <h4 class="flex-between"><span class="visibility">停车时间：</span><span>{{item.out_time}}</span></h4>
                                <h4 class="flex-between"><span>停车时长</span><span>{{item.duration}}分</span></h4>
                                <h4 class="flex-between"><span>应交停车费</span><span>{{item.total_amount}} 元</span></h4>
                                <h4 class="flex-between"><span>优惠券</span><span>{{item.coupon_amount}} 元</span></h4>
                                <h4 class="flex-between"><span>会员积分抵扣</span><span>{{item.total_use_integral}}</span></h4>
                                <h4 class="flex-between"><span>会员积分抵扣金额</span><span>{{item.integral_convert_amount}} 元</span></h4>
                                <h4 class="flex-between"><span>实交停车费</span><span>{{item.amount}} 元</span></h4>
                            </div>
                        </div>
                        <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
                    </div>
                </div>
            </touch-up>
            <div class="bottom-menus flex">
                <img @click="platePage" :class="{active:active==='1'}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190826/stop-1.svg" />
                <img :class="{active:active==='2'}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/app/20190826/stop-2.svg" />
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils.js";
import touchUp from "../../components/touchUp";
import { mapState } from "vuex";
export default {
    name: "integral-history",
    data() {
        return {
            show: false,
            active: '2',
            plate: "",
            isSpecial: false,
            historyPlates: [], //'京A88888警','沪A66666', '桂A5RET', '渝A99999'
            showHistory: true,
            pagesize: 10,
            page: 1,
            noPay: true,
            inStation: false,
            specialText: "特",
            plateMsg: "",
            isError: false,
            isGreen: "",
            feeType: "",
            dataList: [],
            integralUser: {}
        };
    },
    components: { touchUp },
    mounted() {
        const { plate, type } = this.$route.query;
        if (!!plate) {
            this.plate = plate;
        }
        this.integralUser = JSON.parse(window.localStorage.getItem('integralUser')) || {};
        this.getData();
    },
    methods: {

        platePage() {
            this.$router.push({ path: "/integral/plate" });
        },
        getData() {
            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.integralLists, {
                pagesize: this.pagesize,
                page: this.page,
                mobile: this.integralUser.mobile
            }).then(res => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    this.dataList = this.dataList.concat(res.content.lists);
                    this.page++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            })
        },
        more(index) {
            this.dataList[index].show = !this.dataList[index].show;
            this.$forceUpdate();
        },
        login() {
            this.$router.push({ path: "/integral/login" });
        },
        pullUp() {
            this.getData();
        },

    }
};
</script>
