<template>
    <div class="page-home">
        <!-- <img class='bg-img' v-show="currIndex!='2'" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/car_bg_logo1@2x.png"> -->
        <div class="home-tab">
            <x-tab :line-width="4">
                <template v-for="(item,index) in itemData">
                    <x-tabitem :key="index" :selected="currIndex === index" @on-item-click="handleClick">{{item}}</x-tabitem>
                </template>
            </x-tab>
        </div>
        <div class="tab-content" v-if="!!loginInfo.user_id">
            <template v-for="(item,index) in comArr">
                <component :key="index" :is="item" v-if="currIndex === index"></component>
            </template>
        </div>
        <div v-if="!loginInfo.user_id" class="no-authorize">
            <div class="usercenter-authorize">
                <div class="card author-card">
                    <div class="author-card-title">请登录您的账号：</div>
                    <div class="author-card-mobile">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_phone.svg">
                        <x-xinput v-model="mobile" type="number" placeholder="请输入手机号" novalidate :show-clear="false" placeholder-align="left"></x-xinput>
                    </div>
                    <div class="author-card-checkcode" v-if="canSend">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_checkcode.svg">
                        <x-xinput v-model="checkcode" type="number" placeholder="请输入验证码" novalidate :show-clear="false" placeholder-align="left"></x-xinput>
                        <x-xbutton class="author-card-checkcode-btn" :class="isSend?'gray':'green'" :disabled="isSend" @click.native="sendCheckcode">{{checkcodeMsg}}</x-xbutton>
                    </div>
                    <div class="error-msg">{{errorMsg}}</div>
                    <x-xbutton class="submit" :disabled="noSubmit" @click.native="login">下一步</x-xbutton>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
import mine from "./mine";
import lovecar from "./loveCar";
import now from "./now";
export default {
    name: "home",
    data() {
        return {
            itemData: ["Now", "爱车", "我的"],
            comArr: ["now", "lovecar", "mine"],
            currIndex: 2,
            isAuthorize: false,
            mobile: "",
            checkcode: "",
            canSend: false,
            isSend: false,
            noSubmit: true,
            checkcodeMsg: "发送验证码",
            errorMsg: ""
        };
    },
    components: {
        mine,
        lovecar,
        now
    },
    computed: {
        ...mapState(["loginInfo"])
    },
    created() {},
    mounted() {
        const { actived, plate } = this.$route.query;
        if (typeof actived !== "undefined") {
            if (!!plate) {
                this.isInStation(plate);
            } else {
                this.$nextTick(() => {
                    this.currIndex = parseInt(actived);
                });
            }
        }
    },
    watch: {
        mobile(val) {
            if (!/^(13|14|15|16|17|18|19)[0-9]{9}$/.test(val)) {
                this.canSend = false;
                this.errorMsg = "手机号格式不正确";
            } else {
                this.noSubmit = true;
                this.errorMsg = "";
                this.canSend = true;
            }
        },
        checkcode(val) {
            let checkcode = val;
            let canSend = this.canSend;
            if (!!val && canSend) {
                this.noSubmit = false;
            } else {
                this.noSubmit = true;
                this.errorMsg = "";
            }
        }
    },
    methods: {
        isInStation(plate) {
            utils
                .gateway(utils.api.getParkingInfoByPlate, { plate })
                .then(res => {
                    if (res.code === 0 && !!res.content) {
                        this.currIndex = 0;
                    }
                });
        },
        handleClick(e) {
            this.currIndex = e;
        },
        sendCheckcode() {
            let mobile = this.mobile;
            let params = {
                mobile,
                source: "wxapp"
            };
            utils.gateway(utils.api.sendCheckcode, params).then(result => {
                console.log("验证码信息：", result);
                // if (result.code === 0 && !!result.content.lists) {
                //   that.setData({
                //     cities: result.content.lists
                //   });
                // }
            });
            let time = 60;
            let timer = setInterval(() => {
                time--;
                this.isSend = true;
                this.checkcodeMsg = `重新获取 (${time})`;
                if (time === 0) {
                    clearInterval(timer);
                    this.isSend = false;
                    this.checkcodeMsg = `重新获取`;
                }
            }, 1000);
        },
        login() {
            let mobile = this.mobile;
            let checkcode = this.checkcode;
            let params = {
                mobile,
                code: checkcode,
                source: "wxapp"
            };
            this.noSubmit = true;
            utils.gateway(utils.api.userRegist, params).then(result => {
                console.log("注册信息：", result);
                if (result.code === 0 && !!result.content) {
                    //this.$router.push({
                    //    name: "home"
                    //});
                    window.location.href = `${window.location.href}?time=${new Date().getTime()}`;
                } else {
                    this.errorMsg = result.message;
                    this.noSubmit = false;
                }
            });
        }
    }
};
</script>
