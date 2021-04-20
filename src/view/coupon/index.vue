<template>
    <div class="page-home page-coupon">
        <div class="home-tab">
            <x-tab :line-width="4">
                <template v-for="(item,index) in itemData">
                    <x-tabitem :key="index" :selected="currIndex === index" @on-item-click="handleClick">{{item}}</x-tabitem>
                </template>
            </x-tab>
        </div>
        <div class="tab-content">
            <template v-for="(item,index) in comArr">
                <component :key="index" :is="item" :merchantInfo="merchantInfo" :isUnfixedCoupon="isUnfixedCoupon" v-if="currIndex === index"></component>
            </template>
        </div>
        <!-- <div @click="backTop" class="backtop">Top</div> -->
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
import buy from "./buy";
import history from "./history";
import send from "./send";
export default {
    name: "coupon-index",
    data() {
        return {
            merchantInfo: {},
            itemData: ["发券", "买券", "历史"],
            comArr: ["send", "buy", "history"],
            currIndex: 0
        };
    },
    components: {
        buy,
        history,
        send
    },
    computed: {
        ...mapState(["loginInfo"]),
        isUnfixedCoupon: function () {
            return this.merchantInfo.coupontype == '1' ? true : false;
        }
    },
    created() {
    },
    mounted() {

    },
    watch: {
        loginInfo: {
            handler: function () {
                if (this.loginInfo.mobile) {
                    this.getMerchantInfo();
                }
            },
            immediate: true
        }
    },
    methods: {
        handleClick(e) {
            this.currIndex = e;

        },
        backTop() {
        },
        getMerchantInfo() {
            if (!(this.loginInfo.mobile)) {
                this.$vux.toast.text('没获取到用户手机号'); return;
            }
            let postData = { page: 1, pagesize: 1, phone: this.loginInfo.mobile };
            utils.gateway(utils.api.merchantInfo, postData).then((res) => {
                if (res && res.content && res.content.lists) {
                    this.merchantInfos = res.content.lists;
                    this.merchantInfo = res.content.lists[0];
                    console.log('this.merchantInfo', this.merchantInfo)
                }
            });
        }
    }
};
</script>
