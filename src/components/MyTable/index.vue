<template>
  <div class="ui-table">
    <div class="ui-flex ui-flex-col ui-content-center ui-fs14 ui-fw-600">
        <div
        v-for="(item, index) in lists"
        :key="index"
        class="ui-flex ui-flex-row ui-content-between ui-items-center ui-table-item">
            <p class="ui-ft-color-666">{{ item.name || "" }}</p>
            <p class="ui-ft-color-30">{{ item.dec || "" }}</p>
        </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: "my-table",
        props: {
            lists: {
                type: Array,
                default: function() {
                    return [];
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "./index.less";
</style>
