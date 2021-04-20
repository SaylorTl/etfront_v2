<template>
    <div class="page-login">
        <div class="no-authorize">
            <div class="usercenter-authorize">
                <div class="card author-card">
                    <div class="author-card-title">请登录您的账号：</div>
                    <div class="author-card-mobile">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_phone.svg">
                        <x-xinput v-model="mobile"
                                  type="number"
                                  placeholder="请输入手机号"
                                  novalidate
                                  :show-clear="false"
                                  placeholder-align="left"></x-xinput>
                    </div>
                    <div class="author-card-checkcode"
                         v-if="canSend">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_checkcode.svg">
                        <x-xinput v-model="checkcode"
                                  type="number"
                                  placeholder="请输入验证码"
                                  novalidate
                                  :show-clear="false"
                                  placeholder-align="left"></x-xinput>
                        <x-xbutton class="author-card-checkcode-btn"
                                   :class="isSend?'gray':'green'"
                                   :disabled="isSend"
                                   @click.native="sendCheckcode">{{checkcodeMsg}}</x-xbutton>
                    </div>
                    <div class="error-msg">{{errorMsg}}</div>
                    <x-xbutton class="submit"
                               :disabled="noSubmit"
                               @click.native="login">下一步</x-xbutton>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from '../../utils/utils';
export default {
    name: "login",
    components: {},
    props: {},
    data() {
        return {
            mobile: "",
            checkcode: "",
            canSend: false,
            isSend: false,
            noSubmit: true,
            checkcodeMsg: "发送验证码",
            errorMsg: "",
            redirectRoute:"",
            isCheck:false
        };
    },
    mounted(){
        const {mobile,redirectRoute,isCheck} = this.$route.query;
        if(!!mobile){
            this.mobile = mobile;
        }
        if(!!redirectRoute){
            this.redirectRoute = redirectRoute;
        }
    },
    watch:{
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
    methods:{
        sendCheckcode() {
            let mobile = this.mobile;
            let params = {
                mobile: mobile,
                source: "wxapp"
            };
            utils.gateway(utils.api.sendCheckcode, params).then(result => result);
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
                mobile: mobile,
                code: checkcode,
                source: "wxapp"
            };
            utils.gateway(utils.api.userRegist, params).then(result => {
                console.log("注册信息：", result);
                if (result.code === 0 && !!result.content) {
                    this.$store.commit("setLoginInfo", result.content.user_id);
                    if(this.redirectRoute){
                        let url = '';
                        if(this.redirectRoute.indexOf('?') != -1){
                            url = `${this.redirectRoute}&isCheck=true`;
                        }else{
                            url = `${this.redirectRoute}?isCheck=true`; 
                        }
                        window.location.href = url;
                    }
                } else {
                    this.errorMsg = result.message;
                }
            });
        }
    }
};
</script>