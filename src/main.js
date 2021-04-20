import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './vuex/index'
require('./utils/vux');
import '../node_modules/vux/src/styles/weui/weui.less';
import './assets/css/common.less';
import './assets/css/main.less';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import MyLoading from './components/MyLoading/index'
import EPScroll from './components/Scroll/index'
Vue.use(MyLoading);
Vue.use(EPScroll);
const mixin = {
    mounted() {
        (/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', function(e) {
            document.body.scrollIntoView(false);
            // 滚动时 让body的底部与视图容器底部对齐 页面（容器）可滚动时有效
            //修复ios手机输入后导致页面按钮焦点偏移bug
        }, true);
    }
}
Vue.config.productionTip = false
Vue.directive('longpress', {
    bind: function(el, binding, vNode) {

        // 确保提供的表达式是函数
        if (typeof binding.value !== 'function') {
            // 获取组件名称
            const compName = vNode.context.name;
            // 将警告传递给控制台
            let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be `;
            if (compName) { warn += `Found in component '${compName}' ` }

            console.warn(warn);
        }

        // 定义变量
        let pressTimer = null;

        // 定义函数处理程序
        // 创建计时器（ 1秒后执行函数 ）
        let start = (e) => {
            e.stopPropagation();
            if (e.type === 'click' && e.button !== 0) {
                return;
            }

            if (pressTimer === null) {
                pressTimer = setTimeout(() => {
                    // 执行函数
                    handler();
                }, 1000)
            }
        }

        // 取消计时器
        let cancel = (e) => {
            e.stopPropagation();
            // 检查计时器是否有值
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        }

        // 运行函数
        const handler = (e) => {
            e.stopPropagation();
            // 执行传递给指令的方法
            binding.value(e)
        }

        // 添加事件监听器
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);

        // 取消计时器
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
    }
})

new Vue({
    mixins: [mixin],
    store,
    router,
    render: h => h(App)
}).$mount('#app')