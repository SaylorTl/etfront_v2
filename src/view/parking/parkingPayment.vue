<template>
    <div class="parking-payment">
        <x-tab custom-bar-width="1.3rem" :animate="false">
            <x-tabitem selected @on-item-click="onItemClick">月卡</x-tabitem>
            <x-tabitem @on-item-click="onItemClick">临停</x-tabitem>
            <x-tabitem @on-item-click="onItemClick">车场日报</x-tabitem>
        </x-tab>
        <div class="tab-container" v-if="isShow">
            <x-scroller lock-x ref="pageScroller"  :scroll-bottom-offset="200" @on-scroll-bottom="handleMore">
                <div>
                    <div class="card" v-for="item in lists" :key="item.id"  @click="handleCardClick(item)">
                        <div class="card__content">
                            <div :class="iconClass">
                                <img :src="iconSrc" />
                            </div>
                            <div class="card__content__right">
                                <div class="card__content__right__plate">{{dealData(item)}}</div>
                                <div class="card__content__right__date">{{item.paidtime}}</div>
                            </div>
                        </div>
                        <div class="card__footer">
                            <span class="card__footer__left">{{item.station_name}}</span>
                            <label class="card__footer__right">
                                <span>{{item.amount}}元</span>
                                <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/arrow-right.svg" />
                            </label>
                        </div>
                    </div>
                    <x-loadmore :show-loading="isLoading" :tip="loadingTip"></x-loadmore>
                </div>
            </x-scroller>
        </div>
    </div>
</template>

<script>
import utils from "utils/utils";

