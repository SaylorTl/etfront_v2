<template>
    <div class="home-loading">
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'loading',
    computed:{
        ...mapState(['loginInfo'])
    },
    mounted() {
        this.$loading.show()
        if(!!this.loginInfo  && !!this.loginInfo.user_id){
            this.$router.replace({
                name:'home'
            })
        }else{
            this.$router.replace({
                name:'temp-pay'
            })
        }
    },
    destroyed(){
        this.$loading.hide();
    }

}
</script>