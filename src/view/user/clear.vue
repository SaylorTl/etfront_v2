<template>
    <div class="page-login">
 <div style="font-size: 22px;text-align:center;padding: 20px;">clear localStorage</div>
    </div>
</template>
<script>
import utils from '../../utils/utils';
export default {
    name: "loginout",
    components: {},
    props: {},
    data() {
        return {
 
        };
    },
    mounted(){
       this.loginout();
    },
 
    methods:{
        loginout() {
             window.localStorage.clear();
             this.$vux.toast.text('localStorage clear successful', "middle");
        }
    }
};
</script>