<template>
    <div>跳转中.....</div>
</template>
<script>
import utils from 'utils/utils';
import { mapState } from 'vuex';
export default {
    name:'eshifu',
    computed:{
        ...mapState(['loginInfo'])
    },
    beforeMount(){
        this.redirectPage()
    },
    methods:{
        redirectPage(){
            utils.gateway(utils.api.eshifu,{openid:this.loginInfo.open_id}).then(res => {
                if(res.code == 0) {
                    window.location.href = res.content;
                }
            })
        }
    }
}
</script>