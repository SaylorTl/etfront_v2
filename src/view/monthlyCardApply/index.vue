<template>
    <div class="monthly-card-apply page-wrapper card">
        <div class="monthly-card-apply__tips">
            <span>请输入车牌：</span>
            <span></span>
        </div>
        <div class="monthly-card-apply__picker-container">
            <plate-picker :initPlate="plate" @ok="getPlate" />
        </div>
        <div class="monthly-card-apply__btn-container">
            <x-xbutton
                class="btn"
                :disabled="!canUse"
                @click.native="handleNext"
            >下一步</x-xbutton>
        </div>
    </div>
</template>
<script>
import PlatePicker from 'components/PlatePicker'

export default {
    components: { PlatePicker },
    data() {
        return {
            plate:'',
            bindType:'',
            canUse:false
        }
    },
    created(){
        const { plate,bindType} = this.$route.query;
        this.plate = plate || '';
        this.bindType = bindType || ''; 
    },
    methods: {
        getPlate(data){
            if(!data.isError){
                this.plate = data.plate;
                this.canUse = true;
            }else{
                this.canUse = false;
            }
        },
        handleNext() {
            this.$router.push({
                path: '/ui/ui-stations',
                query: {
                    urlName: 'car-card-upload',
                    plate:this.plate,
                    bindType:this.$route.query.bindType || ''
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.monthly-card-apply {
    margin: 0.8rem 0.4rem;
    padding: 0.3rem;
    &__tips {
        color: #999;
    }
    &__picker-container {
        margin-top: 0.27rem;
    }
    &__btn-container {
        margin-top: 3.3rem;
    }
}
</style>
