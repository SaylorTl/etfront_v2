<template>
    <div class="unit-bg page-temp-pay integral">
        <!-- 登录 -->
        <div class="page-home">
            <div class="no-authorize">
                <div class="usercenter-authorize">
                    <div class="card author-card">
                        <div class="author-card-title">请登录您的账号：</div>
                        <div class="author-card-mobile">
                            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_phone.svg">
                            <x-xinput v-model="mobile" type="number" placeholder="请输入手机号" novalidate :show-clear="false" placeholder-align="left"></x-xinput>
                        </div>
                        <div class="author-card-checkcode">
                            <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_checkcode.svg">
                            <x-xinput v-model="checkcode" type="number" placeholder="请输入验证码" novalidate :show-clear="false" placeholder-align="left"></x-xinput>
                            <x-xbutton class="author-card-checkcode-btn" :class="isSend?'gray':'green'" :disabled="isSend" @click.native="sendCheckcode">{{checkcodeMsg}}</x-xbutton>
                        </div>
                        <div class="error-msg">{{errorMsg}}</div>
                        <x-xbutton class="submit" :disabled="noSubmit" @click.native="login">登录</x-xbutton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils.js";
import store from '../../vuex/index'
import { mapState } from "vuex";
export default {
    name: "integral-login",
    data() {
        return {
            noSubmit: false,
            errorMsg: '',
            checkcodeMsg: '发送验证码',
            isSend: false,
            mobile: '',
            checkcode: '',
        };
    },
    computed: {
        ...mapState(["appType", "locationInfo"])
    },
    mounted() {
    },
    methods: {
        pay() {
            this.$router.push({
                path: "/integral/tempPlate",
                query: {
                    stationInfo: JSON.stringify(this.stationInfo),
                    plate: this.plate
                }
            });
        },
        sendCheckcode() {
            let mobile = this.mobile;
            let params = {
                mobile: mobile,
                source: "integral"
            };
            if (!utils.validator.isMobile.test(mobile)) {
                this.errorMsg = '手机号格式不对'; return;
            }
            this.errorMsg = '';
            utils.gateway(utils.api.sendCheckcode, params).then(res => {
                console.log("验证码信息3：", res);
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
            if (!utils.validator.isMobile.test(mobile)) {
                this.errorMsg = '手机号格式不对'; return;
            }
            if (!checkcode) {
                this.errorMsg = '缺少验证码'; return;
            }
            let params = {
                mobile: mobile,
                code: checkcode,
                source: "integral"
            };
            utils.gateway(utils.api.integralLogin, params).then(res => {
                if (res && res.code === 0) {
                    window.localStorage.setItem('integralUser', JSON.stringify(res.content));
                    const { plate } = this.$route.query;
                    if (plate) {
                        this.$router.push({ path: "/integral/pay", query: { plate } });
                    } else {
                        this.$router.push({ path: "/integral/plate" });
                    }
                } else {
                    this.errorMsg = res.message;
                }
            });
        }
    }
};
</script>
