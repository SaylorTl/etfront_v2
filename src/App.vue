<template>
    <div id="app" class="global-app">
        <!-- <component :is="currCom[currRoute.name]" :isShow="isLoading" v-if="showComponent"></component> -->
        <my-loading :isShow="isLoading" ></my-loading>
        <keep-alive :include="cachePages">
            <transition :name="transitionName" mode="out-in">
                <router-view></router-view>
            </transition>
        </keep-alive>
    </div>
</template>

<script>
import { mapState } from "vuex";
import MyLoading from "./components/MyLoading/index.vue";
// import SkeletonHome from "./skeleton/SkeletonHome";
// import SkeletonTemp from "./skeleton/SkeletonTemp";
export default {
    name: "app",
    data() {
        return {
            transitionName:'',
            noAnimation:'',
            currCom: {"home":"SkeletonHome","temp-pay":"SkeletonTemp"}
        };
    },
    computed: {
        ...mapState(["cachePages", "isLoading", "currRoute"]),
        showComponent() {
            return (
                this.currRoute.name === "home" ||
                this.currRoute.name === "temp-pay"
            );
        }
    },
    components: {
        MyLoading,
        // SkeletonHome,
        // SkeletonTemp
    },
    watch: {//使用watch 监听$router的变化
        $route(to, from) {
            //如果to索引大于from索引,判断为前进状态,反之则为后退状态
            if(to.meta.index > from.meta.index){
                this.transitionName = 'slide-left';
            }else{
                this.transitionName = 'slide-right';
            }
        }
    },
    mounted() {

    }
};
</script>