export default {
    data() {
        return {
            currentTabIndex: 0,
            isShow: true,
            lists: [],
            mothLists: [],
            tempLists: [],
            dailyLists:[],
            mothPage: 1,
            tempPage: 1,
            dailyPage:1,
            pageSize: 20,
            monthTotal: 0,
            tempTotal: 0,
            dailyTotal:0,
            tempSroll:false,
            monthScroll:false,
            dailyScroll:false,
            onFetching: false,
            isLoading: false,
            more: 10,
            loadingTip: "暂无数据",
            tips: {
                loading: "正在加载",
                endLoading: "没有更多数据了"
            }
        };
    },
    created() {
        
    },
    mounted() {
        this.$loading.show();
        this.getMonthList().then(res => {
            this.$loading.hide();
            this.mothLists = res.lists;
            this.monthTotal = res.total;
            this.lists = this.mothLists;
        });
        this.$nextTick(() => {
            this.$refs.pageScroller.reset({ top: 0 });
        });
    },
    computed: {
        iconClass() {
            const classObj = {
                card__content__left: true
            };
            if (this.currentTabIndex === 0) {
                classObj["card__content__left--car"] = true;
            } else if (this.currentTabIndex > 0) {
                classObj["card__content__left--park"] = true;
            }
            return classObj;
        },
        iconSrc() {
            return this.currentTabIndex === 0
                ? "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png"
                : "https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_EPLOGO@2x.png";
        }
    },
    methods: {
        initScroller() {
            this.onFetching = false;
            this.isLoading = false;
            this.$refs.pageScroller.reset({ top: 0 });
        },
        onItemClick(index) {
            this.isShow = false;
            this.currentTabIndex = index;
            this.mothPage = 1;
            this.tempPage = 1;
            if (index === 0) {
               
                if (!this.mothLists.length) {
                    this.$loading.show();
                    this.getMonthList().then(res => {
                        this.isShow = true;
                        this.$loading.hide();
                        this.mothLists = res.lists;
                        this.lists = this.mothLists;
                        this.monthTotal = res.total;
                        if(this.lists.length > 0){
                            this.monthScroll = true;
                        }
                    });
                    this.initScroller();
                } else {
                    this.isShow = true;
                    this.lists = this.mothLists;
                }
            } else if (index === 1) {
                
                if (!this.tempLists.length) {
                    this.$loading.show();
                    this.getTempList().then(res => {
                        this.isShow = true;
                        this.$loading.hide();
                        this.tempLists = res.lists;
                        this.lists = this.tempLists;
                        this.tempTotal = res.total;
                        if(this.lists.length > 0){
                            this.tempSroll = true;
                        }
                    });
                    this.initScroller();
                } else {
                    this.isShow = true;
                    this.lists = this.tempLists;
                }
            }else{
                if (!this.dailyLists.length) {
                    this.$loading.show();
                    this.getDailyList().then(res => {
                        this.isShow = true;
                        this.$loading.hide();
                        this.dailyLists = res.lists;
                        this.lists = this.dailyLists;
                        this.dailyTotal = res.total;
                        if(this.lists.length > 0){
                            this.dailyScroll = true;
                        }
                    });
                    this.initScroller();
                } else {
                    this.isShow = true;
                    this.lists = this.dailyLists;
                }
            }
        },
        handleMore() {
            const { loading, endLoading } = this.tips;
            if (this.onFetching) {
                this.isLoading = true;
                this.loadingTip = loading;
            } else {
                if (
                    this.currentTabIndex === 0 &&
                    this.monthTotal >= this.mothLists.length && this.monthScroll
                ) {
                    this.onFetching = true;
                    this.mothPage += 1;
                    this.getMonthList().then(res => {
                        this.onFetching = false;
                        this.isLoading = false;
                        if (res.lists.length > 0) {
                            this.mothLists = [...this.mothLists, res.lists];
                            this.lists = this.mothLists;
                            this.monthTotal = res.total;
                        } else {
                            this.loadingTip = endLoading;
                        }
                    });
                } else if (
                    this.currentTabIndex === 1 &&
                    this.tempTotal >= this.tempLists.length && this.tempSroll
                ) {
                    this.onFetching = true;
                    this.tempPage += 1;
                    this.getTempList().then(res => {
                        this.onFetching = false;
                        this.isLoading = false;
                        if (res.lists.length > 0) {
                            this.tempLists = [...this.tempLists, res.lists];
                            this.lists = this.tempLists;
                            this.tempTotal = res.total;
                        } else {
                            this.loadingTip = endLoading;
                        }
                    });
                }
            }
        },
        getMonthList() {
            const params = {
                order_status: "paid",
                page: this.mothPage,
                pagesize: this.pageSize,
                order_type: 2
            };
            return this.getList(params).then(res => {
                return {
                    lists: res.lists ? res.lists : [],
                    total: res.total
                };
            });
        },
        getTempList() {
            const params = {
                order_status: "paid",
                page: this.tempPage,
                pagesize: this.pageSize,
                order_type: 1
            };
            return this.getList(params).then(res => {
                return {
                    lists: res.lists ? res.lists : [],
                    total: res.total
                };
            });
        },
        getDailyList() {
            const params = {
                order_status: "paid",
                page: this.dailyPage,
                pagesize: this.pageSize,
                order_type: 4
            };
            return this.getList(params).then(res => {
                return {
                    lists: res.lists ? res.lists : [],
                    total: res.total
                };
            });
        },
        getList(params) {
            return utils.gateway(utils.api.payorderLists, params).then(res => {
                const { code, message } = res;
                if (code === 0) {
                    return res.content;
                } else {
                    this.$vux.toast.show({
                        text: message,
                        type: "error"
                    });
                }
            });
        },
        handleCardClick(item){
            this.$router.push({
                name:'parking-detail',
                query:{
                    tnum:item.tnum
                }
            })    
        },
        dealData(data){
            if(data.contract_plates && Array.isArray(data.contract_plates)){
                if(data.contract_plates.length > 3){
                    return data.contract_plates.slice(0,3).join(',') + '...'
                }else{
                    return data.contract_plates.join(',')
                }
            }else{
                return data.plate;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.parking-payment {
    display: flex;
    flex-direction: column;
    img {
        width: 100%;
    }
    .tab-container {
        flex: 1;
        padding: 0.5rem 0.4rem 0;
        background-color: rgba(248, 248, 248, 1);
        &__footer {
            margin: 0.5rem 0;
            color: #999;
            text-align: center;
        }
    }
    .card {
        padding: 0.3rem;
        margin-bottom: 0.3rem;
        border-radius: 0.13rem;
        box-shadow: 0 10px 12px 2px rgba(193, 193, 193, 0.17);
        background-color: #fff;
        &__content {
            display: flex;
            align-items: center;
            padding-bottom: 0.2rem;
            border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
            &__left {
                margin-right: 0.1rem;
                &--car {
                    width: 1.58rem;
                    height: 0.64rem;
                }
                &--park {
                    width: 0.64rem;
                    height: 0.64rem;
                }
            }
            &__right {
                &__plate {
                    color: #303030;
                    font-weight: 500;
                }
                &__date {
                    color: #000;
                    opacity: 0.3;
                }
            }
        }
        &__footer {
            display: flex;
            justify-content: space-between;
            padding-top: 0.2rem;
            color: #666;
            &__right {
                display: flex;
                align-items: center;
                img {
                    width: 0.22rem;
                    height: 0.3rem;
                }
            }
        }
    }
}
</style>
