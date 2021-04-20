<template>
    <div class="page-car-card-upload">
        <div class="page-car-card-upload-title">EP停车将对您的信息严格保密，请放心认证您的车辆信息</div>
        <div class="card page-car-card-upload-car">
            <div>
                <div>{{plate}}</div>
                <!-- <div>
                    <div></div>
                    <div></div>
                </div> -->
            </div>
            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png">
        </div>
        <div class="card page-car-card-upload-card">
            <div>拍摄案例</div>
            <div>
                <div>
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/cases1_def@2x.png">
                    标准
                </div>
                <div>
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/cases2_def@2x.png">
                    边框缺失
                </div>
                <div>
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/cases3_def@2x.png">
                    照片模糊
                </div>
                <div>
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/cases4_def@2x.png">
                    闪光强烈
                </div>
            </div>
        </div>
        <div class="page-car-card-upload-desc">请上传用户<span>{{loginInfo.mobile}} {{loginInfo.nickname}}</span>的行驶证</div>
        <div class="page-car-card-upload-wrapper">
            <div class="page-car-card-upload-pic">
                <input type="file" ref="xsz" accept="image/jpeg,image/jpg,image/png" placeholder="" @change="upload($event,'xsz')">
                <div class="page-car-card-upload-qrcode">
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_scan@2x.png" lazy>
                    <div>上传行驶证首页</div>
                </div>
                <img :src="xszInfo.url" :style="xszStyle">
            </div>
        </div>
        <div class="page-car-card-upload-msg">基本信息将在识别行驶证后呈现</div>
        <div class="page-car-card-upload-wrapper card2">
            <div class="page-car-card-upload-pic">
                <input type="file" ref="jsz" accept="image/jpeg,image/jpg,image/png" placeholder="" @change="upload($event,'jsz')">
                <div class="page-car-card-upload-qrcode">
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_scan@2x.png" lazy>
                    <div>上传驾驶证首页</div>
                </div>
                <img :src="jszInfo.url" :style="jszStyle">
            </div>
        </div>
        <div class="page-car-card-upload-msg">基本信息将在识别驾驶证后呈现</div>
        <div class="page-car-card-upload-btn">
            <x-xbutton @click.native="nextStep" :disabled="noSubmit">核对无误，下一步</x-xbutton>
        </div>
        <div class="page-car-card-upload-tips">
            <div><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_question.svg"></div>
            <div>有疑问<a href="tel:400-1506888">联系客服</a></div>
        </div>
        <div v-transfer-dom>
            <x-popup v-model="show1" height="100%" position="top">
                <div class="page-car-card-upload">
                    <div class="page-car-card-upload-title">EP停车将对您的信息严格保密，请放心认证您的车辆信息</div>
                    <div class="card page-car-card-upload-car">
                        <div>
                            <div>{{plate}}</div>
                            <div>
                                <div>奔驰</div>
                                <div>C63</div>
                            </div>
                        </div>
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png">
                    </div>
                    <div class="page-car-card-form" v-if="!!xszInfo.paperInfo">
                        <form-item label="车牌号码" :content="transforData(xszInfo.paperInfo,'车牌号码')">
                        </form-item>
                        <form-item label="车辆类型" :content="transforData(xszInfo.paperInfo,'车辆类型')">
                        </form-item>
                        <form-item label="所有人" :content="transforData(xszInfo.paperInfo,'所有人')">
                        </form-item>
                        <form-item label="使用性质" :content="transforData(xszInfo.paperInfo,'使用性质')">
                        </form-item>
                        <form-item label="品牌型号" :content="transforData(xszInfo.paperInfo,'品牌型号')">
                        </form-item>
                        <form-item label="识别代码" :content="transforData(xszInfo.paperInfo,'识别代码')">
                        </form-item>
                        <form-item label="发动机号" :content="transforData(xszInfo.paperInfo,'发动机号')">
                        </form-item>
                        <form-item label="住址" :content="transforData(xszInfo.paperInfo,'住址')">
                        </form-item>
                        <form-item label="注册日期" :content="transforData(xszInfo.paperInfo,'注册日期')">
                        </form-item>
                        <form-item label="发证日期" :content="transforData(xszInfo.paperInfo,'发证日期')">
                        </form-item>
                    </div>
                    <div class="page-car-card-upload-btn">
                        <x-xbutton @click.native="hidePop('xsz')">核对无误，下一步</x-xbutton>
                    </div>
                </div>
            </x-popup>
        </div>
        <div v-transfer-dom>
            <x-popup v-model="show2" height="100%" position="top">
                <div class="page-car-card-upload">
                    <div class="page-car-card-upload-title">EP停车将对您的信息严格保密，请放心认证您的车辆信息</div>
                    <div class="card page-car-card-upload-car">
                        <div>
                            <div>{{plate}}</div>
                            <div>
                                <div>奔驰</div>
                                <div>C63</div>
                            </div>
                        </div>
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png">
                    </div>
                    <div class="page-car-card-form" v-if="!!jszInfo.paperInfo">
                        <form-item label="证号" :content="transforData(jszInfo.paperInfo,'证号')">
                        </form-item>
                        <form-item label="姓名" :content="transforData(jszInfo.paperInfo,'姓名')">
                        </form-item>
                        <form-item label="国籍" :content="transforData(jszInfo.paperInfo,'国籍')">
                        </form-item>
                        <form-item label="性别" :content="transforData(jszInfo.paperInfo,'性别')">
                        </form-item>
                        <form-item label="领证日期" :content="transforData(jszInfo.paperInfo,'领证日期')">
                        </form-item>
                        <form-item label="准驾车型" :content="transforData(jszInfo.paperInfo,'准驾车型')">
                        </form-item>
                        <form-item label="起始日期" :content="transforData(jszInfo.paperInfo,'起始日期')">
                        </form-item>
                    </div>
                    <div class="page-car-card-upload-btn">
                        <x-xbutton @click.native="hidePop('jsz')">核对无误，下一步</x-xbutton>
                    </div>
                </div>
            </x-popup>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import FormItem from "../../components/FormItem/index";
