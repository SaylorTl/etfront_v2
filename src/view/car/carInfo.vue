<template>
    <div class="page-car-info">
        <div class="car-info-car">
            <img src="../../assets/images/car_icon.png">
            <div class="car-info-car__unbind" @click="unbindCar">解除绑定</div>
        </div>
        <div class="car-info-content-wrapper">
            <!-- <div class="car-info-card card">
                <div>{{plate}}</div>
                <div><span>{{color}}</span><span>燃油车</span></div>
                <div class="car-info-btn">
                    <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/home_ad01.png">
                    <div>
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190316/icon_record@2x.png">
                        <div>历史记录</div>
                    </div>
                </div>
            </div> -->
            <!-- <div class="car-info-station-card card">
                <div>{{plate}}</div>
                <div><span>{{color}}</span><span>燃油车</span></div>

            </div> -->
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
export default {
    name: "car-info",
    props: {},
    components: {},
    data(){
        return {
            plate:'',
            color:'',
        };
    },
    computed:{

    },
    mounted(){
        this.carinfo();
    },
    methods:{
        carinfo(){
            let params = { plate:this.$route.query.plate };
            utils.gateway(utils.api.getCarInfo, params).then(res => {
                if (res && res.content) {
                    this.plate = res.content.plate;
                    this.color = res.content.color;
                }
            });
        },
        unbindCar(){
            utils.gateway(utils.api.unbindcar,{plate:this.plate}).then(res => {
                if(res.code === 0){
                    this.$vux.toast.text(res.message,'middle');
                    this.$router.push({
                        name:"home",
                        params:{
                            actived:1,
                            plate:this.$route.query.plate
                        }
                    })
                }
            });
        }
    }
};
</script>
