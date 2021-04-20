<template>
    <div class="page-ticket-scan">
        <div class="ticket-tip">
            <p>支持扫小票领停车券！</p>
            <p>请将小票平铺扫描</p>
        </div>
        <div class="ticket-uploader">
            <div class="ticket-uploader-btn"><i class="fa fa-camera"></i>拍照或上传小票</div>
            <input type="file" ref="fileUploader" accept="image/jpeg,image/jpg,image/png" placeholder="" @change="upload">
        </div>
        <div class="ticket-img-container">
            <img :src="imgUrl" ref="img">
            <div class="ticket-img-scanner" v-if="!!imgUrl">
                <div class="img-scanner-left-top"></div>
                <div class="img-scanner-right-top"></div>
                <div class="img-scanner-left-bottom"></div>
                <div class="img-scanner-right-bottom"></div>
                <div class="img-scanner-line"></div>
            </div>
            <div class="img-scanner-retry" @click="reScan" v-if="isScanFail">重试</div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
export default {
    name: "ticket-scan",
    props: {},
    components: {},
    data() {
        return {
            isScanFail: false,
            imgUrl: "",
            responseImage: ""
        };
    },
    created() {
        utils.cosFileInit('ticket');
    },
    mounted() {},
    methods: {
        upload(event) {
            let files = event.target.files;
            if (files.length > 0) {
                utils.cosFileUpload({files,buketKey:'ticket',pathKey:'scan'}, result => {
                    console.log("上传结果：", result);
                    this.imgUrl = result.url;
                    this.responseImage = result.filename;
                    this.scanTicket(result.filename);
                });
            }
        },
        scanTicket(imgUrl) {
            this.$loading.show({ content: "图片识别中...", mask: true });
            utils
                .gateway(utils.api.scanTicket, { img_url: imgUrl })
                .then(res => {
                    this.$loading.hide();
                    if (res.code === 0) {
                        this.ticketInfo = res.content;
                        //过滤掉不符合条件的优惠券信息
                        this.ticketInfo = this.ticketInfo.filter(item => {
                            return item.terms && item.terms.length > 0;
                        });
                        if (this.ticketInfo.length > 0) {
                            this.$router.push({
                                name: "scan-result",
                                params: {
                                    ticketInfo: this.ticketInfo
                                }
                            });
                        } else {
                            this.isScanFail = true;
                            this.$refs.fileUploader.value = "";
                            this.$vux.toast.text(
                                "没有满足条件的优惠信息，请自行到服务台领券或（点击重试/重新上传小票）",
                                "middle"
                            );
                        }
                    } else {
                        this.isScanFail = true;
                        this.$refs.fileUploader.value = "";
                        this.$vux.toast.text(
                            res.message +
                                ",请自行到服务台领券或（点击重试/重新上传小票）",
                            "middle"
                        );
                    }
                });
        },
        reScan() {
            this.scanTicket(this.responseImage);
        }
    }
};
</script>
