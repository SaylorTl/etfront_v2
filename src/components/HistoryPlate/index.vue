<template>
    <div class="ui-history-plate" v-if="showHistory" @touchstart="eStart" @touchmove="eMove" @touchend="eEnd" @click="showNowPlate">
        <div class="ui-history-center" v-for="(item,index) in historyPlates" :key="index">
            <div v-if="currIndex === index">{{item}}</div>
        </div>
        <div class="ui-history-next">
            {{next}}
        </div>
    </div>
</template>
<script>
export default {
    name: "history-plate",
    props: ["historyPlates", "showHistory"],
    data() {
        return {
            currIndex: 0,
            front: "",
            next: "",
            pageY: ""
        };
    },
    watch: {
        historyPlates() {
            let historyPlate = this.historyPlates;
            if (historyPlate.length === 1) {
                this.$emit("historyChange", historyPlate[0]);
            } else if (historyPlate.length === 2) {
                this.front = historyPlate[0];
                this.currIndex = 1;
                this.next = historyPlate[0];
                this.$emit("historyChange", historyPlate[0]);
            } else if (historyPlate.length > 2) {
                this.front = historyPlate[0];
                this.currIndex = 1;
                this.next = historyPlate[2];
                this.$emit("historyChange", historyPlate[0]);
            }
        }
    },
    mounted() {
        // let historyPlate = this.historyPlates;
        // if (historyPlate.length === 1) {
        //     this.$emit("historyChange", historyPlate[0]);
        // } else if (historyPlate.length === 2) {
        //     this.front = historyPlate[0];
        //     this.currIndex = 1;
        //     this.next = historyPlate[0];
        //     this.$emit("historyChange", historyPlate[0]);
        // } else if (historyPlate.length > 2) {
        //     this.front = historyPlate[0];
        //     this.currIndex = 1;
        //     this.next = historyPlate[2];
        //     this.$emit("historyChange", historyPlate[0]);
        // }
    },
    methods: {
        eStart(event) {
            this.pageY = event.changedTouches[0].clientY;
        },
        eMove() {},
        eEnd() {
            let scrollY = event.changedTouches[0].clientY;
            let his = this.historyPlates;
            if (his.length === 1) {
                this.currIndex = 0;
                this.front = his[0];
            } else if (his.length === 2) {
                if (Math.abs(scrollY - this.pageY) > 20) {
                    this.currIndex = this.currIndex === 0 ? 1 : 0;
                    this.front = his[this.currIndex === 0 ? 1 : 0];
                    this.next = his[this.currIndex === 0 ? 1 : 0];
                }
            } else {
                if (scrollY - this.pageY < -20) {
                    this.currIndex = this.currIndex + 1;
                    if (this.currIndex > his.length - 1) {
                        //如果索引超出长度
                        this.currIndex = 0;
                        this.front = his[his.length - 1];
                        this.next = his[1];
                    } else if (this.currIndex === his.length - 1) {
                        //如果索引到最后一位
                        this.currIndex = his.length - 1;
                        this.front = his[his.length - 2];
                        this.next = his[0];
                    } else {
                        this.front = his[this.currIndex - 1];
                        this.next = his[this.currIndex + 1];
                    }
                } else if (scrollY - this.pageY > 20) {
                    this.currIndex = this.currIndex - 1;
                    if (this.currIndex < 0) {
                        //如果当前索引小于0
                        this.currIndex = his.length - 1;
                        this.front = his[his.length - 2];
                        this.next = his[0];
                    } else if (this.currIndex === 0) {
                        this.front = his[his.length - 1];
                        this.next = his[1];
                    } else {
                        this.front = his[this.currIndex - 1];
                        this.next = his[this.currIndex + 1];
                    }
                }
            }
            this.$emit("historyChange", this.front);
        },
        showNowPlate() {
            let his = this.historyPlates;
            this.$emit("historyChange", his[this.currIndex]);
            this.currIndex++;
            if (this.currIndex === his.length) {
                this.currIndex = 0;
            }
            this.next = his[this.currIndex + 1];
        }
    }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
