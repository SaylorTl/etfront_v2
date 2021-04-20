<template>
    <div class="page-mine">
        <div class="card mine-info">
            <div class="mine-info-top">
                <div>
                    <div>{{loginInfo.username || loginInfo.nickname || loginInfo.fullname || loginInfo.mobile}}</div>
                    <div v-show="!!userAddress">{{userAddress}}</div>
                </div>
                <div><img :src="userInfo.head_img || 'https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/avatar.svg'"></div>
            </div>
            <div class="mine-info-bottom">
                <div>{{userType[userInfo.user_type]}}</div>
                <div></div>
            </div>
        </div>
        <div class="mine-hr">
            <!--分割线-->
        </div>
        <div class="card mine-card">
            <div class="mine-card-title">
                基本功能
            </div>
            <div class="mine-card-content">
                <div class="mine-card-content-item" v-for="(item,index) in baseArr" :key="index" @click="redirectPage(item.url)">
                    <div class="mine-card-content-item-pic"><img :src="item.icon"></div>
                    <div>{{item.name}}</div>
                </div>
                <!-- <div class="mine-card-content-item">
                    <div class="mine-card-content-item-pic border"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_payment_records.svg"></div>
                    <div>消息</div>
                </div> -->
                <!-- <div class="mine-card-content-item">
                    <div class="mine-card-content-item-pic border"><img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_parking_lock.svg"></div>
                    <div>车位锁</div>
                </div> -->
            </div>
        </div>
        <div class="card mine-card" v-show="userInfo.role_type.includes('merchants')">
            <div class="mine-card-title">
                商家功能
            </div>
            <div class="mine-card-content">
                <div class="mine-card-content-item" v-for="(item,index) in bussinessArr" :key="index" @click="redirectPage(item.url)">
                    <div class="mine-card-content-item-pic"><img :src="item.icon"></div>
                    <div>{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="card mine-card" v-show="userInfo.role_type.includes('manager')">
            <div class="mine-card-title">
                管家版块
            </div>
            <div class="mine-card-content">
                <div class="mine-card-content-item" v-for="(item,index) in manageArr" :key="index" @click="redirectPage(item.url)">
                    <div class="mine-card-content-item-pic"><img :src="item.icon"></div>
                    <div>{{item.name}}</div>
                </div>
            </div>
        </div>
        <!-- <div class="card mine-card"></div>
        <div class="card mine-card"></div> -->
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
export default {
    name: "mine",
    data() {
        return {
            merchantInfo:false,
            userType: { contract: "月卡用户", temp: "临停用户",other:"未知用户" },
            baseArr: [
                {
                    name: "缴费记录",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_news.svg",
                    url: {
                        name: "parking-payment"
                    }
                },
                {
                    name: "月卡申请",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_accoun.svg",
                    url: {
                        path: "/car/car-plate-bind",
                        query:{
                            bindType:"month"
                        }
                    }
                },
                {
                    name: "月卡代缴",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_payment_records.svg",
                    url: {
                        path: "/temp/temp-pay",
                        query: {
                            type: "proxy"
                        }
                    }
                },
                {
                    name: "扫小票",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_daily.svg",
                    url: {
                        name: "ticket-scan"
                    }
                }
            ],
            bussinessArr: [
                {
                    name: "优惠券",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_card.svg",
                    url: {
                        name: "coupon-index"
                    }
                },
                {
                    name: "自动领券",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_card.svg",
                    url: {
                        name: "coupon-auto"
                    }
                },
                {
                    name: "优惠券限制",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_card.svg",
                    url: {
                        name: "coupon-limit"
                    }
                },
                {
                    name: "优惠券授权",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_card.svg",
                    url: {
                        name: "coupon-authorize"
                    }
                },
                {
                    name: "扫小票配置",
                    icon:
                        "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_card.svg",
                    url: {
                        name: "ticket-config"
                    }
                }
            ],
            manageArr:[
                {
                    name:"车场日报",
                    icon:"https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190321/icon_daily.svg",
                    url:{
                        name:"daily"
                    }
                }
            ]
        };
    },
    computed: {
        ...mapState(["loginInfo","userInfo"]),
        userAddress(){
            return Array.isArray(this.userInfo.roomlist) ? (this.userInfo.roomlist[0].build_name + this.userInfo.roomlist[0].unit_name) : ''
        }
    },
    watch: {
    },
    created() { },
    methods: {
        redirectPage(url) {
            this.$router.push(url);
        }
    }
};
</script>
