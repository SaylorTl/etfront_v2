<template>
    <div class="vehicle-list con">
        <div class="page-one-card-pass-lists card" v-for="(item,index) in dataList" :key="index" @click.stop="onItemClick">
            <div class="card ui-flex ui-flex-row ui-items-center">
                <img class="page-one-card-pass-lists-img" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/home_tab_image@2x.png" alt="">
                <div class="ui-flex ui-flex-col ui-content-center ui-flex-1">
                    <h3 class="ui-ft-color-30 ui-fs14">{{item.plate}}</h3>
                    <div class="ui-flex ui-flex-row ui-content-between">
                        <div class="ui-flex ui-flex-row ui-items-center page-one-card-pass-lists-border">
                            <p class="page-one-card-pass-lists-brand">{{item.brand}}</p>
                            <p class="page-one-card-pass-lists-model">{{item.serial}}</p>
                        </div>
                        <div class="ui-flex ui-flex-row ui-items-center">
                            <p class="ui-ft-color-666 ui-fs12" @click="item.show=!item.show;$forceUpdate()">详细信息</p>
                            <img class="page-one-card-pass-lists-icon" :class="{open:item.show}" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/arrow-right.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="list-info" v-show="item.show">
                <x-cell class="shop" title="授权用户" :value="item.tel"></x-cell>
                <x-cell title="授权时间" :value="item.updated_at"></x-cell>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../../utils/utils";
export default {
    name: 'one-card-pass-lists',
    data() {
        return {
            dataList: null
        }
    },
    created(){
        this.getLists();
    },
    methods: {
        onItemClick() {
            
            this.$emit('onItem', {})
        },
        getLists() {
            this.dataList = null;
            let postData = {}
            utils.gateway(utils.api.vehicleAuthlists).then(res => {
                if (res && res.content) {
                    let list = res.content.lists || [];
                    this.dataList = list;
                }
            });
        },
    },
}
</script>
<style lang="less">
@import "./index.less";
</style>
