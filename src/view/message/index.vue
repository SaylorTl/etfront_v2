<template>
    <div class="page-msg-main">
        <x-tab :line-width="4" custom-bar-width="65px">
            <template v-for="(item, index) in tabItem">
                <x-tabitem :key="index" :selected="comIdx === index" @on-item-click="handleClick">{{item}}</x-tabitem>
            </template>
        </x-tab>
        <div class="page-msg-warpper">
            <keep-alive>
                <component :is="currentView[comIdx]"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import ParkInfo from "./parkInfo";
import SysInfo from "./sysInfo";
export default {
    name: "msg-park-sys",
    data() {
        return {
            currentView: ['ParkInfo', 'SysInfo'],
            comIdx: 0,
            tabItem: ['停车信息', '系统消息']
        };
    },
    components: {
        ParkInfo,
        SysInfo
    },
    methods: {
        handleClick(index) {
            this.comIdx = index;
            console.log(index);
        }
    }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
