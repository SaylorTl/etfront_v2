<template>
    <div class="page-vehicle-auth">
        <keep-alive>
            <component :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
import Author from "./author";
import Lists from "./lists";
import History from "./history";
export default {
    name: "vehicle-auth",
    components: {
        Author,
        History,
        Lists
    },
    data() {
        return {
            currentView: "Author"
        };
    },
    methods: {}
};
</script>
<style lang="less">
@import "./index.less";
</style>
