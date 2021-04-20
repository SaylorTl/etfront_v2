<template>
    <div>
        <div class="time-box">
            <x-datetime v-model="value" start-date="2019-06-01" end-date="2019-08-01" @on-change="timeChange" format="YYYY-MM" title="" @on-confirm="timeChange"></x-datetime>
        </div>

        <!-- <div class="page-park-info-time">2018/8/21</div> -->
        <card-item></card-item>
        <card-item></card-item>
    </div>
</template>
<script>
import utils from "../../../utils/utils";
import CardItem from '../card/index.vue'
export default {
    name: 'parkInfo',
    components: {
        CardItem
    },
    props: [
    ],
    data() {
        return {
            page: 1,
            value: '2019-07',
            dataList: []
        }
    },
    created() {
        this.getData();
    },
    methods: {
        timeInit(){
            
        },
        pullUp() {
            this.$nextTick(() => {
                this.$refs.scroller.donePullup();
                this.$refs.scroller.reset();
            });
        },
        timeChange() {

        },
        getData() {
            let postData = {
                pagesize: 500,
                page: this.page,
                source_id: 3,
                channel: 'wechat',
                table_time: '201904',
                mobile: '18716953790'
            }

            this.$loading.show({ content: '加载数据中...', mask: true });
            utils.gateway(utils.api.msgLists, postData).then((res) => {
                this.$loading.hide();
                if (res && res.content && res.content.lists && res.content.lists.length > 0) {
                    let list = res.content.lists || [];
                    this.page++;
                } else {
                    this.$vux.toast.text('没数据了~');
                }
            });
        },
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