import { mapState } from "vuex";
export default {
    name: "car-card-upload",
    props: {},
    components: {
        FormItem
    },
    data() {
        return {
            plate: "",
            cardMap: { xsz: "行驶证", jsz: "驾驶证" },
            xszInfo: {
                url:
                    "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/drivinglicense_def@2x.png"
            },
            jszInfo: {
                url:
                    "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/drivinglicense_def@2x.png"
            },
            xszStyle: "",
            jszStyle: "",
            xszNumber: 0,
            jszNumber: 0,
            show1: false,
            show2: false,
            baseInfo: {},
            bindType: "",
            stationId: "",
            buildId: "",
            roomId: "",
            noSubmit:false
        };
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {
        utils.cosFileInit("contract");
    },
    mounted() {
        let query = this.$route.query;
        if (!!query) {
            if (!!query.plate) {
                this.plate = this.$route.query.plate;
            }
            if (!!query.station) {
                this.stationId = query.station;
            }
            if (!!query.buildId) {
                this.buildId = query.buildId;
            }
            if (!!query.bindType) {
                this.bindType = query.bindType;
            }
            if (!!query.roomId) {
                this.roomId = query.roomId;
            }
            if (this.bindType === "temp") {
                utils.setTitle("车辆认证");
            } else if (this.bindType === "month") {
                utils.setTitle("月卡申请");
            }
        }
    },
    methods: {
        upload(event, type) {
            let _this = this;
            let files = event.target.files;
            console.log("files:", files);
            utils.cosFileUpload(
                { files, buketKey: "contract", pathKey: type },
                result => {
                    console.log("上传结果：", result);
                    let url = result.url,
                        key = result.filename;
                    _this.checkPapers(url, type).then(info => {
                        if (info.code === 0 && Array.isArray(info.content)) {
                            _this[type + "Info"].paperInfo = info.content;
                            _this[type + "Info"].url = url;
                            _this[type + "Info"].key = key;
                            _this[type + "Style"] =
                                "z-index:11;position:absolute";
                            _this.checkRecognitionRate(
                                _this[type + "Info"].paperInfo,
                                type
                            );
                        } else {
                            _this.$vux.toast.show({
                                type: "warn",
                                width: "3.6rem",
                                text: info.message,
                                time: 3000
                            });
                            
                        }
                    });
                    this.$refs[type].value = "";
                    // if (type === "xsz") {
                    //     this.imgURL1 = result;
                    //     this.style1 = "z-index:11;position:absolute;";
                    // } else if (type === "jsz") {
                    //     this.imgURL2 = result;
                    //     this.style2 = "z-index:11;position:absolute;";
                    // }
                }
            );
        },
        checkPapers(url, type) {
            let params = {
                type: type,
                url: escape(url)
            };
            this.$loading.show({
                content: "证件识别中..."
            });
            return utils
                .gateway(utils.api.checkRecognition, params)
                .then(res => {
                    this.$loading.hide();
                    return res;
                });
        },
        checkRecognitionRate(data, type) {
            if (type === "xsz") {
                let lvArr1 = ["车牌号码", "品牌型号", "识别代码", "发动机号"];
                let lvArr2 = [
                    "车辆类型",
                    "所有人",
                    "注册日期",
                    "发证日期",
                    "使用性质"
                ];
                let level1 = data.filter(oo => {
                    return lvArr1.includes(oo.item);
                });
                let level2 = data.filter(oo => {
                    return lvArr2.includes(oo.item);
                });
                let flag1 = level1.some(item => {
                    return item.confidence > 0.95;
                });
                let flag2 = level2.some(item => {
                    return item.confidence > 0.8;
                });
                if (flag1 && flag2) {
                    this.show1 = true;
                } else {
                    this.$vux.toast.show({
                        type: "warn",
                        width: "3.6rem",
                        text: "行驶证置信度不够，请重新上传",
                        time: 3000
                    });
                    this.$refs[type].value = null;
                }
            } else if (type === "jsz") {
                let lvArr1 = ["证号", "姓名"];
                let level1 = data.filter(oo => {
                    return lvArr1.includes(oo.item);
                });
                let flag1 = level1.some(item => {
                    return item.confidence > 0.95;
                });
                if (flag1) {
                    this.show2 = true;
                } else {
                    this.$vux.toast.show({
                        type: "warn",
                        width: "3.6rem",
                        text: "驾驶证置信度不够，请重新上传",
                        time: 3000
                    });
                    this.$refs[type].value = null;
                }
            }
        },
        nextStep() {
            if (!this.xszInfo.paperInfo) {
                this.$vux.toast.show({
                    type: "text",
                    width: "3.6rem",
                    text: "请上传行驶证",
                    time: 3000
                });
                return;
            } else if (!this.jszInfo.paperInfo) {
                this.$vux.toast.show({
                    type: "text",
                    width: "3.6rem",
                    text: "请上传驾驶证",
                    time: 3000
                });
                return;
            } else {
                
                this.baseInfo.plate = this.plate;
                this.baseInfo.jsz_img = escape(this.jszInfo.key);
                this.baseInfo.xsz_img = escape(this.xszInfo.key);
                if (
                    this.transforData(this.xszInfo.paperInfo, "车牌号码") ===
                    this.plate
                ) {
                    this.noSubmit = true;
                    if (this.bindType === "temp") {
                        //临停车辆绑定
                        this.baseInfo.jsz_info = this.jszInfo.paperInfo;
                        this.baseInfo.xsz_info = this.xszInfo.paperInfo;
                        utils
                            .gateway(utils.api.carBind, this.baseInfo)
                            .then(res => {
                                this.noSubmit = false;
                                if (res.code === 0) {
                                    this.$vux.toast.show({
                                        type: "text",
                                        width: "3.6rem",
                                        text: "提交成功",
                                        time: 3000
                                    });
                                    this.$router.push({
                                        path: "/personal/home",
                                        query: {
                                            actived: 0,
                                            plate: this.plate
                                        }
                                    });
                                } else {
                                    this.$vux.toast.show({
                                        type: "text",
                                        width: "3.6rem",
                                        text: res.message,
                                        time: 3000
                                    });
                                }
                            });
                    } else if (this.bindType === "month") {
                        //月卡车辆绑定
                        let tempCar = [];
                        this.baseInfo.jsz_info = this.jszInfo.paperInfo;
                        this.baseInfo.xsz_info = this.xszInfo.paperInfo;
                        tempCar.push({
                            plate: this.baseInfo.plate,
                            xsz_img: this.baseInfo.xsz_img,
                            xsz_info: this.baseInfo.xsz_info
                        });
                        let tempData = {
                            station_id: this.stationId,
                            identity: "owner",
                            building_id: this.buildId,
                            room_id: this.roomId,
                            car_info: tempCar,
                            jsz_img: this.baseInfo.jsz_img,
                            jsz_info: this.baseInfo.jsz_info
                        };

                        utils
                            .gateway(utils.api.addContractApply, tempData)
                            .then(res => {
                                this.noSubmit = false;
                                if (res.code === 0) {
                                    this.$vux.toast.show({
                                        type: "text",
                                        width: "3.6rem",
                                        text: "月卡申请成功",
                                        time: 3000
                                    });
                                    this.$router.push({
                                        name: "home"
                                    });
                                } else {
                                    this.$vux.toast.show({
                                        type: "text",
                                        width: "3.6rem",
                                        text: res.message,
                                        time: 3000
                                    });
                                }
                            });
                    }
                } else {
                    this.noSubmit = false;
                    this.$vux.toast.show({
                        type: "text",
                        width: "3.6rem",
                        text: "行驶证车牌与绑定车牌不一致",
                        time: 3000
                    });
                    return;
                }
            }
        },
        hidePop(type) {
            if (type === "xsz") {
                this.show1 = false;
            } else if (type === "jsz") {
                this.show2 = false;
            }
        },
        transforData(data, key) {
            let temp = data.filter(item => {
                return item.item === key;
            });
            return temp[0].itemstring;
        }
    }
};
</script>
