<template>
    <div class="page-emergency-open">
        <div class="card page-emergency-open-card">
            <form-item label="订单号" :content="result.tnum"></form-item>
            <form-item label="停车场" :content="result.station_name"></form-item>
            <form-item label="支付时间" :content="result.paidtime"></form-item>
            <form-item label="缴费金额" :content="result.total_amount+''"></form-item>
            <form-item label="支付渠道" :content="result.source_name"></form-item>
            <form-item label="支付结果" :content="statusMap[status]"></form-item>
        </div>
    </div>
</template>
<script>
import utils from "utils/utils";
import FormItem from "components/FormItem/index";
export default {
    name: "daily-detail",
    props: {},
    components: {
        FormItem
    },
    data() {
        return {
            tnum: "",
            status: "",
            statusMap: { success: "成功", fail: "失败" },
            result:""
        };
    },
    mounted() {
        let { tnum, status } = this.$route.query;
        if (!!tnum) {
            this.tnum = tnum;
        }
        if (!!status) {
            this.status = status;
            if (status.indexOf("?") !== -1) {
                status = status.replace("?", "&");
                this.status = status
                    .substring(0, status.indexOf("&"));
            }
        }
        this.getOrderResult();
    },
    methods: {
        getOrderResult() {
            let params = {
                page: 1,
                pagesize: 1,
                order_type: 4,
                tnum: this.tnum
            };
            utils.gateway(utils.api.payorderLists, params).then(res => {
                if (res.code === 0) {
                    if(res.content && Array.isArray(res.content.lists) && res.content.lists.length > 0){
                        this.result = res.content.lists[0]
                    }
                } else {
                    this.$vux.toast.show({
                        text: res.message,
                        type: "error"
                    });
                }
            });
        }
    }
};
</script>
