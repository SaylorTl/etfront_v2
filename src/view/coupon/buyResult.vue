<template>
    <div class="page-buyResult">
        <div class="card con addfrom">
            <div class="logo-box">
                <expression :status="status"></expression>
                <img v-show="status==='success'" class="status-icon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190709/success.png" />
                <img v-show="status==='fail'" class="status-icon" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190709/fail.png" />
                <div class="status-text" :class="{fail:status==='fail'}">支付{{statusOption[status]}}</div>
            </div>
            <div class="pad">
                <x-cell class="shop" title="支付金额" :value="orderInfo.amount"></x-cell>
                <x-cell title="支付渠道" value="微信支付"></x-cell>
                <x-cell title="支付类型" :value="'优惠券购买'"></x-cell>
                <x-cell title="商家名称" :value="orderInfo.merchant_name"></x-cell>
                <x-cell title="优惠券名称" :value="orderInfo.type_name"></x-cell>
                <x-cell :title="orderInfo.coupon_type_kind=='3'?'优惠券金额':'优惠券数量'" :value="orderInfo.num"></x-cell>
                <x-cell title="订单号" :value="tnum"></x-cell>
                <div class="button-box">
                    <x-xbutton @click.native="backCoupon">返回</x-xbutton>
                </div>
            </div>
            <img class="footerimg" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/popup_coupon_bg@2x.png">
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
import expression from "../../components/Expression";
export default {
    name: "coupon-buyResult",
    data() {
        return {
            tnum: 'tnum',//不能为空，为空时会返回很多数据
            orderInfo: {},
            statusOption: { fail: '失败', success: '成功' },
            status: 'fail',//success,fail,
            query: ''
        }
    },
    components: {
        expression
    },
    created() {
        this.init();
    },
    mounted() {
        this.getOrderInfo()
    },
    methods: {
        init() {
            const query = this.$route.query;
            this.query = query;
            this.status = query.status || 'fail';
            this.tnum = query.tnum || 'tnum';
        },
        backCoupon() {
            this.$router.push('/coupon/index')
        },
        getOrderInfo() {
            let postData = {
                page: 1,
                pagesize: 100,
                tnum: this.tnum
            }

            utils.gateway(utils.api.orderLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content) {
                    let list = res.content.lists || [];
                    if (list[0].tnum) {
                        this.orderInfo = list[0];
                    }
                }
            });
        }
    }
};
</script>

