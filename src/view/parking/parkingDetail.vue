<template>
    <div class="page-temp-fee scroll">
        <div class="cost-card card">
            <div class="cost-box-top">
                <div class="cost-box-top-desc">
                    <div>{{theme}}</div>
                    <div>{{stationName}}</div>
                </div>
                <div class="cost-box-top-image">
                    <img :src="logo">
                </div>
            </div>
            <div class="cost-box-bottom">
                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_parking.svg">
                <div>{{address}}</div>
            </div>
        </div>
        <div class="cost-form">
            <form-item label="商品名称" :content="name"></form-item>
            <form-item label="订单编号" :content="tnum"></form-item>
            <form-item v-if="orderType === 'temp'" label="停车时长" :content="duringTime"></form-item>
            <form-item :label="orderType==='temp'?'入场时间':'开始时间'" :content="beginTime"></form-item>
            <form-item :label="orderType==='temp'?'出场时间':'结束时间'" :content="endTime"></form-item>
            <form-item label="支付渠道" :content="sourceType"></form-item>
            <form-item v-if="!!coupon" label="优惠金额" :content="coupon+''"></form-item>
            <form-item v-if="!!coupon" label="优惠说明" :content="couponDesc"></form-item>
            <form-item label="应付金额" :content="amount+'元'"></form-item>
            <form-item label="实付金额" :border="false">
                <div slot="content">
                    <div class="cell-total">{{haveToPay}}<span>元</span></div>
                </div>
            </form-item>
        </div>
        <!-- <div class="cost-btn">
            <x-xbutton :disabled="!canPay" @click.native="handleInvoice">开票</x-xbutton>
        </div>
        <div class="cost-tips">
            <div><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_question.svg"></div>
            <div>有疑问<a href="tel:400-1506888">联系客服</a></div>
        </div> -->
    </div>
</template>
<script>
import utils from 'utils/utils';
import FormItem from 'components/FormItem/index';
export default {
    name:'parking-detail',
    props:{},
    components:{
        FormItem
    },
    data(){
        return {
            utils,
            tnum:"",
            theme:"",
            orderType:"",
            logo:"http://cache.aparcar.cn/car/unknown.jpg",
            name:"",
            stationName:"",
            address:"",
            sourceType:"",
            duringTime:"",
            beginTime:"",
            endTime:"",
            coupon:"",
            couponDesc:"",
            amount:"",
            haveToPay:"",
            canPay:true
        }
    },
    mounted(){
        const { tnum } = this.$route.query;
        if(tnum){
            this.tnum = tnum;
            this.getOrderDetail(this.tnum);
        }
    },
    methods:{
        getOrderDetail(tnum){
            utils.gateway(utils.api.getOrderDetail,{tnum}).then(res => {
                if(res.code === 0 && res.content){
                    let result = res.content;
                    this.dealType(result);
                    this.dealTheme(result);
                    this.dealTime(result);
                    this.dealCoupon(result);
                    this.stationName = result.station_name;
                    this.address = result.station_address;
                    this.logo = !!result.car_brand_logo?`https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/carlogo/${result.car_brand_logo}`:'http://cache.aparcar.cn/car/unknown.jpg';
                    this.name = (result.attach && result.attach.body)?result.attach.body:'车场日报';
                    this.tnum = result.tnum;
                    this.sourceType = result.source_name;
                    this.haveToPay = result.amount;
                    this.amount = result.total_amount;
                }
            })
        },
        /**
         * 处理卡片大字体显示内容
         */
        dealTheme(data){
            if(this.orderType === "temp"){
                this.theme = data.plate || '未知车牌';
            }else if(this.orderType === "month"){
                this.theme = `月卡·${data.contract_plates[0]}`;
            }else if(this.orderType === "daily"){
                this.theme = "车场日报";
            }
        },
        /**
         * 处理订单类型
         */
        dealType(data){
            if(data.order_type === 1){
                this.orderType = 'temp';
            }else if(data.order_type === 2){
                this.orderType = 'month';
            }else if(data.order_type === 4){
                this.orderType = 'daily';
            }
        },
        /**
         * 处理时间段
         */
        dealTime(data){
            if(data.attach){
                if(data.attach.time_begin && data.attach.time_end){
                    this.beginTime = data.attach.time_begin;
                    this.endTime = data.attach.time_end;
                    this.duringTime = utils.transforData(data.attach.time_begin,data.attach.time_end);
                }
            }
        },
        dealCoupon(data){
            if(data.coupon_info && Array.isArray(data.coupon_info) && data.coupon_info.length > 0){
                this.coupon = data.coupon_info[0].coupon_amount;
                this.couponDesc = data.coupon_info[0].coupon_name;
            }
        },
        handleInvoice(){
            this.$vux.toast.text('功能建设中...','middle');
        }
    }
}
</script>
