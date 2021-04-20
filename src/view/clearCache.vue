<template>
    <div class="page-emergency-open">
        <div class="card page-emergency-open-card">
        <form-item label="清除sessionStorage" content="确认" arrow @handleClick="clearSession"></form-item>
        <form-item label="清除localStorage" content="确认" arrow @handleClick="clearLocal"></form-item>
        <form-item label="清除Cookie" content="确认" arrow @handleClick="clearCookie"></form-item>
        <x-xbutton @click.native="clearAll">全部清除</x-xbutton>
        </div>
    </div>
</template>
<script>
import FormItem from "components/FormItem/index";
export default {
    name: "clear-cache",
    props: {},
    components: {
        FormItem
    },
    data() {
        return {};
    },
    methods: {
        clearSession() {
            window.sessionStorage.clear();
            this.$vux.toast.text("清除成功", "middle");
        },
        clearLocal() {
            window.localStorage.clear();
            this.$vux.toast.text("清除成功", "middle");
        },
        clearCookie() {
            let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (let i = keys.length; i--; )
                    document.cookie =
                        keys[i] + "=0;expires=" + new Date(0).toUTCString();
            }
            this.$vux.toast.text("清除成功", "middle");
        },
        clearAll(){
            window.sessionStorage.clear();
            window.localStorage.clear();
            let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (let i = keys.length; i--; )
                    document.cookie =
                        keys[i] + "=0;expires=" + new Date(0).toUTCString();
            }
            this.$vux.toast.text("清除成功", "middle");
        }
    }
};
</script>
